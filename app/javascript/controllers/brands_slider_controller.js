import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["track"];

  connect() {
    console.log("Brands Slider controller connecté");
    this.fetchBrands();
  }

  async fetchBrands() {
    const apiUrl = "/api/v1/brands_only"; // Votre endpoint API

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const brands = await response.json();
      this.renderBrands(brands);
    } catch (error) {
      console.error("Erreur lors de la récupération des marques:", error);
      this.trackTarget.innerHTML = "<p style='color: #cc0000; text-align: center; width: 100%;'>Impossible de charger les marques. Veuillez réessayer plus tard.</p>";
    }
  }

  renderBrands(brands) {
    if (!brands || brands.length === 0) {
      this.trackTarget.innerHTML = "<p style='color: #666; text-align: center; width: 100%;'>Aucune marque à afficher pour le moment.</p>";
      return;
    }

    // Dupliquer les marques pour créer un effet de boucle infini fluide
    // Nous dupliquons le tableau pour que l'animation CSS puisse boucler sans "saut"
    // Si vous avez beaucoup de marques, vous pouvez ajuster le nombre de duplications (ex: x3, x4)
    const duplicatedBrands = [...brands, ...brands]; 

    const brandHtml = duplicatedBrands.map(brand => `
      <div class="brand-logo-item">
        <img src="${brand.image_url}" alt="${brand.name}" />
      </div>
    `).join('');

    this.trackTarget.innerHTML = brandHtml;
  }
}