import { BACKEND_URL } from "config";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "shared/api/auth";
import { updatePet } from "shared/api/pets";
import { useGenusSpecies } from "shared/hooks/useGenusSpecies";

export default function EditPetPage() {
  const { petId } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { genusList, speciesList } = useGenusSpecies(pet?.genus_id);

  // ----------------------------------------
  //  ЗАГРУЗКА ПИТОМЦА
  // ----------------------------------------
  const fetchPet = useCallback(async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/pets/${petId}/`);
      if (!res.ok) throw new Error("Ошибка загрузки данных питомца " + res.statusText);

      const data = await res.json();
      setPet(data);
      setPreviewImage(data.image || null);
    } catch (e) {
      setError("Ошибка загрузки питомца");
    } finally {
      setLoading(false);
    }
  }, [petId]);

  useEffect(() => {
    fetchPet();
  }, [fetchPet]);

  // ----------------------------------------
  //  HANDLERS
  // ----------------------------------------
  const handleChange = (field, value) => {
    setPet((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPet((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", pet.name);
      formData.append("gender", pet.gender);
      formData.append("birth_date", pet.birth_date || "");
      formData.append("genus_id", pet.genus_id ?? "");
      formData.append("species_id", pet.species_id ?? "");

      if (pet.image instanceof File) {
        formData.append("image", pet.image);
      }
      await updatePet(petId, formData);
      navigate(`/pet/${petId}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => navigate(-1);

  // ----------------------------------------
  // UI
  // ----------------------------------------
  if (loading) return <div className="p-8 text-center">Загрузка...</div>;

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
        <div>
          <button onClick={handleCancel} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Назад
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen py-8 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-6">Редактирование питомца</h1>

        {/* Фото */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={previewImage || "/default-pet-image.png"}
            alt="pet"
            className="w-32 h-32 rounded-full object-cover border-2 mb-3"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Имя */}
        <label className="block mb-3">
          <span className="font-medium">Имя</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={pet.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </label>

        {/* Дата рождения */}
        <label className="block mb-3">
          <span className="font-medium">Дата рождения</span>
          <input
            type="date"
            className="mt-1 w-full border rounded px-3 py-2"
            value={pet.birth_date || ""}
            onChange={(e) => handleChange("birth_date", e.target.value)}
          />
        </label>

        {/* Пол */}
        <label className="block mb-3">
          <span className="font-medium">Пол</span>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={pet.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="M">Мужской</option>
            <option value="F">Женский</option>
          </select>
        </label>

        {/* Вид */}
        <label className="block mb-3">
          <span className="font-medium">Вид</span>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={pet.genus_id || ""}
            onChange={(e) => {
              const val = e.target.value === "" ? null : Number(e.target.value);
              handleChange("genus_id", val);
              handleChange("species_id", null);
            }}
          >
            <option value="">Нет вида</option>
            {genusList.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>

        {/* Порода */}
        <label className="block mb-6">
          <span className="font-medium">Порода</span>
          <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={pet.species_id || ""}
            onChange={(e) => handleChange("species_id", e.target.value === "" ? null : Number(e.target.value))}
          >
            <option value="">Нет породы</option>
            {speciesList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        {/* Кнопки */}
        <div className="flex justify-between">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={handleCancel}>
            Отмена
          </button>

          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSave} disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
