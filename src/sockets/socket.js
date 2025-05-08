const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model"); 
const Group = require("../models/group.model"); 

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" }
  });
  const onlineUsers = new Map();

  io.use((socket, next) => {
    const token = socket.handshake.headers["authorization"];
    if (!token) return next(new Error("Auth token missing"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // store user info on socket
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id} - Authenticated as: ${socket.user.email}`);
    const userEmail = socket.user.email;
    onlineUsers.set(userEmail, socket.id);

    socket.on("private-message", async ({ toEmail, message }) => {
      try {
        // 🔍 Check if recipient exists in DB
        const recipient = await User.findOne({ email: toEmail });
        if (!recipient) {
          return socket.emit("error", {
            message: "Recipient does not exist in the system"
          });
        }

        const toSocketId = onlineUsers.get(toEmail);
        console.log(toSocketId, "TOOO")
       
        if (toSocketId) {
          io.to(toSocketId).emit("private-message", {
            from: userEmail,
            message
          });
        } else {
          // Optionally store offline messages in DB or just log
          socket.emit("info", {
            message: "User is offline, but message accepted"
          });
        }
      } catch (err) {
        console.error("Error in private-message:", err.message);
        socket.emit("error", {
          message: "Server error sending message"
        });
      }
    });

    socket.on("join-group", async ({groupId}) => {
      try {
        const group = await Group.findById(groupId);
        if (!group) return socket.emit("error", "Group not found");
        console.log(socket.user, "group")

        // Add user if not already a member
        if (!group.members.includes(socket.user.userId)) {
          group.members.push(socket.user.userId);
          await group.save();
        }

        socket.join(groupId);
        socket.emit("joined-group", { groupId });
      } catch (err) {
        socket.emit("error", "Failed to join group");
      }
    });

    // Send group message
    socket.on("group-message", async ({ groupId, message }) => {
      const group = await Group.findById(groupId);
      if (!group) return socket.emit("error", "Group not found");

      const isMember = group.members.some(id => id.equals(socket.user.userId));
      if (!isMember) return socket.emit("error", "You're not a member of this group");

      io.to(groupId).emit("group-message", {
        from: socket.user.email,
        message
      });
    });

    // Leave group and remove from DB
    socket.on("leave-group", async ({groupId}) => {
      try {
        const group = await Group.findById(groupId);
        if (!group) return socket.emit("error", "Group not found");

        group.members = group.members.filter(id => !id.equals(socket.user.userId));
        await group.save();

        socket.leave(groupId);
        socket.emit("left-group", { groupId });
      } catch (err) {
        socket.emit("error", "Failed to leave group");
      }
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = socketSetup;
