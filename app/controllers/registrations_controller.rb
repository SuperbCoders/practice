class RegistrationsController < Devise::RegistrationsController

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
  
end
