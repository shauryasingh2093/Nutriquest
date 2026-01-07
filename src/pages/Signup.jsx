import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, socialLogin } = useAuth();
    const navigate = useNavigate();
    const [socialLoading, setSocialLoading] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSocialLogin = async (provider) => {
        setError('');
        setSocialLoading(provider);
        try {
            await socialLogin(provider);
            navigate('/courses');
        } catch (err) {
            setError(err.message || `Failed to login with ${provider}`);
        } finally {
            setSocialLoading(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        setLoading(true);

        try {
            await signup(formData.name, formData.email, formData.password);
            navigate('/courses');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-auth-bg min-h-screen flex justify-center items-center relative p-8 font-source-serif overflow-hidden">

            <img src="/signup.png" alt="Mascot" className="absolute -bottom-1 z-6 pointer-events-none -left-0 w-[250px] hidden lg:block" />

            <div className="bg-auth-card w-full max-w-[1200px] h-[720px] rounded-[60px] p-5 md:p-12 relative flex flex-col items-center shadow-2xl border-1.5 border-auth-brown/10 overflow-hidden">

                <Link to="/" className="absolute top-8 left-10 text-4xl font-bold text-auth-brown no-underline cursor-pointer leading-none hover:opacity-70 transition-opacity">×</Link>

                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl text-auth-brown mb-2 font-bold tracking-tight">Welcome to NutriQuest</h1>
                    <h2 className="text-xl md:text-2xl text-auth-brown mt-0 font-semibold opacity-90">Create an account</h2>
                </div>

                <div className="flex flex-col gap-3.5 w-full max-w-[380px] mb-8">
                    <button
                        onClick={() => handleSocialLogin('Google')}
                        disabled={loading || !!socialLoading}
                        className="bg-white border-1.5 border-auth-brown rounded-xl p-[11px] flex items-center justify-center gap-3 font-bold text-base cursor-pointer text-auth-brown hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <img src="/devicon_google.png" alt="Google" className={`w-6 h-6 ${socialLoading === 'Google' ? 'animate-spin' : ''}`} />
                        {socialLoading === 'Google' ? 'Connecting...' : 'Continue with Google'}
                    </button>
                    <button
                        onClick={() => handleSocialLogin('Apple')}
                        disabled={loading || !!socialLoading}
                        className="bg-white border-1.5 border-auth-brown rounded-xl p-[11px] flex items-center justify-center gap-3 font-bold text-base cursor-pointer text-auth-brown hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        <img src="/ic_baseline-apple.png" alt="Apple" className={`w-6 h-6 ${socialLoading === 'Apple' ? 'animate-spin' : ''}`} />
                        {socialLoading === 'Apple' ? 'Connecting...' : 'Continue with Apple'}
                    </button>
                </div>

                <div className="flex items-center w-full max-w-[420px] mb-8 text-auth-brown/60">
                    <div className="flex-1 h-[1px] bg-auth-brown/30"></div>
                    <span className="px-3 text-sm font-semibold italic">or</span>
                    <div className="flex-1 h-[1px] bg-auth-brown/30"></div>
                </div>

                {error && <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg mb-6 text-sm font-semibold border border-red-100">{error}</div>}

                <form className="w-full max-w-[380px] flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="relative w-full group">
                        <img src="/mdi_account.png" alt="User" className="absolute left-[18px] top-1/2 -translate-y-1/2 w-5.5 h-auto opacity-70 group-focus-within:opacity-100 transition-opacity" />
                        <input
                            type="text"
                            name="name"
                            className="w-full py-4 pl-14 pr-[15px] rounded-xl border-1.5 border-auth-brown bg-white text-base text-auth-brown outline-none box-border focus:ring-2 focus:ring-auth-mauve/20 transition-all placeholder:text-auth-brown/40"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative w-full group">
                        <img src="/material-symbols-light_mail-rounded.png" alt="Mail" className="absolute left-[18px] top-1/2 -translate-y-1/2 w-5.5 h-auto opacity-70 group-focus-within:opacity-100 transition-opacity" />
                        <input
                            type="email"
                            name="email"
                            className="w-full py-4 pl-14 pr-[15px] rounded-xl border-1.5 border-auth-brown bg-white text-base text-auth-brown outline-none box-border focus:ring-2 focus:ring-auth-mauve/20 transition-all placeholder:text-auth-brown/40"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative w-full group">
                        <img src="/material-symbols_lock.png" alt="Lock" className="absolute left-[18px] top-1/2 -translate-y-1/2 w-5.5 h-auto opacity-70 group-focus-within:opacity-100 transition-opacity" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full py-4 pl-14 pr-[15px] rounded-xl border-1.5 border-auth-brown bg-white text-base text-auth-brown outline-none box-border focus:ring-2 focus:ring-auth-mauve/20 transition-all placeholder:text-auth-brown/40"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <img
                            src="/Vector.png"
                            alt="Toggle visibility"
                            className="absolute right-[18px] top-1/2 -translate-y-1/2 cursor-pointer w-5 hover:opacity-70 transition-opacity"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>

                    <button type="submit" className="bg-auth-mauve text-auth-brown border-none py-4 rounded-xl font-bold text-lg mt-4 cursor-pointer shadow-[0_4px_0_rgba(158,118,143,0.3)] hover:shadow-none hover:translate-y-[2px] active:translate-y-[4px] transition-all disabled:opacity-50" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>

                <div className="mt-4 text-sm text-auth-brown/80 font-medium">
                    Already have account? <Link to="/login" className="text-auth-purple font-bold no-underline hover:underline ml-1">Login</Link>
                </div>
            </div>
        </div>
    );
}




