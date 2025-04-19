import useAuth from "../../hooks/useAuth";
import ProfileEdit from "./components/edit";

import "./index.scss";

const ProfilePage = () => {
  const { auth } = useAuth();
  const userInfos = auth?.userInfo || null;
  const userName = userInfos?.name || "";

  const capitalizeName = (name: string) => {
    return name
      .split(" ")
      .map((word) =>
        isNaN(Number(word)) ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word
      )
      .join(" ");
  };
  const formattedUserName = capitalizeName(userName);



  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">{formattedUserName}'s Profile</h1>
        <p>Welcome {userName}!</p>
      </div>

      <ProfileEdit />
    </div>
  );
}

export default ProfilePage;