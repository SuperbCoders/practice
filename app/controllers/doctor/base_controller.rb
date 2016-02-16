class Doctor::BaseController < ApplicationController
  layout 'doctor'
  before_action authenticate_doctor!
  before_filter :auth_user

  def auth_user
    if not doctor_signed_in?
      redirect_to root_path
    else
      sign_out_and_redirect(current_doctor) if not (current_doctor.has_role?(:doctor))
    end
  end

end
