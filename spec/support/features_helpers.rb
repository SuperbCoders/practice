# coding: utf-8
module FeaturesHelpers
  def login_with email, params = {}
    login_by_email_and_password email, '12345678', params
  end

  def rack_login user
    page.set_rack_session('warden.user.user.key' => User.serialize_into_session(user).unshift("User"))
  end

  def warden_login user
    login_as(user, scope: :doctor)
  end

  def login_by_email_and_password email, password, params = {}
    visit dashboard_path
    click_on 'Войти'
    fill_in 'Введите email', with: email
    fill_in 'Пароль', with: password
    click_button 'Войти'
    wait_for_ajax
    if !negative_param(params, :check)
      expect(find('.nt-main-top-menu')).to have_content(email)
    end
  end

  def negative_param params, param
    params.keys.include? param && !params[param]
  end

  def logout_helper
    visit dashboard_path
    click_on 'Выйти'
    expect(find('.nt-main-top-menu')).to have_content('Войти')
  end

  def provider_login email
    visit dashboard_path
    click_on 'Войти'
    fill_in 'Введите email', with: email
    fill_in 'Пароль', with: '12345678'
    click_button 'Войти'
    wait_for_ajax
  end

  def admin_login
    AdminUser.create!(:email => 'admin@example.com', :password => 'password', :password_confirmation => 'password')
    visit new_admin_user_session_path
    fill_in 'Эл. почта', with: 'admin@example.com'
    fill_in 'Пароль', with: 'password'
    click_on 'Войти'
  end

  def main_top_menu
    find('.nt-main-top-menu')
  end

  def expect_dashboard_logged_in email
    expect(main_top_menu).to have_content(email)
  end

  def order_scenario
    create(:car_variant, city_id: 1, car_type_id: 1, provider: create(:provider))
    visit dashboard_path
    click_button 'Подобрать автомобиль'
    click_button 'Выбрать'
    within('.modal') do
      expect(find('.js-modal-booking-form-title')).to have_content('Жигули')
    end
    fill_in 'Дата получения', with: '11.11.15'
    fill_in 'Дата возврата', with: '12.11.15'
    fill_in 'Ваше имя', with: 'test'
    fill_in 'Телефон', with: '99999999999'
    fill_in 'Email', with: 'test@test.test'
    click_button 'Забронировать автомобиль'
    wait_for_ajax
  end

  def booking_scenario
    order = create(:accepted_order)
    login_with order.user.email
    visit new_order_booking_path(order)
    booking_fill_scenario
    click_on 'Подтвердить бронь'
    order
  end

  def new_booking
    Booking.new
  end

  def do_booking
    yield DoBooking.new
  end

  def order
    OrderObject.new
  end

  def order_object2
    yield OrderObject2.new
  end

  def payment_object2
    yield PaymentObject2.new
  end

  def login_object
    yield LoginObject.new
  end

  def register_object
    yield RegisterObject.new
  end
end
