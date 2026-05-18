const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 세팅
app.use(cors());
app.use(express.json());

// MongoDB Atlas 연결
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected...'))
    .catch((err) => console.log('MongoDB Connection Error: ', err));

// 기본 라우트 테스트
app.get('/', (req, res) => {
    res.send('Backend Server is Running!');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});