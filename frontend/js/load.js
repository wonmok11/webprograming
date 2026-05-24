async function loadComponents() {
    try {
        const headerRes = await fetch('/components/header.html');
        const headerHtml = await headerRes.text();
        document.getElementById('header-placeholder').innerHTML = headerHtml;

        const footerRes = await fetch('/components/footer.html');
        const footerHtml = await footerRes.text();
        document.getElementById('footer-placeholder').innerHTML = footerHtml;
    } catch (error) {
        console.error('컴포넌트 로드 중 오류 발생:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadComponents);