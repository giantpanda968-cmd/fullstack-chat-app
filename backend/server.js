import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDb from "./src/lib/db.js";
import { server } from "./src/lib/socket.js";

const PORT = process.env.PORT || 5001;

connectDb();

server.listen(PORT, () => {
  console.log("Server is Running on Port " + PORT);
});