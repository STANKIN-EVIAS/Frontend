import { BACKEND_URL } from "config";
import { useCallback, useEffect, useState } from "react";
import { authFetch } from "shared/api/auth";

export function useGenusSpecies(genusId) {
  const [genusList, setGenusList] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [loadingGenus, setLoadingGenus] = useState(true);
  const [loadingSpecies, setLoadingSpecies] = useState(false);

  // --- Fetch Genus (виды животных)
  const fetchGenus = useCallback(async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/pets/genus/`);
      const data = await res.json();
      setGenusList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setGenusList([]);
    } finally {
      setLoadingGenus(false);
    }
  }, []);

  // --- Fetch Species (породы)
  const fetchSpecies = useCallback(async () => {
    if (!genusId) {
      setSpeciesList([]);
      return;
    }
    setLoadingSpecies(true);

    try {
      const res = await authFetch(`${BACKEND_URL}/pets/species/?genus=${genusId}`);
      const data = await res.json();
      setSpeciesList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setSpeciesList([]);
    } finally {
      setLoadingSpecies(false);
    }
  }, [genusId]);

  // Load genus on mount
  useEffect(() => {
    fetchGenus();
  }, [fetchGenus]);

  // Load species when genusId changes
  useEffect(() => {
    fetchSpecies();
  }, [fetchSpecies]);

  return {
    genusList,
    speciesList,
    loadingGenus,
    loadingSpecies,
  };
}
