// ====================
// Login Status
// ====================

let isLoggedIn = false;
let pendingProduct = null;


// ====================
// Search
// ====================

const searchInput = document.getElementById("searchInput");
const productCards = document.querySelectorAll(".product-card");
const filterButtons = document.querySelectorAll(".filter-btn");
const noResults = document.getElementById("noResults");

let activeCategory = "all";


// One function checks BOTH the search text and the category

function filterProducts() {

    const searchValue =
        searchInput.value.toLowerCase().trim();

    let visibleCount = 0;

    productCards.forEach(function (card) {

        const productName =
            card.querySelector("h3").textContent.toLowerCase();

        const category =
            card.querySelector(".category").textContent.toLowerCase().trim();

        const matchesSearch =
            productName.includes(searchValue) ||
            category.includes(searchValue);

        const matchesCategory =
            activeCategory === "all" ||
            category === activeCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = "";
            visibleCount++;
        } else {
            card.style.display = "none";
        }

    });

    // Show a message when nothing matches

    if (visibleCount === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

}


// Typing in the search box

searchInput.addEventListener("input", filterProducts);


// Clicking a category button

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (otherButton) {
            otherButton.classList.remove("active");
        });

        button.classList.add("active");

        activeCategory = button.dataset.category;

        filterProducts();

    });

});


// ====================
// Favorite
// ====================

const favoriteButtons = document.querySelectorAll(".favorite");

favoriteButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        button.classList.toggle("active");

        if (button.classList.contains("active")) {
            button.textContent = "♥";
        } else {
            button.textContent = "♡";
        }

    });

});


// ====================
// Cart
// ====================

let cart = [];

const cartButtons = document.querySelectorAll(".add-cart");

cartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Check Login First

        if (!isLoggedIn) {

            const card = button.closest(".product-card");

            const productName =
                card.querySelector("h3").textContent;

            const priceText =
                card.querySelector(".price").textContent;

            const price =
                parseFloat(priceText.replace("$", ""));

            pendingProduct = {
                name: productName,
                price: price,
                quantity: 1
            };

            loginBox.style.display = "block";

            document.getElementById("loginName").focus();

            return;
        }


        // Get Product

        const card = button.closest(".product-card");

        const productName =
            card.querySelector("h3").textContent;

        const priceText =
            card.querySelector(".price").textContent;

        const price =
            parseFloat(priceText.replace("$", ""));


        const product = {
            name: productName,
            price: price,
            quantity: 1
        };


           addToCart(product);

        displayCart();

        showToast(product.name + " added to cart ✓");

    });

});


// ====================
// Display Cart
// ====================

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");


function displayCart() {

    cartItems.innerHTML = "";

    document.getElementById("cartMessage").textContent = "";

    let total = 0;


    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

    }


    cart.forEach(function (product) {

        if (!product.quantity) {
            product.quantity = 1;
        }


        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");


        cartItem.innerHTML = `
            <span>
                ${product.name}
            </span>

            <span>

                $${product.price * product.quantity}

                <button class="quantity-btn minus">
                    −
                </button>

                <span class="quantity">
                    ${product.quantity}
                </span>

                <button class="quantity-btn plus">
                    +
                </button>

                <button class="remove-cart">
                    Remove
                </button>

            </span>
        `;


        cartItems.appendChild(cartItem);


        // Plus

        const plusButton =
            cartItem.querySelector(".plus");

        plusButton.addEventListener("click", function () {

            product.quantity++;

            displayCart();

        });


        // Minus

        const minusButton =
            cartItem.querySelector(".minus");

        minusButton.addEventListener("click", function () {

            if (product.quantity > 1) {

                product.quantity--;

                displayCart();

            }

        });


        // Remove

        const removeButton =
            cartItem.querySelector(".remove-cart");

        removeButton.addEventListener("click", function () {

            const index = cart.indexOf(product);

            cart.splice(index, 1);

            displayCart();

        });


           total += product.price * product.quantity;

    });


    cartTotal.textContent = total;


    // Update the number on the cart icon

    let itemCount = 0;

    cart.forEach(function (product) {
        itemCount += product.quantity;
    });

    const cartCount = document.getElementById("cartCount");

    cartCount.textContent = itemCount;

    if (itemCount === 0) {
        cartCount.style.display = "none";
    } else {
        cartCount.style.display = "block";
    }

}

// ====================
// Open / Close Cart
// ====================

const cartIcon = document.getElementById("cartIcon");
const cartBox = document.getElementById("cartBox");

