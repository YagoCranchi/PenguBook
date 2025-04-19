import { Link } from "react-router-dom";
import SignupForm from "./components/form";

import './index.scss';

const SignupPage = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>SignUp</h1>
        <SignupForm />
        <div>
          Aready have an account?
          <Link to="/login"> Login</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;