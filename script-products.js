document.addEventListener("DOMContentLoaded", () => {
   setCategoryData();       // Set Data
   setupMobileMenu();       // Init Mobile
   setupTranslations();     // Init Translations
   applyBackgroundImages();
   showAgeVerificationPopup();
});

window.addEventListener("resize", applyBackgroundImages);