import { useLocation } from "react-router-dom";

export const ResetPassword = () => {
  const location = useLocation();
  console.log(location.state);
  return (
    <div>
      <h1>Reset Password</h1>
      <form>
        <div>
          <input type="password" placeholder="New Password" />
        </div>
        <div>
          <input type="password" placeholder="Confirm Password" />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};
