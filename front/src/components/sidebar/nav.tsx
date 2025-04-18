import { Link, useLocation } from "react-router-dom";

interface SideBarNavProps {
    isAdmin: boolean;
}

const SideBarNav: React.FC<SideBarNavProps> = ({ isAdmin }) => {
    const location = useLocation();

    return (
        <ul className="sidebar-list">
            {isAdmin && (
                <>
                    <li className={location.pathname === "/users" ? "active" : ""}>
                        <Link to="/users">List Users</Link>
                    </li>
                    <li className={location.pathname === "/location" ? "active" : ""}>
                        <Link to="/location">Locação</Link>
                    </li>
                </>
            )}
            <li className={location.pathname === "/item3" ? "active" : ""}>
                <Link to="/item3">Item 3</Link>
            </li>
        </ul>
    );
};

export default SideBarNav;