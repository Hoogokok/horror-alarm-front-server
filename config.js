import { config } from "dotenv";

config();

export const serviceAccount = {
    "type": process.env.REACT_APP_FIRE_BASE_TYPE,
    "project_id": process.env.REACT_APP_FIRE_BASE_PROJECT_ID,
    "private_key_id": process.env.REACT_APP_FIRE_BASE_PRIVATE_KEY_ID,
    "private_key": process.env.REACT_APP_FIRE_BASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.REACT_APP_FIRE_BASE_CLIENT_EMAIL,
    "client_id": process.env.REACT_APP_FIRE_BASE_CLIENT_ID,
    "auth_uri": process.env.REACT_APP_FIRE_BASE_AUTH_URI,
    "token_uri": process.env.REACT_APP_FIRE_BASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.REACT_APP_FIRE_BASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.REACT_APP_FIRE_BASE_CLIENT_X509_CERT_URL
};
	