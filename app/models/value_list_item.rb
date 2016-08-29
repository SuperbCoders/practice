class ValueListItem < ActiveRecord::Base
	# Хранит ОДНО значение из справочника данных
	belongs_to :value_list
end
