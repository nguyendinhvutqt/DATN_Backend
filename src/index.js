const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const routes = require("./routes");
const connectMongoose = require("./configs/mongoose");

const app = express();

const port = 3001;

app.use(express.static(path.join(__dirname, "public")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

routes(app);

connectMongoose(process.env.MONGOOSE_URL);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => console.log("Server is running on localhost:", port));
