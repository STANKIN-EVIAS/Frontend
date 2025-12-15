import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "shared/context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-neutral-100 shadow-md relative">
      {/* Верхняя панель */}
      <div className="container mx-auto flex justify-between items-center h-28 px-6">
        <Link to="/">
          <div>
            <h1 className="text-5xl font-black font-inter">ЕВИАС</h1>
            <p className="text-xs text-gray-500 mt-1">Единая ветеринарная информационно-аналитическая система</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">+7 (999) 123-45-67</p>
          <CallDoctorButton />
          <OnlineBookingButton />
          <ProfileButton user={user} />
        </div>
      </div>

      {/* Навигация */}
      <nav className="bg-white shadow-lx">
        <div className="container mx-auto flex justify-center gap-8 h-16 items-center px-6">
          <NavItem text="Услуги" to="/services" />
          <NavItem text="Контакты" to="/contacts" />
          <NavItem text="Отзывы" to="/reviews" />
          <NavItem text="Ветклиники" to="/clinics" />
          <NavItem text="Календарь" to="/calendar" />
        </div>
      </nav>
    </header>
  );
}

function CallDoctorButton() {
  return (
    <button className="bg-blue-600 text-white font-medium rounded-full h-12 px-6 hover:bg-blue-700">
      Вызвать врача на дом
    </button>
  );
}

function OnlineBookingButton() {
  return (
    <button className="bg-green-500 text-white font-medium rounded-full h-12 px-6 hover:bg-green-600">
      Записаться онлайн
    </button>
  );
}

function ProfileButton({ user }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const userAvatar = user?.image || "/assets/user-placeholder.webp";

  return (
    <div className="flex items-center gap-2">
      <Link
        to={user ? "/profile" : "/login"}
        className="flex items-center gap-2 bg-blue-600 text-white font-medium rounded-full h-12 px-4 hover:bg-blue-700"
      >
        {user && (
          <div className="w-7 h-7 rounded-full overflow-hidden">
            <img src={userAvatar} alt="Аватар" className="w-full h-full object-cover" />
          </div>
        )}

        {user ? "Личный кабинет" : "Войти"}
      </Link>

      {user && (
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-2 bg-red-500 text-white font-medium rounded-full h-12 px-4 hover:bg-red-600"
        >
          Выйти
        </button>
      )}
    </div>
  );
}

function NavItem({ text, to }) {
  return (
    <Link to={to} className="text-black font-semibold hover:text-blue-600 transition">
      {text}
    </Link>
  );
}
