import { cors } from 'https://deno.land/x/hono/middleware.ts'
import { router } from "./api/routes/firebase.ts";
import { Hono } from "https://deno.land/x/hono@v3.4.1/mod.ts";

const app = new Hono();

app.use('/api/*', cors())
router(app);

Deno.serve(app.fetch)