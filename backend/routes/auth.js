const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// 🌟 메모리 DB 역할을 할 유저 배열
let users = [];

// 회원가입
router.post('/signup', async (req, res) => {
    try {
        const { email, password, nickname } = req.body;

        // 배열에서 이메일 중복 확인
        const existingUser = users.find(u => u.email === email);
        if (existingUser) return res.status(400).json({ success: false, message: '이미 가입된 이메일입니다.' });

        const hashedPassword = await bcrypt.hash(password, 10);

        // 배열에 유저 데이터 저장
        users.push({ email, password: hashedPassword, nickname, createdAt: new Date() });

        // 🌟 변경됨: 성공 시 메시지와 함께 nickname을 바로 반환하여 자동 로그인 지원
        res.json({ success: true, message: '회원가입 완료!', nickname: nickname });
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

// 로그인
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 배열에서 유저 찾기
        const user = users.find(u => u.email === email);
        if (!user) return res.status(400).json({ success: false, message: '가입되지 않은 이메일입니다.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });

        res.json({ success: true, nickname: user.nickname });
    } catch (error) {
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;