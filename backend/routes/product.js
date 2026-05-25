const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// uploads 디렉토리
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

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB로 증대
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("이미지 파일만 업로드 가능합니다."), false);
        }
    },
});

// in-memory products 배열
const products = [];

/** POST /api/products - 상품 등록 (이미지 포함) */
router.post("/products", upload.single("image"), (req, res) => {
    try {
        const { title, category, price, desc } = req.body;
        const file = req.file;

        if (!title || !category || !price || !desc) {
            return res
                .status(400)
                .json({ success: false, message: "필수 항목을 입력하세요." });
        }

        const product = {
            id: products.length + 1,
            title: title.trim(),
            category: category.trim(),
            price: Number(price) || 0,
            desc: desc.trim(),
            imageUrl: file ? `/uploads/${file.filename}` : null,
            createdAt: new Date().toISOString(),
        };

        products.push(product);
        console.log(`✅ 상품 등록: ${product.title}`);
        return res.json({ success: true, product });
    } catch (err) {
        console.error("❌ POST /products error:", err);
        return res.status(500).json({ success: false, message: "서버 오류" });
    }
});

/** GET /api/products - 전체 상품 조회 */
router.get("/products", (req, res) => {
    try {
        res.json({ success: true, products });
    } catch (err) {
        console.error("❌ GET /products error:", err);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
});

module.exports = router;
