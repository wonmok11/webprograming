const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

app.use(express.static(path.join(__dirname, '../frontend')));

// ===== 가짜 상품 데이터 (나중에 DB로 교체할 부분) =====
const products = [
    { id: 1, title: '아이폰 13', price: 400000, description: '깨끗하게 사용했어요', category: '전자기기', status: '판매중', createdAt: '2026-05-20' },
    { id: 2, title: '자료구조 교재', price: 15000, description: '필기 약간 있음', category: '전공책', status: '판매중', createdAt: '2026-05-22' },
    { id: 3, title: '겨울 패딩', price: 50000, description: 'L 사이즈입니다', category: '의류', status: '판매완료', createdAt: '2026-05-18' },
    { id: 4, title: '미니 선풍기', price: 8000, description: '여름용 USB 선풍기', category: '비품', status: '판매중', createdAt: '2026-05-24' },
    { id: 5, title: '무선 마우스', price: 12000, description: '로지텍 제품', category: '전자기기', status: '판매중', createdAt: '2026-05-21' }
];

// ===== 상품 목록 조회 API =====
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(port, () => {
    console.log(`서버 구동 완료: http://localhost:${port}`);
});