import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import './index.css'
import './utils/storageProtection' // Add localStorage logging

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const ConfigurationError = () => (
    <div className="min-h-screen bg-[#F5EFE1] flex flex-col items-center justify-center p-8 font-source-serif text-center">
        <div className="bg-white rounded-[40px] p-12 shadow-2xl max-w-lg border-2 border-[#7F6E68]/10">
            <div className="text-6xl mb-6">🔐</div>
            <h1 className="text-3xl font-bold text-[#7F6E68] mb-4">Clerk Setup Required</h1>
            <p className="text-[#7F6E68]/70 mb-8 leading-relaxed">
                To enable Google and Apple authentication, you need to add your Clerk Publishable Key to the configuration.
            </p>
            <div className="bg-[#7F6E68]/5 rounded-2xl p-6 mb-8 text-left border border-[#7F6E68]/10">
                <p className="font-bold text-[#7F6E68] mb-2 text-sm uppercase tracking-wider">Instructions:</p>
                <ol className="list-decimal list-inside space-y-2 text-[#7F6E68]/80 text-sm">
                    <li>Create a <code className="bg-white px-2 py-1 rounded border">.env</code> file in the root directory.</li>
                    <li>Add your key: <code className="bg-white px-2 py-1 rounded border">VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code></li>
                    <li>Restart the development server.</li>
                </ol>
            </div>
            <p className="text-xs text-[#7F6E68]/40">
                You can find your key in the <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#7F6E68]/60">Clerk Dashboard</a>.
            </p>
        </div>
    </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {PUBLISHABLE_KEY ? (
            <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
                <App />
            </ClerkProvider>
        ) : (
            <ConfigurationError />
        )}
    </React.StrictMode>,
)
