import { BACKEND_URL } from "config";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "shared/api/auth";

// Импортируем заглушки
import userPlaceholder from "assets/Placeholder_resized-scaled.jpg";
import petPlaceholder from "assets/Placeholder_resized-scaled.jpg";

function PetCard({ pet }) {
  const navigate = useNavigate();

  const handlePetClick = () => {
    navigate(`/pet/${pet.id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    // Логика для редактирования питомца
    navigate(`/pet/${pet.id}/edit`);
  };

  return (
    <div 
      className="bg-white block overflow-clip relative rounded-[25px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] h-[320px] w-full min-w-[300px] cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handlePetClick}
    >
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17px] justify-center leading-[0] left-1/2 not-italic text-[20px] text-black text-center top-[188.5px] tracking-[-0.1px] translate-x-[-50%] translate-y-[-50%] w-[79px]">
        <p className="leading-[1.45]">{pet.name}</p>
      </div>
      <div className="absolute left-1/2 size-[146px] top-[21px] translate-x-[-50%]">
        <img 
          alt={pet.name} 
          className="block size-full object-cover rounded-full" 
          src={pet.image || petPlaceholder}
          onError={(e) => {
            e.target.src = petPlaceholder;
          }}
        />
      </div>
      <div className="absolute bottom-[90px] flex flex-col font-['Inter:Light',sans-serif] font-light h-[43px] justify-center leading-[0] left-[18px] not-italic right-[18px] text-[12px] text-black text-center tracking-[-0.06px] translate-y-[50%]">
        <p className="leading-[1.45]">
          Вид: {pet.genus}; порода: {pet.species}; возраст: {pet.age || 'не указан'}; пол: {getGenderText(pet.gender)};
        </p>
      </div>
      <div 
        className="absolute bg-blue-600 bottom-[21px] h-[33px] left-1/2 overflow-clip rounded-[25px] w-[116px] translate-x-[-50%] hover:bg-blue-700 transition-colors cursor-pointer" 
        role="button" 
        tabIndex="0"
        onClick={handleEditClick}
      >
        <div className="absolute flex flex-col font-['Inter:Light',sans-serif] font-light inset-[7px_8px_6px_8px] justify-center leading-[0] not-italic text-[0px] text-center text-white tracking-[-0.06px]">
          <p className="leading-[1.45]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-[10px]">Редактировать</span>
            <span className="text-[12px]"> </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function getGenderText(gender) {
  const genderMap = {
    'male': 'м',
    'female': 'ж',
    'M': 'м',
    'F': 'ж'
  };
  return genderMap[gender] || gender || 'не указан';
}

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProfile = useCallback(async function fetchProfile() {
        setLoading(true);
        setError(null);

        try {
            const res = await authFetch(`${BACKEND_URL}/users/profile/`);
            if (!res.ok) throw new Error("Не удалось загрузить профиль");
            const userData = await res.json();
            setUser(userData);
        } catch (error) {
            console.error("Ошибка загрузки профиля:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleEditProfile = () => {
        navigate("/profile/edit");
    };

    const handleAddPet = () => {
        navigate("/pet/add");
    };

    if (loading) {
        return (
            <div className="bg-neutral-100 min-h-screen flex justify-center items-center">
                <p className="text-center">Загрузка...</p>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="bg-neutral-100 min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <p className="text-lg text-red-600 mb-4">
                        {error || "Не удалось загрузить профиль"}
                    </p>
                    <button
                        onClick={fetchProfile}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-['Inter:Semi_Bold',sans-serif] font-semibold"
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-100 min-h-screen py-10 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Заголовок профиля */}
                <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 h-[180px]">
                    <div className="flex items-center gap-6 h-full">
                        <img
                            src={user.image || userPlaceholder}
                            alt="Аватар пользователя"
                            className="w-[146px] h-[146px] rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                                e.target.src = userPlaceholder;
                            }}
                        />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 font-['Inter:Semi_Bold',sans-serif]">{user.username}</h1>
                            <p className="text-gray-600 text-lg font-['Inter:Light',sans-serif]">{user.email}</p>
                            <button
                                onClick={handleEditProfile}
                                className="bg-blue-600 text-white px-6 py-2 rounded-3xl hover:bg-blue-700 transition-colors mt-4 font-['Inter:Semi_Bold',sans-serif] font-semibold"
                            >
                                Редактировать профиль
                            </button>
                        </div>
                    </div>
                </div>

                {/* Секция питомцев */}
                <div className="bg-white shadow-lg rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 font-['Inter:Semi_Bold',sans-serif]">Мои питомцы</h2>
                        <button
                            onClick={handleAddPet}
                            className="bg-green-600 text-white px-6 py-2 rounded-3xl hover:bg-green-700 transition-colors font-['Inter:Semi_Bold',sans-serif] font-semibold"
                        >
                            + Добавить питомца
                        </button>
                    </div>

                    {user.pets && user.pets.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {user.pets.map((pet) => (
                                <PetCard key={pet.id} pet={pet} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg font-['Inter:Light',sans-serif]">У вас пока нет питомцев</p>
                            <button
                                onClick={handleAddPet}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4 font-['Inter:Semi_Bold',sans-serif] font-semibold"
                            >
                                Добавить первого питомца
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}