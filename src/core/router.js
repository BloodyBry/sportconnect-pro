function handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    console.log(`${req.method} ${url.pathname}`);

    if (req.method === "GET" && url.pathname === "/") {
        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(`
            <h1>SportConnect Pro</h1>
            <p>Bienvenue sur la plateforme sportive.</p>
        `);

        return;
    }

    if (req.method === "GET" && url.pathname === "/activities") {
        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(`
            <h1>Catalogue des activités</h1>
            <p>Les activités seront affichées ici.</p>
        `);

        return;
    }

    res.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8"
    });

    res.end(`
        <h1>Erreur 404</h1>
        <p>Page introuvable.</p>
    `);
}

module.exports = { handleRequest };