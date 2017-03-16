class PopulateColorsToExistingUsers < ActiveRecord::Migration
  def up
    Patient.all.each do |p|
      p.color = Color.get_random_color
      p.save
    end
  end

  def down
  end
end
