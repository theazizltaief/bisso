class AddCategoryToParfums < ActiveRecord::Migration[8.0]
  def change
    add_reference :parfums, :category, foreign_key: true
  end
end
