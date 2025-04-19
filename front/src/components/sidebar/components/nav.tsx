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
                    <li className={location.pathname === "/list-reservations" ? "active" : ""}>
                        <Link to="/list-reservations">List Reservations</Link>
                    </li>
                    <li className={location.pathname === "/location" ? "active" : ""}>
                        <Link to="/location">Location</Link>
                    </li>
                </>
            )}
            <li className={location.pathname === "/item3" ? "active" : ""}>
                <Link to="/reservations">My Reservations</Link>
            </li>
        </ul>
    );
};

export default SideBarNav;