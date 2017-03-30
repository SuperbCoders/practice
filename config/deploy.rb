# config valid only for current version of Capistrano
lock '3.4.0'

set :repo_url, 'git@github.com:SuperbCoders/practice.git'
set :log_level, :debug
set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')
set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system public/uploads public/upload app/views/mailers/templates}
set :application, 'practice'

set :rails_env, fetch(:development)
set :sidekiq_monit_use_sudo, false
set :sidekiq_queue, %w(mailers)

namespace :deploy do

  # before :starting, :bower do
  #   on roles(:app), in: :sequence, wait: 5 do
  #     within release_path do
  #       execute :rake, 'bower:install'
  #     end
  #   end
  # end

  desc "reload the database with seed data"
  task :seed do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        with rails_env: fetch(:rails_env) do
          execute :rake, 'db:seed'
        end
      end
    end
  end

  after :restart, :clear_cache do
    invoke 'unicorn:restart'

    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        # execute :rake, 'cache:clear'
        # execute :rake, 'seed:all'
      end
    end

  end

  after :publishing, :restart

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
    end
  end

end

namespace :bower do
  desc 'Install bower'
  task :install do
    on roles(:web) do
      within release_path do
        execute :rake, "bower:install['-f']"
      end
    end
  end
end

# before 'deploy:compile_assets', 'bower:install'

# set :faye_pid, "#{deploy_to}/shared/pids/faye.pid"
# set :faye_config, "#{deploy_to}/current/faye.ru"

# namespace :faye do
#   desc "Start Faye"
#   task :start do
#     on roles(:web) do
#       set :faye_pid, "#{fetch(:deploy_to)}/shared/pids/faye.pid"
#       set :faye_config, "#{fetch(:deploy_to)}/current/faye.ru"
#       within release_path do
#         with rails_env: fetch(:rails_env) do
#           execute :bundle, "exec rackup #{fetch(:faye_config)} -s thin -E production -D --pid #{fetch(:faye_pid)}"
#         end
#       end
#     end
#   end

#   desc "Stop Faye"
#   task :stop do
#     on roles(:web) do
#       set :faye_pid, "#{fetch(:deploy_to)}/shared/pids/faye.pid"
#       set :faye_config, "#{fetch(:deploy_to)}/current/faye.ru"
#       within release_path do
#         with rails_env: fetch(:rails_env) do
#           execute :kill, "`cat #{fetch(:faye_pid)}` || true"
#         end
#       end
#     end
#   end
# end

# # before 'deploy:updating', 'faye:stop'
# # after 'deploy:updated', 'faye:start'

# after 'deploy:publishing', 'faye:stop'
# after 'deploy:publishing', 'faye:start'

load "config/recipes/upload_erb.rb"
load "config/recipes/faye.rb"
