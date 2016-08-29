class AddStandartSheduleIntervalToSettings < ActiveRecord::Migration
  def change
    add_column :settings, :standart_shedule_interval, :integer
  end
end
