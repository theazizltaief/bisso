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
    root to: "dashboard#index"  # admin_panel_root_path

    resources :parfums do
      patch :update_image, on: :member
    end

    resources :brands
  end

  # Routes publiques pour parfums et brands
  resources :parfums
  resources :brands

  # Redirection root spécifique aux admins authentifiés
  authenticated :admin do
    root to: "admin_panel/dashboard#index", as: :authenticated_admin_root
  end

  # Health check
  get "up", to: "rails/health#show", as: :rails_health_check

  # API namespace versionné
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
