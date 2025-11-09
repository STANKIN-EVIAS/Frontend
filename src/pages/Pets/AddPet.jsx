import { BACKEND_URL } from "config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "shared/api/auth";

export default function AddPet() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    genus_id: "",
    species_id: "",
    age: "",
    gender: "M",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [genusList, setGenusList] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);

  // Загрузка родов животных при монтировании
  useEffect(() => {
    const fetchGenus = async () => {
      try {
        const res = await authFetch(`${BACKEND_URL}/pets/genus/`);
        if (!res.ok) throw new Error("Ошибка при загрузке видов");
        const data = await res.json();
        setGenusList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setGenusList([]);
      }
    };
    fetchGenus();
  }, []);

  // Загрузка пород при выборе рода
  useEffect(() => {
    const fetchSpecies = async () => {
      if (!form.genus_id) {
        setSpeciesList([]);
        return;
      }

      try {
        const res = await authFetch(`${BACKEND_URL}/pets/species/?genus=${form.genus_id}`);
        if (!res.ok) throw new Error("Ошибка при загрузке пород");
        const data = await res.json();
        setSpeciesList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setSpeciesList([]);
      }
    };
    fetchSpecies();
  }, [form.genus_id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") formData.append(key, value);
    });

    try {
      const res = await authFetch(`${BACKEND_URL}/pets/`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Ошибка при добавлении питомца");
      }

      navigate("/profile");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-100 min-h-screen flex justify-center items-start py-10 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Добавить питомца</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Имя */}
          <div>
            <label className="block text-gray-700 mb-1">Имя</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Вид (Genus) */}
          <div>
            <label className="block text-gray-700 mb-1">Вид</label>
            <select
              name="genus_id"
              value={form.genus_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите вид</option>
              {genusList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Порода (Species) */}
          <div>
            <label className="block text-gray-700 mb-1">Порода</label>
            <select
              name="species_id"
              value={form.species_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              disabled={!form.genus_id || speciesList.length === 0}
            >
              <option value="">Выберите породу</option>
              {Array.isArray(speciesList) &&
                speciesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Пол и возраст */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1">Возраст</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Пол</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="M">Мужской</option>
                <option value="F">Женский</option>
              </select>
            </div>
          </div>

          {/* Фото */}
          <div>
            <label className="block text-gray-700 mb-1">Фото</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-70"
            >
              {loading ? "Сохранение..." : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
