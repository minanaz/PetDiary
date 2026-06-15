export type PetGender = "male" | "female" | "unknown";

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age?: number;
  gender?: PetGender;
  notes?: string;
  photoUri?: string;
  createdAt: string;
}
