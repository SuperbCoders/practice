class Doctor::BaseController < ApplicationController
  before_action :authenticate_user!
  before_filter :doctor?

  layout 'doctor'



  def doctor?
    if not user_signed_in?
      redirect_to root_path
    else
      sign_out_and_redirect(current_user) if not current_user.has_role?(:doctor)
    end
  end

end
