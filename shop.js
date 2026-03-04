// ===== SELECT ELEMENTS =====
const categoryInputs = document.querySelectorAll(".categoryFilter");
const sizeInputs = document.querySelectorAll (".sizeFilter");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const sortSelect = document.getElementById("sortPrice");
const clearBtn = document.getElementById("clearFilters");


// ===== MAIN FILTER FUNCTION =====
function filterProducts() {

    let filtered = [...productsArray];

    // CATEGORY FILTER
    const selectedCategories = [...document.querySelectorAll(".categoryFilter")]
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    if (selectedCategories.length > 0) {
        filtered = filtered.filter(product =>
            selectedCategories.includes(product.category)
        );
    }

    // SIZE FILTER
    const selectedSizes = [...document.querySelectorAll(".sizeFilter")]
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
    const min = parseFloat(document.getElementById("minPrice").value);
    const max = parseFloat(document.getElementById("maxPrice").value);

    if (!isNaN(min)) {
        filtered = filtered.filter(product =>
            Object.values(product.sizes).some(price => price >= min)
        );
    }

    if (!isNaN(max)) {
        filtered = filtered.filter(product =>
            Object.values(product.sizes).some(price => price <= max)
        );
    }

    renderProducts(filtered);
}
// ===== LISTENERS =====
categoryInputs.forEach(input =>
    input.addEventListener("change", filterProducts)
);

sizeInputs.forEach(input =>
    input.addEventListener("change", filterProducts)
);

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