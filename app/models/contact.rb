class Contact < BaseModel

  as_enum :type, [:phone, :social, :email], map: :string, source: :type
  as_enum :data_type, [:mobile, :work, :home, :vk, :fb, :twitter], map: :string, source: :data_type

  field :data

  validates_presence_of :type, :data_type, :data

  belongs_to :base_profile, polymorphic: true

end
