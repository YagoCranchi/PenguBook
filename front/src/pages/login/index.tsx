import React from 'react';
import { Link } from 'react-router-dom';

import LoginForm from './components/form';

import './index.scss';

const LoginPage: React.FC = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Login</h1>
                <LoginForm />
                <div>
                    Don't have an account?
                    <Link to="/signup"> Sign up now</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;