import { ActionfulExchange } from "./exchange";

export type RequestOf<Exchange> =
    Exchange extends ActionfulExchange<infer R, any> ? R : never;

export type ResponseOf<Exchange> =
    Exchange extends ActionfulExchange<any, infer R> ? R : never;

export type RouteDict = Record<string, ActionfulExchange<any, any>>;

export type ActionfulHandlerDict<Routes extends RouteDict> = {
    [K in keyof Routes]: (
        req: RequestOf<Routes[K]>,
    ) => Promise<ResponseOf<Routes[K]>>;
};
