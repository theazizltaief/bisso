Rails.application.routes.draw do
  devise_for :admins

  namespace :admin_panel do
    root to: "dashboard#index"  # admin_panel_root_path
    resources :parfums do      # admin_panel_parfums_path
      patch :update_image, on: :member
    end
    resources :brands          # admin_panel_brands_path
  end

  resources :parfums
  resources :brands

  root "parfums#index"
  get "up" => "rails/health#show", as: :rails_health_check
end
