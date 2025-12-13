import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPet } from "shared/api/pets";
import { getPetMedicalCard } from "shared/api/medicalCards";

const petPlaceholder = "/assets/pet-placeholder.avif";

function MedicalRecordItem({ title, value, unit = "" }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 py-4 border-b border-gray-100 last:border-b-0">
      <div className="w-full sm:w-1/3">
        <p className="text-gray-600 font-medium font-['Inter:Medium',sans-serif]">{title}</p>
      </div>
      <div className="w-full sm:w-2/3">
        <p className="text-gray-800 font-['Inter:Regular',sans-serif]">
          {value || <span className="text-gray-400">Не указано</span>}
          {unit && value && ` ${unit}`}
        </p>
      </div>
    </div>
  );
}

function MedicalRecordCard({ title, children, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 font-['Inter:Semi_Bold',sans-serif]">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm font-['Inter:Medium',sans-serif] transition-colors"
          >
            Редактировать
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function formatDate(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  } catch (error) {
    console.error("Ошибка форматирования даты:", dateString, error);
    return dateString;
  }
}

// Функция для парсинга текстовых полей в массив
function parseTextToArray(text) {
  if (!text) return [];
  return text.split('\n').filter(item => item.trim() !== '');
}

// Функция для парсинга прививок
function parseVaccinations(vaccinationsText) {
  if (!vaccinationsText) return [];
  
  try {
    const lines = vaccinationsText.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => {
      const lineText = line.trim();
      
      if (lineText.includes('-')) {
        const [name, datesPart] = lineText.split('-').map(part => part.trim());
        if (datesPart) {
          const dates = datesPart.split(',').map(date => date.trim());
          return {
            name,
            date: dates[0] || '',
            nextDate: dates[1] || ''
          };
        }
      }
      
      return { name: lineText, date: '', nextDate: '' };
    });
  } catch (error) {
    console.error("Ошибка парсинга прививок:", error);
    return [];
  }
}

