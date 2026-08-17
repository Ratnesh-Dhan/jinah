import fs from "node:fs/promises";
import path from "node:path";

export async function telegramMessageBot(
  chatId: string,
  message?: string,
  filePath?: string,
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  console.log(token);

  if (!token) {
    throw new Error(`TELEGRAM_BOT_TOKEN is not configured`);
  }

  // Send message
  if (message) {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      },
    );
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(JSON.stringify(data));
    }
  }

  // Send document
  if (filePath) {
    const fileBuffer = await fs.readFile(filePath);
    const formData = new FormData();
    formData.append("chat_id", chatId);
    formData.append(
      "document",
      new Blob([fileBuffer]),
      path.basename(filePath),
    );

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendDocument`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(JSON.stringify(data));
    }
  }
}

export async function getChatId(username: string) {
  if (username.toLocaleLowerCase() === "tirandars") return -949335274;
  else if (username.toLocaleLowerCase() === "paramvir") return 5309277899;
  else if (username.toLocaleLowerCase() === "sunny da") return 1292012602;
  else if (username.toLocaleLowerCase() === "shubham") return 8568111405;
}
