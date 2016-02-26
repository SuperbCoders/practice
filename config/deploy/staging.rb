
set :stage, :staging

role :app, %w{w3dev-pract@ono.rrv.ru:2223}
role :web, %w{w3dev-pract@ono.rrv.ru:2223}
role :db,  %w{w3dev-pract@ono.rrv.ru:2223}

set :application, 'dev-practice'
set :deploy_to, '/www/dev-pract.onomnenado.ru'
ask :branch, proc { `git rev-parse --abbrev-ref HEAD`.chomp }

set :format, :pretty
set :log_level, :debug
set :pty, true
# set :branch, '05f2ef93572b05ca5708e26b0b00ccfdbfa22ea5'
