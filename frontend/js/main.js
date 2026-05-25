// 전역 변수로 서버에서 받은 전체 상품 목록 저장 (필터링용)
let allProducts = [];

// 1. 헤더, 푸터 HTML 가져오기 및 로그인 상태 복구
async function loadComponents() {
    try {
        const headerRes = await fetch("/components/header.html");
        document.getElementById("header-placeholder").innerHTML =
            await headerRes.text();

        const footerRes = await fetch("/components/footer.html");
        document.getElementById("footer-placeholder").innerHTML =
            await footerRes.text();

        const savedNickname = localStorage.getItem("userNickname");
        if (savedNickname) {
            document.getElementById("display-username").innerText =
                savedNickname + " 님";
            document.getElementById("btn-login").style.display = "none";
            document.getElementById("btn-logout").style.display =
                "inline-block";
            document.getElementById("btn-create").style.display =
                "inline-block";
        }
    } catch (error) {
        console.error("컴포넌트 로드 실패:", error);
    }
}

// 2. 화면 전환 (홈으로 돌아올 때 카테고리 '전체'로 초기화)
window.switchView = function (viewId) {
    document
        .querySelectorAll(".page-section")
        .forEach((el) => el.classList.remove("active-section"));
    document.getElementById(viewId).classList.add("active-section");

    if (viewId === "view-home") {
        // 카테고리 버튼 '전체'로 시각적 초기화
        const categoryBtns = document.querySelectorAll(".category-btn");
        if (categoryBtns.length > 0) {
            categoryBtns.forEach((b) => b.classList.remove("active"));
            categoryBtns[0].classList.add("active");
        }
        loadProducts();
    }
};

// 3. 서버에서 상품 목록 로드 후 최초 렌더링
async function loadProducts() {
    try {
        const response = await fetch("/api/products");
        const result = await response.json();

        // ✅ 서버 응답 구조 수정: result.data → result.products
        allProducts = result.products || [];

        // 화면에 그리기 (처음엔 전체 상품)
        renderProducts(allProducts);

        // 카테고리 버튼 클릭 이벤트 세팅
        setupCategoryFilter();
    } catch (err) {
        console.error("❌ 데이터 로드 실패", err);
        allProducts = [];
        renderProducts([]);
    }
}

function renderProducts(productsToRender) {
    const container = document.getElementById("product-list-container");
    container.innerHTML = "";

    if (!productsToRender || productsToRender.length === 0) {
        container.innerHTML =
            '<div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: #999;">해당 카테고리에 등록된 상품이 없습니다.</div>';
        return;
    }

    productsToRender.forEach((item) => {
        const imgStyle = item.imageUrl
            ? `background-image: url('${item.imageUrl}'); background-size: cover; background-position: center;`
            : "";
        const imgText = item.imageUrl ? "" : "이미지 없음";

        container.innerHTML += `
            <div class="product-card">
                <div class="product-img" style="${imgStyle}">${imgText}</div>
                <div class="product-info">
                    <div class="product-title">${escapeHtml(item.title)}</div>
                    <div class="product-desc">${escapeHtml(item.desc)}</div>
                    <div class="product-price-row">
                        <div class="product-price">₩${Number(item.price).toLocaleString()}</div>
                    </div>
                    <div style="font-size: 12px; color: #999;">${escapeHtml(item.category)}</div>
                </div>
            </div>
        `;
    });
}

// 5. 카테고리 버튼 필터링 로직
function setupCategoryFilter() {
    const categoryBtns = document.querySelectorAll(".category-btn");

    categoryBtns.forEach((btn) => {
        btn.onclick = function () {
            // 버튼 색상 변경 (누른 것만 까맣게)
            categoryBtns.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");

            // 누른 버튼의 텍스트(예: "전자기기") 가져오기
            const selectedCategory = this.innerText;

            // 데이터 필터링 후 다시 그리기
            if (selectedCategory === "전체") {
                renderProducts(allProducts);
            } else {
                const filtered = allProducts.filter(
                    (p) => p.category === selectedCategory,
                );
                renderProducts(filtered);
            }
        };
    });
}

// 6. 상품 등록 (FormData 사용 - 이미지 파일 업로드)
window.handleCreate = async function (e) {
    e.preventDefault();

    const title = document.getElementById("p-title").value.trim();
    const category = document.getElementById("p-category").value;
    const price = document.getElementById("p-price").value.trim();
    const desc = document.getElementById("p-desc").value.trim();
    const fileInput = document.getElementById("p-image");
    const file = fileInput && fileInput.files && fileInput.files[0];

    // 입력값 검증
    if (!title || !category || !price) {
        alert("필수 항목을 입력하세요.");
        return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("category", category);
    fd.append("price", price);
    fd.append("desc", desc);
    if (file) fd.append("image", file);

    try {
        const response = await fetch("/api/products", {
            method: "POST",
            body: fd,
        });
        const result = await response.json();

        if (result.success) {
            alert("상품이 성공적으로 등록되었습니다!");
            document.getElementById("create-form").reset();
            document.getElementById("image-preview-container").innerHTML = "";
            await loadProducts();
            switchView("view-home");
        } else {
            alert(result.message || "등록 실패");
        }
    } catch (err) {
        console.error("❌ 상품 등록 실패:", err);
        alert("등록 중 오류가 발생했습니다.");
    }
};

// 7. 회원가입
window.handleSignup = async function (e) {
    e.preventDefault();
    const email = document.getElementById("s-email").value;
    const password = document.getElementById("s-password").value;
    const nickname = document.getElementById("s-nickname").value;

    if (!email || !password || !nickname)
        return alert("모든 항목을 입력해주세요.");

    const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname }),
    });
    const result = await response.json();

    if (result.success) {
        alert("환영합니다! 회원가입과 동시에 로그인되었습니다.");
        localStorage.setItem("userNickname", result.nickname);
        document.cookie =
            "sessionToken=wonmok_secret_token_abc123; path=/; max-age=3600";
        document.getElementById("display-username").innerText =
            result.nickname + " 님";
        document.getElementById("btn-login").style.display = "none";
        document.getElementById("btn-logout").style.display = "inline-block";
        document.getElementById("btn-create").style.display = "inline-block";
        switchView("view-home");
        document.getElementById("signup-form").reset();
    } else {
        alert(result.message);
    }
};

// 8. 로그인
window.handleLogin = async function (e) {
    e.preventDefault();
    const email = document.getElementById("l-email").value;
    const password = document.getElementById("l-password").value;

    if (!email || !password) return alert("이메일과 비밀번호를 입력해주세요.");

    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    if (result.success) {
        alert("로그인 성공!");
        localStorage.setItem("userNickname", result.nickname);
        document.cookie =
            "sessionToken=wonmok_secret_token_abc123; path=/; max-age=3600";
        document.getElementById("display-username").innerText =
            result.nickname + " 님";
        document.getElementById("btn-login").style.display = "none";
        document.getElementById("btn-logout").style.display = "inline-block";
        document.getElementById("btn-create").style.display = "inline-block";
        switchView("view-home");
        document.getElementById("login-form").reset();
    } else {
        alert(result.message);
    }
};

// 9. 로그아웃
window.handleLogout = function () {
    localStorage.removeItem("userNickname");
    document.cookie =
        "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    alert("로그아웃 되었습니다.");
    location.reload();
};

// XSS 방지 함수
function escapeHtml(str = "") {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// 10. 초기화
window.onload = async () => {
    await loadComponents();
    loadProducts();
};
