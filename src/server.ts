import * as http from "http";
import { ActionfulHandlerDict, RouteDict } from "./util_types";

export interface ActionfulServer<Routes extends RouteDict> {
    run(): void;
}

export function createServer<Routes extends RouteDict>(
    port: number,
    routes: Routes,
    handlers: ActionfulHandlerDict<Routes>,
): ActionfulServer<Routes> {
    return {
        run() {
            const server = http.createServer(
                { keepAliveTimeout: 60_000 },
                async (req, res) => {
                    const routeKey = Object.keys(routes).find(
                        (key) => req.method === "POST" && req.url === "/" + key,
                    );
                    if (!routeKey) {
                        res.statusCode = 404;
                        res.end(JSON.stringify({ ok: false }));
                        return;
                    }

                    // Parse request body
                    let body = "";
                    req.on("data", (chunk) => {
                        body += chunk.toString();
                    });
                    req.on("end", async () => {
                        try {
                            const requestData = body ? JSON.parse(body) : {};
                            const response =
                                await handlers[routeKey](requestData);
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.end(JSON.stringify(response));
                        } catch (error) {
                            res.statusCode = 500;
                            res.end(
                                JSON.stringify({
                                    error: "Internal server error",
                                }),
                            );
                        }
                    });
                },
            );
            server.listen(port);
        },
    };
}
