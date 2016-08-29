class ValueList < ActiveRecord::Base
	# Справочник для разных данных, используемых в системе (типа города, страны, стандартное
	# время приема и т.д.)
	has_many :value_list_items
end
