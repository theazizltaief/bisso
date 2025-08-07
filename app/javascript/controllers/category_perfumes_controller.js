import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["categoryTitle", "categorySlogan", "perfumesGrid", "pagination"];
  // MODIFIÉ: S'attend maintenant à une seule valeur 'category'
  static values = { category: String };

  allPerfumes = [];
  currentPage = 1;
  perfumesPerPage = 12; // Nombre de parfums à afficher par page

  connect() {
    console.log(`Category Perfumes controller connecté pour la catégorie:`, this.categoryValue);
    this.updateHeaderContent(); // Met à jour le titre et le slogan
    this.fetchPerfumes();
  }

  updateHeaderContent() {
    let titleText = '';
    let sloganText = '';

    // Détermine si c'est un genre ou une classe de parfum basé sur la valeur elle-même
    const genderCategories = ['homme', 'femme', 'unisexe'];
    const fragranceClasses = ['designer', 'niche', 'collection_privee'];
    const filterValueLower = this.categoryValue.toLowerCase();

    if (genderCategories.includes(filterValueLower)) {
      titleText = `Parfums ${this.capitalizeFirstLetter(filterValueLower)}`;
      sloganText = `Découvrez notre sélection de parfums pour ${filterValueLower}.`;
    } else if (fragranceClasses.includes(filterValueLower)) {
      titleText = `Parfums ${this.capitalizeFirstLetter(filterValueLower)}`;
      sloganText = `Explorez l'univers des parfums de classe ${filterValueLower}.`;
    } else {
      titleText = "Parfums";
      sloganText = "Découvrez toutes nos fragrances.";
    }

    this.categoryTitleTarget.textContent = titleText;
    this.categorySloganTarget.textContent = sloganText;
  }

  async fetchPerfumes() {
    const apiUrl = `/api/v1/parfums`; // Votre endpoint qui retourne TOUS les parfums

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // MODIFIÉ: Filtrer les parfums en fonction de la seule 'categoryValue'
      this.allPerfumes = data.filter(perfume => {
        const categoryLower = perfume.category ? perfume.category.toLowerCase() : '';
        const fragranceClassLower = perfume.fragrance_class ? perfume.fragrance_class.toLowerCase() : '';
        const filterValueLower = this.categoryValue.toLowerCase();

        // Vérifie si la valeur du filtre correspond à la catégorie OU à la classe de fragrance
        return categoryLower === filterValueLower || fragranceClassLower === filterValueLower;
      });

      if (this.allPerfumes.length === 0) {
        this.perfumesGridTarget.innerHTML = "<p class='no-perfumes-message'>Aucun parfum trouvé pour cette sélection pour le moment.</p>";
        this.paginationTarget.innerHTML = ''; // Cache la pagination
        return;
      }

      this.renderPerfumes(); // Affiche la première page de parfums filtrés
      this.renderPagination(); // Affiche les contrôles de pagination
    } catch (error) {
      console.error("Erreur lors de la récupération des parfums:", error);
      this.perfumesGridTarget.innerHTML = "<p class='error-message'>Impossible de charger les parfums. Veuillez réessayer plus tard.</p>";
      this.categoryTitleTarget.textContent = "Erreur de chargement";
      this.categorySloganTarget.textContent = "Une erreur est survenue lors du chargement des parfums.";
    }
  }

  renderPerfumes() {
    const startIndex = (this.currentPage - 1) * this.perfumesPerPage;
    const endIndex = startIndex + this.perfumesPerPage;
    const perfumesToDisplay = this.allPerfumes.slice(startIndex, endIndex);

    const perfumeHtml = perfumesToDisplay.map(perfume => {
      const imageUrl = perfume.image_url || "/placeholder.svg?height=250&width=250&text=Parfum";
      const availabilityStatus = perfume.disponible ? 'Disponible' : 'Rupture de stock';
      const availabilityClass = perfume.disponible ? 'perfume-availability-badge--available' : 'perfume-availability-badge--unavailable';

      return `
        <div class="perfume-card">
          <a href="/vitrine/parfums/${perfume.id}" class="perfume-card-link">
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
              <div class="perfume-card-actions">
                <button
                  class="perfume-card-add-to-cart-btn"
                  data-action="click->cart#addToCart"
                  data-parfum-id="${perfume.id}"
                  data-parfum-name="${perfume.name}"
                  data-parfum-price="${perfume.prix}"
                  data-parfum-image-url="${imageUrl}"
                  ${!perfume.disponible ? 'disabled' : ''}
                >
                  Ajouter au panier
                </button>
              </div>
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
      this.paginationTarget.innerHTML = '';
      return;
    }

    let paginationHtml = '<ul class="pagination">';
    paginationHtml += `
      <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
        <a href="#" data-action="click->category-perfumes#previousPage" class="page-link">Précédent</a>
      </li>
    `;
    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `
        <li class="page-item ${this.currentPage === i ? 'current' : ''}">
          <a href="#" data-action="click->category-perfumes#goToPage" data-page="${i}" class="page-link">${i}</a>
      </li>
      `;
    }
    paginationHtml += `
      <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
        <a href="#" data-action="click->category-perfumes#nextPage" class="page-link">Suivant</a>
      </li>
    `;
    paginationHtml += '</ul>';
    this.paginationTarget.innerHTML = paginationHtml;
  }

  previousPage(event) {
    event.preventDefault();
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderPerfumes();
      this.renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(event) {
    event.preventDefault();
    const totalPages = Math.ceil(this.allPerfumes.length / this.perfumesPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.renderPerfumes();
      this.renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPage(event) {
    event.preventDefault();
    const page = parseInt(event.currentTarget.dataset.page);
    if (page && page !== this.currentPage) {
      this.currentPage = page;
      this.renderPerfumes();
      this.renderPagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

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
