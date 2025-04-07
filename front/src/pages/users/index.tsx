import { useEffect, useState } from "react";
import useAxiosPrivate  from "../../hooks/axiosPrivate";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        
        const fetchUsers = async () => {
            try {
                const response = await axiosPrivate.get("/user/all", {
                    signal: controller.signal
                });
                if (isMounted) {
                    setUsers(response.data);
                }
            } catch (error: any) {
                if (error.name !== "CanceledError") {
                    console.error("Error fetching users: ", error);
                }
            }
        };

        fetchUsers();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [auth]);

    return (
        <div>
            <h1>List Users</h1>
            {users?.length ? (
                <ul>
                    {users.map((user: any, index) => (
                        <li key={index}>{user?.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No users found</p>
            )}

            <Link to="/">Back to Dashboard</Link>
        </div>
    );
};

export default UsersPage;