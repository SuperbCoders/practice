class Doctor::PatientSerializer < Doctor::BaseSerializer
  attributes :full_name, :comment, :gender, :weight, :height,
      :blood, :diseases, :habits, :profession, :contract_id,
      :register_date, :avatar, :approved, :archivated, :phone, 
      :email, :age, :birthday, :phones, :emails, :rhesus, :initials,
      :in_archive, :cart_color, :last_visit

  has_many :contacts

  def rhesus
    object.try(:rhesus) ? "+" : "-"
  end

  def phones
    object.contacts.phone
  end

  def emails
    object.contacts.email
  end

  def age
    dob = object.birthday
    return 0 unless dob
    now = Time.now.utc.to_date
    now.year - dob.year - ((now.month > dob.month || (now.month == dob.month && now.day >= dob.day)) ? 0 : 1)
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
      nil
    end
  end

  def last_visit
    object.visits.actual.last
  end

  def initials
    begin
      object.full_name.split(/\s+/)[-2..-1].map {|x| x[0]}.join("")
    rescue Exception => e
      ""
    end
  end

end