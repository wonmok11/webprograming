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
    // 쿼리스트링에서 조건 꺼내기
    const category = req.query.category;
    const sort = req.query.sort;

    // 원본을 건드리지 않게 복사본으로 작업
    let result = [...products];

    // 1. 카테고리 필터링
    if (category && category !== '전체') {
        result = result.filter(product => product.category === category);
    }

    // 2. 정렬
    if (sort === 'price-low') {
        result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
        result.sort((a, b) => b.price - a.price);
    } else if (sort === 'latest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json(result);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(port, () => {
    console.log(`서버 구동 완료: http://localhost:${port}`);
});