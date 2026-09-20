const MAX_BODY_SIZE = 1_000_000;

function readFormBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";
        let bodyTooLarge = false;

        req.on("data", (chunk) => {
            if (bodyTooLarge) {
                return;
            }

            body += chunk.toString();

            if (Buffer.byteLength(body) > MAX_BODY_SIZE) {
                bodyTooLarge = true;

                reject(
                    new Error(
                        "Le corps de la requête est trop volumineux."
                    )
                );
            }
        });

        req.on("end", () => {
            if (bodyTooLarge) {
                return;
            }

            const parameters = new URLSearchParams(body);
            const formData = Object.fromEntries(parameters);

            resolve(formData);
        });

        req.on("error", (error) => {
            reject(error);
        });
    });
}

module.exports = { readFormBody };