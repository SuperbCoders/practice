class RegistrationsController < Devise::RegistrationsController

  before_filter :configure_permitted_parameters
  before_filter :check_avatar, only: :create

  def create
    super do |resource|
      if resource.persisted?
        # Doesn't work. Replaced with after_create hook in doctor model.
        # AfterDoctorRegisteredNotifier.run(resource)
      end
    end
  end

protected

  def check_avatar
    if params[:doctor][:avatar].blank? && params[:doctor][:social_avatar].present?
      params[:doctor][:avatar] = params[:doctor][:social_avatar]
    end
  end

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
      u.permit(:email, :password, :password_confirmation, :first_name, :last_name, :avatar)
    end
  end

end
