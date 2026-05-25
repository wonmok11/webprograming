const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// uploads 디렉토리 (backend/uploads)
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
        cb(null, name);
    },
});
const upload = multer({ storage });

/** 간단한 in-memory products 배열 (메모리 DB) */
const products = [];

/** POST /api/products - 이미지 포함 업로드 처리 */
router.post("/products", upload.single("image"), (req, res) => {
    try {
        const { title, category, price, desc } = req.body;
        const file = req.file;
        const product = {
            id: products.length + 1,
            title: title || "",
            category: category || "",
            price: Number(price || 0),
            desc: desc || "",
            imageUrl: file ? `/uploads/${file.filename}` : null,
            createdAt: new Date(),
        };
        products.push(product);
        return res.json({ success: true, product });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "서버 오류" });
    }
});

/** GET /api/products - 전체 조회 (테스트/프론트갱신용) */
router.get("/products", (req, res) => {
    res.json({ products });
});

module.exports = router;
