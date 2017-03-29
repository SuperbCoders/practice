role :app, %w{w3practica@ono.rrv.ru:2222}
role :web, %w{w3practica@ono.rrv.ru:2222}
role :db,  %w{w3practica@ono.rrv.ru:2222}

set :application, 'practice'
set :deploy_to, '/www/practica.cc'
set :branch, 'master'
