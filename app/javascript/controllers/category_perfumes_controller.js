import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["categoryTitle", "categorySlogan", "perfumesGrid", "pagination"];
  // CHANGÉ : filterType (ex: 'category', 'fragrance_class') et filterValue (ex: 'homme', 'niche')
  static values = { filterType: String, filterValue: String };

  allPerfumes = [];
  currentPage = 1;
  perfumesPerPage = 12; // Nombre de parfums à afficher par page

  connect() {
    console.log(`Category Perfumes controller connecté pour ${this.filterTypeValue}:`, this.filterValueValue);
    this.updateHeaderContent(); // Nouvelle fonction pour mettre à jour le titre et le slogan
    this.fetchPerfumes();
  }

  updateHeaderContent() {
    let titleText = '';
    let sloganText = '';

    if (this.filterTypeValue === 'category') {
      titleText = `Parfums ${this.capitalizeFirstLetter(this.filterValueValue)}`;
      sloganText = `Découvrez notre sélection de parfums pour ${this.filterValueValue}.`;
    } else if (this.filterTypeValue === 'fragrance_class') {
      titleText = `Parfums ${this.capitalizeFirstLetter(this.filterValueValue)}`;
      sloganText = `Explorez l'univers des parfums de classe ${this.filterValueValue}.`;
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

      // Filtrer les parfums en fonction du filterType et filterValue
      this.allPerfumes = data.filter(perfume => {
        if (this.filterTypeValue === 'category') {
          return perfume.category && perfume.category.toLowerCase() === this.filterValueValue.toLowerCase();
        } else if (this.filterTypeValue === 'fragrance_class') {
          return perfume.fragrance_class && perfume.fragrance_class.toLowerCase() === this.filterValueValue.toLowerCase();
        }
        return true; // Si aucun filtre n'est spécifié, affiche tout (cas par défaut)
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
            </div>
          </a>
          <div class="perfume-volume">10ml</div> <!-- AJOUTÉ ICI -->
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
