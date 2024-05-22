export const serviceAccount = {
    "type": Deno.env.get("REACT_APP_FIRE_BASE_TYPE"),
    "projectId": Deno.env.get("REACT_APP_FIRE_BASE_PROJECT_ID"),
    "privateKeyId": Deno.env.get("REACT_APP_FIRE_BASE_PRIVATE_KEY_ID"),
    "privateKey": Deno.env.get("REACT_APP_FIRE_BASE_PRIVATE_KEY")?.replace(/\\n/g, "\n"),
    "clientEmail": Deno.env.get("REACT_APP_FIRE_BASE_CLIENT_EMAIL"),
    "clientId": Deno.env.get("REACT_APP_FIRE_BASE_CLIENT_ID"),
    "authUri": Deno.env.get("REACT_APP_FIRE_BASE_AUTH_URI"),
    "tokenUri": Deno.env.get("REACT_APP_FIRE_BASE_TOKEN_URI"),
    "authProviderX509CertUrl": Deno.env.get("REACT_APP_FIRE_BASE_AUTH_PROVIDER_X509_CERT_URL"),
    "clientX509CertUrl": Deno.env.get("REACT_APP_FIRE_BASE_CLIENT_X509_CERT_URL")
};