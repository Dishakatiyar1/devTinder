const { Server } = require("socket.io");
const { Chat } = require("../models/chat");

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
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text }) => {
        const roomId = [userId, targetUserId].sort().join("_");
        // save messages to the database
        console.log("message received : " + firstName);
        try {
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          // create new if chat does not exist first create
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          // push the messages
          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();
          // ***
          io.to(roomId).emit("messageReceived", { text, firstName });
        } catch (err) {
          console.log("error: " + err);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
