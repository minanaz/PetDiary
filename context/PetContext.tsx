import { createContext, useContext, useState, type ReactNode } from "react";

import type { Activity } from "../types/activity";
import type { Pet } from "../types/pet";

interface PetContextValue {
  pets: Pet[];
  activities: Activity[];
  addPet: (pet: Pet) => void;
  addActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
}

const PetContext = createContext<PetContextValue | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  const addPet = (pet: Pet) => {
    setPets((prev) => [...prev, pet]);
  };

  const addActivity = (activity: Activity) => {
    setActivities((prev) => [...prev, activity]);
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <PetContext.Provider
      value={{ pets, activities, addPet, addActivity, deleteActivity }}
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
