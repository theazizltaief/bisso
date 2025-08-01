Rails.application.routes.draw do
  # Routes pour les 3 templates vitrine
  get "vitrine/accueil", to: "vitrine#accueil", as: :vitrine_accueil
  get "vitrine/accueil_vitrine2", to: "vitrine#accueil_vitrine2", as: :vitrine_accueil_vitrine2
  get "vitrine/accueil_vitrine3", to: "vitrine#accueil_vitrine3", as: :vitrine_accueil_vitrine3

  # Devise avec contrôleur sessions personnalisé
  devise_for :admins, controllers: {
    sessions: "admin/sessions"
  }

  # Namespace pour l'admin panel
  namespace :admin_panel do
    root to: "dashboard#index"  # admin_panel_root_path

    resources :parfums do
      patch :update_image, on: :member
    end

    resources :brands
  end

  # Routes publiques (vitrine)
  resources :parfums
  resources :brands

  # Redirection par défaut (root)
  authenticated :admin do
    root to: "admin_panel/dashboard#index", as: :authenticated_admin_root
  end

  # Modifier la root par défaut pour afficher ta vitrine (template 1 par exemple)
  root "vitrine#accueil"

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
