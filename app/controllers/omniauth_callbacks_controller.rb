class OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def self.provides_callback_for(provider)
    class_eval %Q{
      def #{provider}
        byebug
        @doctor = Doctor.find_for_oauth(env["omniauth.auth"])

        if @doctor.persisted?
          sign_in_and_redirect @doctor, event: :authentication
          set_flash_message(:notice, :success, kind: "#{provider}".capitalize) if is_navigational_format?
        else
          session["devise.#{provider}_data"] = env["omniauth.auth"]
          redirect_to new_doctor_registration_url
        end
      end
    }
  end

  # [:facebook, :vkontakte].each do |provider|
  #   provides_callback_for provider
  # end

  def vkontakte
    @doctor = Doctor.from_omniauth(env["omniauth.auth"])

    if @doctor.persisted?
      sign_in_and_redirect @doctor, event: :authentication
      set_flash_message(:notice, :success, kind: "VKONTAKTE") if is_navigational_format?
    else
      session[:new_user] = @doctor
      session[:oauth] = env["omniauth.auth"]
      redirect_to new_doctor_registration_url
    end
  end

  def facebook
    @doctor = Doctor.from_omniauth(env["omniauth.auth"])

    if @doctor.persisted?
      sign_in_and_redirect @doctor, event: :authentication
      set_flash_message(:notice, :success, kind: "FACEBOOK") if is_navigational_format?
    else
      session["devise.facebook_data"] = env["omniauth.auth"]
      redirect_to new_doctor_registration_url
    end
  end

end
