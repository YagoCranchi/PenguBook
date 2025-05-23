import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/axiosPrivate";
import Table from "../../../components/table";
import Icon from "@mdi/react";
import { mdiCog, mdiPlusBox } from "@mdi/js";
import UserDialog from "./dialog";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const axiosPrivate = useAxiosPrivate();

    const fetchUsers = async () => {
        try {
            const response = await axiosPrivate.get("/user/all");
            setUsers(response.data);
        } catch (error: any) {
            console.error("Error fetching users: ", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [axiosPrivate]);

    const headers = ["Name", "Email", "CPF", "Phone", "Creation Date", "Role", "Actions"];
    const data = users.map((user: any) => ({
        Name: user.name,
        Email: user.email,
        CPF: user.cpf,
        Phone: user.phone,
        "Creation Date": new Date(user.creationDate).toLocaleDateString(),
        Role: user.roles.map((role: any) => role.name).join(", "),
        Actions: (
            <button
                onClick={() => handleIconClick(user)}
                className="icon-button"
            >
                <Icon path={mdiCog} size={1} color="currentColor" />
            </button>
        ),
    }));

    const handleIconClick = (user: any) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedUser(null);
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsDialogOpen(true);
    };

    return (
        <div className={'users-box' + (users?.length ? ' ' : 'full')}>
            <button className="btn add" onClick={handleAddUser}>
                <Icon path={mdiPlusBox} size={1} />
            </button>
            {users?.length ? (
                <Table
                    headers={headers}
                    data={data}
                />
            ) : (
                <p className="no-users">No users found</p>
            )}

            <UserDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                user={selectedUser}
                onUpdate={fetchUsers}
            />
        </div>
    );
};

export default UsersList;