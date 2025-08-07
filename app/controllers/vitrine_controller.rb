# app/controllers/vitrine_controller.rb

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

# NOUVELLE MÉTHODE : Action pour afficher les détails d'un parfum
def show_parfum
  @parfum = Parfum.find_by(id: params[:id])

  if @parfum.nil?
    flash[:alert] = "Le parfum demandé n'existe pas."
    redirect_to vitrine_accueil_path # Redirige vers l'accueil de la vitrine
    return # Arrête l'exécution de l'action pour éviter de rendre la vue avec @parfum = nil
  end

  # Récupérer les parfums associés de la même marque (exclure le parfum actuel)
  if @parfum.brand
    @associated_parfums = @parfum.brand.parfums.where.not(id: @parfum.id).limit(4)
  else
    @associated_parfums = []
  end
end

# NOUVELLE MÉTHODE : Action pour afficher le panier
def cart
  # Cette action ne fait que rendre la vue.
  # La logique d'affichage des articles du panier sera gérée par Stimulus côté client.
end
end
