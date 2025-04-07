import useAuth from "../../hooks/useAuth";

const ProfileEdit = () => {
    const { auth } = useAuth();
    const userInfos = auth?.userInfo || null;
    const userName = userInfos?.name || "";
    const userEmail = userInfos?.email || "";
    const userCpf = userInfos?.cpf || "";
    const userPhone = userInfos?.phone || "";
    const userCreationDate = userInfos?.creationDate || "";

    const formatDate = (date: string) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return date;
        return parsedDate.toLocaleDateString("us", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formattedUserCreationDate = formatDate(userCreationDate);

    return (
        <form className="profile-edit">
            <div className="profile-info-item">
                <span className="profile-info-label">Name: </span>
                <input
                    className="profile-info-value"
                    type="text"
                    defaultValue={userName}
                />
            </div>
            <div className="profile-info-item">
                <span className="profile-info-label">Email: </span>
                <input
                    className="profile-info-value"
                    type="email"
                    defaultValue={userEmail}
                />
            </div>
            <div className="profile-info-item">
                <span className="profile-info-label">CPF: </span>
                <input
                    className="profile-info-value"
                    type="text"
                    defaultValue={userCpf}
                />
            </div>
            <div className="profile-info-item">
                <span className="profile-info-label">Phone: </span>
                <input
                    className="profile-info-value"
                    type="text"
                    defaultValue={userPhone}
                />
            </div>
            <div className="profile-info-item">
                <span className="profile-info-label">Account Created: </span>
                <input
                    className="profile-info-value"
                    type="text"
                    defaultValue={formattedUserCreationDate}
                    readOnly
                />
            </div>
        </form>
    );
}

export default ProfileEdit;