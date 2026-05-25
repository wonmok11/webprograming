// 서버에서 상품 목록을 가져와 화면에 그리는 함수
async function loadProducts() {
    try {
        // 1. 서버에 상품 목록 요청
        const res = await fetch('/api/products');
        const products = await res.json();

        // 2. 카드를 그릴 자리(product-grid)를 찾기
        const grid = document.getElementById('product-grid');
        grid.innerHTML = ''; // 기존 내용 비우기

        // 3. 상품 하나하나를 카드로 만들어 넣기
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img">이미지 없음ㅎㅎ</div>
                <div class="product-info">
                    <div class="product-title">${product.title}</div>
                    <div class="product-desc">${product.description}</div>
                    <div class="product-price-row">
                        <div class="product-price">₩${product.price.toLocaleString()}</div>
                        <div class="status-badge">${product.status}</div>
                    </div>
                    <div class="product-meta">${product.category}</div>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error('상품목록 로드 중 오류발생:', error);
    }
}

// 페이지가 열리면 상품 목록 불러오기
document.addEventListener('DOMContentLoaded', loadProducts);