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
end
