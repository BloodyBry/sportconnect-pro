const path = require("node:path");
const ejs = require("ejs");


const viewsDirectory = path.join(__dirname, "..", "views");

function renderView(res, viewName, data = {}, statusCode = 200) {
    const viewPath = path.join(
        viewsDirectory,
        `${viewName}.ejs`
    );

    ejs.renderFile(viewPath, data, (error, html) => {
        if (error) {
            console.error("Erreur EJS :", error);

            res.writeHead(500, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end("<h1>Erreur interne du serveur</h1>");
            return;
        }

        res.writeHead(statusCode, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(html);
    });
}

module.exports = { renderView };