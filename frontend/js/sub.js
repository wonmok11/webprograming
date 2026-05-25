document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("p-image");

    if (fileInput) {
        // 이미지 미리보기 요소 생성
        const previewContainer = document.createElement("div");
        previewContainer.id = "image-preview-container";
        previewContainer.style.marginTop = "10px";
        fileInput.parentNode.appendChild(previewContainer);

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files && e.target.files[0];
            previewContainer.innerHTML = "";

            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement("img");
                img.src = event.target.result;
                img.style.maxWidth = "100%";
                img.style.maxHeight = "300px";
                img.style.borderRadius = "4px";
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    }

    // 초기 상품 로드
    loadProducts();
});

/** 상품 등록 폼 제출 */
window.handleCreate = async function handleCreate(event) {
    event.preventDefault();

    const title = document.getElementById("p-title").value.trim();
    const category = document.getElementById("p-category").value;
    const price = document.getElementById("p-price").value.trim();
    const desc = document.getElementById("p-desc").value.trim();
    const fileInput = document.getElementById("p-image");
    const file = fileInput && fileInput.files && fileInput.files[0];

    // 입력값 검증
    if (!title || !category || !price || !desc) {
        alert("모든 필드를 입력하세요.");
        return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("category", category);
    fd.append("price", price);
    fd.append("desc", desc);
    if (file) fd.append("image", file);

    try {
        const res = await fetch("/api/products", { method: "POST", body: fd });
        const data = await res.json();

        if (!res.ok || !data.success) {
            alert(data.message || "업로드 실패");
            return;
        }

        alert("상품 등록 완료!");
        document.getElementById("create-form").reset();
        document.getElementById("image-preview-container").innerHTML = "";
        await loadProducts();
        switchView("view-home"); // 상품 목록으로 이동
    } catch (err) {
        console.error("❌ handleCreate error:", err);
        alert("업로드 중 오류가 발생했습니다.");
    }
};

/** 상품 목록 로드 및 렌더링 */
async function loadProducts() {
    try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (!data.success) {
            console.error("상품 로드 실패");
            return;
        }

        const container = document.getElementById("product-list-container");
        if (!container) return;

        container.innerHTML = "";

        if (data.products.length === 0) {
            container.innerHTML =
                '<p style="text-align:center; color:#999;">등록된 상품이 없습니다.</p>';
            return;
        }

        // 최신순 정렬
        data.products
            .slice()
            .reverse()
            .forEach((product) => {
                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `
        <div class="product-image">
          ${
              product.imageUrl
                  ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.title)}">`
                  : '<div class="no-image">이미지 없음</div>'
          }
        </div>
        <div class="product-info">
          <h3 class="product-title">${escapeHtml(product.title)}</h3>
          <div class="product-category">${escapeHtml(product.category)}</div>
          <div class="product-price">${Number(product.price).toLocaleString()}원</div>
          <div class="product-date">${new Date(product.createdAt).toLocaleDateString("ko-KR")}</div>
        </div>
      `;
                container.appendChild(card);
            });
    } catch (err) {
        console.error("❌ loadProducts error:", err);
    }
}

/** XSS 방지 */
function escapeHtml(str = "") {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}
