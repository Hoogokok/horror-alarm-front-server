import "jsr:@std/dotenv/load";

export const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") as string,
  // "Access-Control-Allow-Origin": env.REACT_APP_ALLOWED_ORIGIN as string,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
