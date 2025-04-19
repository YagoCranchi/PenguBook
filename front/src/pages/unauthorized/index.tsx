import { useNavigate } from "react-router-dom";
import useLogoff from "../../hooks/useLogoff";

import "./index.scss";

const UnauthorizedPage = () => {
    const navigate = useNavigate();
    const logoff = useLogoff();

    const goBack = () => navigate(-1);

    return (
        <div className="unauthorized-page">
            <h1 className="page-title">Unauthorized</h1>
            <p>You do not have access to the requested page.</p>
            <div className="btn-container">
                <button className="btn" onClick={goBack}>Go Back</button>
                <button className="btn" onClick={logoff}>Logout</button>
            </div>
        </div>
    )
}

export default UnauthorizedPage;