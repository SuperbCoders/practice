class BaseModel
  include Mongoid::Document
  include Mongoid::Timestamps::Short
  include GlobalID::Identification
  include SimpleEnum::Mongoid

  include Alertable
  include Attachable

end
