const express = require("express");
const fs = require("fs");
const router = express.Router();

const COMMENTS_FILE = "./data/comments.json";

router.post("/comments", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "로그인 필요" });
    }

    const { text } = req.body;
    const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE));

    const newComment = {
        id: Date.now(),
        user: req.session.user.id,
        text
    };

    comments.push(newComment);
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments));

    res.json(newComment);
});

router.delete("/comments", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "로그인 필요" });
    }

    const { id } = req.body;
    let comments = JSON.parse(fs.readFileSync(COMMENTS_FILE));

    const comment = comments.find(c => c.id === id);

    if (!comment) {
        return res.status(404).json({ message: "댓글 없음" });
    }

    if (comment.user !== req.session.user.id) {
        return res.status(403).json({ message: "본인 댓글만 삭제 가능" });
    }

    comments = comments.filter(c => c.id !== id);
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments));

    res.json({ success: true });
});

module.exports = router;
