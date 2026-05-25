// 현재 선택된 필터/정렬 상태를 기억하는 변수
let currentCategory = '전체';
let currentSort = 'latest';

// 서버에서 상품 목록을 가져와 화면에 그리는 함수
async function loadProducts() {
    try {
        // 1. 현재 상태를 쿼리스트링으로 조립
        const params = new URLSearchParams();
        params.append('category', currentCategory);
        params.append('sort', currentSort);

        // 2. 서버에 상품 목록 요청
        const res = await fetch('/api/products?' + params.toString());
        const products = await res.json();

        // 3. 카드를 그릴 자리 찾기
        const grid = document.getElementById('product-grid');
        grid.innerHTML = '';

        // 상품이 하나도 없을 때
        if (products.length === 0) {
            grid.innerHTML = '<p style="color:#888;">해당하는 상품이 없습니다.</p>';
            return;
        }

        // 4. 상품 하나하나를 카드로 만들어 넣기
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img">이미지 없음</div>
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
        console.error('상품 목록 로드 중 오류 발생:', error);
    }
}

// 정렬 셀렉트박스 이벤트
function setupSortEvent() {
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        loadProducts();
    });
}

// 카테고리 버튼 이벤트
function setupCategoryEvent() {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // 모든 버튼에서 active 빼고, 누른 버튼에만 active 주기
            buttons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            // 버튼 글자(전체, 의류 등)를 현재 카테고리로
            currentCategory = button.textContent;
            loadProducts();
        });
    });
}

// 페이지가 열리면 실행
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupSortEvent();
    setupCategoryEvent();
});