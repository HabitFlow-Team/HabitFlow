/* =========================================================
   HABITFLOW — ACHIEVEMENTS
   Achievement category filtering
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const filters = document.querySelectorAll(".achievement-filter");
    const cards = document.querySelectorAll(".achievement-card");

    if (!filters.length || !cards.length) return;


    filters.forEach((filter) => {

        filter.addEventListener("click", () => {

            const selectedCategory =
                filter.dataset.category;


            /* ---------------------------------------------
               Update active filter
            --------------------------------------------- */

            filters.forEach((item) => {
                item.classList.remove("active");
            });

            filter.classList.add("active");


            /* ---------------------------------------------
               Filter achievement cards
            --------------------------------------------- */

            cards.forEach((card) => {

                const cardCategory =
                    card.dataset.category;

                const shouldShow =
                    selectedCategory === "all" ||
                    cardCategory === selectedCategory;

                card.style.display =
                    shouldShow ? "" : "none";

            });

        });

    });

});