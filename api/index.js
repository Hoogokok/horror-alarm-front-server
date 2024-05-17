import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import { router } from "./routes/firebase.js";
import { config } from "dotenv";

config();
const app = express();

// CORS 설정
app.use(cors());

const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
}



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', allowCors(router));

const PORT = process.env.PORT || 3000;
app.listen(4001, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;