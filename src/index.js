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

const API_v1 = require("./routes/v1");
const connectMongoose = require("./configs/mongoose");
const handleCommentSocket = require("./socket/commentSocket");
const handleErrorMiddleware = require("./middlewares/handleErrorMiddleware");

const port = 3001;

app.use(express.static(path.join(__dirname, "public")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.use("/api/v1", API_v1);

app.use(handleErrorMiddleware);

connectMongoose(process.env.MONGOOSE_URL);

handleCommentSocket(io);

server.listen(port, () => {
  console.log("Server is running on localhost:", port);
});
