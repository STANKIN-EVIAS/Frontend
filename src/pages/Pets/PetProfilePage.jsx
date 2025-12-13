import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deletePet, getPet } from "shared/api/pets";

const petPlaceholder = "/assets/pet-placeholder.avif";
const MedicalIcon = "/assets/2025-11-09_18-17-08.png";
const CertificateIcon = "/assets/2025-11-09_18-23-50.png";
const PassportIcon = "/assets/2025-11-09_18-24-00.png";

function DocumentCard({ title, onClick, iconSrc }) {
  return (
    <button
      className="bg-white block cursor-pointer overflow-clip relative rounded-[25px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] h-[120px] w-full min-w-[300px] hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] left-[60px] not-italic text-[20px] text-black text-left top-1/2 tracking-[-0.1px] translate-y-[-50%] w-[calc(100%-120px)]">
        <p className="leading-[1.45] whitespace-pre">{title}</p>
      </div>

      {/* Иконка слева */}
      <div className="absolute left-[19px] size-[32px] top-1/2 translate-y-[-50%]">
        <img
          src={iconSrc}
          alt={title}
          className="block size-full object-contain"
          onError={(e) => {
            console.error(`Не удалось загрузить иконку: ${iconSrc}`);
            e.target.src = "/icons/default-icon.png";
          }}
        />
      </div>

      {/* Стрелка справа */}
      <div className="absolute bottom-[40px] right-[19px] top-[43px]">
        <div className="absolute right-0 size-[26px] top-0" role="button" tabIndex="0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
            <circle cx="13" cy="13" fill="#50C43B" r="13" />
          </svg>
          {/* Иконка стрелки */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m9 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

function getGenderText(gender) {
  const genderMap = {
    M: "Мужской",
    F: "Женский",
  };
  return genderMap[gender] || gender || "не указан";
}

export default function PetProfilePage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPetProfile = useCallback(async () => {
    if (!petId) {
      setError("ID питомца не указан");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const petData = await getPet(petId);
      setPet(petData);
    } catch (error) {
      console.error("Ошибка загрузки профиля питомца:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchPetProfile();
  }, [fetchPetProfile]);

  const handleDocumentClick = (documentType) => {
    // Навигация на конкретный документ
    if (documentType === "medical") {
      navigate(`/pet/${petId}/medical-card`);
    } else {
      navigate(`/pet/${petId}/${documentType}`);
    }
  };
  
  const handleDeletePet = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить этого питомца? Это действие невозможно отменить.")) return;
    setLoading(true);
    setError(null);
    try {
      await deletePet(petId);
      navigate("/profile");
    } catch (err) {
      console.error("Ошибка при удалении питомца:", err);
      setError(err.message || "Не удалось удалить питомца");
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditPet = () => {
    navigate(`/pet/${petId}/edit`);
  };

  if (loading) {
    return (
      <div className="bg-neutral-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Загрузка профиля питомца...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="bg-neutral-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error || "Питомец не найден"}</p>
          <button
            onClick={handleBackClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Хедер с кнопкой назад */}
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors font-['Inter:Semi_Bold',sans-serif]"
          >
            <span className="mr-2">←</span>
            Назад к профилю
          </button>
        </div>

        {/* Профиль питомца */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex-shrink-0">
              <img
                src={pet.image || petPlaceholder}
                alt={pet.name}
                className="w-32 h-32 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-gray-100"
                onError={(e) => {
                  e.target.src = petPlaceholder;
                }}
              />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-0 font-['Inter:Semi_Bold',sans-serif]">
                  {pet.name}
                </h1>
                <div className="flex gap-3">
                  <button
                    onClick={handleEditPet}
                    className="bg-blue-600 text-white px-4 py-2 rounded-3xl hover:bg-blue-700 transition-colors text-sm font-medium font-['Inter:Semi_Bold',sans-serif]"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={handleDeletePet}
                    className="bg-red-600 text-white px-4 py-2 rounded-3xl hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-gray-600 font-['Inter:Light',sans-serif]">
                {pet.genus && (
                  <p className="text-base">
                    <span className="font-semibold">Вид:</span> {pet.genus}
                  </p>
                )}
                {pet.species && (
                  <p className="text-base">
                    <span className="font-semibold">Порода:</span> {pet.species || "не указана"}
                  </p>
                )}
                {pet.age && (
                  <p className="leading-[1.45]">
                    <span className="font-semibold">Возраст:</span>{" "}
                    {pet.age.years
                      ? `${pet.age.years} ${
                          pet.age.years === 1 ? "год" : pet.age.years >= 2 && pet.age.years <= 4 ? "года" : "лет"
                        }` + (pet.age.months ? ` и ${pet.age.months} месяцев` : "")
                      : pet.age.months
                      ? `${pet.age.months} месяцев`
                      : "не указан"}
                  </p>
                )}
                {pet.gender && (
                  <p className="text-base">
                    <span className="font-semibold">Пол:</span> {getGenderText(pet.gender)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Секция документов */}
        <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 font-['Inter:Semi_Bold',sans-serif]">
            Документы питомца
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DocumentCard
              title="Медицинская карта"
              onClick={() => handleDocumentClick("medical")}
              iconSrc={MedicalIcon}
            />
            <DocumentCard
              title="Сертификаты"
              onClick={() => handleDocumentClick("certificates")}
              iconSrc={CertificateIcon}
            />
            <DocumentCard
              title="Паспорт"
              onClick={() => handleDocumentClick("passport")}
              iconSrc={PassportIcon}
            />
          </div>
        </div>
      </div>
    </div>
  );
}