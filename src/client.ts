import { ActionfulHandlerDict, ResponseOf, RouteDict } from "./util_types";

export function createClient<Routes extends RouteDict>(
    baseUrl: string,
    routes: Routes,
): ActionfulHandlerDict<Routes> {
    const client: Partial<Record<keyof Routes, unknown>> = {};
    for (const key in routes) {
        client[key] = async (req: object) => {
            const res = await fetch(baseUrl + "/" + key, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(req),
            });
            return res.json() as Promise<ResponseOf<Routes[typeof key]>>;
        };
    }
    return client as ActionfulHandlerDict<Routes>;
}
