import useAuth from "../../hooks/useAuth";
import ProfileEdit from "./components/edit/form";

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
      <h1 className="page-title">{formattedUserName}'s Profile</h1>

      <ProfileEdit />
    </div>
  );
}

export default ProfilePage;