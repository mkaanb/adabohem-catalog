// Mobile Menu //

function setupMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const dropdownToggle = document.querySelector(".dropdown-toggle"); // Products link

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active"); // Show/hide menu
    });

    // Close menu when clicking a link
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
      });
    });
  }
}

// Translation Functions //

function setupTranslations() {
  const languageToggle = document.getElementById("language-toggle");
  if (!languageToggle) return; // Prevent errors if flag is missing

  let currentLang = localStorage.getItem("selectedLanguage") || "tr"; // Default to Turkish

  function applyLanguage(lang) {
    document.querySelectorAll("[data-key]").forEach((element) => {
      const key = element.getAttribute("data-key");
      if (translations[lang][key]) {
        element.innerHTML = translations[lang][key];
      }
    });

    // Change flag image
    languageToggle.src =
      lang === "tr" ? "images/uk-flag.png" : "images/tr-flag.png";
    languageToggle.alt =
      lang === "tr" ? "Switch to English" : "Switch to Turkish";

    // Save language to localStorage
    localStorage.setItem("selectedLanguage", lang);
  }

  function switchLanguage() {
    currentLang = currentLang === "tr" ? "en" : "tr"; // Toggle language
    applyLanguage(currentLang);

    // Notify other pages to update their language without reloading
    localStorage.setItem("languageChanged", Date.now()); // Trigger event
  }

  // Apply saved language on page load
  applyLanguage(currentLang);

  // Add click event to the flag icon
  languageToggle.addEventListener("click", switchLanguage);

  // Listen for language changes from other pages
  window.addEventListener("storage", (event) => {
    if (event.key === "languageChanged") {
      const newLang = localStorage.getItem("selectedLanguage");
      if (newLang && newLang !== currentLang) {
        applyLanguage(newLang); // Apply new language without reloading
        currentLang = newLang; // Update current language
      }
    }
  });
}

// Fetch Data //

async function fetchCatalogData() {
  try {
    const response = await fetch(
      "https://catalog-data-fetch.onrender.com/api/catalog"
    );
    const data = await response.json();
    console.log("Fetched Catalog Data:", data);

    var sections = {
      "Yeni Ürünler": [],
      "Çok Satanlar": [],
      "Nargile Takımı": [],
      Lüle: [],
      Közlük: [],
      Smogmoon: [],
      Smyrna: [],
      Jibiar: [],
      "Al Fakher": [],
      Marpuç: [],
      "Diğer Aksesuarlar": [],
    };

    data.forEach((item) => {
      if (item.category in sections) {
        sections[item.category].push(item);
      } else {
        sections["Diğer Aksesuarlar"].push(item);
      }
    });

    // Store sections in localStorage
    localStorage.setItem("catalogSections", JSON.stringify(sections));
  } catch (error) {
    console.error("Error fetching catalog data:", error);
  }
}

// Set Category Data //

function setCategoryData() {
  // Get the current HTML page name
  const currentPage = window.location.pathname.split("/").pop();

  // Define category mappings based on HTML file names
  const categoryMap = {
    "hookahs.html": "Nargile Takımı",
    "bowls.html": "Lüle",
    "hmds.html": "Közlük",
    "hoses.html": "Marpuç",
    "smogmoon.html": "Smogmoon",
    "smyrna.html": "Smyrna",
    "jibiar.html": "Jibiar",
    "alfakher.html": "Al Fakher",
    "others.html": "Diğer Aksesuarlar",
  };

  // Get the category from the mapping
  const category = categoryMap[currentPage];

  if (category) {
    loadCategoryData(category);
  } else {
    console.warn("No matching category found for this page.");
  }
}

// Load Category Data //

async function loadCategoryData(category) {
  const storedSections = localStorage.getItem("catalogSections");

  if (storedSections) {
    const sections = JSON.parse(storedSections);
    if (sections[category] && Array.isArray(sections[category]) && sections[category].length > 0) {
      console.log(`Data for ${category}:`, sections[category]);
      updateCatalog(sections, category);
    } else {
      console.warn(`No data found for category: ${category}`);
    }
  } else {
    console.warn("Catalog data not available, fetching again...");
    await fetchCatalogData(); // Fetch again if not stored
  }
}

// Update Category Data //

