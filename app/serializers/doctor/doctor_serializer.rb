class Doctor::DoctorSerializer < Doctor::BaseSerializer
  attributes :email, :first_name, :last_name, :name, :avatar, :public_avatar,
      :gender, :birthday, :specialty, :education, :experience, :about, :office,
      :profile, :vk_id, :fb_id, :twitter_id, :phones, :emails

  def avatar
    if object.try(:avatar)
      return "/upload/#{object.avatar}"
    else
      "/i/user_1.png"
    end
  end

  def public_avatar
    if object.try(:public_avatar)
      return "/upload/#{object.public_avatar}"
    else
      "/i/user_1.png"
    end
  end

  def phones
    object.contacts.phone
  end

  def emails
    object.contacts.email
  end

  def office
    object.office_open?
  end

  def profile
    object.profile_open?
  end

end