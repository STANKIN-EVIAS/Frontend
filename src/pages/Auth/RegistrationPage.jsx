import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "shared/api/auth";
import { getProfile } from "shared/api/profile";
import { useAuth } from "shared/context/AuthContext";

export default function RegistrationPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();
    const navigate = useNavigate();
    const [agreement, setAgreement] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (password1 !== password2) {
            setErrors({ password2: ["Пароли не совпадают"] });
            return;
        }

        if (!agreement) {
    setErrors({ agreement: ["Необходимо дать согласие на обработку персональных данных"] });
    return;
}

        setLoading(true);
        try {
            await register({
                username,
                email,
                first_name: firstName,
                last_name: lastName,
                password1,
                password2,
            });

            const profile = await getProfile();
            setUser(profile);
            navigate("/profile");
        } catch (err) {
            setErrors(err); // err — объект с ключами полей
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-center mb-6">Регистрация</h1>
                {/* Username */}
                <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-gray-300 rounded-lg w-full p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.username && <div className="text-red-500 text-sm mb-1">{errors.username.join(", ")}</div>}

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-lg w-full p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.email && <div className="text-red-500 text-sm mb-1">{errors.email.join(", ")}</div>}

                {/* First Name */}
                <input
                    type="text"
                    placeholder="Имя"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border border-gray-300 rounded-lg w-full p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.first_name && <div className="text-red-500 text-sm mb-1">{errors.first_name.join(", ")}</div>}

                {/* Last Name */}
                <input
                    type="text"
                    placeholder="Фамилия"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border border-gray-300 rounded-lg w-full p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.last_name && <div className="text-red-500 text-sm mb-1">{errors.last_name.join(", ")}</div>}

                {/* Password */}
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    className="border border-gray-300 rounded-lg w-full p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.password1 && <div className="text-red-500 text-sm mb-1">{errors.password1.join(", ")}</div>}

                {/* Confirm Password */}
                <input
                    type="password"
                    placeholder="Повторите пароль"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="border border-gray-300 rounded-lg w-full p-2 mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.password2 && <div className="text-red-500 text-sm mb-1">{errors.password2.join(", ")}</div>}

                {/* Agreement */}
                <div className="flex items-start gap-2 mt-4">
                    <input
                        type="checkbox"
                        id="agreement"
                        checked={agreement}
                        onChange={(e) => setAgreement(e.target.checked)}
                        className="mt-1"
                    />
                    <label htmlFor="agreement" className="text-sm text-gray-700">
                        Я даю{" "}
                        <a
                            href="/assets/Политика_конфиденциальности_ЕВИАС.pdf"
                            download="Политика_конфиденциальности_ЕВИАС.pdf"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            согласие на обработку персональных данных
                        </a>
                    </label>
                </div>

                {errors.agreement && (
                    <div className="text-red-500 text-sm mt-1">
                        {errors.agreement.join(", ")}
                    </div>
                )}


                <button
                    type="submit"
                    disabled={loading || !agreement}
                    className="bg-blue-600 text-white w-full py-2 rounded-lg mt-3 hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? "Регистрация..." : "Зарегистрироваться"}
                </button>

                <Link to="/login" className="block text-center text-blue-600 mt-4 hover:underline">
                    Уже есть аккаунт? Войти
                </Link>
            </form>
        </div>
    );
}
