class Doctor::PatientSerializer < Doctor::BaseSerializer
  attributes :name, :comment, :gender, :weight, :height,
      :blood, :diseases, :habits, :profession, :contract_id,
      :register_date, :avatar, :first_name, :last_name,
      :approved, :archivated

  has_many :contacts

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