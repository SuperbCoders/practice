class Doctor::BaseController < ApplicationController
  layout 'doctor'
  # before_action authenticate_user!
  # before_filter :auth_user

  def auth_user
    if not user_signed_in?
      redirect_to root_path
    else
      sign_out_and_redirect(current_user) if not (user_doctor.has_role?(:doctor))
    end
  end

end
