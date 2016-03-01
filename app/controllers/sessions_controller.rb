class SessionsController < Devise::SessionsController

  # GET /resource/sign_in
  def new
    cookies[:omniauth_redirect_url] = admin_url
    super
  end

end