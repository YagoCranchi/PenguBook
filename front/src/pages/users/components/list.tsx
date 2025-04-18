import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/axiosPrivate";
import useAuth from "../../../hooks/useAuth";
import Table from "../../../components/table";
import Icon from "@mdi/react";
import { mdiCog } from "@mdi/js";
import UserDialog from "./dialog";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

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
    }, [auth, axiosPrivate]);

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

    return (
        <div className="users-box">
            {users?.length ? (
                <Table
                    headers={headers}
                    data={data}
                />
            ) : (
                <p className="users-table__no-data">No users found</p>
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