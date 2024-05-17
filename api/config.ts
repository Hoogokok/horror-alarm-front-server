import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
const env = await load();

export const serviceAccount = {
    "type": env["REACT_APP_FIRE_BASE_TYPE"],
    "projectId": env["REACT_APP_FIRE_BASE_PROJECT_ID"],
    "privateKeyId": env["REACT_APP_FIRE_BASE_PRIVATE_KEY_ID"],
    "privateKey": env["REACT_APP_FIRE_BASE_PRIVATE_KEY"]?.replace(/\\n/g, "\n"),
    "clientEmail": env["REACT_APP_FIRE_BASE_CLIENT_EMAIL"],
    "clientId": env["REACT_APP_FIRE_BASE_CLIENT_ID"],
    "authUri": env["REACT_APP_FIRE_BASE_AUTH_URI"],
    "tokenUri": env["REACT_APP_FIRE_BASE_TOKEN_URI"],
    "authProviderX509CertUrl": env["REACT_APP_FIRE_BASE_AUTH_PROVIDER_X509_CERT_URL"],
    "clientX509CertUrl": env["REACT_APP_FIRE_BASE_CLIENT_X509_CERT_URL"]
};
