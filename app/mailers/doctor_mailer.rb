class DoctorMailer < ApplicationMailer

  def welcome_email(doctor)
    @doctor = doctor
    mail(to: doctor.email, subject: 'Все готово')
  end

  def activate_email(doctor)
    @doctor = doctor
    mail(to: doctor.email, subject: 'Нужна помощь?')
  end

  def reactivate_email(doctor)
    @doctor = doctor
    mail(to: doctor.email, subject: 'Просто напоминание')
  end

  def trial_finished_email(doctor)
    @doctor = doctor
    mail(to: doctor.email, subject: 'Все получается?')
  end

  def payment_received_email(doctor)
    @doctor = doctor
    mail(to: doctor.email, subject: 'Мы получили оплату, спасибо!')
  end

  def password_recovery_email(doctor)
    @doctor = doctor
    mail(to: doctor.email, subject: 'Восстановление пароля от Практики')
  end

end
