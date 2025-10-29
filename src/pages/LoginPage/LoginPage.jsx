import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "shared/api/auth";
import { getProfile } from "shared/api/profile";
import { useAuth } from "shared/context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);
            const profile = await getProfile(); // запрос профиля
            setUser(profile); // обновляем контекст
            navigate("/profile"); // переходим без перезагрузки
        } catch (err) {
            setError(err.message || "Ошибка авторизации");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-center mb-6">Вход в аккаунт</h1>

                {error && <div className="text-red-500 text-sm text-center mb-3">{error}</div>}

                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-lg w-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg w-full p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? "Входим..." : "Войти"}
                </button>

                <Link to="/registration" className="block text-center text-blue-600 mt-4 hover:underline">
                    Зарегистрироваться
                </Link>
            </form>
        </div>
    );
}
