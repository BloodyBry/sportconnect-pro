const http = require("node:http");
const { handleRequest } = require("./core/router");

const PORT = 3000;

// Le serveur transmet chaque requête au routeur
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});