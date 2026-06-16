import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { Activity } from "../types/activity";
import type { Pet } from "../types/pet";
import { PetProvider, usePets } from "./PetContext";

beforeEach(async () => {
  await AsyncStorage.clear();
});
// a reusable test pet/activity
const testPet: Pet = {
  id: "pet-1",
  name: "Titan",
  breed: "Husky",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const testActivity: Activity = {
  id: "activity-1",
  petId: "pet-1",
  type: "walk",
  date: "2026-01-01T08:00:00.000Z",
};

describe("PetContext", () => {
  it("starts with empty pets and activities", async () => {
    const { result } = await renderHook(() => usePets(), {
      wrapper: PetProvider,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.pets).toEqual([]);
    expect(result.current.activities).toEqual([]);
  });

  // PET TESTS
  it("adds a pet", async () => {
    const { result } = await renderHook(() => usePets(), {
      wrapper: PetProvider,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.addPet(testPet);
    });

    expect(result.current.pets).toEqual([testPet]);
  });

  it("updates a pet", async () => {
    const { result } = await renderHook(() => usePets(), {
      wrapper: PetProvider,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.addPet(testPet);
    });

    const updatedPet: Pet = { ...testPet, name: "Titan the good boy" };
    await act(async () => {
      result.current.updatePet(updatedPet);
    });

    expect(result.current.pets).toEqual([updatedPet]);
  });

  it("deletes a pet and its activities", async () => {
    const { result } = await renderHook(() => usePets(), {
      wrapper: PetProvider,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.addPet(testPet);
      result.current.addActivity(testActivity);
    });

    await act(async () => {
      result.current.deletePet("pet-1");
    });

    expect(result.current.pets).toEqual([]);
    expect(result.current.activities).toEqual([]);
  });

  // ACTIVITY TESTS
  it("adds an activity", async () => {
    const { result } = await renderHook(() => usePets(), {
      wrapper: PetProvider,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.addActivity(testActivity);
    });

    expect(result.current.activities).toEqual([testActivity]);
  });

  it("deletes an activity", async () => {
    const { result } = await renderHook(() => usePets(), {
      wrapper: PetProvider,
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      result.current.addActivity(testActivity);
    });

    await act(async () => {
      result.current.deleteActivity("activity-1");
    });

    expect(result.current.activities).toEqual([]);
  });
});
