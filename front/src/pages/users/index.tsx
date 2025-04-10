import UsersList from "./components/list";

import "./index.scss";

const UsersPage = () => {
    return (
        <div>
            <h1 className="page-title">List Users</h1>
            <UsersList />
        </div>
    );
};

export default UsersPage;