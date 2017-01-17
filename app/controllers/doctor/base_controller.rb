class Doctor::BaseController < ApplicationController
  before_action :authenticate_doctor!
  layout 'doctor'

  def doctor
    current_doctor
  end

  private

  def authenticate_doctor!
    if doctor_signed_in?
      super
    else
      redirect_to '#login'
    end
  end

end
