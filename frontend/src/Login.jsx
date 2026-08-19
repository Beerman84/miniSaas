import { useState } from "react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await fetch(
            "http://localhost:3000/api/login",
            {
                method: "POST",
        		    credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );
        const data = await response.json();
        //console.log("data login: ",data);
        if (data.success) {
          //After login, we simply reload the page. At that point, the entire app has access to the session ID and can continue normally.
        	window.location.reload();
        }
        else {setMessage("Wrong username or password");}
    }

    return (
<div className="login-page">
  <div className="login-card">

    <h2 className="login-title">
      Login
    </h2>

    <form onSubmit={handleSubmit}>

      <div className="login-field">
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="login-field">
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      (Username: "admin" ; Password "cielito!1984")
      <button
        type="submit"
        className="login-button"
      >
        Login
      </button>

    </form>

    <p className="login-message">
      {message}
    </p>

  </div>
</div>
    );
}

export default Login;