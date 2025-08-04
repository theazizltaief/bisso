include Rails.application.routes.url_helpers

module Api
  module V1
    class BrandsController < ApplicationController
      def index
        brands = Brand.includes(:parfums, image_attachment: :blob).all

        render json: brands.map { |brand|
          {
            id: brand.id,
            name: brand.name,
            image_url: brand.image.attached? ? url_for(brand.image) : nil,
            parfums: brand.parfums.map { |parfum|
              {
                id: parfum.id,
                name: parfum.name,
                prix: parfum.prix,
                description: parfum.description,
                category: parfum.category,
                fragrance_class: parfum.fragrance_class,
                image_url: parfum.image.attached? ? url_for(parfum.image) : nil
              }
            }
          }
        }
      end

      def only_brands
        brands = Brand.includes(image_attachment: :blob).all

        render json: brands.map { |brand|
          {
            id: brand.id,
            name: brand.name,
            image_url: brand.image.attached? ? url_for(brand.image) : nil
          }
        }
      end


      def show
        brand = Brand.includes(:parfums, image_attachment: :blob).find(params[:id])
        render json: {
          id: brand.id,
          name: brand.name,
          image_url: brand.image.attached? ? url_for(brand.image) : nil,
          parfums: brand.parfums.map { |parfum|
            {
              id: parfum.id,
              name: parfum.name,
              prix: parfum.prix,
              description: parfum.description,
              category: parfum.category,
              fragrance_class: parfum.fragrance_class,
              image_url: parfum.image.attached? ? url_for(parfum.image) : nil
            }
          }
        }
      end
    end
  end
end
