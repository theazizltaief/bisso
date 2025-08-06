class VitrineController < ApplicationController
  layout "vitrine1"

  def accueil
    # Par défaut, accueil
  end

  # Nouvelle action pour afficher les détails d'une marque dans la vitrine
  def show_brand
    @brand_id = params[:id]
    # Aucune logique de récupération de données ici.
    # Le contrôleur Stimulus 'brand_perfumes' s'en chargera côté client.
  end

  def category_perfumes
    # Cette action ne fait que rendre la vue.
    # La logique de récupération et de filtrage des parfums sera gérée côté client par Stimulus.
  end
end
