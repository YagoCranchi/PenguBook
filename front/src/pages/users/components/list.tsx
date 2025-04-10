import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/axiosPrivate";
import useAuth from "../../../hooks/useAuth";
import Table from "../../../components/table";
import Icon from "@mdi/react";
import { mdiCog } from "@mdi/js"; // Import do Dialog
import UsersDialog from "./dialog";

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
        Id: user.userId,
        Name: user.name,
        Email: user.email,
        CPF: user.cpf,
        Phone: user.phone,
        "Creation Date": new Date(user.creationDate).toLocaleDateString(),
        Role: user.roles.map((role: any) => role.name).join(", "),
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
                    renderRow={(row, rowIndex) => (
                        <tr key={rowIndex} className="table__body__row">
                            {headers.map((header, colIndex) => (
                                <td key={colIndex} className="cell">
                                    {header === "Actions" ? (
                                        <button
                                            onClick={() => handleIconClick(row)}
                                            className="icon-button"
                                        >
                                            <Icon path={mdiCog} size={1} color="currentColor" />
                                        </button>
                                    ) : (
                                        row[header] || ''
                                    )}
                                </td>
                            ))}
                        </tr>
                    )}
                />
            ) : (
                <p className="users-table__no-data">Nenhum usuário encontrado</p>
            )}

            <UsersDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                user={selectedUser}
                onUpdate={fetchUsers}
            />
        </div>
    );
};

export default UsersList;