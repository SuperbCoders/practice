class SystemSettings < ActiveRecord::Base

  validates_presence_of :name, :slug
end
