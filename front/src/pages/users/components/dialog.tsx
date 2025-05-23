import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import useAxiosPrivate from "../../../hooks/axiosPrivate";

import Dialog, { DialogBody, DialogFooter } from "../../../components/dialog";
import validateForm from "./dialogValidator";

interface UsersDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        userId: string;
        name: string;
        email: string;
        cpf: string;
        phone: string;
        roles: {
            roleId: number;
            name: string;
        }[];
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
        resetInputs();
        if (user && user.userId) {
            setName(user.name || '');
            setEmail(user.email || '');
            setCpf(user.cpf || '');
            setPhone(user.phone || '');
            setRole(user.roles?.[0]?.name || '');
        }
    }, [user]);

    const resetInputs = () => {
        setName('');
        setEmail('');
        setCpf('');
        setPhone('');
        setRole('');
        setInvalidFields({});
    }

    const updateUser = async () => {
        setInvalidFields({});

        const { isValid, errors, invalidFields } = validateForm(name, email, phone, cpf);

        if (!isValid) {
            setInvalidFields(invalidFields);
            errors.forEach((error) => toast.error(error));
            return;
        }

        if (user?.userId) {
            try {
                await axiosPrivate.put(`/user/${user?.userId}`,
                    {
                        name,
                        email,
                        phone
                    });

                toast.success('User updated successfully!');
                onClose();
                onUpdate();
            } catch (err: any) {
                if (!err?.response) {
                    toast.error('No server response');
                } else {
                    for (let i = 0; i < err.response.data.length; i++) {
                        toast.error(err.response.data[i].message);
                    }
                }

            }
        } else {
            try {
                await axiosPrivate.post('/user/create-without-password', {
                    name,
                    email,
                    phone,
                    cpf
                });

                toast.success('User created successfully!');
                onClose();
                onUpdate();
            } catch (err: any) {
                if (!err?.response) {
                    toast.error('No server response');
                } else {
                    for (let i = 0; i < err.response.data.length; i++) {
                        toast.error(err.response.data[i].message);
                    }
                }
            }
        }
    };

    const deleteUser = async () => {
        try {
            await axiosPrivate.delete(`/user/${user?.userId}`);
            toast.success('User deleted successfully!');
            onClose();
            onUpdate();
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
        <Dialog isOpen={isOpen} title="User Datails" onClose={onClose} className="sm">
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
                        disabled={!!user?.userId}
                        onChange={(e) => setCpf(e.target.value)}
                        className={invalidFields.cpf ? "input-error" : ""}
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
                <div className="flex between footer">
                    <button className="btn" onClick={updateUser}>
                        Save
                    </button>
                    {user?.userId && (
                        <button className="btn danger" onClick={deleteUser}>
                            Delete
                        </button>
                    )}
                </div>
            </DialogFooter>
        </Dialog>
    );
};

export default UsersDialog;