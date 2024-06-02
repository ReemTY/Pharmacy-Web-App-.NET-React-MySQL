import React, { useState } from 'react';
import { Row, Col, Card, CardTitle, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from './api/axios';

const USER_URL = '/user/login'; // API URL

const Login = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        setEmailError('');
        setPasswordError('');

        if (email.trim() === '') {
            setEmailError('Please enter your email');
            return;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError('Please enter a valid email');
            return;
        }

        if (password.trim() === '') {
            setPasswordError('Please enter a password');
            return;
        }

        try {
            const response = await axios.post(USER_URL, {
                email,
                password
            });

            if (response.status === 200) {
                const { token, userRole, userId } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('userRole', userRole); // Update userRole in localStorage

                // Call onLogin callback with userRole
                onLogin({ userRole });

                if (userRole === 0) {
                    navigate('/Cards');
                } else if (userRole === 1) {
                    navigate('/categories');
                } else {
                    console.error('Invalid user role:', userRole);
                }
            } else {
                setPasswordError(response.data.message);
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };

    return (
        <Row className="justify-content-center">
            <Col lg="6">
                <Card className="mt-5">
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0 text-center">
                        <i className="bi bi-box-arrow-in-right me-2"></i> Login
                    </CardTitle>
                    <div className="p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <label className="errorLabel">{emailError}</label>
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <label className="errorLabel">{passwordError}</label>
                            </div>
                            <Button type="submit" color="primary" block>Login</Button>
                        </form>
                        <p className="mt-3 mb-0 text-center">
                            Don't have an account? <Link to="/register">Register</Link>
                        </p>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default Login;
