import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isLogin) await login({ email: form.email, password: form.password });
      else await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth">
      <form className="card" onSubmit={onSubmit}>
        <h1>TaskFlow</h1>
        <p className="muted">{isLogin ? "Sign in to your account" : "Create an account"}</p>

        {!isLogin && (
          <label>
            Name
            <input name="name" value={form.name} onChange={onChange} required />
          </label>
        )}
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={onChange} required />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            minLength={6}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="primary" disabled={busy}>
          {busy ? "Please wait…" : isLogin ? "Sign in" : "Sign up"}
        </button>

        <p className="muted small">
          {isLogin ? (
            <>No account? <Link to="/register">Sign up</Link></>
          ) : (
            <>Already registered? <Link to="/login">Sign in</Link></>
          )}
        </p>
      </form>
    </main>
  );
}
