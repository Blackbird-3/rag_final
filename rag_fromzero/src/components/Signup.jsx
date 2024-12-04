import { useState } from "react";
import { account, ID } from "../lib/appwrite";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // general states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // navigate
  const navigate = useNavigate();

  // form submit
  const handleRegistration = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    account
      .create(ID.unique(), email, password, name)
      .then(() => {
        account
          .createEmailPasswordSession(email, password)
          .then(() => {
            navigate("/");
          })
          .catch((err) => {
            setError(err.message);
          })
          .finally(() => setLoading(false));
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <div className="background">
      <h1>Create an account!</h1>
      <form onSubmit={handleRegistration} className="form">
        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
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
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <button type="submit" className="submit-btn">
            {loading ? "..." : "SIGN UP"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
