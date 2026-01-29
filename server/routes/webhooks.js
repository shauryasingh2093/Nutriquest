import express from 'express';
import { Webhook } from 'svix';
import User from '../models/User.js';

const router = express.Router();

// Clerk webhook handler
router.post('/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

        if (!WEBHOOK_SECRET) {
            console.error('❌ CLERK_WEBHOOK_SECRET is not set');
            return res.status(500).json({ error: 'Webhook secret not configured' });
        }

        // Get the headers
        const svix_id = req.headers['svix-id'];
        const svix_timestamp = req.headers['svix-timestamp'];
        const svix_signature = req.headers['svix-signature'];

        // If there are no headers, error out
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).json({ error: 'Missing svix headers' });
        }

        // Get the body
        const body = req.body.toString();

        // Create a new Svix instance with your webhook secret
        const wh = new Webhook(WEBHOOK_SECRET);

        let evt;

        // Verify the webhook signature
        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            });
        } catch (err) {
            console.error('❌ Webhook signature verification failed:', err.message);
            return res.status(400).json({ error: 'Invalid signature' });
        }

        // Handle the webhook event
        const { id, ...attributes } = evt.data;
        const eventType = evt.type;

        console.log(`📨 Webhook received: ${eventType}`);

        switch (eventType) {
            case 'user.created':
                await handleUserCreated(evt.data);
                break;
            case 'user.updated':
                await handleUserUpdated(evt.data);
                break;
            case 'user.deleted':
                await handleUserDeleted(evt.data);
                break;
            default:
                console.log(`ℹ️  Unhandled webhook event type: ${eventType}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
});

// Handle user creation from Clerk
async function handleUserCreated(data) {
    try {
        const clerkId = data.id;
        const email = data.email_addresses?.[0]?.email_address;
        const name = data.first_name
            ? `${data.first_name} ${data.last_name || ''}`.trim()
            : data.username || 'User';
        const avatar = data.image_url;

        // Check if user already exists
        const existingUser = await User.findOne({ clerkId });
        if (existingUser) {
            console.log(`ℹ️  User already exists: ${email}`);
            return;
        }

        // Create new user in MongoDB
        const newUser = new User({
            clerkId,
            email,
            name,
            avatar,
            xp: 0,
            level: 1,
            streak: 0,
            longestStreak: 0,
            achievements: [],
            completedLessons: [],
            stageProgress: {}
        });

        await newUser.save();
        console.log(`✅ User created in MongoDB: ${email}`);
    } catch (error) {
        console.error('❌ Error creating user:', error);
        throw error;
    }
}

// Handle user update from Clerk
async function handleUserUpdated(data) {
    try {
        const clerkId = data.id;
        const email = data.email_addresses?.[0]?.email_address;
        const name = data.first_name
            ? `${data.first_name} ${data.last_name || ''}`.trim()
            : data.username || 'User';
        const avatar = data.image_url;

        // Update user in MongoDB
        const user = await User.findOne({ clerkId });
        if (!user) {
            console.log(`⚠️  User not found for update, creating new: ${email}`);
            await handleUserCreated(data);
            return;
        }

        user.email = email;
        user.name = name;
        user.avatar = avatar;

        await user.save();
        console.log(`✅ User updated in MongoDB: ${email}`);
    } catch (error) {
        console.error('❌ Error updating user:', error);
        throw error;
    }
}

// Handle user deletion from Clerk
async function handleUserDeleted(data) {
    try {
        const clerkId = data.id;

        // Delete user from MongoDB
        const result = await User.deleteOne({ clerkId });

        if (result.deletedCount > 0) {
            console.log(`✅ User deleted from MongoDB: ${clerkId}`);
        } else {
            console.log(`⚠️  User not found for deletion: ${clerkId}`);
        }
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        throw error;
    }
}

export default router;
