class PasswordsController < Devise::PasswordsController
  respond_to :json, only: [:create]

  # POST /resource/password
  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)
    yield resource if block_given?

    if successfully_sent?(resource)
      render json: { msg: 'Инструкции отправлены на почту' }
    else
      render json: { error: 'Повторите попытку позже' }
    end
  end

end