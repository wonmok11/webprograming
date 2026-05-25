const express = require("express");
const session = require("express-session");
const authRouter = require("./routes/auth");
const commentsRouter = require("./routes/comments");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5500",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
}));

app.use("/api", authRouter);
app.use("/api", commentsRouter);

app.listen(3000, () => console.log("Server running on 3000"));
