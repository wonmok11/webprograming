const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = "weak_secret_key_1234";

let products = [
    {
        id: "sample_1",
        title: "자바 프로그래밍 전공책 팝니다",
        desc: "A+ 받은 기운이 담겨있습니다. 깨끗해요!",
        price: 15000,
        category: "전공책",
        status: "판매중",
        image: "",
        createdAt: new Date()
    }
];

function authenticateToken(req, res, next) {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return res.status(401).json({ success: false, message: "로그인이 필요합니다." });

    const token = cookieHeader.split('; ').find(row => row.startsWith('sessionToken='))?.split('=')[1];
    if (!token) return res.status(401).json({ success: false, message: "토큰이 없습니다." });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ success: false, message: "조작되거나 유효하지 않은 토큰입니다!" });
        req.user = decoded;
        next();
    });
}

router.get('/products', (req, res) => {
    try {
        const sortedProducts = [...products].sort((a, b) => b.createdAt - a.createdAt);
        res.json({ success: true, data: sortedProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: '상품 조회 에러' });
    }
});

router.post('/products', authenticateToken, (req, res) => {
    try {
        const { title, desc, price, category, image } = req.body;

        products.push({
            id: Date.now().toString(),
            title,
            desc,
            price: Number(price),
            category,
            status: '판매중',
            image: image || "",
            createdAt: new Date()
        });

        res.json({ success: true, message: '상품이 성공적으로 등록되었습니다.' });
    } catch (error) {
        res.status(500).json({ success: false, message: '상품 등록 에러' });
    }
});

module.exports = router;