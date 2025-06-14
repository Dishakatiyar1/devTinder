const { Server } = require("socket.io");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      if (!userId || !targetUserId) {
        return "Can't start chat!!!";
      }

      const roomId = [userId, targetUserId].sort().join("_");
      socket.join(roomId);
    });
    socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      io.to(roomId).emit("messageReceived", { text, firstName });
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
