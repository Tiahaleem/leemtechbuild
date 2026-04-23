// ===== SELECT ELEMENTS =====
const categoryInputs = document.querySelectorAll(".categoryFilter");
const sizeInputs = document.querySelectorAll(".sizeFilter");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const sortSelect = document.getElementById("sortPrice");
const clearBtn = document.getElementById("clearFilters");
const filterForm = document.querySelector(".shop_sidebar form");

// stop form refresh if filters are inside a form
if (filterForm) {
    filterForm.addEventListener("submit", (e) => {
        e.preventDefault();
    });
}

// ===== MAIN FILTER FUNCTION =====
function filterProducts() {
    let filtered = [...productsArray];

    const selectedCategories = [...categoryInputs]
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (selectedCategories.length > 0) {
        filtered = filtered.filter(product =>
            selectedCategories.includes(product.category)
        );
    }

    const selectedSizes = [...sizeInputs]
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (selectedSizes.length > 0) {
        filtered = filtered.filter(product =>
            Object.keys(product.sizes).some(size =>
                selectedSizes.includes(size)
            )
        );
    }

    const min = parseFloat(minPriceInput.value);
    const max = parseFloat(maxPriceInput.value);

    if (!isNaN(min)) {
        filtered = filtered.filter(product =>
            Object.values(product.sizes).some(price => Number(price) >= min)
        );
    }

    if (!isNaN(max)) {
        filtered = filtered.filter(product =>
            Object.values(product.sizes).some(price => Number(price) <= max)
        );
    }

    if (sortSelect.value === "low-high") {
        filtered.sort((a, b) => {
            const priceA = Math.min(...Object.values(a.sizes).map(Number));
            const priceB = Math.min(...Object.values(b.sizes).map(Number));
            return priceA - priceB;
        });
    }

    if (sortSelect.value === "high-low") {
        filtered.sort((a, b) => {
            const priceA = Math.max(...Object.values(a.sizes).map(Number));
            const priceB = Math.max(...Object.values(b.sizes).map(Number));
            return priceB - priceA;
        });
    }

    renderProducts(filtered);
}

// ===== LISTENERS =====
categoryInputs.forEach(input => {
    input.addEventListener("change", filterProducts);
});

sizeInputs.forEach(input => {
    input.addEventListener("change", filterProducts);
});

if (minPriceInput) minPriceInput.addEventListener("input", filterProducts);
if (maxPriceInput) maxPriceInput.addEventListener("input", filterProducts);
if (sortSelect) sortSelect.addEventListener("change", filterProducts);

// ===== CLEAR FILTERS =====
if (clearBtn) {
    clearBtn.addEventListener("click", (e) => {
        e.preventDefault();

        categoryInputs.forEach(input => input.checked = false);
        sizeInputs.forEach(input => input.checked = false);

        if (minPriceInput) minPriceInput.value = "";
        if (maxPriceInput) maxPriceInput.value = "";
        if (sortSelect) sortSelect.value = "";

        renderProducts(productsArray);
    });
}

// ===== INITIAL LOAD =====
renderProducts(productsArray);