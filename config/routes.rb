Rails.application.routes.draw do
  get 'templates(/*url)' => 'application#templates'
  root 'index#index'


  namespace :admin do
    get '' => 'index#index'

    resources :doctors
    resources :patients
  end

  namespace :patient do
    get '/' => 'cabinet#index'
  end

  namespace :doctor do
    get '/' => 'cabinet#index'

    devise_for :doctors, class_name: 'Doctor', path: 'auth', singular: :doctor, path_names: {
        sign_in: 'login',
        sign_out: 'logout',
        password: 'secret',
        confirmation: 'verification',
        unlock: 'unblock',
        registration: 'register',
        sign_up: 'cmon_let_me_in'
    }

  end
end
