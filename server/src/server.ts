import cors from "cors";
import express from "express";
import routes from "./routes";

const server = express();

server.use(
  cors({
    origin: ["http://wiserooms.com.br", "http://localhost:3000"],
    credentials: true,
  })
);
server.use(express.json());

server.get("/", (req, res) => {
  res.send("Hello World!");
});

routes(server);

export default server;
