import fs from "node:fs/promises";

const file = await fs.readFile("./test.json", "utf-8");
const data = JSON.parse(file);

// console.log(data.result);

for (const result of data.result) {
  const messageText = result.message?.text;
  if (
    typeof messageText === "string" &&
    messageText.toLowerCase() === "/start"
  ) {
    console.log(result.message.text);
    console.log(result.message.chat);
  }
}
