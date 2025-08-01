class VitrineController < ApplicationController
  layout "vitrine1"

  def accueil
    # Par défaut, template 1
  end

  def accueil_vitrine2
    render layout: "vitrine2"
  end

  def accueil_vitrine3
    render layout: "vitrine3"
  end
end
