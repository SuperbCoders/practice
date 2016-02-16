class DoctorProfile < BaseProfile

  # - Специальность
  field :specialty
  # - Образование
  field :education
  # - Опыт работы
  field :experience
  # - О себе
  field :about
  # - публичная фотография
  field :public_avatar

  as_enum :office, [:office_open, :office_closed], map: :string, source: :office
  as_enum :profile, [:profile_open, :profile_closed], map: :string, source: :profile

  embeds_one :setting, class_name: 'GlobalSetting'
  belongs_to :doctor, class_name: 'Doctor'

  def change_public_avatar(file_params)
    attach(:public_avatar, file_params)
  end

  def destroy_public_avatar
    detach(:public_avatar)
  end


end
