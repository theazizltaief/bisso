class ApplicationController < ActionController::Base
    layout :layout_by_resource

  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  def after_sign_out_path_for(resource_or_scope)
  new_admin_session_path # redirige vers la page de login
  end
  private

  def layout_by_resource
    devise_controller? ? "devise" : "application"
  end
end
