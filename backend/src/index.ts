import express from "express";
import dotenv from "dotenv";
import errorHandler from "../middleware/errorHandler";
import router from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

// Enable JSON body parsing
app.use(express.json());
app.use(router);
app.use(errorHandler as express.ErrorRequestHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
