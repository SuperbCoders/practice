class Doctor::VisitSerializer < Admin::BaseSerializer
  attributes :title, :start, :end, :patient, :duration

  def patient
    if object.signed?
      object.try(:patient)
    else
      object.try(:unsigned_patient)
    end
  end

  def title
    if object.signed?
      object.try(:patient).try(:name)
    else
      object.try(:unsigned_patient).try(:name)
    end
  end

end