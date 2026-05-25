const API = "http://localhost:3000/api";

async function login() {
    const id = document.getElementById("id").value;
    const pw = document.getElementById("pw").value;

    const res = await fetch(`${API}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    });

    const data = await res.json();

    if (data.success) {
        alert("로그인 성공");
        location.href = "detail.html";
    } else {
        alert("로그인 실패");
    }
}

async function logout() {
    await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include"
    });
    alert("로그아웃 완료");
    location.href = "login.html";
}

async function addComment() {
    const text = document.getElementById("commentInput").value;

    const res = await fetch(`${API}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    if (res.status === 401) {
        alert("로그인 필요");
        return;
    }

    const comment = await res.json();
    renderComment(comment);
}

function renderComment(comment) {
    const list = document.getElementById("commentList");
    const li = document.createElement("li");

    li.innerHTML = `
        ${comment.user}: ${comment.text}
        <button onclick="deleteComment(${comment.id})">삭제</button>
    `;

    list.appendChild(li);
}

async function deleteComment(id) {
    const res = await fetch(`${API}/comments`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });

    const data = await res.json();

    if (data.success) {
        alert("삭제 완료");
        location.reload();
    } else {
        alert(data.message);
    }
}
