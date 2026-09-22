const { renderView } = require("./view-renderer");
const { serveStaticFile } = require("./static-server");
const { readFormBody } = require("./body-parser");

const {
    findAllActivities,
    findActivityById,
    createActivity,
    updateActivity,
    deactivateActivity
} = require("../modules/activities/activity.repository");

async function handleRequest(req, res) {
    const url = new URL(
        req.url,
        `http://${req.headers.host}`
    );

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


    if (
        req.method === "GET" &&
        url.pathname === "/"
    ) {
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
            pageTitle: "Ajouter une activité - SportConnect Pro",
            error: null
        });

        return;
    }


    const editActivityMatch = url.pathname.match(
        /^\/activities\/(\d+)\/edit$/
    );

    const deactivateActivityMatch = url.pathname.match(
        /^\/activities\/(\d+)\/deactivate$/
    );


    if (
        req.method === "GET" &&
        editActivityMatch
    ) {
        try {
            const activityId = Number(editActivityMatch[1]);

            const activity = await findActivityById(activityId);

            if (!activity) {
                renderView(
                    res,
                    "errors/404",
                    {
                        pageTitle:
                            "Activité introuvable - SportConnect Pro"
                    },
                    404
                );

                return;
            }

            renderView(res, "pages/activity-edit", {
                pageTitle:
                    "Modifier une activité - SportConnect Pro",
                activity,
                error: null
            });
        } catch (error) {
            console.error(
                "Erreur pendant la récupération de l’activité :",
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


    if (
        req.method === "POST" &&
        editActivityMatch
    ) {
        const activityId = Number(editActivityMatch[1]);

        let formActivity = null;

        try {
            const formData = await readFormBody(req);

            const activity = {
                name: formData.name?.trim(),
                description:
                    formData.description?.trim() || null,
                sport: formData.sport?.trim(),
                minAge: Number(formData.min_age),
                maxAge: Number(formData.max_age),
                basePrice: Number(formData.base_price),
                medicalCertificateRequired:
                    formData.medical_certificate_required === "on"
            };

            formActivity = {
                id: activityId,
                name: activity.name,
                description: activity.description,
                sport: activity.sport,
                min_age: formData.min_age,
                max_age: formData.max_age,
                base_price: formData.base_price,
                medical_certificate_required:
                    activity.medicalCertificateRequired
            };

            const emptyNumericFields =
                !formData.min_age?.trim() ||
                !formData.max_age?.trim() ||
                !formData.base_price?.trim();

            const invalidActivity =
                !activity.name ||
                !activity.sport ||
                emptyNumericFields ||
                !Number.isInteger(activity.minAge) ||
                activity.minAge < 0 ||
                !Number.isInteger(activity.maxAge) ||
                activity.maxAge < activity.minAge ||
                !Number.isFinite(activity.basePrice) ||
                activity.basePrice < 0;

            if (invalidActivity) {
                renderView(
                    res,
                    "pages/activity-edit",
                    {
                        pageTitle:
                            "Modifier une activité - SportConnect Pro",
                        activity: formActivity,
                        error:
                            "Veuillez vérifier les informations saisies."
                    },
                    400
                );

                return;
            }

            const updatedActivity = await updateActivity(
                activityId,
                activity
            );

            if (!updatedActivity) {
                renderView(
                    res,
                    "errors/404",
                    {
                        pageTitle:
                            "Activité introuvable - SportConnect Pro"
                    },
                    404
                );

                return;
            }

            res.writeHead(303, {
                Location: "/activities"
            });

            res.end();
        } catch (error) {
            if (
                error.code === "23505" &&
                formActivity
            ) {
                renderView(
                    res,
                    "pages/activity-edit",
                    {
                        pageTitle:
                            "Modifier une activité - SportConnect Pro",
                        activity: formActivity,
                        error:
                            "Une autre activité portant ce nom existe déjà."
                    },
                    409
                );

                return;
            }

            console.error(
                "Erreur pendant la modification de l’activité :",
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


    if (
        req.method === "POST" &&
        deactivateActivityMatch
    ) {
        try {
            const activityId = Number(
                deactivateActivityMatch[1]
            );

            const deactivatedActivity =
                await deactivateActivity(activityId);

            if (!deactivatedActivity) {
                renderView(
                    res,
                    "errors/404",
                    {
                        pageTitle:
                            "Activité introuvable - SportConnect Pro"
                    },
                    404
                );

                return;
            }

            
            res.writeHead(303, {
                Location: "/activities"
            });

            res.end();
        } catch (error) {
            console.error(
                "Erreur pendant la désactivation de l’activité :",
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

    

    if (
        req.method === "POST" &&
        url.pathname === "/activities"
    ) {
        try {
            const formData = await readFormBody(req);

            const activity = {
                name: formData.name?.trim(),
                description:
                    formData.description?.trim() || null,
                sport: formData.sport?.trim(),
                minAge: Number(formData.min_age),
                maxAge: Number(formData.max_age),
                basePrice: Number(formData.base_price),
                medicalCertificateRequired:
                    formData.medical_certificate_required === "on"
            };

            const emptyNumericFields =
                !formData.min_age?.trim() ||
                !formData.max_age?.trim() ||
                !formData.base_price?.trim();

            const invalidActivity =
                !activity.name ||
                !activity.sport ||
                emptyNumericFields ||
                !Number.isInteger(activity.minAge) ||
                activity.minAge < 0 ||
                !Number.isInteger(activity.maxAge) ||
                activity.maxAge < activity.minAge ||
                !Number.isFinite(activity.basePrice) ||
                activity.basePrice < 0;

            if (invalidActivity) {
                renderView(
                    res,
                    "pages/activity-form",
                    {
                        pageTitle:
                            "Ajouter une activité - SportConnect Pro",
                        error:
                            "Veuillez vérifier les informations saisies."
                    },
                    400
                );

                return;
            }

            await createActivity(activity);

            res.writeHead(303, {
                Location: "/activities"
            });

            res.end();
        } catch (error) {
            if (error.code === "23505") {
                renderView(
                    res,
                    "pages/activity-form",
                    {
                        pageTitle:
                            "Ajouter une activité - SportConnect Pro",
                        error:
                            "Une activité portant ce nom existe déjà."
                    },
                    409
                );

                return;
            }

            console.error(
                "Erreur pendant l’ajout de l’activité :",
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


    if (
        req.method === "GET" &&
        url.pathname === "/activities"
    ) {
        try {
            const activities = await findAllActivities();

            renderView(res, "pages/activities", {
                pageTitle:
                    "Activités - SportConnect Pro",
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