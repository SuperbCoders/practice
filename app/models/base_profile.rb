class BaseProfile < BaseModel
  include Attachable

  # – пол
  as_enum :gender, [:male, :female], source: :gender, map: :string
  # - Фамилия
  # - Имя
  field :first_name
  field :last_name

  # возраст
  field :birthday, type: DateTime

  # юзерпик
  field :avatar

  # телефон/email (может быть несколько)
  has_many :contacts, dependent: :destroy


  validates_presence_of :first_name, :last_name

  before_destroy :delete_avatar_file

  def change_avatar(file_params)
    attach(:avatar, file_params)
  end

  def destroy_avatar
    if avatar and destroy_file(avatar)
      update_attributes(avatar: nil)
    end
  end

  def name
    [:first_name, :last_name].join(' ')
  end


  private


end
