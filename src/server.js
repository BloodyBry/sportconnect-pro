require("dotenv").config();

const http = require("node:http");
const { handleRequest } = require("./core/router");
const {
    testDatabaseConnection
} = require("./config/database");

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(handleRequest);

async function startServer() {
    try {
        // Le serveur démarre seulement si PostgreSQL répond
        await testDatabaseConnection();

        server.listen(PORT, () => {
            console.log(
                `Serveur démarré sur http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "Impossible de se connecter à PostgreSQL :",
            error.message
        );

        process.exit(1);
    }
}

startServer();