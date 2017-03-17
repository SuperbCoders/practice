class PopulateDefaultDicts < ActiveRecord::Migration
  def up
    Dict.where(dict_type: 2).delete_all
    Doctor.all.each do |doctor|
      DictDefaults::DEFAULT.each do |dict|
        doctor.dicts.create(
          dict_type: 2,
          dict_value: dict,
          dictable_id: doctor.id,
          dictable_type: 'Doctor'
        )
      end
    end
  end

  def down
  end
end
