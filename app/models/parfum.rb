class Parfum < ApplicationRecord
  belongs_to :brand
  has_one_attached :image
  validates :name, :prix, :brand_id, presence: true
end
