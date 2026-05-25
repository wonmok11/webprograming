const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

let users = [];

// 🚨 프론트엔드/백엔드 모두 동일해야 하는 비밀키
const SECRET_KEY = "weak_secret_key_1234";

// 회원가입
router.post('/signup', async (req, res) => {
    try {
        const { email, password, nickname } = req.body;

        const existingUser = users.find(u => u.email === email);
        if (existingUser) return res.status(400).json({ success: false, message: '이미 가입된 이메일입니다.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ email, password: hashedPassword, nickname, createdAt: new Date() });

        // 🌟 진짜 JWT 발급 (권한을 'user'로 부여)
        const token = jwt.sign({ email, nickname, role: "user" }, SECRET_KEY);

        // 프론트엔드로 token 쏴주기
        res.json({ success: true, message: '회원가입 완료!', nickname, token });
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

// 로그인
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.find(u => u.email === email);
        if (!user) return res.status(400).json({ success: false, message: '가입되지 않은 이메일입니다.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });

        // 🌟 진짜 JWT 발급
        const token = jwt.sign({ email: user.email, nickname: user.nickname, role: "user" }, SECRET_KEY);

        res.json({ success: true, nickname: user.nickname, token });
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

module.exports = router;