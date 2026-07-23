const products = [
  {
    id: 1,
    name: "Noir Essential Tee",
    price: "$48",
    oldPrice: "$68",
    rating: "4.8",
    badge: "-20%",
    image: "assets/images/wearhaat-men.jpg",
    tag: "New Arrival",
    description: "Ultra-soft premium cotton with a structured drape."
  },
  {
    id: 2,
    name: "Cloudline Overshirt",
    price: "$88",
    oldPrice: "$118",
    rating: "4.9",
    badge: "Hot",
    image: "assets/images/wearhaat-products.jpg",
    tag: "Best Seller",
    description: "Layered elegance built for day-to-night transitions."
  },
  {
    id: 3,
    name: "Studio Wide Trousers",
    price: "$96",
    oldPrice: "$124",
    rating: "4.7",
    badge: "-15%",
    image: "assets/images/wearhaat-men.jpg",
    tag: "Trending",
    description: "Relaxed luxury silhouette with clean tailored lines."
  },
  {
    id: 4,
    name: "Electric Blue Wallet",
    price: "$38",
    oldPrice: "$52",
    rating: "4.9",
    badge: "Limited",
    image: "assets/images/wearhaat-products.jpg",
    tag: "Accessory",
    description: "Signature accent piece with bold modern contrast."
  }
];

const body = document.body;
const pageLoader = document.getElementById("pageLoader");
const themeToggle = document.getElementById("themeToggle");
const navToggle = document.getElementById("navToggle");
const navPanel = document.getElementById("navPanel");
const cartCountElements = document.querySelectorAll("#cartCount");

const initialTheme = localStorage.getItem("wearhaat-theme") || "dark";
body.dataset.theme = initialTheme;

window.addEventListener("load", () => {
  setTimeout(() => pageLoader?.classList.add("hidden"), 650);
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
  body.dataset.theme = nextTheme;
  localStorage.setItem("wearhaat-theme", nextTheme);
});

navToggle?.addEventListener("click", () => {
  navPanel.classList.toggle("open");
  navToggle.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navPanel?.classList.remove("open"));
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const renderProducts = (selector, items) => {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = items
    .map(
      (product) => `
        <article class="product-card glass reveal">
          <div class="product-media">
            <span class="product-badge">${product.badge}</span>
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span>${product.tag}</span>
              <strong>★ ${product.rating}</strong>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price-row">
              <div>
                <strong>${product.price}</strong>
                <span>${product.oldPrice}</span>
              </div>
              <div class="product-actions">
                <button class="text-button" data-quick-view="${product.id}">Quick View</button>
                <button class="button button-primary button-small" data-add-cart="${product.id}">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  container.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
};

renderProducts("#productGrid", products);
renderProducts("#relatedGrid", products.slice(0, 3));

const quickViewModal = document.getElementById("quickViewModal");
const modalContent = document.getElementById("modalContent");

const openModal = (productId) => {
  const product = products.find((item) => item.id === Number(productId));
  if (!product || !quickViewModal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="modal-image">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="modal-copy">
      <span class="eyebrow">${product.tag}</span>
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <div class="rating-line"><span>★★★★★</span><p>${product.rating} premium rating</p></div>
      <div class="price-line"><strong>${product.price}</strong><span>${product.oldPrice}</span><em>${product.badge}</em></div>
      <div class="cta-stack">
        <button class="button button-primary wide" data-add-cart="${product.id}">Add to Cart</button>
        <a class="button button-secondary wide" href="product.html">Open Product Page</a>
      </div>
    </div>
  `;

  quickViewModal.classList.add("active");
  quickViewModal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  quickViewModal?.classList.remove("active");
  quickViewModal?.setAttribute("aria-hidden", "true");
};

document.addEventListener("click", (event) => {
  const quickViewButton = event.target.closest("[data-quick-view]");
  const addCartButton = event.target.closest("[data-add-cart]");
  const closeButton = event.target.closest("[data-close-modal]");

  if (quickViewButton) {
    openModal(quickViewButton.dataset.quickView);
  }

  if (addCartButton) {
    cartCountElements.forEach((counter) => {
      counter.textContent = String(Number(counter.textContent) + 1);
      counter.classList.add("pulse");
      setTimeout(() => counter.classList.remove("pulse"), 400);
    });
  }

  if (closeButton) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

document.querySelectorAll(".newsletter-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    if (!button) return;
    button.textContent = "Subscribed";
    button.disabled = true;
  });
});

const mainProductImage = document.getElementById("mainProductImage");
document.querySelectorAll(".thumb").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    document.querySelectorAll(".thumb").forEach((item) => item.classList.remove("active"));
    thumb.classList.add("active");
    if (mainProductImage && thumb.dataset.image) {
      mainProductImage.src = thumb.dataset.image;
    }
  });
});

document.querySelectorAll(".option-chip, .color-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const siblings = chip.parentElement?.querySelectorAll(".option-chip, .color-chip");
    siblings?.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
  });
});

document.getElementById("addToCartProduct")?.addEventListener("click", () => {
  cartCountElements.forEach((counter) => {
    counter.textContent = String(Number(counter.textContent) + 1);
  });
});