export default function MedicalCardPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [medicalCard, setMedicalCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMedicalCard = useCallback(async () => {
    if (!petId) {
      setError("ID питомца не указан");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Начинаем загрузку данных для питомца:", petId);
      
      // 1. Загружаем данные питомца
      const petData = await getPet(petId);
      console.log("Данные питомца загружены:", petData);
      setPet(petData);
      
      // 2. Загружаем медицинскую карту
      console.log("Пробуем загрузить медицинскую карту через API...");
      const medicalData = await getPetMedicalCard(petId);
      console.log("Ответ от API medical-cards:", medicalData);
      
      if (medicalData && medicalData.id) {
        console.log("Найдена медкарта:", medicalData);
        setMedicalCard(medicalData);
      } else {
        console.log("Медкарта не найдена или пустая");
        setMedicalCard(null);
      }
      
    } catch (error) {
      console.error("Критическая ошибка загрузки данных:", error);
      // Проверяем, если это 404 ошибка - это нормально (медкарты нет)
      if (error.response?.status === 404 || error.message?.includes('404')) {
        console.log("Медкарта не найдена (404)");
        setMedicalCard(null);
      } else {
        setError("Ошибка загрузки данных: " + (error.message || "Неизвестная ошибка"));
      }
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchMedicalCard();
  }, [fetchMedicalCard]);

  const handleCreateMedicalCard = () => {
    navigate(`/pet/${petId}/medical/create`);
  };

  const handleEditMedicalCard = () => {
    if (medicalCard && medicalCard.id) {
      navigate(`/pet/${petId}/medical/edit/${medicalCard.id}`);
    } else {
      handleCreateMedicalCard();
    }
  };

  const handleBackClick = () => {
    navigate(`/pet/${petId}`);
  };

  // Добавим кнопку для отладки
  const handleDebugClick = () => {
    console.log("=== DEBUG INFO ===");
    console.log("petId:", petId);
    console.log("pet:", pet);
    console.log("medicalCard:", medicalCard);
    console.log("loading:", loading);
    console.log("error:", error);
    
    if (medicalCard) {
      const cardInfo = `
Медкарта найдена!
ID: ${medicalCard.id}
Номер: ${medicalCard.medical_number || 'нет'}
Вес: ${medicalCard.weight || 'нет'}
Группа крови: ${medicalCard.blood_type || 'нет'}
Аллергии: ${medicalCard.allergies ? 'есть' : 'нет'}
Хронические заболевания: ${medicalCard.chronic_diseases ? 'есть' : 'нет'}
Прививки: ${medicalCard.vaccinations ? 'есть' : 'нет'}
Последний осмотр: ${medicalCard.last_checkup_date || 'нет'}
Следующий осмотр: ${medicalCard.next_checkup_date || 'нет'}
Сертификат: ${medicalCard.certificate_info ? 'есть' : 'нет'}
`;
      alert(cardInfo);
    } else {
      alert("Медкарта не найдена в состоянии");
    }
  };

  if (loading) {
    return (
      <div className="bg-neutral-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Загрузка медицинской карты...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
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

  // Если нет питомца
  if (!pet) {
    return (
      <div className="bg-neutral-100 min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Питомец не найден</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вернуться в профиль
          </button>
        </div>
      </div>
    );
  }

  // Парсим данные только если есть медицинская карта
  const allergiesArray = medicalCard ? parseTextToArray(medicalCard.allergies) : [];
  const diseasesArray = medicalCard ? parseTextToArray(medicalCard.chronic_diseases) : [];
  const vaccinationsArray = medicalCard ? parseVaccinations(medicalCard.vaccinations) : [];

  // Если нет медицинской карты
  if (!medicalCard) {
    return (
      <div className="bg-neutral-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={handleBackClick}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors font-['Inter:Semi_Bold',sans-serif]"
            >
              <span className="mr-2">←</span>
              Назад к профилю питомца
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 font-['Inter:Semi_Bold',sans-serif]">
                Медицинская карта
              </h1>
              <p className="text-gray-600">
                {pet.name} • {pet.species || "Порода не указана"}
              </p>
            </div>
            
            <div className="mb-8">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 mb-6">
                Для питомца <span className="font-semibold">{pet.name}</span> пока не создана медицинская карта.
              </p>
              <button
                onClick={handleDebugClick}
                className="mt-4 text-sm text-gray-500 underline"
              >
                Отладка
              </button>
            </div>
            
            <button
              onClick={handleCreateMedicalCard}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Создать медицинскую карту
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("Рендерим медкарту с данными:", medicalCard);

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
            Назад к профилю питомца
          </button>
          <button
            onClick={handleDebugClick}
            className="mt-2 text-sm text-gray-500 underline"
          >
            Отладка
          </button>
        </div>

        {/* Заголовок */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 font-['Inter:Semi_Bold',sans-serif]">
                Медицинская карта
              </h1>
              <p className="text-gray-600">
                {pet.name} • {pet.species || "Порода не указана"}
              </p>
            </div>
            <button
              onClick={handleEditMedicalCard}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Редактировать
            </button>
          </div>
          
          {medicalCard.medical_number && (
            <div className="mt-2">
              <span className="text-gray-500 text-sm">
                Номер медкарты: <span className="font-medium">{medicalCard.medical_number}</span>
              </span>
            </div>
          )}
        </div>

        {/* Основная информация */}
        <MedicalRecordCard title="Основная информация">
          <div className="space-y-1">
            {medicalCard.weight && medicalCard.weight !== "-256" && (
              <MedicalRecordItem 
                title="Вес" 
                value={medicalCard.weight} 
                unit="кг" 
              />
            )}
            {medicalCard.blood_type && (
              <MedicalRecordItem title="Группа крови" value={medicalCard.blood_type} />
            )}
          </div>
        </MedicalRecordCard>

        {/* Даты осмотров */}
        {(medicalCard.last_checkup_date || medicalCard.next_checkup_date) && (
          <MedicalRecordCard title="Даты осмотров">
            <div className="space-y-1">
              {medicalCard.last_checkup_date && (
                <MedicalRecordItem 
                  title="Последний осмотр" 
                  value={formatDate(medicalCard.last_checkup_date)} 
                />
              )}
              {medicalCard.next_checkup_date && (
                <MedicalRecordItem 
                  title="Следующий осмотр" 
                  value={formatDate(medicalCard.next_checkup_date)} 
                />
              )}
            </div>
          </MedicalRecordCard>
        )}

        {/* Сертификат (если есть) */}
        {medicalCard.certificate_info && (
          <MedicalRecordCard title="Сертификат">
            <div className="space-y-1">
              {medicalCard.certificate_info.certificate_number && (
                <MedicalRecordItem 
                  title="Номер сертификата" 
                  value={medicalCard.certificate_info.certificate_number} 
                />
              )}
              {medicalCard.certificate_info.title && (
                <MedicalRecordItem 
                  title="Название" 
                  value={medicalCard.certificate_info.title} 
                />
              )}
              {medicalCard.certificate_info.certificate_type_display && (
                <MedicalRecordItem 
                  title="Тип сертификата" 
                  value={medicalCard.certificate_info.certificate_type_display} 
                />
              )}
              {medicalCard.certificate_info.issue_date && (
                <MedicalRecordItem 
                  title="Дата выдачи" 
                  value={formatDate(medicalCard.certificate_info.issue_date)} 
                />
              )}
              {medicalCard.certificate_info.expiration_date && (
                <MedicalRecordItem 
                  title="Срок действия до" 
                  value={formatDate(medicalCard.certificate_info.expiration_date)} 
                />
              )}
              {medicalCard.certificate_info.issued_by && (
                <MedicalRecordItem 
                  title="Кем выдан" 
                  value={medicalCard.certificate_info.issued_by} 
                />
              )}
              {medicalCard.certificate_info.description && (
                <MedicalRecordItem 
                  title="Описание" 
                  value={medicalCard.certificate_info.description} 
                />
              )}
            </div>
          </MedicalRecordCard>
        )}

        {/* Вакцинация */}
        {vaccinationsArray.length > 0 && (
          <MedicalRecordCard title="Вакцинация">
            <div className="space-y-4">
              {vaccinationsArray.map((vaccine, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-800 mb-2">{vaccine.name}</p>
                  {(vaccine.date || vaccine.nextDate) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      {vaccine.date && <p>Дата вакцинации: {formatDate(vaccine.date)}</p>}
                      {vaccine.nextDate && <p>Следующая дата: {formatDate(vaccine.nextDate)}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </MedicalRecordCard>
        )}

        {/* Хронические заболевания */}
        {diseasesArray.length > 0 && (
          <MedicalRecordCard title="Хронические заболевания">
            <div className="flex flex-wrap gap-2">
              {diseasesArray.map((disease, index) => (
                <span key={index} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                  {disease}
                </span>
              ))}
            </div>
          </MedicalRecordCard>
        )}

        {/* Аллергии */}
        {allergiesArray.length > 0 && (
          <MedicalRecordCard title="Аллергии">
            <div className="flex flex-wrap gap-2">
              {allergiesArray.map((allergy, index) => (
                <span key={index} className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm">
                  {allergy}
                </span>
              ))}
            </div>
          </MedicalRecordCard>
        )}

        {/* Если все поля пустые */}
        {(!medicalCard.weight || medicalCard.weight === "-256") && 
         !medicalCard.blood_type && 
         !medicalCard.last_checkup_date && !medicalCard.next_checkup_date &&
         !medicalCard.certificate_info &&
         allergiesArray.length === 0 && diseasesArray.length === 0 && vaccinationsArray.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 mb-4">Медицинская карта создана, но пока пуста</p>
            <button
              onClick={handleEditMedicalCard}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Заполнить информацию
            </button>
          </div>
        )}
      </div>
    </div>
  );
}