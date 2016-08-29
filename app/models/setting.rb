class Setting < ActiveRecord::Base
	#Настройки для врача
	belongs_to :doctor
end
