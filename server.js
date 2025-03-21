require("dotenv").config();
const express = require("express")
const app = express();
const socket = require("socket.io"); // Add this
const mainRouter = require("./router/index");
const PORT = process.env.PORT || 8000;
const bodyParser = require("body-parser")
const cors = require("cors");
const connectDB = require("./dbLayer/connection");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
connectDB();
app.use("/api", mainRouter);
const allowOrigin = [
    "*",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://192.168.1.125:3000",
    "http://192.168.1.5:3000",
    "http://192.168.1.5:3001",
    "http://192.168.1.8:3000",
    "http://192.168.1.8:3001",
    "https://mom.ntspl.co.in",
    "http://192.168.1.86:4200",
    "https://localhost",
    "https://mom.ntspl.co.in",
];
const corsOpts = {
    origin: allowOrigin,
    methods: ["GET, POST, PUT, DELETE, OPTIONS, PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors());


// app.use("/api", mainRouter);
console.log("frontend", process.env.FRONTEND_URL);
const io = socket(
    app.listen(PORT, () => {
        console.info(`Server is running on port.... ${PORT}`);
    }),
    {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET, POST, PUT, DELETE, OPTIONS, PATCH"],
        },
    }
);