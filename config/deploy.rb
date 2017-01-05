# config valid only for current version of Capistrano
lock '3.4.0'

set :repo_url, 'git@github.com:SuperbCoders/practice.git'
set :log_level, :debug
set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')
set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system public/uploads public/upload}

set :rails_env, fetch(:development)

namespace :deploy do

  before :starting, :bower do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        # execute :rake, 'bower:install'
      end
    end
  end

  desc "reload the database with seed data"
  task :seed do
    on roles(:app), in: :sequence, wait: 5 do
      within release_path do
        execute :rake, 'db:seed'
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

before 'deploy:compile_assets', 'bower:install'
