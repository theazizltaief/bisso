Rails.application.routes.draw do
  # Root publique : la vitrine
  root "vitrine#accueil"
  get "vitrine/accueil", to: "vitrine#accueil", as: :vitrine_accueil

  # Devise pour admins avec contrôleur de sessions personnalisé
  devise_for :admins, path: "admin_panel", controllers: {
    sessions: "admin/sessions"
  }

  # Namespace admin_panel pour l'espace admin
  namespace :admin_panel do
    root to: "dashboard#index" # admin_panel_root_path
    resources :parfums do
      patch :update_image, on: :member
    end
    resources :brands # Ceci est la route pour le BrandsController de l'admin panel
  end

  # Routes publiques pour parfums
  resources :parfums # Gardez cette ligne pour les parfums publics

  # NOUVELLE ROUTE POUR LA PAGE DE DÉTAILS DES MARQUES DANS LA VITRINE
  get "vitrine/brands/:id", to: "vitrine#show_brand", as: :vitrine_brand_show
  # Route pour la page des parfums par catégorie
  get "vitrine/parfums", to: "vitrine#category_perfumes", as: :category_perfumes

  # Redirection root spécifique aux admins authentifiés
  authenticated :admin do
    root to: "admin_panel/dashboard#index", as: :authenticated_admin_root
  end

  # Health check
  get "up", to: "rails/health#show", as: :rails_health_check

  # API namespace versionné (NE PAS TOUCHER)
  namespace :api do
    namespace :v1 do
      resources :brands, only: [ :index, :show ]
      resources :parfums, only: [ :index, :show ]
      get "brands_only", to: "brands#only_brands"
      resources :users, only: [ :create ]
      post "login", to: "auth#login"
      resources :orders, only: [ :create ]
      resources :cart_items, only: [ :create, :update, :destroy ]
    end
  end
end
