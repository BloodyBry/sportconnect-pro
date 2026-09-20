const { renderView } = require("./view-renderer");
const { serveStaticFile } = require("./static-server");
const {
    findAllActivities
} = require("../modules/activities/activity.repository");

async function handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);

    console.log(`${req.method} ${url.pathname}`);

    if (
        req.method === "GET" &&
        (
            url.pathname.startsWith("/css/") ||
            url.pathname.startsWith("/js/") ||
            url.pathname.startsWith("/images/")
        )
    ) {
        serveStaticFile(url.pathname, res);
        return;
    }

    if (req.method === "GET" && url.pathname === "/") {
        renderView(res, "pages/home", {
            pageTitle: "Accueil - SportConnect Pro",
            heading: "SportConnect Pro"
        });

        return;
    }

    if (
        req.method === "GET" &&
        url.pathname === "/activities/new"
    ) {
        renderView(res, "pages/activity-form", {
            pageTitle: "Ajouter une activité - SportConnect Pro"
        });

        return;
    }

    if (
        req.method === "GET" &&
        url.pathname === "/activities"
    ) {
        try {
            const activities = await findAllActivities();

            renderView(res, "pages/activities", {
                pageTitle: "Activités - SportConnect Pro",
                activities
            });
        } catch (error) {
            console.error(
                "Erreur pendant la récupération des activités :",
                error.message
            );

            renderView(
                res,
                "errors/500",
                {
                    pageTitle:
                        "Erreur interne - SportConnect Pro"
                },
                500
            );
        }

        return;
    }

    renderView(
        res,
        "errors/404",
        {
            pageTitle:
                "Page introuvable - SportConnect Pro"
        },
        404
    );
}

module.exports = { handleRequest };