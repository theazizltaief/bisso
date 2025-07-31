Rails.application.routes.draw do
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

  # Si pas connecté → vitrine (en attendant de la construire)
  root "parfums#index"

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
