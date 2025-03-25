document.addEventListener("DOMContentLoaded", () => {
    loadSpinner();
    fetchCatalogData();       //Fetch Data
    setupMobileMenu();    // Re-initialize mobile menu after loading
    setupTranslations();  // Re-apply translations after loading
    showAgeVerificationPopup();
});

window.addEventListener("load", updateVideoSource);
window.addEventListener("resize", updateVideoSource);