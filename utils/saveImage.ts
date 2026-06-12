import { File, Paths } from "expo-file-system";

// copy an image from temporary uri, return the new permanent uri
export async function saveImageToDevice(tempUri: string): Promise<string> {
  const filename = `${Date.now()}.jpg`;

  const sourceFile = new File(tempUri);
  const destination = new File(Paths.document, filename);

  sourceFile.copy(destination);

  return destination.uri;
}
