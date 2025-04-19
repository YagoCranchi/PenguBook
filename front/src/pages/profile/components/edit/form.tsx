import { useState } from "react";
import { toast } from "react-toastify";

import useAuth from "../../../../hooks/useAuth";
import useAxiosPrivate from "../../../../hooks/axiosPrivate";

import validateForm from "./formValidator";

const ProfileEdit = () => {
    const { auth } = useAuth();
    const [userInfos, setUserInfos] =useState<any>( auth?.userInfo || null);
    const [name, setName] = useState<string>(userInfos?.name || "");
    const [email, setEmail] = useState<string>(userInfos?.email || "");
    const [cpf, setCpf] = useState<string>(userInfos?.cpf || "");
    const [phone, setPhone] = useState<string>(userInfos?.phone || "");
    const [invalidFields, setInvalidFields] = useState<{ [key: string]: boolean }>({});

    const axiosPrivate = useAxiosPrivate();

    const handleProfileEditForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const { isValid, errors, invalidFields } = validateForm(name, email, phone);

        if (!isValid) {
            setInvalidFields(invalidFields);
            errors.forEach((error) => toast.error(error));
            return;
        }

        try {
            await axiosPrivate.put('/user/update', 
                {
                    name,
                    email,
                    phone
                }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            window.location.reload();
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

    return (
        <form className="profile-edit" onSubmit={handleProfileEditForm}>
            <div className="input-box">
                <div className="form-group input-label">
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
                    <label htmlFor="cpf">CPF: </label>
                    <input
                        type="text"
                        id="cpf"
                        maxLength={14}
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        className={invalidFields.cpf ? "input-error" : ""}
                        disabled={true}
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
            <div className="btn-box">
                <button type="submit" className="btn">Save</button>
            </div>
        </form>
    );
}

export default ProfileEdit;