cartIcon.addEventListener("click", function () {

    if (cartBox.style.display === "block") {

        cartBox.style.display = "none";

    } else {

        cartBox.style.display = "block";

        displayCart();

    }

});


// ====================
// Login
// ====================

const loginLink =
    document.getElementById("loginLink");

const loginBox =
    document.getElementById("loginBox");

const loginButton =
    document.getElementById("loginButton");


// ====================
// Open Login
// ====================

loginLink.addEventListener("click", function () {

    loginBox.style.display = "block";

});


// ====================
// Login Button
// ====================

loginButton.addEventListener("click", function () {

    const name =
        document.getElementById("loginName").value.trim();

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();

    const loginMessage =
        document.getElementById("loginMessage");


    // Check Empty Fields

    if (
        name === "" ||
        email === "" ||
        password === ""
    ) {

        loginMessage.textContent =
            "Please enter your name, email and password.";

        return;

    }


    // Login Successful

    isLoggedIn = true;


    loginMessage.textContent =
        "Login successful! Welcome " + name;


    // Hide Login Link

    loginLink.style.display = "none";


    // Show User Greeting

    const userGreeting =
        document.getElementById("userGreeting");

    userGreeting.textContent =
        "Hello, " + name;

    userGreeting.style.display =
        "inline";


    // Show Logout

    const logoutLink =
        document.getElementById("logoutLink");

    logoutLink.style.display =
        "inline";


    // Close Login Box

    loginBox.style.display =
        "none";
        
    // Show Cart Icon

    cartIcon.style.display = "inline";

    // Add Pending Product

    if (pendingProduct !== null) {

             addToCart(pendingProduct);

        showToast(pendingProduct.name + " added to cart ✓");

        pendingProduct = null;

        displayCart();
    }

});


// ====================
// Logout
// ====================

const logoutLink =
    document.getElementById("logoutLink");


logoutLink.addEventListener("click", function () {

    isLoggedIn = false;


    // Show Login

    loginLink.style.display =
        "inline";


    // Hide Greeting

    document.getElementById("userGreeting").style.display =
        "none";


    // Hide Logout

    logoutLink.style.display =
        "none";


       // Close Cart

    cartBox.style.display =
        "none";


    // Close Checkout Form and Confirmation

    checkoutBox.style.display =
        "none";

    confirmBox.style.display =
        "none";


    // Clear the cart and update the total

    cart = [];

    pendingProduct = null;

    displayCart();

});
// ====================
// Scroll To Products
// ====================

function scrollToProducts() {

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });

}


// ====================
// Order Confirmation
// ====================

const confirmBox = document.getElementById("confirmBox");
const backToShopButton = document.getElementById("backToShopButton");


// Back to Shop

backToShopButton.addEventListener("click", function () {

    confirmBox.style.display = "none";

    scrollToProducts();

});


// ====================
// Checkout Form
// ====================

const checkoutButton = document.getElementById("checkoutButton");
const checkoutBox = document.getElementById("checkoutBox");
const backToCartButton = document.getElementById("backToCartButton");
const placeOrderButton = document.getElementById("placeOrderButton");
const cartMessage = document.getElementById("cartMessage");
const checkoutMessage = document.getElementById("checkoutMessage");


// Proceed to Checkout (check that the cart is not empty)

checkoutButton.addEventListener("click", function () {

    if (cart.length === 0) {

        cartMessage.textContent =
            "Your cart is empty. Please add a product first.";

        return;

    }

    cartMessage.textContent = "";
    checkoutMessage.textContent = "";

    cartBox.style.display = "none";

    checkoutBox.style.display = "block";

    document.getElementById("checkoutName").focus();

});


// Back to Cart

backToCartButton.addEventListener("click", function () {

    checkoutMessage.textContent = "";

    checkoutBox.style.display = "none";

    cartBox.style.display = "block";

    displayCart();

});


// Place Order (validation only for now)

