const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
    const { id, password } = req.body;

    if (id === "test" && password === "1234") {
        req.session.user = { id };
        return res.json({ success: true, user: id });
    }

    res.status(401).json({ success: false, message: "로그인 실패" });
});

router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

module.exports = router;
