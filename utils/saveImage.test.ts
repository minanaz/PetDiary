import { File } from "expo-file-system";

import { saveImageToDevice } from "./saveImage";

jest.mock("expo-file-system", () => ({
  Paths: { document: "/fake/documents/" },
  File: jest.fn(),
}));

describe("saveImageToDevice", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("throws an error if copying the file fails", async () => {
    (File as unknown as jest.Mock).mockImplementation(() => ({
      copy: () => {
        throw new Error("Disk full");
      },
    }));

    await expect(saveImageToDevice("file://temp/photo.jpg")).rejects.toThrow(
      "Could not save the photo",
    );
  });
});