placeOrderButton.addEventListener("click", function () {

    const customerName =
        document.getElementById("checkoutName").value.trim();

    const customerPhone =
        document.getElementById("checkoutPhone").value.trim();

    const customerAddress =
        document.getElementById("checkoutAddress").value.trim();


    // Cart must not be empty

    if (cart.length === 0) {

        checkoutMessage.textContent =
            "Your cart is empty. Please add a product first.";

        return;

    }


    // Name

    if (customerName.length < 2) {

        checkoutMessage.textContent =
            "Please enter your full name.";

        return;

    }


    // Phone: digits, spaces, + or -, from 7 to 15 characters

    const phonePattern = /^[0-9+\s-]{7,15}$/;

    if (!phonePattern.test(customerPhone)) {

        checkoutMessage.textContent =
            "Please enter a valid phone number (7 to 15 digits).";

        return;

    }


    // Address

    if (customerAddress.length < 5) {

        checkoutMessage.textContent =
            "Please enter your delivery address.";

        return;

    }


        // All good: create the order

    checkoutMessage.textContent = "";


    // Calculate the total BEFORE clearing the cart

    let orderTotalValue = 0;

    cart.forEach(function (product) {

        orderTotalValue += product.price * product.quantity;

    });


    // Simple order number (demo only)

    const orderNumber =
        "ECL-" + Math.floor(100000 + Math.random() * 900000);


    // Fill the confirmation box

    document.getElementById("orderNumber").textContent =
        orderNumber;

    document.getElementById("orderTotal").textContent =
        orderTotalValue;

    document.getElementById("orderCustomer").textContent =
        customerName + " (" + customerPhone + ")";


    // Clear the cart and update the total

    cart = [];

    displayCart();


    // Clear the form fields

    document.getElementById("checkoutName").value = "";
    document.getElementById("checkoutPhone").value = "";
    document.getElementById("checkoutAddress").value = "";


    // Show confirmation

    checkoutBox.style.display = "none";

    confirmBox.style.display = "block";
});
// ====================
// Close Login Box
// ====================

const loginClose = document.getElementById("loginClose");

loginClose.addEventListener("click", function () {

    loginBox.style.display = "none";

});
// ====================
// Toast Message
// ====================

let toastTimer;

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {

        toast.classList.remove("show");

    }, 2000);

}
// ====================
// Add To Cart (merge same product)
// ====================

function addToCart(newProduct) {

    const existingProduct = cart.find(function (item) {

        return item.name === newProduct.name;

    });

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push(newProduct);

    }

}
// ====================
// Product Details Window
// ====================

const productModal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalCategory = document.getElementById("modalCategory");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalAddButton = document.getElementById("modalAddButton");
const modalClose = document.getElementById("modalClose");

let modalCard = null;


// Short descriptions. The text on the left must match the
// product name on the card exactly (same letters, same capitals).

const productDescriptions = {
    "Gold Ring Set": "A set of stacked rings in a warm gold tone. Wear them together or mix and match.",
    "Crystal Pendant Necklace": "A delicate necklace with a sparkling crystal pendant that sits at the collarbone.",
    "Heart bracelet": "A bracelet with heart-shaped details, simple enough for everyday wear.",
    "Gold Geometric Drop Earrings": "Drop earrings with a bold geometric shape, easy to dress up or down.",
    "Black Velvet Bow Tassel Earrings": "Earrings with a black velvet bow and a long tassel for a soft, elegant look.",
    "Minimal Gold Ring": "A simple ring made for everyday wear.",
    "Vintage Watch Collection": "A collection of watches with a classic, vintage look.",
    "Gold Chain Bracelet": "A chain bracelet with a classic look that goes with everything."
};


// Open the window and fill it from the clicked card

function openProductModal(card) {

    modalCard = card;

    const cardName =
        card.querySelector("h3").textContent.trim();

    const cardImage =
        card.querySelector(".product-image img");

    modalImage.src = cardImage.src;

    modalImage.alt = cardName;

    modalName.textContent = cardName;

    modalCategory.textContent =
        card.querySelector(".category").textContent.trim();

    modalPrice.textContent =
        card.querySelector(".price").textContent.trim();

    modalDescription.textContent =
        productDescriptions[cardName] ||
        "A beautiful piece from the ECLIPSE collection.";

    productModal.classList.add("show");

}


function closeProductModal() {

    productModal.classList.remove("show");

    modalCard = null;

}


// Click on a card (but not on its buttons) opens the window

productCards.forEach(function (card) {

    card.addEventListener("click", function (event) {

        if (event.target.closest("button")) {
            return;
        }

        openProductModal(card);

    });

});


// Add to Cart inside the window uses the card's own button

modalAddButton.addEventListener("click", function () {

    const card = modalCard;

    closeProductModal();

    if (card) {
        card.querySelector(".add-cart").click();
    }

});


// Close with the X button

modalClose.addEventListener("click", closeProductModal);


// Close by clicking the dark area outside the window

productModal.addEventListener("click", function (event) {

    if (event.target === productModal) {
        closeProductModal();
    }

});


// Close with the Escape key

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeProductModal();
    }

});