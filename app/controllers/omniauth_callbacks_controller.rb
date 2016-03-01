class OmniauthCallbacksController < Devise::OmniauthCallbacksController

  before_filter :find_user

  def find_user
    @redirect_url = new_doctor_session_path
    logger.info "OmniAuth data #{request.env["omniauth.auth"].to_json}"
    @omni_data = request.env["omniauth.auth"]

    @doctor = Doctor.from_omniauth(@omni_data)

    if @doctor
      sign_in_and_redirect @doctor
    end

  end

  def facebook
    redirect_to @redirect_url
  end

  def vkontakte
    redirect_to @redirect_url

    # {
    #     "provider":"vkontakte",
    #     "uid":"209939842",
    #     "info":{
    #     "name":"Тимур Талипов",
    #     "nickname":"",
    #     "email":"corehook@gmail.com",
    #     "first_name":"Тимур",
    #     "last_name":"Талипов",
    #     "image":"https://pp.vk.me/c628230/v628230842/33648/rq2IS7LSsMc.jpg",
    #     "location":"",
    #     "urls":{
    #     "Vkontakte":"http://vk.com/c0rehook"
    # }
    # },
    #     "credentials":{
    #     "token":"e504494b6332d018297060b38996a46cabe7357c55a8083f4c1e1c6d3e52c9f492855433217d9baad10e2",
    #     "expires_at":1456919396,
    #     "expires":true
    # },
    #     "extra":{
    #     "raw_info":{
    #     "id":209939842,
    #     "first_name":"Тимур",
    #     "last_name":"Талипов",
    #     "sex":2,
    #     "nickname":"",
    #     "screen_name":"c0rehook",
    #     "bdate":"1.2.1970",
    #     "photo_50":"https://pp.vk.me/c628230/v628230842/3364b/M-alvnN6lDc.jpg",
    #     "photo_100":"https://pp.vk.me/c628230/v628230842/3364a/oinSbk9RC0U.jpg",
    #     "photo_200":"https://pp.vk.me/c628230/v628230842/33649/CqYXG9SZh40.jpg",
    #     "photo_200_orig":"https://pp.vk.me/c628230/v628230842/33648/rq2IS7LSsMc.jpg",
    #     "online":0
    # }
    # }
    # }


  end
end
