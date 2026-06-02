const cartKey = "cart";
const ordersKey = "orders";
const adminPassword = "Saumu 1982";
const adminPhone = "0675846893";
const productsKey = "products";
const defaultProducts = [
    { name: "Sabuni ya mwani", price: 2500, image: "images/product1.jpg", desc: "Sabuni ya asili kwa ngozi nyororo." },
    { name: "Sabuni ya mkaratusi", price: 2500, image: "images/product2.jpg", desc: "Sabuni yenye harufu nzuri ya mkaratusi." },
    { name: "Massage oil", price: 3000, image: "images/product3.jpg", desc: "Mafuta ya massage kwa mwili na kupumua." },
    { name: "Lotion Rice", price: 4000, image: "images/product4.jpg", desc: "Lotion ya unga wa mchele kwa ngozi laini." },
    { name: "Pure oil", price: 3000, image: "images/product5.jpg", desc: "Mafuta safi kwa afya ya ngozi." }
];

const paymentMethods = [
    { id: "mpesa", label: "M-Pesa (Mix by yas)", details: "Tuma pesa kwa namba 0675846893. Tumia jina lako kama marejeo." },
    { id: "bank", label: "Bank Transfer", details: "Lipa kwa akaunti ya Bint Salum Store, NIDA Bank 123456789, Aina: Current." },
    { id: "card", label: "Card / Credit", details: "Taarifa ya malipo ya kadi itatumwa kupitia simu au email baada ya kuthibitisha oda." }
];

function getCart() {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

function getProducts() {
    return JSON.parse(localStorage.getItem(productsKey)) || [];
}

function saveProducts(products) {
    localStorage.setItem(productsKey, JSON.stringify(products));
}

function initializeProducts() {
    if (!localStorage.getItem(productsKey)) {
        saveProducts(defaultProducts);
    }
}

function renderProducts() {
    const productsGrid = document.getElementById("productsGrid");
    if (!productsGrid) return;

    const products = getProducts();
    productsGrid.innerHTML = "";

    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="empty-state">Hakuna bidhaa kwa sasa. Tafadhali ona admin ili kuongeza bidhaa.</p>';
        return;
    }

    products.forEach((product) => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;

        const title = document.createElement("h3");
        title.textContent = product.name;

        const description = document.createElement("p");
        description.textContent = product.desc;

        const priceText = document.createElement("p");
        priceText.textContent = `TZS ${product.price}`;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-primary";
        button.textContent = "Add to Cart";
        button.addEventListener("click", () => addToCart(product.name, product.price));

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(priceText);
        card.appendChild(button);
        productsGrid.appendChild(card);
    });
}

function renderAdminProducts() {
    const productList = document.getElementById("productList");
    if (!productList) return;

    const products = getProducts();
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = '<p>Hakuna bidhaa zilizowekwa.</p>';
        return;
    }

    products.forEach((product, index) => {
        productList.innerHTML += `
            <div class="product-list-item">
                <strong>${product.name}</strong>
                <p>${product.desc}</p>
                <p>Bei: TZS ${product.price}</p>
                <p>Image: ${product.image}</p>
                <button type="button" class="btn btn-secondary" onclick="deleteProduct(${index})">Futa</button>
            </div>
        `;
    });
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.toString());
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function previewProductImage() {
    const fileInput = document.getElementById("productImageFile");
    const preview = document.getElementById("imagePreview");
    if (!preview) return;

    preview.innerHTML = "";
    const file = fileInput?.files?.[0];
    if (!file) return;

    const img = document.createElement("img");
    img.alt = "Preview ya picha ya bidhaa";
    img.className = "preview-image";
    const reader = new FileReader();
    reader.onload = () => {
        img.src = reader.result;
        preview.appendChild(img);
    };
    reader.readAsDataURL(file);
}

async function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById("productName")?.value.trim();
    const price = Number(document.getElementById("productPrice")?.value || 0);
    const imagePath = document.getElementById("productImage")?.value.trim();
    const imageFile = document.getElementById("productImageFile")?.files?.[0];
    const desc = document.getElementById("productDesc")?.value.trim();

    if (!name || !price || (!imagePath && !imageFile)) {
        alert("Tafadhali jaza jina, bei, na picha ya bidhaa au path ya picha.");
        return;
    }

    let image = imagePath;
    if (imageFile) {
        try {
            image = await readFileAsDataURL(imageFile);
        } catch (error) {
            alert("Imeshindikana kusoma picha. Tafadhali jaribu tena.");
            return;
        }
    }

    const products = getProducts();
    products.push({ name, price, image, desc });
    saveProducts(products);
    renderProducts();
    renderAdminProducts();

    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("productImageFile").value = "";
    document.getElementById("productDesc").value = "";
    const preview = document.getElementById("imagePreview");
    if (preview) preview.innerHTML = "";

    alert("Bidhaa imeongezwa kwa mafanikio.");
}

