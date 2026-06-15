import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Activity } from "../types/activity";
import type { Pet } from "../types/pet";

interface PetContextValue {
  pets: Pet[];
  activities: Activity[];
  isLoading: boolean;
  addPet: (pet: Pet) => void;
  updatePet: (pet: Pet) => void;
  deletePet: (id: string) => void;
  addActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
}

const PetContext = createContext<PetContextValue | undefined>(undefined);

const PETS_KEY = "pets";
const ACTIVITIES_KEY = "activities";

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedPets = await AsyncStorage.getItem(PETS_KEY);
        const storedActivities = await AsyncStorage.getItem(ACTIVITIES_KEY);
        if (storedPets) setPets(JSON.parse(storedPets));
        if (storedActivities) setActivities(JSON.parse(storedActivities));
      } catch (error) {
        console.error("Failed to load data from storage", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));
    }
  }, [pets, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    }
  }, [activities, isLoading]);

  const addPet = (pet: Pet) => {
    setPets((prev) => [...prev, pet]);
  };

  const updatePet = (updatedPet: Pet) => {
    setPets((prev) =>
      prev.map((p) => (p.id === updatedPet.id ? updatedPet : p)),
    );
  };

  const deletePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
    setActivities((prev) => prev.filter((a) => a.petId !== id)); // delete pet's activities too
  };

  const addActivity = (activity: Activity) => {
    setActivities((prev) => [...prev, activity]);
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        activities,
        isLoading,
        addPet,
        deletePet,
        updatePet,
        addActivity,
        deleteActivity,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (!context) throw new Error("usePets must be used within a PetProvider");
  return context;
}
