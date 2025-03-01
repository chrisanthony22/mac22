import fs from "fs";
import path from "path";

export default function handler(req, res) {
    const filesJsonPath = path.join(process.cwd(), "public", "files.json");

    // Read files.json
    fs.readFile(filesJsonPath, "utf-8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Failed to load files.json" });
            return;
        }

        const files = JSON.parse(data).files;
        const randomFile = files[Math.floor(Math.random() * files.length)];
        const filePath = path.join(process.cwd(), randomFile);

        // Read the actual file
        fs.readFile(filePath, "utf-8", (err, fileContent) => {
            if (err) {
                res.status(500).json({ error: `Failed to load ${randomFile}` });
                return;
            }

            res.status(200).json({ filename: randomFile, content: fileContent });
        });
    });
}
