import React from 'react';

const Login = (props) => {
  const [mode, setMode] = React.useState('login');
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === 'login') {
      props.onLogin(email, password);
    } else {
      props.onRegister(email, password);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Kanban</h1>
        <p className="login-subtitle">
          {mode === 'login' ? 'Sign in to continue' : 'Create a new account'}
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {props.error && <p className="login-error">{props.error}</p>}

          <button className="btn btn-login" type="submit" disabled={props.loading}>
            {props.loading
              ? (mode === 'login' ? "Logging in..." : "Creating account...")
              : (mode === 'login' ? "Log In" : "Sign Up")}
          </button>
        </form>

        <button className="login-toggle" onClick={toggleMode} type="button">
          {mode === 'login' ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
};

export default Login;