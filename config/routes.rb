Rails.application.routes.draw do

  devise_for :users
  namespace :patient do
    get 'cabinet/index'
  end

  namespace :doctor do
    get 'cabinet/index'
  end

end