function deleteProduct(index) {
    const products = getProducts();
    products.splice(index, 1);
    saveProducts(products);
    renderProducts();
    renderAdminProducts();
}

function updateCartCount() {
    const count = getCart().length;
    document.querySelectorAll(".cart-count").forEach((element) => {
        element.textContent = count;
    });
}

function addToCart(name, price) {
    const cart = getCart();
    cart.push({ name, price });
    saveCart(cart);
    updateCartCount();
    alert(`${name} imeongezwa kwenye cart!`);
}

function displayCart() {
    const cartItems = document.getElementById("cartItems");
    const totalPrice = document.getElementById("totalPrice");
    const checkoutButton = document.getElementById("checkoutButton");

    if (!cartItems || !totalPrice) return;

    const cart = getCart();
    cartItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-state">Cart yako iko tupu. <a href="products.html">Angalia bidhaa</a></p>';
        totalPrice.innerText = "Total: TZS 0";
        if (checkoutButton) checkoutButton.classList.add("btn-secondary");
        if (checkoutButton) checkoutButton.classList.remove("btn-primary");
        if (checkoutButton) checkoutButton.setAttribute("href", "products.html");
        updateCartCount();
        return;
    }

    cart.forEach((item, index) => {
        total += Number(item.price);
        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong>
                    <p>TZS ${item.price}</p>
                </div>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    totalPrice.innerText = `Total: TZS ${total}`;
    if (checkoutButton) checkoutButton.classList.add("btn-primary");
    if (checkoutButton) checkoutButton.classList.remove("btn-secondary");
    if (checkoutButton) checkoutButton.setAttribute("href", "checkout.html");
    updateCartCount();
}

function removeItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
}

function clearCart() {
    localStorage.removeItem(cartKey);
    displayCart();
    updateCartCount();
}

function displayCheckoutSummary() {
    const itemsContainer = document.getElementById("checkoutItems");
    const totalElement = document.getElementById("checkoutTotal");

    if (!itemsContainer || !totalElement) return;

    const cart = getCart();
    itemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-state">Cart yako iko tupu. <a href="products.html">Angalia bidhaa</a></p>';
        totalElement.innerText = "Total: TZS 0";
        return;
    }

    cart.forEach((item) => {
        total += Number(item.price);
        itemsContainer.innerHTML += `
            <div class="checkout-item">
                <span>${item.name}</span>
                <strong>TZS ${item.price}</strong>
            </div>
        `;
    });

    totalElement.innerText = `Total: TZS ${total}`;
}

function updatePaymentDetails(order, methodId) {
    const paymentDetails = document.getElementById("paymentDetails");
    const method = paymentMethods.find((item) => item.id === methodId) || paymentMethods[0];
    if (!paymentDetails) return;

    paymentDetails.innerHTML = `
        <div class="payment-details-card">
            <h4>Oda #${order.id}</h4>
            <p><strong>Jumla ya malipo:</strong> TZS ${order.total}</p>
            <p><strong>Njia ya malipo:</strong> ${method.label}</p>
            <p>${method.details}</p>
            <p><strong>Taarifa za oda:</strong> ${order.name}, ${order.phone}, ${order.delivery}</p>
            <p>Baada ya kulipa, tuma ujumbe wa uthibitisho kwa admin ili kuweka mchakato wa utoaji.</p>
        </div>
    `;
}

function getLastOrder() {
    const orderId = Number(sessionStorage.getItem("lastOrderId"));
    if (!orderId) return null;
    const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
    return orders.find((order) => order.id === orderId) || null;
}

