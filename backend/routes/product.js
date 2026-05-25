const express = require('express');
const router = express.Router();

// 메모리 DB 역할을 할 상품 배열 (이미지 필드 추가)
let products = [
    {
        title: "자바 프로그래밍 전공책 팝니다",
        desc: "A+ 받은 기운이 담겨있습니다. 깨끗해요!",
        price: 15000,
        category: "전공책",
        status: "판매중",
        image: "", // 이미지 기본값
        createdAt: new Date()
    }
];

// 상품 조회
router.get('/products', (req, res) => {
    try {
        const sortedProducts = [...products].sort((a, b) => b.createdAt - a.createdAt);
        res.json({ success: true, data: sortedProducts });
    } catch (error) {
        res.status(500).json({ success: false, message: '상품 조회 에러' });
    }
});

// 상품 등록
router.post('/products', (req, res) => {
    try {
        const { title, desc, price, category, image } = req.body;

        products.push({
            title,
            desc,
            price: Number(price),
            category,
            status: '판매중',
            image: image || "", // 이미지가 넘어오면 저장, 없으면 빈칸
            createdAt: new Date()
        });

        res.json({ success: true, message: '상품이 등록되었습니다.' });
    } catch (error) {
        res.status(500).json({ success: false, message: '상품 등록 에러' });
    }
});

module.exports = router;