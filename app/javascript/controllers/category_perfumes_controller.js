import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["categoryTitle", "categorySlogan", "perfumesGrid", "pagination"];
  static values = { category: String }; // Pour récupérer la catégorie depuis le HTML

  allPerfumes = [];
  currentPage = 1;
  perfumesPerPage = 12; // Nombre de parfums à afficher par page

  connect() {
    console.log("Category Perfumes controller connecté pour la catégorie:", this.categoryValue);
    this.categoryTitleTarget.textContent = `Parfums ${this.capitalizeFirstLetter(this.categoryValue)}`;
    this.fetchPerfumes();
  }

  async fetchPerfumes() {
    const apiUrl = `/api/v1/parfums`; // Votre endpoint qui retourne TOUS les parfums

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Filtrer les parfums par la catégorie reçue dans les params de l'URL
      this.allPerfumes = data.filter(perfume =>
        perfume.category && perfume.category.toLowerCase() === this.categoryValue.toLowerCase()
      );

      if (this.allPerfumes.length === 0) {
        this.perfumesGridTarget.innerHTML = "<p class='no-perfumes-message'>Aucun parfum trouvé pour cette catégorie pour le moment.</p>";
        this.paginationTarget.innerHTML = ''; // Cache la pagination
        return;
      }

      this.renderPerfumes(); // Affiche la première page de parfums filtrés
      this.renderPagination(); // Affiche les contrôles de pagination
    } catch (error) {
      console.error("Erreur lors de la récupération des parfums par catégorie:", error);
      this.perfumesGridTarget.innerHTML = "<p class='error-message'>Impossible de charger les parfums. Veuillez réessayer plus tard.</p>";
      this.categoryTitleTarget.textContent = "Catégorie Inconnue";
      this.categorySloganTarget.textContent = "Une erreur est survenue lors du chargement.";
    }
  }

  renderPerfumes() {
    const startIndex = (this.currentPage - 1) * this.perfumesPerPage;
    const endIndex = startIndex + this.perfumesPerPage;
    const perfumesToDisplay = this.allPerfumes.slice(startIndex, endIndex);

    const perfumeHtml = perfumesToDisplay.map(perfume => {
      // Utilise l'URL d'image de l'API ou un placeholder générique si non disponible
      const imageUrl = perfume.image_url || "/placeholder.svg?height=250&width=250&text=Parfum";
      
      // Détermine le statut de disponibilité et la classe CSS associée
      const availabilityStatus = perfume.disponible ? 'Disponible' : 'Rupture de stock';
      const availabilityClass = perfume.disponible ? 'perfume-availability-badge--available' : 'perfume-availability-badge--unavailable';

      return `
        <div class="perfume-card">
          <a href="/parfums/${perfume.id}" class="perfume-card-link">
            <div class="perfume-image-wrapper">
              <img src="${imageUrl}" alt="${perfume.name}" class="perfume-image">
              <div class="image-overlay"></div>
            </div>
            <div class="perfume-content">
              <h3 class="perfume-name">${perfume.name}</h3>
              <p class="perfume-description">${this.truncateText(perfume.description, 100)}</p>
              <div class="perfume-meta">
                <span class="perfume-category">${perfume.category ? this.capitalizeFirstLetter(perfume.category) : ''}</span>
                <span class="perfume-class">${perfume.fragrance_class ? this.capitalizeFirstLetter(perfume.fragrance_class) : ''}</span>
              </div>
              <p class="perfume-price">${this.formatCurrency(perfume.prix)}</p>
            </div>
          </a>
          <div class="perfume-volume">10ml</div>
          <div class="perfume-availability-badge ${availabilityClass}">${availabilityStatus}</div>
        </div>
      `;
    }).join('');

    this.perfumesGridTarget.innerHTML = perfumeHtml;
  }

  renderPagination() {
    const totalPages = Math.ceil(this.allPerfumes.length / this.perfumesPerPage);
    if (totalPages <= 1) {
      this.paginationTarget.innerHTML = ''; // Cache la pagination s'il n'y a qu'une seule page
      return;
    }

    let paginationHtml = '<ul class="pagination">';

    // Bouton Précédent
    paginationHtml += `
      <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
        <a href="#" data-action="click->category-perfumes#previousPage" class="page-link">Précédent</a>
      </li>
    `;

    // Numéros de page
    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `
        <li class="page-item ${this.currentPage === i ? 'current' : ''}">
          <a href="#" data-action="click->category-perfumes#goToPage" data-page="${i}" class="page-link">${i}</a>
        </li>
      `;
    }

    // Bouton Suivant
    paginationHtml += `
      <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
        <a href="#" data-action="click->category-perfumes#nextPage" class="page-link">Suivant</a>
      </li>
    `;

    paginationHtml += '</ul>';
    this.paginationTarget.innerHTML = paginationHtml;
  }

  // Actions de pagination
  previousPage(event) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPerfumes();
      this.renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte en haut de page
    }
  }

  nextPage(event) {
    event.preventDefault();
    const totalPages = Math.ceil(this.allPerfumes.length / this.perfumesPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.renderPerfumes();
      this.renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte en haut de page
    }
  }

  goToPage(event) {
    event.preventDefault();
    const page = parseInt(event.currentTarget.dataset.page);
    if (page && page !== this.currentPage) {
      this.currentPage = page;
      this.renderPerfumes();
      this.renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte en haut de page
    }
  }

  // Fonctions utilitaires (réutilisées de vos contrôleurs existants)
  formatCurrency(amount) {
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND' }).format(num);
  }

  truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }

  capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
