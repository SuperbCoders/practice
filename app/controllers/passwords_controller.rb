class PasswordsController < Devise::PasswordsController

  layout 'admins_login'

  respond_to :json, only: [:create]

  # POST /resource/password
  def create
    self.resource = resource_class.find_or_initialize_with_errors(resource_class.reset_password_keys, resource_params, :not_found)

    if resource.persisted?
      token = resource.send :set_reset_password_token
      DoctorMailer.password_recovery_email(resource, token).deliver_now
    end

    yield resource if block_given?

    if successfully_sent?(resource)
      render json: { msg: 'Инструкции отправлены на почту' }
    else
      render json: { error: 'Повторите попытку позже' }, status: 403
    end
  end

end
