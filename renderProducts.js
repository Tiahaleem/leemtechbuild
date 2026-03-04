function renderProducts(data = PRODUCTS, options = {}) {
    const { featuredOnly = false } = options;

    const grid = document.querySelector(".items_display_grid");
    if (!grid) return;

    grid.innerHTML = "";

    // Convert to array safely
    const productArray = Array.isArray(data)
        ? data
        : Object.entries(data);

    productArray.forEach((item) => {

        let id, product;

        // If coming from PRODUCTS object
        if (!Array.isArray(data)) {
            [id, product] = item;
        } 
        // If coming from filtered array
        else {
            product = item;
            id = Object.keys(PRODUCTS).find(
                key => PRODUCTS[key] === product
            );
        }

        if (featuredOnly && !product.featured) return;

        const firstPrice = Object.values(product.sizes)[0];
        const sizeList = Object.keys(product.sizes).join(", ");

        const card = document.createElement("div");
        card.className = "item_display_product";

        card.innerHTML = `
            <div class="item_img">
                <a href="product.html?id=${id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
            </div>

            <div class="product_details">
                <div class="detail_txt">
                    <p class="Product">${product.category}</p>

                    <h3>
                        <a href="product.html?id=${id}">
                            ${product.name}
                        </a>
                    </h3>
                </div>

                <div class="price_cart_flex">
                    <div class="price">
                        <span class="current">₦${firstPrice.toLocaleString()}</span>
                    </div>

                    <p class="size">Sizes: ${sizeList}</p>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}
// document.addEventListener("DOMContentLoaded", () => {
//     renderProducts(productsArray);
// });