Rails.application.routes.draw do

  devise_for :admins, path: 'admin', controllers: { sessions: 'admin/sessions' }
  devise_for :doctors, path: 'auth', controllers: { omniauth_callbacks: 'omniauth_callbacks',
                                                    sessions: 'sessions',
                                                    registrations: 'registrations',
                                                    passwords: 'passwords' }
  get 'templates(/*url)' => 'application#templates'

  root 'static_pages#landing', as: :root

  post 'doctors/new_visit' => 'public/profiles#create_visit'
  delete 'doctors/remove_visit' => 'public/profiles#remove_visit'

  scope 'doctors/:username' do
    get '/' => 'public/profiles#public'
    get 'profile' => 'public/profiles#profile'
    get 'visits' => 'public/profiles#visits'
  end

  namespace :doctor do
    root 'cabinet#index'
    resource :profile, only: [:show, :update]
    resources :cabinet, only: [:index]
    resources :patients do
      collection do
        post 'search'
        get 'autocomplete'
      end
    end
    resources :visits
    resources :journals do
      member do
        get 'print'
        get 'download'
      end
    end
    resources :dicts
    resource :settings, only: [:show, :update]
  end

  namespace :admin do
    get '' => 'index#index'
    #справочники
    get '/value-lists/:name' => 'value_lists#show'
    match '/value-lists/:name' => 'value_lists#update', via: [:put, :patch]
    resources :doctors
    resources :patients
    resources :admins
  end
end
