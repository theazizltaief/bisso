import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["wrapper", "inputArea", "input", "results", "perfumeResults", "brandResults"];
  static values = { open: Boolean };

  connect() {
    console.log("Search controller connected!");
    this.openValue = false; // Initialement fermé
    this.debounceTimeout = null;
  }

  toggle() {
    this.openValue = !this.openValue;
    if (this.openValue) {
      this.wrapperTarget.classList.add("is-open");
      this.inputAreaTarget.classList.add("is-open");
      this.inputTarget.focus(); // Met le focus sur le champ de recherche
    } else {
      this.wrapperTarget.classList.remove("is-open");
      this.inputAreaTarget.classList.remove("is-open");
      this.clear(); // Nettoie les résultats et le champ quand on ferme
    }
  }

  close() {
    this.openValue = false;
    this.wrapperTarget.classList.remove("is-open");
    this.inputAreaTarget.classList.remove("is-open");
    this.clear();
  }

  search() {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      const query = this.inputTarget.value.trim();
      console.log("Search query:", query); // DEBUG: Affiche la requête de recherche
      if (query.length > 2) { // Recherche seulement si la requête a au moins 3 caractères
        this.fetchResults(query);
      } else {
        this.clearResults(); // Efface les résultats si la requête est trop courte
      }
    }, 300);
  }

  async fetchResults(query) {
    try {
      const url = `/api/v1/search?query=${encodeURIComponent(query)}`;
      console.log("Fetching from URL:", url);
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        this.resultsTarget.innerHTML = `<p class='inline-search-error-message'>Une erreur est survenue lors de la recherche: ${response.status}</p>`;
        this.resultsTarget.classList.add('is-open');
        return;
      }

      const data = await response.json();
      console.log("Received data:", data);
      this.displayResults(data);
    } catch (error) {
      console.error("Erreur lors de la recherche (connexion ou parsing):", error);
      this.resultsTarget.innerHTML = "<p class='inline-search-error-message'>Une erreur est survenue lors de la recherche (connexion ou données).</p>";
      this.resultsTarget.classList.add('is-open');
    }
  }

  displayResults(data) {
    let perfumeHtml = '';
    let brandHtml = '';

    if (data.perfumes && data.perfumes.length > 0) {
      perfumeHtml += '<h3>Parfums</h3><div class="inline-search-results-grid">';
      perfumeHtml += data.perfumes.map(perfume => `
        <a href="/vitrine/parfums/${perfume.id}" class="inline-search-result-item">
          <img src="${perfume.image_url || '/placeholder.svg?height=50&width=50&text=P'}" alt="${perfume.name}" class="inline-search-result-image">
          <div class="inline-search-result-info">
            <h4>${perfume.name}</h4>
            <p>${this.truncateText(perfume.description, 50)}</p>
          </div>
        </a>
      `).join('');
      perfumeHtml += '</div>';
    } else {
      perfumeHtml = '<p class="inline-search-no-results-message">Aucun parfum trouvé.</p>';
    }

 if (data.brands && data.brands.length > 0) {
  brandHtml += '<h3>Marques</h3><div class="inline-search-results-grid">';
  brandHtml += data.brands.map(brand => `
    <a href="/vitrine/brands/${brand.id}" class="inline-search-result-item">
      <img src="${brand.image_url || '/placeholder.svg?height=50&width=50&text=M'}" alt="${brand.name} Logo" class="inline-search-result-image">
      <div class="inline-search-result-info">
        <h4>${brand.name}</h4>
        ${brand.description ? `<p>${this.truncateText(brand.description, 50)}</p>` : ""}
      </div>
    </a>
  `).join('');
  brandHtml += '</div>';
} else {
  brandHtml = '<p class="inline-search-no-results-message">Aucune marque trouvée.</p>';
}

this.perfumeResultsTarget.innerHTML = perfumeHtml;
this.brandResultsTarget.innerHTML = brandHtml;


    if (this.inputTarget.value.length > 0) {
      this.resultsTarget.classList.add('is-open');
    } else {
      this.resultsTarget.classList.remove('is-open');
    }
  }

  clearResults() {
    this.perfumeResultsTarget.innerHTML = '';
    this.brandResultsTarget.innerHTML = '';
    this.resultsTarget.classList.remove('is-open');
  }

  clear() {
    this.inputTarget.value = '';
    this.clearResults();
  }

  truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  }
}
