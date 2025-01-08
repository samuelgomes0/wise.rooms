import cors from "cors";
import express from "express";
import routes from "./routes";

const server = express();

const allowedOrigins = [
  "https://wiserooms.com.br",
  "https://www.wiserooms.com.br",
  "http://localhost:3000",
];

server.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
server.use(express.json());

server.get("/", (req, res) => {
  res.send("Hello World!");
});

routes(server);

export default server;
