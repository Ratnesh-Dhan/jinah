import fs from "node:fs/promises";

const data = await fs.readFile("./test.json");
console.log(JSON.parse(data));
