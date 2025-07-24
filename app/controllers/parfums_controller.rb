class ParfumsController < ApplicationController
  def index
    @parfums = Parfum.all
  end

  def show
    @parfum = Parfum.find(params[:id])
  end

  def new
    @parfum = Parfum.new
  end

  def create
    @parfum = Parfum.new(parfum_params)
    if @parfum.save 
      redirect_to @parfum, notice: "Parfum ajouté avec succès."
    else 
      render :new 
  end
end
private

def parfum_params
    params.require(:parfum).permit(:nom, :description, :prix, :image, :genre, :brand_id)
  end
end