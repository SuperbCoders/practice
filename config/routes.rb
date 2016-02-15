Rails.application.routes.draw do

  namespace :patient do
    get 'cabinet/index'
  end

  namespace :doctor do
    get 'cabinet/index'
  end

end
