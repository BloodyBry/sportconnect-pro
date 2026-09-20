const fs = require("node:fs");
const path = require("node:path");

const publicDirectory = path.resolve(__dirname, "../../public");

const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

function serveStaticFile(pathname, res) {
    const relativePath = pathname.replace(/^\/+/, "");

    const filePath = path.resolve(publicDirectory, relativePath);

    if (!filePath.startsWith(publicDirectory + path.sep)) {
        res.writeHead(403, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end("Accès interdit");
        return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType =
        mimeTypes[extension] || "application/octet-stream";

    const fileStream = fs.createReadStream(filePath);

    fileStream.on("open", () => {
        res.writeHead(200, {
            "Content-Type": contentType
        });

        fileStream.pipe(res);
    });

    fileStream.on("error", (error) => {
        const statusCode = error.code === "ENOENT" ? 404 : 500;

        res.writeHead(statusCode, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        res.end(
            statusCode === 404
                ? "Fichier introuvable"
                : "Erreur interne du serveur"
        );
    });
}

module.exports = { serveStaticFile };