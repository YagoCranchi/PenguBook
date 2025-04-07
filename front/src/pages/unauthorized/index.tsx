import { useNavigate } from "react-router-dom";
import useLogoff from "../../hooks/useLogoff";

const UnauthorizedPage = () => {
    const navigate = useNavigate();
    const logoff = useLogoff();

    const goBack = () => navigate(-1);

    return (
        <section>
            <h1>Unauthorized</h1>
            <br />
            <p>You do not have access to the requested page.</p>
            <div>
                <button className="btn" onClick={goBack}>Go Back</button>
                <button className="btn" onClick={logoff}>Logout</button>
            </div>
        </section>
    )
}

export default UnauthorizedPage;