function loadPaymentConfirmation() {
    const order = getLastOrder();
    const orderDetails = document.getElementById("confirmationOrderDetails");
    const paymentDetails = document.getElementById("confirmationPaymentDetails");
    if (!orderDetails || !paymentDetails) return;

    if (!order) {
        orderDetails.innerHTML = '<p class="empty-state">Hakuna oda ya hivi karibuni. <a href="products.html">Rudi kwenye bidhaa</a>.</p>';
        paymentDetails.innerHTML = "";
        return;
    }

    const methodId = sessionStorage.getItem("lastOrderMethod") || paymentMethods[0].id;
    const method = paymentMethods.find((item) => item.id === methodId) || paymentMethods[0];

    orderDetails.innerHTML = `
        <div class="payment-details-card">
            <h4>Oda #${order.id}</h4>
            <p><strong>Jina:</strong> ${order.name}</p>
            <p><strong>Simu:</strong> ${order.phone}</p>
            <p><strong>Delivery:</strong> ${order.delivery}</p>
            <p><strong>Jumla:</strong> TZS ${order.total}</p>
            <p><strong>Imekamilishwa:</strong> ${order.time}</p>
        </div>
    `;

    paymentDetails.innerHTML = `
        <div class="payment-details-card">
            <h4>Maelezo ya Malipo</h4>
            <p><strong>Njia:</strong> ${method.label}</p>
            <p>${method.details}</p>
            <p>Tuma kwa njia uliyochagua na uhifadhi uthibitisho wa malipo.</p>
        </div>
    `;
}

function showPaymentSection(order) {
    const section = document.getElementById("paymentSection");
    const paymentMethod = document.getElementById("paymentMethod");
    if (!section || !paymentMethod) return;

    section.classList.remove("hidden");
    paymentMethod.value = paymentMethods[0].id;
    sessionStorage.setItem("lastOrderId", order.id);
    sessionStorage.setItem("lastOrderMethod", paymentMethod.value);
    updatePaymentDetails(order, paymentMethod.value);
}

function onPaymentMethodChange() {
    const methodId = document.getElementById("paymentMethod")?.value;
    const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
    const lastOrder = orders[orders.length - 1];
    if (!lastOrder || !methodId) return;
    sessionStorage.setItem("lastOrderMethod", methodId);
    updatePaymentDetails(lastOrder, methodId);
}

function copyPaymentDetails() {
    const paymentDetails = document.getElementById("paymentDetails");
    if (!paymentDetails) return;
    const text = paymentDetails.innerText;
    const orderMessage = document.getElementById("orderMessage");

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            if (orderMessage) orderMessage.innerText = "Maelezo ya malipo yamekopywa. Tuma kwa malipo au admin.";
        }).catch(() => {
            if (orderMessage) orderMessage.innerText = "Haiwezekani kunakili maelezo kwa sasa. Rudia tena au nakili mkono.";
        });
        return;
    }

    try {
        const range = document.createRange();
        range.selectNodeContents(paymentDetails);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("copy");
        selection.removeAllRanges();
        if (orderMessage) orderMessage.innerText = "Maelezo ya malipo yamekopywa. Tuma kwa malipo au admin.";
    } catch (error) {
        if (orderMessage) orderMessage.innerText = "Haiwezekani kunakili maelezo kwa sasa. Rudia tena au nakili mkono.";
    }
}

function toggleMobileMenu() {
    const nav = document.querySelector(".main-nav");
    if (!nav) return;
    nav.classList.toggle("open");
}

function goToPaymentConfirmation() {
    window.location.href = "payment-confirmation.html";
}

function placeOrder(event) {
    event.preventDefault();
    const name = document.getElementById("name")?.value || "";
    const phone = document.getElementById("phone")?.value || "";
    const delivery = document.getElementById("delivery")?.value || "pickup";
    const orderMessage = document.getElementById("orderMessage");
    const cart = getCart();

    if (cart.length === 0) {
        if (orderMessage) orderMessage.innerText = "Cart yako iko tupu. Tafadhali ongeza bidhaa kwanza.";
        return;
    }

    const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
    const order = {
        id: Date.now(),
        name,
        phone,
        delivery,
        total,
        items: cart,
        time: new Date().toLocaleString(),
    };

    const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
    orders.push(order);
    localStorage.setItem(ordersKey, JSON.stringify(orders));
    localStorage.removeItem(cartKey);
    sessionStorage.setItem("lastOrderId", order.id);
    sessionStorage.setItem("lastOrderMethod", paymentMethods[0].id);

    if (orderMessage) orderMessage.innerText = `Asante ${name}! Oda yako imepokelewa. Chagua njia ya malipo hapa chini.`;
    updateCartCount();
    displayCheckoutSummary();
    showPaymentSection(order);
    displayAdminNotification(order);
}

