class Parfum < ApplicationRecord
  belongs_to :brand
  has_one_attached :image
  validates :name, presence: { message: "Le nom est obligatoire" }
  validates :prix, presence: { message: "Le prix est obligatoire" },
                   numericality: { greater_than: 0, message: "Doit être supérieur à 0" }
  validates :brand_id, presence: { message: "La marque est obligatoire" }
  validates :description, presence: { message: "La description est obligatoire" },
                         length: { minimum: 5, message: "Minimum 5 caractères" }
  attr_accessor :remove_image

  before_save :purge_image_if_requested

  private

  def purge_image_if_requested
    image.purge if remove_image == "1"
  end
end
