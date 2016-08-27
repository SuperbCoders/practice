class RegistrationsController < Devise::RegistrationsController

  before_filter :configure_permitted_parameters

protected
	def build_resource(hash=nil)
    if session[:new_user]
    	self.resource = resource_class.new(session[:new_user])
      session[:new_user] = nil
    else
    	self.resource = resource_class.new_with_session(hash || {}, session)
    end
  end

  def after_inactive_sign_up_path_for(resource)
    new_doctor_session_path
  end
  
  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) do |u|
      u.permit(:email, :password, :password_confirmation, :first_name, :last_name)
    end
  end

end