function getAdminWhatsAppNumber() {
    return adminPhone.startsWith("0") ? `254${adminPhone.slice(1)}` : adminPhone;
}

function formatAdminMessage(order) {
    return `Oda #${order.id}: ${order.name}, simu ${order.phone}, delivery ${order.delivery}, total TZS ${order.total}.`;
}

function displayAdminNotification(order) {
    const adminNotification = document.getElementById("adminNotification");
    if (!adminNotification) return;

    const whatsappNumber = getAdminWhatsAppNumber();
    const message = formatAdminMessage(order);
    const encoded = encodeURIComponent(message);

    adminNotification.classList.remove("hidden");
    adminNotification.innerHTML = `
        <div class="admin-notification-card">
            <h4>Mawasiliano kwa Admin</h4>
            <p>Arifa za oda zitumwe kwa namba ya admin:</p>
            <p><strong>${adminPhone}</strong></p>
            <div class="admin-notification-actions">
                <a href="https://wa.me/${whatsappNumber}?text=${encoded}" target="_blank" rel="noreferrer" class="btn btn-primary">Tuma WhatsApp kwa Admin</a>
                <button type="button" class="btn btn-secondary" onclick="copyAdminNumber()">Nakili namba ya Admin</button>
            </div>
            <p class="small-note">Ujumbe utakajazwa na maelezo ya oda yako ili admin apate taarifa kwa haraka.</p>
        </div>
    `;
}

function copyAdminNumber() {
    const adminNotification = document.getElementById("adminNotification");
    const orderMessage = document.getElementById("orderMessage");
    if (!adminNotification) return;
    const adminText = `Admin number: ${adminPhone}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(adminText).then(() => {
            if (orderMessage) orderMessage.innerText = "Namba ya admin imekopywa. Tuma ujumbe sasa.";
        }).catch(() => {
            if (orderMessage) orderMessage.innerText = "Haiwezekani kunakili namba kwa sasa. Nakili kwa mkono.";
        });
        return;
    }

    try {
        const textarea = document.createElement("textarea");
        textarea.value = adminText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        if (orderMessage) orderMessage.innerText = "Namba ya admin imekopywa. Tuma ujumbe sasa.";
    } catch (error) {
        if (orderMessage) orderMessage.innerText = "Haiwezekani kunakili namba kwa sasa. Nakili kwa mkono.";
    }
}

function loadOrders() {
    const ordersDiv = document.getElementById("orders");
    if (!ordersDiv) return;

    const orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
    ordersDiv.innerHTML = "";

    if (orders.length === 0) {
        ordersDiv.innerHTML = "<p>Hakuna orders bado.</p>";
        return;
    }

    orders.forEach((order) => {
        ordersDiv.innerHTML += `
            <div class="order-box">
                <h4>Jina: ${order.name}</h4>
                <p>Simu: ${order.phone}</p>
                <p>Delivery: ${order.delivery}</p>
                <p>Total: TZS ${order.total}</p>
                <p>Time: ${order.time}</p>
            </div>
        `;
    });
}

function clearOrders() {
    localStorage.removeItem(ordersKey);
    loadOrders();
}

function togglePasswordVisibility() {
    const input = document.getElementById("password");
    const button = document.querySelector(".password-toggle");
    if (!input || !button) return;

    if (input.type === "password") {
        input.type = "text";
        button.textContent = "Ficha";
    } else {
        input.type = "password";
        button.textContent = "Onyesha";
    }
}

function login(event) {
    if (event) event.preventDefault();
    const password = document.getElementById("password")?.value.trim() || "";
    const msg = document.getElementById("msg");

    if (password === adminPassword) {
        sessionStorage.setItem("logged", "true");
        window.location.href = "admin.html";
        return;
    }

    if (msg) msg.innerText = "Password sio sahihi!";
}

function logout() {
    sessionStorage.removeItem("logged");
    window.location.href = "admin-login.html";
}

window.addEventListener("DOMContentLoaded", () => {
    initializeProducts();
    renderProducts();
    renderAdminProducts();
    updateCartCount();
    displayCart();
    displayCheckoutSummary();
    loadOrders();
    loadPaymentConfirmation();
});
