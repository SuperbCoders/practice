Rails.application.routes.draw do
  get 'templates(/*url)' => 'application#templates'
  root 'doctor/cabinet#index'

  namespace :doctor do
    resources :patients
    resources :visits
  end

  namespace :admin do
    get '' => 'index#index'

    resources :doctors
    resources :patients
  end
end
