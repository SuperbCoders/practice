# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Заполняем справочники
ValueList.find_or_create_by(name: "Стандартное время приема") do |list|
	list.value_list_items.delete_all
	list.value_list_items << ValueListItem.new(value: 15)
	list.value_list_items	<< ValueListItem.new(value: 30)
	list.value_list_items	<< ValueListItem.new(value: 45)
	list.value_list_items	<< ValueListItem.new(value: 60)
	list.value_list_items	<< ValueListItem.new(value: 90)
	list.value_list_items	<< ValueListItem.new(value: 120)
end

[
	{ slug: 'counter_code', name: 'Код счетчика' },
	{ slug: 'practice_phone', name: 'Телефон практики' }
].each do |s|
	SystemSettings.find_or_create_by(slug: s[:slug]) do |ns|
		ns.name = 'Код счетчика'
	end
end

Admin.find_or_create_by(email: 'admin1@example.com') do |admin|
  admin.password = 'adminadmin'
end