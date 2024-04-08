import React, { useState } from 'react';
import './SignUp.css';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        rePassword: '',
        agreeTerm: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormData({
            ...formData,
            [name]: value
        });


        if (name === 'rePassword') {
            if (formData.password !== value) {
                setError('Passwords do not match');
            } else {
                setError('');
            }
        }
    }

    const handlePasswordBlur = () => {
        // Password length validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
        } else {
            setError('');
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.rePassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            console.log(formData)

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                const data = await response.json();
                setError(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="main">
            <section className="signup">
                <div className="container1">
                    <div className="signup-content">

                        <form onSubmit={handleSubmit} className="signup-form">
                            <h2 className="form-title">CREATE ACCOUNT</h2>
                            <div className="form-group">
                                <input type="text" className="form-input" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" />
                            </div>
                            <div className="form-group">
                                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleInputChange} placeholder="Your Email" />
                            </div>
                            <div className="form-group">
                                <input type="password" className="form-input" name="password" value={formData.password} onChange={handleInputChange} onBlur={handlePasswordBlur} placeholder="Your Password" />
                            </div>
                            <div className="form-group">
                                <input type="password" className={`form-input ${formData.password !== formData.rePassword && 'error'}`} name="rePassword" value={formData.rePassword} onChange={handleInputChange} onBlur={handleInputChange} placeholder="Repeat Your Password" />
                            </div>
                            <div className="form-group">
                                <input type="checkbox" name="agreeTerm" checked={formData.agreeTerm} onChange={handleInputChange} className="agree-term" />
                                <label htmlFor="agree-term" className="label-agree-term"><span><span></span></span>I agree all statements in <a href="#" className="term-service">Terms of service</a></label>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="form-submit" disabled={loading}>

                                    {loading ? "Signing up..." : success ? "Sign up ✓" : "Sign up"}
                                </button>
                            </div>
                        </form>
                        <p className="loginhere">
                            Have already an account ? <a href="/login" className="loginhere-link">Login here</a>
                        </p>
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success"><br />Verification mail has been sent!<br /> Redirecting to login...</p>}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SignUpForm;