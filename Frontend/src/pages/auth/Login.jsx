import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded w-96"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? "Loading..." : "Login"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
