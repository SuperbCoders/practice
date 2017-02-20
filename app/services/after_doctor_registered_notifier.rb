class AfterDoctorRegisteredNotifier

  def self.run(doctor)
    new(doctor).run
  end

  def initialize(doctor)
    @doctor = doctor
  end

  def run
    # TODO: Check for profile filled up or account paid already
    DoctorMailer.welcome_email(@doctor).deliver_later
    DoctorMailer.activate_email(@doctor).deliver_later(wait: 3.days)
    DoctorMailer.reactivate_email(@doctor).deliver_later(wait: 10.days)
    DoctorMailer.trial_finished_email(@doctor).deliver_later(wait: 40.days)
  end
end