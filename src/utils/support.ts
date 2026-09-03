import fs from "fs/promises";

// Helper function to check if a file is likely binary
export async function isBinaryFile(filePath: string): Promise<boolean> {
  try {
    // Read the first 512 bytes (enough to detect most binary formats)
    const buffer = await fs.readFile(filePath, { flag: "r", encoding: null });

    if (buffer.length === 0) return false;

    // Check for null bytes or other non-text characters
    // A simple heuristic: if it contains many control characters, it's likely binary
    let nonTextCount = 0;
    const chunkSize = Math.min(buffer.length, 512);

    for (let i = 0; i < chunkSize; i++) {
      const byte = buffer[i];

      // Allow common text characters and whitespace
      // Control characters (except newline \n=10, tab \t=9, carriage return \r=13) are suspicious
      if (byte < 32 && byte !== 10 && byte !== 13 && byte !== 9) {
        nonTextCount++;
      }
      // High-bit characters might be valid UTF-8, but frequent high bytes can indicate binary
      if (byte > 127) {
        // This is a rough heuristic. For strict UTF-8 validation, you'd use a library,
        // but for a simple assistant bot, this usually suffices to catch images/exes.
        nonTextCount++;
      }
    }

    // If more than 10% of the sample is "non-text", assume it's binary
    return nonTextCount / chunkSize > 0.1;
  } catch {
    return true; // If we can't read it, treat as binary/unsafe
  }
}
