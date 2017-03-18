class SessionsController < Devise::SessionsController

  # GET /resource/sign_in
  def new
    cookies[:omniauth_redirect_url] = admin_url
    super
  end

  # POST /resource/sign_in
  def create
    unless Doctor.exists?(email: resource_params[:email])
      doctor = Doctor.create(
        resource_params
          .permit(:email, :password)
          .merge({ password_confirmation: resource_params.fetch(:password) })
      )
      Rails.logger.debug 'create session'
      Rails.logger.debug doctor.valid?
      Rails.logger.debug doctor.errors.inspect
    end
    super
  end

end
