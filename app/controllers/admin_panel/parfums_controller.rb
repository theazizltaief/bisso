module AdminPanel
  class ParfumsController < ApplicationController
    before_action :authenticate_admin!
    before_action :set_parfum, only: [ :show, :edit, :update, :destroy ]
    before_action :set_brands, only: [ :new, :edit, :create, :update ]

    def index
      @parfums = Parfum.includes(:brand).all
    end

    def show
    end

    def new
      @parfum = Parfum.new
    end

    def create
      @parfum = Parfum.new(parfum_params)
      if @parfum.save
        redirect_to admin_panel_parfums_path, notice: "Parfum créé avec succès."
      else
        render :new
      end
    end

    def edit
    end

    def update
      if @parfum.update(parfum_params)
        redirect_to admin_panel_parfums_path, notice: "Parfum mis à jour."
      else
        render :edit
      end
    end

    def destroy
      @parfum.destroy
      redirect_to admin_panel_parfums_path, notice: "Parfum supprimé."
    end

    private

    def set_parfum
      @parfum = Parfum.find(params[:id])
    end

    def set_brands
      @brands = Brand.all.order(:name)  # Trié par nom pour affichage dans le select
    end

    def parfum_params
      params.require(:parfum).permit(:name, :prix, :brand_id)
    end
  end
end
