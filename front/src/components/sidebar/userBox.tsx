import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiLogout } from "@mdi/js";

import useLogoff from "../../hooks/useLogoff";
import useAuth from "../../hooks/useAuth";

import DialogConfirm from "../dialog/confirm";

const SideBarUserBox = () => {
    const navigate = useNavigate();
    const logoff = useLogoff();

    const { auth } = useAuth();

    const userInfos = auth?.userInfo || null;
    const userName = userInfos?.name || "";

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    const handleConfirmLogout = async () => {
        await logoff();
        navigate('/');
        setIsDialogOpen(false);
    };

    return (
        <>
            <div className="sidebar-user-info">
                <Link to="/profile" className="sidebar-user-link">
                    <p className="sidebar-user-name">{userName}</p>
                </Link>

                <button className="btn" onClick={handleOpenDialog}>
                    <Icon path={mdiLogout} size={1} color="currentColor" />
                </button>
            </div>

            <DialogConfirm
                isOpen={isDialogOpen}
                content="Are you sure you want to log out?"
                onClose={handleCloseDialog}
                onConfirm={handleConfirmLogout}
                confirmText="Yes"
                cancelText="No"
            />
        </>

    );
};

export default SideBarUserBox;