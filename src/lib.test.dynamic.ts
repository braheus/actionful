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

export class AddExchange extends ActionfulExchange<
    {
        a: number;
        b: number;
    },
    {
        sum: number;
    }
> {}

async function test() {
    const routes = {
        echo: new EchoExchange(),
        add: new AddExchange(),
    };

    const server = createServer(10000, routes, {
        echo: async (request) => {
            return { pong: request.ping };
        },
        add: async (request) => {
            return { sum: request.a + request.b };
        },
    });
    server.run();

    const client = createClient("http://localhost:10000", routes);
    {
        const response = await client.echo({ ping: "Hello, World!" });
        console.log("pong", response.pong); // "Hello, World!"
        if (response.pong !== "Hello, World!") {
            throw new Error("Unexpected response");
        }
    }
    {
        const response = await client.add({ a: 1, b: 2 });
        console.log("sum", response.sum); // 3
        if (response.sum !== 3) {
            throw new Error("Unexpected response");
        }
    }
    process.exit();
}

test();
