require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// uploads 디렉토리 생성
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static(UPLOAD_DIR));

// 라우터 로드 (에러 캐칭)
let authRoutes, uploadRoutes;
try {
    authRoutes = require("./routes/auth");
    console.log("✅ auth.js 로드 성공");
} catch (err) {
    console.error("❌ auth.js 로드 실패:", err.message);
    authRoutes = express.Router(); // 빈 라우터로 대체
}

try {
    uploadRoutes = require("./routes/upload");
    console.log("✅ upload.js 로드 성공");
} catch (err) {
    console.error("❌ upload.js 로드 실패:", err.message);
    uploadRoutes = express.Router(); // 빈 라우터로 대체
}

app.use("/api", authRoutes);
app.use("/api", uploadRoutes);

// 프론트엔드 메인 페이지
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 에러 처리
process.on("uncaughtException", (err) => {
    console.error("❌ uncaughtException:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ unhandledRejection at:", promise, "reason:", reason);
});

const server = app.listen(PORT, () => {
    console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
    console.log("\n🛑 서버 종료 중...");
    server.close(() => process.exit(0));
});
