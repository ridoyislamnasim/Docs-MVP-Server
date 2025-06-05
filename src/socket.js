const { Server } = require("socket.io");
const Document = require("./models/doc/docSchema"); // আপনার ডকুমেন্ট মডেল

const defaultValue = ""; // ডিফল্ট ডকুমেন্ট কন্টেন্ট

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // প্রোডাকশনে নির্দিষ্ট origin দিন
      methods: ["GET", "POST"]
    }
  });

  // roomId -> Set of user info (presence)
  const roomUsers = {}; // { roomId: [userObj, ...] }

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    // roomUsers
    console.log("Current room users:", roomUsers);
    // Join room
    socket.on("join-room", (roomId, user) => {
      console.log(`User joined room: ${roomId} with user:`, user);
      socket.join(roomId);
      if (!roomUsers[roomId]) roomUsers[roomId] = [];
      // একই user বারবার না ঢুকতে চেক করুন
      if (!roomUsers[roomId].some(u => u.id === user.id)) {
        roomUsers[roomId].push(user);
      }
      console.log(`Current users in room ${roomId}:`, roomUsers[roomId]);
      io.to(roomId).emit("presence", roomUsers[roomId]);
      socket.data.roomId = roomId;
      socket.data.userId = user.id;
    });

    socket.on("get-document", async (documentId) => {
      // ডাটাবেজ থেকে ডকুমেন্ট খুঁজে বের করুন
      let document = await Document.findById(documentId);
        console.log("Document found:", document);
      if (!document) {
        document = await Document.create({ _id: documentId, content: defaultValue, title: "Untitled" });
      }
      socket.join(documentId);
      socket.emit(
        "load-document",
        typeof document.content === "string" && document.content.length > 0
          ? JSON.parse(document.content)
          : document.content || { ops: [{ insert: "\n" }] } // Quill-এর জন্য default empty delta
      );

      // রিয়েল-টাইম চেঞ্জ শেয়ার করা
      socket.on("send-changes", (delta) => {
        socket.broadcast.to(documentId).emit("receive-changes", delta);
      });


      // প্রতি ২ সেকেন্ডে ক্লায়েন্ট থেকে save-document এলে ডাটাবেজে সেভ করুন
      socket.on("save-document", async (data) => {
        console.log(`Saving document with ID: ${documentId} and content:`, data);
        // এখানে ডাটাবেজে সেভ করার লজিক
        await Document.findByIdAndUpdate(documentId, { content: JSON.stringify(data) });
      });     
    });

    // Real-time doc changes
    socket.on("doc-changes", ({ docId, content }) => {
        console.log(`Document changes for ${docId}:`, content);
      // Broadcast to others in the room
      socket.to(docId).emit("doc-changes", content);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      const { roomId, userId } = socket.data;
      if (roomId && userId && roomUsers[roomId]) {
        roomUsers[roomId] = roomUsers[roomId].filter(u => u.id !== userId);
        io.to(roomId).emit("presence", roomUsers[roomId]);
      }
    });
  });
}

module.exports = setupSocket;