import { createClient } from "./client";
import { ActionfulExchange } from "./exchange";

import { createServer } from "./server";

export class EchoExchange extends ActionfulExchange<
    {
        ping: string;
    },
    {
        pong: string;
    }
> {}

const routes = {
    echo: new EchoExchange(),
};

const server = createServer(3000, routes, {
    echo: async (request) => {
        return { pong: request.ping };
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

const client = createClient("http://localhost:3000", routes);
const response1 = await client.echo({ ping: "Hello, World!" });
const response2 = await client.echo({ ping: 1 }); // Type error
console.log(response1.pong); // "Hello, World!"
console.log(response2.ppp); // Type error
