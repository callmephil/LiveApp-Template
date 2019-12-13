import { app, io } from "./app";
import Connection from "./Database/Connection";

import usersControllerApp from "./Routes/users";

let nextVisitorNumber = 1;
let onlineClients = new Set();

function onNewWebsocketConnection(socket) {
  console.info(`Socket ${socket.id} has connected.`);
  onlineClients.add(socket.id);

  socket.on("disconnect", () => {
    onlineClients.delete(socket.id);
    console.info(`Socket ${socket.id} has disconnected.`);
  });
}

const start = async () => {
  const DatabaseControllers = await Connection();
  const { usersController } = DatabaseControllers;

  app.get("/", (req, res, next) => {
    res.send("hello from the test server");
  });

  app.use("/api/users", await usersControllerApp(usersController));

  app.use((err, req, res, next) => {
    console.error(err);
    const message = err.message;
    res.status(500).json({
      success: false,
      message
    });
  });

  io.on("connection", onNewWebsocketConnection);
};

start();