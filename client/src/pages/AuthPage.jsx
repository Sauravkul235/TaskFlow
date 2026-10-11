import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { CheckIcon } from "../components/Icons.jsx";

const POINTS = [
  "Drag tasks across To do, In progress and Done",
  "Set priorities and due dates at a glance",
  "Search and filter in real time",
];

export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="auth-shell">
      <aside className="auth-hero">
        <div className="brand brand-light">
          <span className="brand-mark"><CheckIcon width={18} height={18} /></span>
          TaskFlow
        </div>
        <div>
          <h1>Organise your work.<br />Ship with calm.</h1>
          <ul className="hero-points">
            {POINTS.map((p) => (
              <li key={p}>
                <span className="hero-check"><CheckIcon width={14} height={14} /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="hero-foot">A MERN stack project</p>
      </aside>

      <main className="auth-panel">
        <div className="auth-theme"><ThemeToggle /></div>

        <form className="auth-form" onSubmit={onSubmit} noValidate={false}>
          <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="muted">
            {isLogin ? "Sign in to continue to your board." : "It takes less than a minute."}
          </p>

          {!isLogin && (
            <label className="field">
              <span>Name</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </label>
          )}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <div className="input-with-action">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="At least 6 characters"
                required
              />
              <button
                type="button"
                className="link-btn"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error && <p className="form-error" role="alert">{error}</p>}

          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
          </button>

          <p className="muted small center-text">
            {isLogin ? (
              <>New here? <Link to="/register">Create an account</Link></>
            ) : (
              <>Already have an account? <Link to="/login">Sign in</Link></>
            )}
          </p>
        </form>
      </main>
    </div>
  );
}