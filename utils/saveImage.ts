import { File, Paths } from "expo-file-system";

// copy an image from temporary uri, return the new permanent uri
export async function saveImageToDevice(tempUri: string): Promise<string> {
  try {
    const filename = `${Date.now()}.jpg`;
    const sourceFile = new File(tempUri);
    const destination = new File(Paths.document, filename);

    sourceFile.copy(destination);

    return destination.uri;
  } catch (error) {
    console.error("Failed to save image to device", error);
    throw new Error("Could not save the photo. Please try again.");
  }
}
