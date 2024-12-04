import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account } from "../lib/appwrite";

const Login = () => {
  // login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // navigate
  const navigate = useNavigate();

  // handle login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    account
      .createEmailPasswordSession(email, password)
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="background">
      <h1>Login!</h1>
      <form onSubmit={handleLogin} className="form">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        {error && <div className="error-msg">{error}</div>}
        <div className="submit-div">
          <p>
            Don&apos;t have an account? <Link to="/signup">Register</Link>
          </p>
          <button type="submit" className="submit-btn">
            {loading ? "..." : "LOGIN"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
