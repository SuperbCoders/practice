class Doctor::PatientSerializer < Doctor::BaseSerializer
  attributes :name, :comment, :gender, :weight, :height,
      :blood, :diseases, :habits, :profession, :contract_id,
      :register_date, :avatar, :first_name, :last_name,
      :approved, :archivated, :phone, :email, :age, :birthday,
      :phones, :emails

  has_many :contacts

  def phones
    object.contacts.phone
  end

  def emails
    object.contacts.email
  end

  def birthday
    birthday = object.try(:birthday)

    if birthday
      "#{birthday.day} / #{birthday.month} / #{birthday.year}"
    end
  end

  def age
    age = 0
    if object.try(:birthday)
      birthday = object.birthday
      while birthday.year != DateTime.now.year
        age += 1
        birthday += 1.year
      end
    end
    age
  end

  def approved
    @approved ||= false
    app = Appointment.find_by(patient: object, doctor: scope)
    @approved = app.approved if app
    @approved
  end

  def archivated
    @archivated ||= false
    app = Appointment.find_by(patient: object, doctor: scope)
    @archivated = app.archivated if app
    @archivated
  end

  def phone
    if object.contacts.phone.count > 0
      object.contacts.phone.first.data
    end
  end

  def avatar
    if object.try(:avatar)
      return "/upload/#{object.avatar}"
    else
      "/i/user_1.png"
    end
  end

  def name
    if object.try(:first_name)
      object.first_name
    else
      object.try(:email)
    end
  end
end