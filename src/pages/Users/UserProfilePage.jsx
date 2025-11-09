import { BACKEND_URL } from "config";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "shared/api/auth";

// Импортируем заглушки
import userPlaceholder from "assets/Placeholder_resized-scaled.jpg";
import petPlaceholder from "assets/Placeholder_resized-scaled.jpg";

function PetCard({ pet }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pets/${pet.id}`);
  };

  // Заглушка для фото питомца
  const petImage = pet.image || "assets/pet-placeholder.avif";

  return (
    <div
      onClick={handleClick}
      className="bg-white block overflow-clip relative rounded-[25px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] h-[320px] w-full min-w-[300px] cursor-pointer hover:shadow-lg transition-shadow duration-200"
    >
      <div className="absolute left-1/2 size-[146px] top-[21px] translate-x-[-50%]">
        <img alt={pet.name} className="block size-full object-cover rounded-full" src={petImage} />
      </div>

      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center left-1/2 not-italic text-[20px] text-black text-center top-[188.5px] translate-x-[-50%] translate-y-[-50%] w-[79px]">
        <p className="leading-[1.45]">{pet.name}</p>
      </div>

      <div className="absolute bottom-[90px] flex flex-col font-['Inter:Light',sans-serif] font-light h-[43px] justify-center left-[18px] right-[18px] text-[12px] text-black text-center tracking-[-0.06px] translate-y-[50%]">
        <p className="leading-[1.45]">
          Вид: {pet.genus_name || "не указан"}; порода: {pet.species_name || "не указана"}; возраст:{" "}
          {pet.age || "не указан"}; пол: {getGenderText(pet.gender)};
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/pets/${pet.id}/edit`);
        }}
        className="absolute bg-[#3b84c4] bottom-[21px] h-[33px] left-1/2 overflow-clip rounded-[25px] w-[116px] translate-x-[-50%] hover:bg-[#357ab6] transition-colors duration-200"
      >
        <div className="absolute flex flex-col font-['Inter:Light',sans-serif] font-light inset-[7px_8px_6px_8px] justify-center leading-[0] not-italic text-[0px] text-center text-white tracking-[-0.06px]">
          <p className="leading-[1.45]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-[10px]">
              Редактировать
            </span>
          </p>
        </div>
      </button>
    </div>
  );
}

function getGenderText(gender) {
  const genderMap = {
    male: "м",
    female: "ж",
    M: "м",
    F: "ж",
  };
  return genderMap[gender] || gender || "не указан";
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async function fetchProfile() {
    setLoading(true);
    const res = await authFetch(`${BACKEND_URL}/users/profile/`);
    if (!res.ok) throw new Error("Не удалось загрузить профиль");
    setLoading(false);
    return res.json();
  }, []);

  useEffect(() => {
    fetchProfile().then(setUser).catch(console.error);
  }, [fetchProfile]);

  if (!user)
    return (
      <div className="bg-neutral-100 min-h-screen flex justify-center items-center">
        <p className="text-center">Загрузка...</p>
      </div>
    );

  // Заглушка для аватара пользователя
  const userAvatar = user.image || "assets/user-placeholder.webp";

  return (
    <div className="bg-neutral-100 min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок профиля */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 h-[180px]">
          <div className="flex items-center gap-6 h-full">
            <img
              src={userAvatar}
              alt="Аватар пользователя"
              className="w-[146px] h-[146px] rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
              <p className="text-gray-600 text-lg">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Секция питомцев */}
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Мои питомцы</h2>
            <button
              onClick={() => navigate("/pets/add")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-[20px] text-sm font-medium transition-colors duration-200"
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
              <p className="text-gray-500 text-lg">У вас пока нет питомцев</p>
              <button
                onClick={() => navigate("/pets/add")}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-[20px] text-sm font-medium"
              >
                Добавить питомца
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
