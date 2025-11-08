import { BACKEND_URL } from "config";
import { useCallback, useEffect, useState } from "react";
import { authFetch } from "shared/api/auth";

function PetCard({ pet }) {
  return (
    <div className="bg-white block overflow-clip relative rounded-[25px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] h-[320px] w-full min-w-[300px]">
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17px] justify-center leading-[0] left-1/2 not-italic text-[20px] text-black text-center top-[188.5px] tracking-[-0.1px] translate-x-[-50%] translate-y-[-50%] w-[79px]">
        <p className="leading-[1.45]">{pet.name}</p>
      </div>
      <div className="absolute left-1/2 size-[146px] top-[21px] translate-x-[-50%]">
        <img 
          alt={pet.name} 
          className="block size-full object-cover rounded-full" 
          src={pet.image} 
        />
      </div>
      <div className="absolute bottom-[90px] flex flex-col font-['Inter:Light',sans-serif] font-light h-[43px] justify-center leading-[0] left-[18px] not-italic right-[18px] text-[12px] text-black text-center tracking-[-0.06px] translate-y-[50%]">
        <p className="leading-[1.45]">
          Вид: {pet.species}; порода: {pet.genus || 'нет'}; возраст: {pet.age || 'не указан'}; пол: {getGenderText(pet.gender)};
        </p>
      </div>
      <div className="absolute bg-[#3b84c4] bottom-[21px] h-[33px] left-1/2 overflow-clip rounded-[25px] w-[116px] translate-x-[-50%]" role="button" tabIndex="0">
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
    const [, setLoading] = useState(false);

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

    if (!user) return (
        <div className="bg-neutral-100 min-h-screen flex justify-center items-center">
            <p className="text-center">Загрузка...</p>
        </div>
    );

    return (
        <div className="bg-neutral-100 min-h-screen py-10 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Заголовок профиля - уменьшена высота */}
                <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 h-[180px]">
                    <div className="flex items-center gap-6 h-full">
                        <img
                            src={user.image}
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-8">Мои питомцы</h2>

                    {user.pets && user.pets.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            {user.pets.map((pet) => (
                                <PetCard key={pet.id} pet={pet} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">У вас пока нет питомцев</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}