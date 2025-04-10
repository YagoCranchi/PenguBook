import useAuth from "../../hooks/useAuth";

const DashboardPage = () => {
  const { auth } = useAuth();
  const userInfos = auth?.userInfo || null;
  const userName = userInfos?.name || "";

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p>Welcome to the dashboard { userName }!</p>
    </div>
  );
}

export default DashboardPage;