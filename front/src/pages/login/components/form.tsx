import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import validateForm from './formValidator';

import axios from '../../../api/axios';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';

const LoginForm = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [name, setName] = useState('admin');
    const [password, setPassword] = useState('123');
    const [errorMsg, setErrorMsg] = useState('');
    const [invalidFields, setInvalidFields] = useState<{ [key: string]: boolean }>({});

    const handleLoginForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const { isValid, errors, invalidFields } = validateForm(name, password);

        if (!isValid) {
            setInvalidFields(invalidFields);
            errors.forEach((error) => toast.error(error));
            return;
        }
        try {
            const response = await axios.post('/login', { name, password }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            const userInfos = await getUserInfos(response.data.accessToken);
            setAuth(response.data.accessToken, userInfos);
            navigate(from, { replace: true });
        } catch (err: any) {
            if (!err?.response) {
                setErrorMsg('No server response');
            } else {
                setErrorMsg('Invalid username or password');
            }
        }
    };

    async function getUserInfos(accessToken: string) {
        if (!accessToken) return console.log('No access token provided');

        try {
            const response = await axios.get('/user', {
                withCredentials: true,
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            return response.data;
        } catch (err: any) {
            if (!err?.response) {
                console.log(err);
                setErrorMsg('No server response');
            } else {
                setErrorMsg('Could not fetch user information');
            }
        }
    }

    return(
        <form onSubmit={handleLoginForm} className="login-form">
            <div className="form-group">
                <label htmlFor="name">Name: </label>
                <input
                    type="name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={invalidFields.name ? "input-error" : ""}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password: </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={invalidFields.password ? "input-error" : ""}
                />
            </div>
            <p className='errorMessage'>{errorMsg}</p>
            <button type="submit" className="btn login-button">Login</button>
        </form>
    )
};

export default LoginForm;