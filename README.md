# Actionful

A minimal API server kit in TypeScript.

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
        return { pong: request.xxx }; // Type error
    },
    x: async (request) => {
        // Type error
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
