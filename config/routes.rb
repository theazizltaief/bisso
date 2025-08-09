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

  # NOUVELLE ROUTE SPÉCIFIQUE POUR LA PAGE DE DÉTAILS DES PARFUMS DANS LA VITRINE
  get "vitrine/parfums/:id", to: "vitrine#show_parfum", as: :vitrine_parfum_show

  # NOUVELLE ROUTE POUR LA PAGE DE DÉTAILS DES MARQUES DANS LA VITRINE
  get "vitrine/brands/:id", to: "vitrine#show_brand", as: :vitrine_brand_show

  # NOUVELLE ROUTE POUR LA PAGE DE TOUTES LES MARQUES
  get "vitrine/brands", to: "vitrine#all_brands", as: :vitrine_all_brands

  # NOUVELLE ROUTE POUR LA PAGE DU PANIER DANS LA VITRINE
  get "vitrine/cart", to: "vitrine#cart", as: :vitrine_cart

  # NOUVELLE ROUTE POUR LA PAGE DE TOUS LES PARFUMS DANS LA VITRINE
  get "vitrine/all_perfumes", to: "vitrine#all_perfumes", as: :vitrine_all_perfumes

  # Route pour la page des parfums par catégorie
  get "vitrine/parfums", to: "vitrine#category_perfumes", as: :category_perfumes

  # NOUVELLE ROUTE POUR LA PAGE DE CONTACT
  get "vitrine/contact", to: "vitrine#contact", as: :vitrine_contact

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
      resources :search, only: [ :index ] # ASSUREZ-VOUS QUE CETTE LIGNE EST PRÉSENTE
    end
  end
end
