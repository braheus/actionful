# Actionful

A minimal API server kit in TypeScript.

## Design principles

- Simplicity and uniformity.
    - No HTTP verbs, no headers, no URL parameters, no query strings, no status codes.
        - Everything is in the request body and response body.
        - Exception: **Cookies** can be accessed and set in the request and response body if needed. (Because HttpOnly cookies are safer than explicit JavaScript strings.)
    - No middlewares
        - Composition with functions.
    - JSON-oriented (and plaintext based)
        - No binary data. No advanced marshalling.
    - Optimize for shared TypeScript codebase between client and server.

- Type-safety
    - The request and response types are pre-defined.
    - Client is guaranteed to get the expected response type.

## Examples

```ts
// routes.ts
import { ActionfulExchange } from "actionful";

export class EchoExchange extends ActionfulExchange<
    {
        ping: string;
    },
    {
        pong: string;
    }
> {}

export const AddExchange = class extends ActionfulExchange<
    {
        a: number;
        b: number;
    },
    {
        sum: number;
    }
> {};

export const routes = {
    echo: EchoExchange,
    add: AddExchange,
};
```

```ts
// server.ts
import { createServer } from "actionful";
import { routes } from "./routes";

const server = createServer(3000, routes, {
    echo: async (request) => {
        return { pong: request.ping };
    },
    add: async (request) => {
        return { sum: request.a + request.b };
    },
    echo: async (request) => {
        return { pong: request.nonexisting }; // Type error
    },
    // Type error
    x: async (request) => {
        return { ppp: request.ping };
    },
});
server.run();
```

```ts
// client.ts
import { createClient } from "actionful";
import { routes } from "./routes";

const client = createClient("http://localhost:3000", routes);
const response1 = await client.echo({ ping: "Hello, World!" });
const response2 = await client.echo({ ping: 1 }); // Type error
console.log(response1.pong); // "Hello, World!"
console.log(response2.ppp); // Type error
```
