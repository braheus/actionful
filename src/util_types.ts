import { ActionfulExchange } from "./exchange.js";

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

export type ActionfulHandlerDictExpanded<Routes extends RouteDict> = {
    [K in keyof Routes]: (
        req: RequestOf<Routes[K]> & {
            _headers?: Record<string, string | string[]>;
        },
    ) => Promise<ResponseOf<Routes[K]> & { _cookies?: string[] }>;
};
