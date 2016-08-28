Rails.application.routes.draw do

  devise_for :doctors, path: 'auth', controllers: { omniauth_callbacks: 'omniauth_callbacks', sessions: 'sessions', registrations: 'registrations' }
  get 'templates(/*url)' => 'application#templates'
  root 'doctor/cabinet#index', as: :root

  post 'doctors/new_visit' => 'public/profiles#create_visit'
  scope 'doctors/:username' do
    get '/' => 'public/profiles#public'
    get 'profile' => 'public/profiles#profile'
    get 'visits' => 'public/profiles#visits'
  end

  namespace :doctor do
    resource :profile, only: [:show, :update]
    resources :patients
    resources :visits
    resources :journals
    resources :dicts
    resource :settings, only: [:show, :update]
  end

  namespace :admin do
    get '' => 'index#index'

    resources :doctors
    resources :patients
  end
end
