// import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
// const env = await load();


export const serviceAccount = {
    "type": Deno.env.get("REACT_APP_FIRE_BASE_TYPE") as string,
    "projectId": Deno.env.get("REACT_APP_FIRE_BASE_PROJECT_ID") as string,
    "privateKeyId": Deno.env.get("REACT_APP_FIRE_BASE_PRIVATE_KEY_ID") as string,
    "privateKey": Deno.env.get("REACT_APP_FIRE_BASE_PRIVATE_KEY")?.replace(/\\n/g, "\n") as string,
    "clientEmail": Deno.env.get("REACT_APP_FIRE_BASE_CLIENT_EMAIL") as string,
    "clientId": Deno.env.get("REACT_APP_FIRE_BASE_CLIENT_ID") as string,
    "authUri": Deno.env.get("REACT_APP_FIRE_BASE_AUTH_URI") as string,
    "tokenUri": Deno.env.get("REACT_APP_FIRE_BASE_TOKEN_URI")as string,
    "authProviderX509CertUrl": Deno.env.get("REACT_APP_FIRE_BASE_AUTH_PROVIDER_X509_CERT_URL") as string,
    "clientX509CertUrl": Deno.env.get("REACT_APP_FIRE_BASE_CLIENT_X509_CERT_URL") as string 
};

