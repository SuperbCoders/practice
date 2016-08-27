class OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def self.provides_callback_for(provider)
    class_eval %Q{
      def #{provider}
        # todo: Добавить проверку на существование доктора с такой социалкой
        if doctor_signed_in?
          Identity.create_user_identity(env["omniauth.auth"], current_doctor)
          render inline: "<script>window.close()</script>"
          return
        end

        @doctor = Doctor.from_omniauth(env["omniauth.auth"])

        if @doctor.persisted?
          sign_in_and_redirect @doctor, event: :authentication
          set_flash_message(:notice, :success, kind: "#{provider}".capitalize) if is_navigational_format?
        else
          session[:new_user] = @doctor
          session[:oauth] = env["omniauth.auth"]
          redirect_to new_doctor_registration_url
        end
      end
    }
  end

  [:facebook, :vkontakte].each do |provider|
    provides_callback_for provider
  end

end
