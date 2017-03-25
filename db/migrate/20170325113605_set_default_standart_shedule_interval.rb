class SetDefaultStandartSheduleInterval < ActiveRecord::Migration
  def change
    change_column :settings, :standart_shedule_interval, :string, default: '30'
  end
end
