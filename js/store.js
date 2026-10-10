// Product data for the listing pages. Prices are in AZN.
// oldPrice is set only for discounted products.
const store = (() => {
    const products = [
        { id: 1, name: 'Rəngli qələm 1.0mm "Cello" 1565', image: "img/Products/qelemler.jpg", price: 0.2, oldPrice: 0.25 },
        { id: 2, name: '"My Tech" mix colour 2240/R', image: "img/Products/16242606922240-renqli.jpg", price: 0.25, oldPrice: 0.3, recommended: true },
        { id: 3, name: 'Şüşə silən "Camsil" 1000ML', image: "img/suse silen.jpg", price: 2.4, oldPrice: 2.73 },
        { id: 4, name: 'Tess "Ginger Mojito" 20əd', image: "img/tess.jpg", price: 2.4, oldPrice: 2.82 },
        { id: 5, name: 'Qələm "Gigis" 9684', image: "img/1636102439dwGqfsr0N4IbHr9RYvefNoUJB5mWNiAQdKCE1aPo.png", price: 0.4, isNew: true },
        { id: 6, name: "Qayçı “Maped” E-4682", image: "img/1625820269bdc38bb1842a6c677cae4a6f2a8c5deb.jpg", price: 2, isNew: true },
        { id: 7, name: "Textmarker Maped/Grosso", image: "img/textmasker.jpg", price: 0.7, isNew: true },
        { id: 8, name: '"Opuntia Subulata" plastik qabda PA-5', image: "img/kaktus.jpg", price: 9, oldPrice: 10 },
        { id: 9, name: 'Stepler "Maped" 710', image: "img/stepler.jpg", price: 4.5, isNew: true },
    ];

    // Ordered product ids shown on each listing page. The template repeats
    // placeholder products to fill several pages; replace with real data.
    const repeat = (ids, times) => Array.from({ length: times }, () => ids).flat();
    const collections = {
        "endirim": repeat([1, 2, 3, 1, 1, 1, 4, 5, 6, 7, 5, 8], 3),
        "yeni-mehsullar": repeat([5, 6, 7, 5, 6, 7, 5, 6, 7, 7, 9, 9], 2),
    };

    const productsById = new Map(products.map((product) => [product.id, product]));

    return Object.freeze({
        products,
        getCollection(name) {
            return (collections[name] || []).map((id) => productsById.get(id)).filter(Boolean);
        },
    });
})();
