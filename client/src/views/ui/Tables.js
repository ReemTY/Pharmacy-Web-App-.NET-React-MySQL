import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardTitle, Button } from 'reactstrap';
import axios from '../../api/axios';

const UserAccount = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/user');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        // Redirect to login page or any other desired route
    };

    return (
        <Row className="justify-content-center">
            <Col lg="6">
                <Card className="mt-5">
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0 text-center">
                        User Account
                    </CardTitle>
                    <div className="p-4">
                        {user && (
                            <>
                                <p><strong>Name:</strong> {user.Username}</p>
                                <p><strong>Email:</strong> {user.Email}</p>
                                <p><strong>Role:</strong> {user.UserRole}</p>
                                {/* You can display other user information here */}
                                <Button onClick={handleLogout} color="danger" block>Logout</Button>
                            </>
                        )}
                        {!user && <p>Loading user data...</p>}
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default UserAccount;
