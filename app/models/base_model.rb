class BaseModel < ActiveRecord::Base
  include Alertable
  include Attachable

end
