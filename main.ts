import { cors } from "https://deno.land/x/hono@v4.3.7/middleware.ts";
import { router } from "./api/routes/firebase.ts";
import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";
import "jsr:@std/dotenv/load";
const app = new Hono();

app.use("/api/*",
    cors({
        origin: Deno.env.get("ALLOWED_ORIGIN") as string,
        allowHeaders: ['X-Custom-Header', 'authorization', 'x-client-info', 'apikey', 'content-type'],
        allowMethods: ['GET', 'POST', 'DELETE'],
        maxAge: 600,
    })
);
router(app);
Deno.serve(app.fetch);