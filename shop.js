// ===== SELECT ELEMENTS =====
const categoryInputs = document.querySelectorAll(".categoryFilter");
const sizeInputs = document.querySelectorAll(".sizeFilter");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const sortSelect = document.getElementById("sortPrice");
const clearBtn = document.getElementById("clearFilters");

// ===== MAIN FILTER FUNCTION =====
function filterProducts() {
    let filtered = [...productsArray];

    // CATEGORY FILTER
    const selectedCategories = [...categoryInputs]
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (selectedCategories.length > 0) {
        filtered = filtered.filter(product =>
            selectedCategories.includes(product.category)
        );
    }

    // SIZE FILTER
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

    // PRICE FILTER
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

    // SORTING
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

minPriceInput.addEventListener("input", filterProducts);
maxPriceInput.addEventListener("input", filterProducts);
sortSelect.addEventListener("change", filterProducts);

// ===== CLEAR FILTERS =====
clearBtn.addEventListener("click", () => {
    categoryInputs.forEach(input => input.checked = false);
    sizeInputs.forEach(input => input.checked = false);

    minPriceInput.value = "";
    maxPriceInput.value = "";
    sortSelect.value = "";

    renderProducts(productsArray);
});

// ===== INITIAL LOAD =====
renderProducts(productsArray);