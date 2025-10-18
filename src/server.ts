import * as http from "http";
import type { ActionfulHandlerDictExpanded, RouteDict } from "./util_types.js";

export interface ActionfulServer<Routes extends RouteDict> {
    run(): void;
}

export function createServer<Routes extends RouteDict>(
    port: number,
    routes: Routes,
    handlers: ActionfulHandlerDictExpanded<Routes>,
): ActionfulServer<Routes> {
    function run() {
        const server = http.createServer(
            { keepAliveTimeout: 60_000 },
            async (httpRequest, httpResponse) => {
                httpResponse.setHeader("Content-Type", "application/json");
                const routeKey = Object.keys(routes).find(
                    (key) =>
                        httpRequest.method === "POST" &&
                        httpRequest.url?.endsWith("/" + key),
                ) as keyof Routes | undefined;
                if (!routeKey) {
                    httpResponse.statusCode = 404;
                    httpResponse.end(JSON.stringify({ ok: false }));
                    return;
                }

                // Parse request body
                let body = "";
                httpRequest.on("data", (chunk) => {
                    body += chunk.toString();
                });
                httpRequest.on("end", async () => {
                    try {
                        const requestData = body ? JSON.parse(body) : {};
                        const response = await handlers[routeKey]({
                            ...requestData,
                            _headers: httpRequest.headers,
                        });
                        httpResponse.statusCode = 200;
                        if (response._cookies) {
                            httpResponse.setHeader(
                                "Set-Cookie",
                                response._cookies,
                            );
                        }
                        httpResponse.end(JSON.stringify(response));
                    } catch (error) {
                        httpResponse.statusCode = 500;
                        httpResponse.end(
                            JSON.stringify({
                                ok: false,
                                error: "Internal server error: " + error,
                            }),
                        );
                    }
                });
            },
        );
        server.listen(port);
    }
    return {
        run,
    };
}
