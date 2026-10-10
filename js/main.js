for (const category of document.querySelectorAll(".category")) {
    for (const category_ul of document.querySelectorAll(".category>ul")) {
        category.addEventListener("mouseover", () => {
            category_ul.classList.remove("d-none");
        });
        category.addEventListener("mouseout", () => {
            category_ul.classList.add("d-none");
        });
    }
}
document.querySelector(".dropdown").addEventListener("mouseover", () => {
    document.querySelector(".conditions").classList.add("transform-90deg");
    document.querySelector(".dropdown>ul").classList.remove("d-none");
});
document.querySelector(".dropdown").addEventListener("mouseout", () => {
    document.querySelector(".conditions").classList.remove("transform-90deg");
    document.querySelector(".dropdown>ul").classList.add("d-none");
});

// Delegated so it also works for cards rendered from js/store.js.
document.addEventListener("click", (event) => {
    if (event.target.closest(".addToCart")) {
        for (const addValue of document.querySelectorAll(".addValue")) {
            addValue.innerText = parseInt(addValue.textContent) + 1;
        }
        return;
    }

    const heart = event.target.closest(".heart-outline, .heart-filled");
    if (!heart) return;
    const liked = heart.classList.contains("heart-outline");
    const sibling = liked ? heart.nextElementSibling : heart.previousElementSibling;
    heart.classList.add("d-none");
    sibling.classList.remove("d-none");
    for (const likes of document.querySelectorAll(".likes")) {
        likes.innerText = parseInt(likes.textContent) + (liked ? 1 : -1);
    }
});
document.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop > 200) {
        document.querySelector(".position-fixed").classList.remove("d-none");
    } else {
        document.querySelector(".position-fixed").classList.add("d-none");
    }
});

var swiper1 = new Swiper(".mySwiper", {
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    autoplay: {
        delay: 3000,
    },
});
var swiper2 = new Swiper(".mySwiper2", {
    slidesPerView: 4,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});
