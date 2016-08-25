role :app, %w{w3dev-pract@ono.rrv.ru:2223}
role :web, %w{w3dev-pract@ono.rrv.ru:2223}
role :db,  %w{w3dev-pract@ono.rrv.ru:2223}

set :application, 'dev-practice'
set :deploy_to, '/www/dev-pract.onomnenado.ru'
set :branch, 'master'