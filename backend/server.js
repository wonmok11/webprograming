require('dotenv').config();
const express = require('express');
const path = require('path');

// 분리된 라우터 불러오기
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// 🌟 Mongoose 연결 코드 완전 삭제!
console.log('✅ 메모리 DB(배열) 모드로 전환되었습니다.');

// 라우터 적용
app.use('/api', authRoutes);
app.use('/api', productRoutes);

// 프론트엔드 서빙
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 서버 실행 중: http://localhost:${port}`);
});