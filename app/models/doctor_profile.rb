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


  def change_public_avatar(file_params)
    attach(:public_avatar, file_params)
  end

  def destroy_public_avatar
    if public_avatar and destroy_file(public_avatar)
      update_attributes(public_avatar: nil)
    end
  end


end
