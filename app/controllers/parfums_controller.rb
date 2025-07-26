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
    @brands = Brand.all

    if @parfum.save
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.prepend("parfums_container", partial: "parfum", locals: { parfum: @parfum }),
            turbo_stream.replace("flash", partial: "shared/flash", locals: { notice: "Parfum créé !" })
          ]
        end
        format.html { redirect_to admin_panel_parfums_path, notice: "Parfum créé !" }
      end
    else
      render :new, status: :unprocessable_entity
    end
  end

private

def parfum_params
    params.require(:parfum).permit(:nom, :description, :prix, :image, :genre, :brand_id)
end
end
