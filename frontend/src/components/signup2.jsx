import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Signup = () => {
    const [user, setUser] = useState({ name: '', email: '', password: '', role: '' });
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!otpSent) {
                const res = await axios.post("http://localhost:8000/api/v1/user/sendOTP", { email: user.email });
                if (res.data.success) {
                    toast.success("OTP sent to your email");
                    setOtpSent(true);
                }
            } else {
                const verifyRes = await axios.post("http://localhost:8000/api/v1/user/verifyOTP", { email: user.email, otp });
                if (verifyRes.data.success) {
                    const regRes = await axios.post("http://localhost:8000/api/v1/user/register", user);
                    if (regRes.data.success) {
                        toast.success("Account created successfully");
                        navigate("/");
                    }
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={onSubmitHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>CargoConnect</h1>
                    <p className='text-sm text-center'>Sign up to access all features</p>
                </div>
                <Input type="text" name="name" placeholder="Name" onChange={changeHandler} className="my-2" />
                <Input type="email" name="email" placeholder="Email" onChange={changeHandler} className="my-2" />
                <Input type="password" name="password" placeholder="Password" onChange={changeHandler} className="my-2" />
                <div className='flex gap-4'>
                    <label><input type="radio" name="role" value="portManager" onChange={changeHandler} /> Port Manager</label>
                    <label><input type="radio" name="role" value="shipOwner" onChange={changeHandler} /> Ship Owner</label>
                </div>
                {otpSent && (
                    <Input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="my-2" />
                )}
                <Button type="submit" disabled={loading}>
                    {loading ? <><Loader2 className="animate-spin mr-2" />Processing...</> : otpSent ? "Verify & Register" : "Send OTP"}
                </Button>
                <span className='text-center'>Already have an account? <Link to="/login">Login</Link></span>
            </form>
        </div>
    );
};

export default Signup2;
