// Renders a paginated product grid from `store`.
// Markup: <div data-product-list="<collection>" data-page-size="12"></div>
//         <ul data-pagination-for="<collection>"></ul>
// The current page is kept in the URL (?page=2) so it can be shared and
// works with the browser's back/forward buttons.
(() => {
    const list = document.querySelector("[data-product-list]");
    if (!list) return;

    const collection = list.dataset.productList;
    const pagination = document.querySelector(`[data-pagination-for="${collection}"]`);
    const pageSize = Number(list.dataset.pageSize) || 12;
    const products = store.getCollection(collection);
    const totalPages = Math.max(1, Math.ceil(products.length / pageSize));

    const escapeHtml = (value) =>
        String(value).replace(/[&<>"']/g, (char) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
        })[char]);

    const formatPrice = (value) => `${value.toFixed(2)} Azn`;

    const clampPage = (page) => Math.min(Math.max(page, 1), totalPages);

    const readPage = () => {
        const page = parseInt(new URLSearchParams(location.search).get("page"), 10);
        return Number.isNaN(page) ? 1 : clampPage(page);
    };

    const pageUrl = (page) => {
        const url = new URL(location.href);
        if (page === 1) url.searchParams.delete("page");
        else url.searchParams.set("page", page);
        return url.pathname + url.search + url.hash;
    };

    // Some browsers reject history updates for pages opened from file://.
    const updateHistory = (method, page) => {
        try {
            history[method]({ page }, "", pageUrl(page));
        } catch (error) {
            // Pagination still works; the URL just won't reflect the page.
        }
    };

    const badgeTemplate = (product) => {
        if (product.recommended) {
            return `<div class="col-lg-7">
                        <button type="button" class="btn-success rounded border border-success">Tövsiyə edilir</button>
                    </div>`;
        }
        if (product.isNew) {
            return `<div class="col-lg-6">
                        <button type="button" class="btn rounded orange text-white">Yeni</button>
                    </div>`;
        }
        return "";
    };

    const cardTemplate = (product) => {
        const badge = badgeTemplate(product);
        const oldPrice = product.oldPrice
            ? ` <span class="text-decoration-line-through">${formatPrice(product.oldPrice)}</span>`
            : "";
        return `
            <div class="card rounded" style="width: 18rem;" data-product-id="${product.id}">
                <div class="row p-3 ${badge ? "justify-content-between" : "justify-content-end"}">
                    ${badge}
                    <div class="col-lg-2">
                        <img src="img/images/icon/heart-outline.svg" class="heart-outline" alt="Bəyən">
                        <img src="img/images/icon/heart-filled.svg" class="heart-filled d-none" alt="Bəyənildi">
                    </div>
                </div>
                <img class="card-img-top" height="100%" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
                <div class="card-body text-center">
                    <p class="card-text">${escapeHtml(product.name)}</p>
                    <p class="card-text">${formatPrice(product.price)}${oldPrice}</p>
                    <button type="button" class="btn btn-transparent py-2 px-5 border border-success addToCart">Səbətə at</button>
                </div>
            </div>`;
    };

    // Page numbers to show: always first and last, plus a window around the
    // current page; gaps are collapsed into an ellipsis (null).
    const visiblePages = (current) => {
        const pages = [];
        for (let page = 1; page <= totalPages; page++) {
            if (page === 1 || page === totalPages || Math.abs(page - current) <= 1) {
                pages.push(page);
            } else if (pages[pages.length - 1] !== null) {
                pages.push(null);
            }
        }
        return pages;
    };

    const edgeTemplate = (target, label, symbol, rel) =>
        target
            ? `<li class="page-item">
                   <a class="page-link" href="${pageUrl(target)}" data-page="${target}" rel="${rel}" aria-label="${label}">
                       <span aria-hidden="true">${symbol}</span>
                   </a>
               </li>`
            : `<li class="page-item disabled">
                   <span class="page-link" aria-hidden="true">${symbol}</span>
                   <span class="visually-hidden">${label}</span>
               </li>`;

    const paginationTemplate = (current) => [
        edgeTemplate(current > 1 && current - 1, "Əvvəlki səhifə", "&laquo;", "prev"),
        ...visiblePages(current).map((page) => {
            if (page === null) {
                return `<li class="page-item disabled"><span class="page-link" aria-hidden="true">&hellip;</span></li>`;
            }
            if (page === current) {
                return `<li class="page-item active" aria-current="page"><span class="page-link">${page}</span></li>`;
            }
            return `<li class="page-item"><a class="page-link" href="${pageUrl(page)}" data-page="${page}" aria-label="Səhifə ${page}">${page}</a></li>`;
        }),
        edgeTemplate(current < totalPages && current + 1, "Növbəti səhifə", "&raquo;", "next"),
    ].join("");

    const render = (page) => {
        const start = (page - 1) * pageSize;
        const pageProducts = products.slice(start, start + pageSize);

        list.innerHTML = pageProducts.length
            ? pageProducts.map(cardTemplate).join("")
            : `<p class="w-100 text-center text-muted my-5">Məhsul tapılmadı.</p>`;

        if (pagination) {
            pagination.innerHTML = paginationTemplate(page);
            pagination.closest("nav").hidden = totalPages < 2;
        }
    };

    if (pagination) {
        pagination.addEventListener("click", (event) => {
            const link = event.target.closest("a[data-page]");
            // Let modified clicks (new tab, etc.) behave like normal links.
            if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();

            const page = Number(link.dataset.page);
            updateHistory("pushState", page);
            render(page);
            list.closest("section").scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    window.addEventListener("popstate", () => render(readPage()));

    // Normalise invalid values such as ?page=0 or ?page=99 in the address bar.
    const initialPage = readPage();
    updateHistory("replaceState", initialPage);
    render(initialPage);
})();
