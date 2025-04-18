import useAuth from "../../hooks/useAuth";
import DashboardList from "./components/list";
import "./index.scss";

const DashboardPage = () => {
  const { auth } = useAuth();
  const userInfos = auth?.userInfo || null;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <DashboardList />
    </div>
  );
}

export default DashboardPage;