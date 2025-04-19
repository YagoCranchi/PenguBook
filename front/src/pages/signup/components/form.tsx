import { useState } from "react";
import axios from "../../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { cpfFormatter } from "../../../utils/cpf";
import validateForm from "./formValidator";
import { toast } from "react-toastify";

const SignupForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [invalidFields, setInvalidFields] = useState<{ [key: string]: boolean }>({});

    const handleSignupForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const { isValid, errors, invalidFields } = validateForm(name, email, cpf, phone, password, passwordConfirm);

        if (!isValid) {
            setInvalidFields(invalidFields);
            errors.forEach((error) => toast.error(error));
            return;
        }

        try {
            await axios.post('/user/create',
                {
                    name,
                    password,
                    email,
                    cpf,
                    phone
                }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            navigate(from, { replace: true });
        } catch (err: any) {
            if (!err?.response) {
                toast.error('No server response');
            } else {
                for (let i = 0; i < err.response.data.length; i++) {
                    toast.error(err.response.data[i].message);
                }
            }
        }
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.replace(/\D/g, '');
        setCpf(cpfFormatter(inputValue));
    };

    return (
        <form onSubmit={handleSignupForm} className="login-form">
            <div className="flex-row">
                <div className="form-group input-label max-flex">
                    <label htmlFor="name">Name: </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        max={50}
                        onChange={(e) => setName(e.target.value)}
                        className={invalidFields.name ? "input-error" : ""}
                    />
                </div>
                <div className="form-group input-label">
                    <label htmlFor="cpf">CPF: </label>
                    <input
                        type="text"
                        id="cpf"
                        maxLength={14}
                        value={cpf}
                        onChange={handleCpfChange}
                        className={invalidFields.cpf ? "input-error" : ""}
                    />
                </div>
            </div>
            <div className="flex-row">
                <div className="form-group input-label max-flex">
                    <label htmlFor="email">Email: </label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        max={50}
                        onChange={(e) => setEmail(e.target.value)}
                        className={invalidFields.email ? "input-error" : ""}
                    />
                </div>
                <div className="form-group input-label">
                    <label htmlFor="phone">Phone: </label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        max={20}
                        onChange={(e) => setPhone(e.target.value)}
                        className={invalidFields.phone ? "input-error" : ""}
                    />
                </div>
            </div>
            <div className="flex-row">
                <div className="form-group input-label max-flex">
                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        max={50}
                        onChange={(e) => setPassword(e.target.value)}
                        className={invalidFields.password ? "input-error" : ""}
                    />
                </div>
                <div className="form-group input-label max-flex">
                    <label htmlFor="passwordConfirm">Confirm your Password: </label>
                    <input
                        type="password"
                        id="passwordConfirm"
                        value={passwordConfirm}
                        max={50}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className={invalidFields.passwordConfirm ? "input-error" : ""}
                    />
                </div>
            </div>
            <button type="submit" className="btn signup-button">
                Sign Up
            </button>
        </form>
    );
};

export default SignupForm;