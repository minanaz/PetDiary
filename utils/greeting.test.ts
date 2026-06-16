import { getGreeting } from "./greeting";

describe("getGreeting", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns "Good morning" before noon', () => {
    jest.spyOn(Date.prototype, "getHours").mockReturnValue(9);
    expect(getGreeting()).toBe("Good morning");
  });

  it('returns "Good afternoon" between noon and 6pm', () => {
    jest.spyOn(Date.prototype, "getHours").mockReturnValue(14);
    expect(getGreeting()).toBe("Good afternoon");
  });

  it('returns "Good evening" after 6pm', () => {
    jest.spyOn(Date.prototype, "getHours").mockReturnValue(20);
    expect(getGreeting()).toBe("Good evening");
  });
});
