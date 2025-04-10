import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import useAxiosPrivate from "../../../hooks/axiosPrivate";

import Dialog, { DialogBody, DialogFooter } from "../../../components/dialog";
import validateForm from "./dialogValidator";

interface UsersDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        Id: string;
        Name: string;
        Email: string;
        CPF: string;
        Phone: string;
        Role: string;
    } | null;
    onUpdate: () => void;
}

const UsersDialog: React.FC<UsersDialogProps> = ({ isOpen, onClose, user, onUpdate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('');
    const [invalidFields, setInvalidFields] = useState<{ [key: string]: boolean }>({});

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (user) {
            setName(user.Name);
            setEmail(user.Email);
            setCpf(user.CPF);
            setPhone(user.Phone);
            setRole(user.Role);
        }
    }, [user]);

    const updateUser = async () => {
        const { isValid, errors, invalidFields } = validateForm(name, email, phone);

        if (!isValid) {
            setInvalidFields(invalidFields);
            errors.forEach((error) => toast.error(error));
            return;
        }
        const controller = new AbortController();

        try {
            await axiosPrivate.put(`/user/update/${user?.Id}`, 
                {
                    name,
                    email,
                    phone
                }, {
                    signal: controller.signal
            });

            toast.success('User updated successfully!');
            onClose();
            onUpdate();
        } catch (err: any) {
            if (!err?.response) {
                toast.error('No server response');
            } else {
                toast.error('Request failed');
            }
        }
    };

    return (
        <Dialog isOpen={isOpen} title="Detalhes do Usuário" onClose={onClose} className="sm">
            <DialogBody>
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
                        value={cpf}
                        max={50}
                        disabled
                    />
                </div>
                <div className="form-group input-label">
                    <label htmlFor="phone">Phone: </label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        max={50}
                        onChange={(e) => setPhone(e.target.value)}
                        className={invalidFields.phone ? "input-error" : ""}
                    />
                </div>
                <div className="form-group input-label">
                    <label htmlFor="role">Role: </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className={invalidFields.role ? "input-error" : ""}
                        disabled
                    >
                        <option value="ADMIN">Admin</option>
                        <option value="BASIC">User</option>
                    </select>
                </div>
            </DialogBody>
            <DialogFooter>
                <div className="flex between">
                    <button className="btn danger">
                        Delete
                    </button>
                    <button className="btn" onClick={updateUser}>
                        Save
                    </button>
                </div>
            </DialogFooter>
        </Dialog>
    );
};

export default UsersDialog;