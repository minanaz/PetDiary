import { ACTIVITY_LABELS } from "./activity";

describe("ACTIVITY_LABELS", () => {
  it("has a label for every activity type", () => {
    expect(ACTIVITY_LABELS.meal).toBe("Meal");
    expect(ACTIVITY_LABELS.walk).toBe("Walk");
    expect(ACTIVITY_LABELS.med).toBe("Medication");
    expect(ACTIVITY_LABELS.vet).toBe("Vet visit");
    expect(ACTIVITY_LABELS.play).toBe("Play");
  });
});
