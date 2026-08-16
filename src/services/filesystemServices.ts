import fs from "node:fs/promises";
import path from "node:path";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import { ModifyOperation } from "../types/fileSystem.js";

export async function modifyFile(
  filePath: string,
  operation: ModifyOperation,
  content: string,
  target?: string,
): Promise<string> {
  const safePath = path.resolve(filePath);

  let existing = await fs.readFile(safePath, "utf-8");

  switch (operation) {
    case "replace":
      if (!target) {
        throw new Error("target is required for replace");
      }

      if (!existing.includes(target)) {
        throw new Error("Target text was not found");
      }

      existing = existing.replace(target, content);
      break;

    case "append":
      existing += content;
      break;

    case "prepend":
      existing = content + existing;
      break;

    case "insert_after":
      if (!target) {
        throw new Error("target is required for insert_after");
      }

      if (!existing.includes(target)) {
        throw new Error("Target text was not found");
      }

      existing = existing.replace(target, target + content);
      break;

    case "insert_before":
      if (!target) {
        throw new Error("target is required for insert_before");
      }

      if (!existing.includes(target)) {
        throw new Error("Target text was not found");
      }

      existing = existing.replace(target, content + target);
      break;
  }

  await fs.writeFile(safePath, existing, "utf-8");

  return safePath;
}

export async function createFile(filePath: string, content: string) {
  const safePath = path.resolve(filePath);
  if (
    safePath.toLowerCase().endsWith(".txt") ||
    safePath.toLowerCase().endsWith(".md") ||
    safePath.toLowerCase().endsWith(".json") ||
    safePath.toLowerCase().endsWith(".csv")
  ) {
    await fs.mkdir(path.dirname(safePath), { recursive: true });
    await fs.writeFile(safePath, content, "utf-8");
  } else if (
    safePath.toLowerCase().endsWith(".xlsx") ||
    safePath.toLowerCase().endsWith(".docx")
  ) {
    await fs.mkdir(path.dirname(safePath), { recursive: true });
    await fs.writeFile(safePath, content);
  } else {
    throw new Error("File type not supported");
  }
  return safePath;
}

export async function readFile(filePath: string): Promise<string> {
  const safePath = path.resolve(filePath);
  const ext = path.extname(safePath).toLowerCase();

  // Text files
  if ([".txt", ".md", ".json", ".csv"].includes(ext)) {
    return await fs.readFile(safePath, "utf-8");
  }

  // Excel
  if (ext === ".xlsx") {
    const buffer = await fs.readFile(safePath);

    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

    const sheets: Record<string, unknown[][]> = {};

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];

      sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: null,
      });
    }

    return JSON.stringify(
      {
        type: "xlsx",
        sheets,
      },
      null,
      2,
    );
  }

  // Word document
  if (ext === ".docx") {
    const buffer = await fs.readFile(safePath);

    const result = await mammoth.extractRawText({
      buffer,
    });

    return result.value;
  }

  throw new Error(`File type not supported: ${ext}`);
}

export async function listDirectory(dirPath: string): Promise<string[]> {
  try {
    const safePath = path.resolve(dirPath);
    await fs.access(safePath, fs.constants.R_OK);
    const files = await fs.readdir(safePath);
    return files;
  } catch (error) {
    throw new Error("Path does not exist or is not a directory");
  }
}