function updateCatalog(sections, category) {
  const catalogContainer = document.querySelector(".product-list");
  catalogContainer.innerHTML = ""; // Clear existing catalog

  if (!sections[category]) {
    console.warn(`No data found for category: ${category}`);
    return;
  }

  sections[category].forEach((item) => {
    const productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.setAttribute("onclick", `openPopup('${item.image}')`);

    productDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="product-image">
            <div class="product-info">
            <h3>${item.name}</h3>
            <p class="price">${item.price}₺</p>
            ${
              item.status === "Stokta Var"
                ? `<p class="stock in-stock" data-key="stock">${item.status}</p>`
                : `<p class="stock out-of-stock" data-key="no-stock">${item.status}</p>`
            }
            </div>
        `;

    catalogContainer.appendChild(productDiv);
  });
}

// Default Header&Footer Inclusion //

function loadComponent(url, elementId, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(elementId).innerHTML = html;
      if (callback) callback(); // Ensure scripts work after content loads
    })
    .catch((error) => console.error(`Error loading ${url}:`, error));
}

// Image Pop-Ups //

function openPopup(imageSrc) {
  const popup = document.getElementById("popup");
  const popupImg = document.getElementById("popup-img");

  popupImg.src = imageSrc; // Set the image source
  popup.style.display = "flex"; // Show popup

  // Close when clicking outside the image
  popup.addEventListener("click", function (event) {
    if (event.target === popup) {
      // Check if click is on background, not image
      closePopup();
    }
  });
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Video Convert //

function updateVideoSource() {
  const video = document.getElementById("hero-video");
  const source = document.getElementById("video-source");

  if (window.innerWidth <= 768) {
    source.src = "images/hero-mobile.mp4"; // Mobile video
  } else {
    source.src = "images/hero.mp4"; // Desktop video
  }

  video.load(); // Reload video to apply changes
}

// Category Banners //

function applyBackgroundImages() {
  document.querySelectorAll(".category-name").forEach(section => {
    const isMobile = window.innerWidth <= 768;
    const bgImage = isMobile ? section.dataset.bgMobile : section.dataset.bgDesktop;

    if (bgImage) {
      section.style.backgroundImage = `url('${bgImage}')`;
    }
  });
}

// Age Verification //

function showAgeVerificationPopup() {
  // Check if the user has already answered the age verification
  if (!localStorage.getItem('ageVerified')) {
    // Show the pop-up if not verified
    document.getElementById('age-verification-popup').style.display = 'flex';
    document.body.classList.add('blurred'); // Add the blur effect to the body
    console.log(localStorage.getItem('ageVerified'));

    // If the user clicks "Yes"
    document.getElementById('yes-button').addEventListener('click', function() {
      localStorage.setItem('ageVerified', 'true'); // Store that the user has verified their age
      document.getElementById('age-verification-popup').style.display = 'none'; // Hide the pop-up
      document.body.classList.remove('blurred'); // Remove the blur effect
    });

    // If the user clicks "No"
    document.getElementById('no-button').addEventListener('click', function() {
      window.history.back(); // Go back to the previous page
    });
  }
}

// Translations //

const translations = {
  tr: {
    title: "AdaBohem - Anasayfa",
    home: "Anasayfa",
    products: "Ürünler",
    contact: "İletişim",
    hookahs: "Nargile Takımları",
    bowls: "Lüleler",
    hmds: "Közlükler",
    hoses: "Marpuçlar",
    others: "Diğer Aksesuarlar",
    smyrna: "Smyrna",
    smogmoon: "Smogmoon",
    alfakher: "Al Fakher",
    jibiar: "Jibiar",
    stock: "Stokta Var",
    "no-stock": "Tükendi",
    "contact-store1": "Merkez Ofis & Nargile Satış Mağazası",
    "contact-store2": "Girne Nargile Satış Mağazası",
    phone: "Telefon:",
    address: "Adres:",
    email: "E-Mail:",
    footer:
      "&copy; 2025 AdaBohem. <br>Tüm Hakları Saklıdır.<br> AdaBohem bir <a href='http://www.bahcivanlar.com.tr' target='_blank' class='bahcivanlar-link'>Bahçıvanlar Grup</a> şirketidir.",
  },
  en: {
    title: "AdaBohem - Homepage",
    home: "Home",
    products: "Products",
    contact: "Contact",
    hookahs: "Hookahs",
    bowls: "Bowls",
    hmds: "HMDs",
    hoses: "Hoses",
    others: "Other Accessories",
    smyrna: "Smyrna",
    smogmoon: "Smogmoon",
    alfakher: "Al Fakher",
    jibiar: "Jibiar",
    stock: "In-Stock",
    "no-stock": "Out-of-Stock",
    "contact-store1": "Head Office & Hookah Sales Store",
    "contact-store2": "Girne Hookah Sales Store",
    phone: "Phone:",
    address: "Address:",
    email: "Email:",
    footer:
      "&copy; 2025 AdaBohem. <br>All Rights Reserved.<br> AdaBohem is a <a href='http://www.bahcivanlar.com.tr' target='_blank' class='bahcivanlar-link'>Bahçıvanlar Group</a> company.",
  },
};


function loadSpinner(){
// Ensure all scripts are loaded before hiding the spinner
window.onload = function() {
  let loader = document.getElementById("loading-screen");
  loader.style.opacity = "0";  // Smooth fade-out effect
  setTimeout(() => {
      loader.style.display = "none"; // Hide completely
  }, 600); // Wait for fade-out animation
};
}