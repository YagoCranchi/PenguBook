import { Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import SideBar from "../components/sidebar";

const Layout = () => {
    const { auth } = useAuth();

    return (
        <div className={`app-layout ${auth?.accessToken ? 'logged-in' : ''}`}>
            {auth?.accessToken && <SideBar />}
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;