const express = require("express");
const app = express();
const cors = require("cors");

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Thêm tên miền của ứng dụng React vào đây
    methods: ["GET", "POST"],
  },
});

const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const routes = require("./routes");
const connectMongoose = require("./configs/mongoose");

const port = 3001;

app.use(express.static(path.join(__dirname, "public")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

routes(app);

connectMongoose(process.env.MONGOOSE_URL);

// Định nghĩa sự kiện kết nối Socket.io
io.on("connection", (socket) => {
  console.log("socket Id: ", socket.id);

  socket.on("comment", (data) => {
    console.log("socket data: ", data);
    // socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(port, () => {
  console.log("Server is running on localhost:", port);
});
