Rails.application.routes.draw do
  devise_for :admins

  namespace :admin_panel do
    root to: "dashboard#index" # page d'accueil de l'espace admin
    resources :parfums
    resources :brands
  end

  resources :parfums
  resources :brands

  root "parfums#index"

  get "up" => "rails/health#show", as: :rails_health_check
end
