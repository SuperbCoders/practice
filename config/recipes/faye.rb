set :faye_user, "w3dev-pract"
set :faye_pid, "#{current_path}/tmp/pids/faye.pid"

namespace :faye do
  desc "Setup Faye initializer"
  task :setup do
    on roles(:app) do
      # template "faye_init", "/tmp/faye_init"
      from = "faye_init"
      to = "/tmp/faye_init"
      template_path = File.expand_path("../templates/#{from}", __FILE__)
      template = ERB.new(File.new(template_path).read).result(binding)
      upload! StringIO.new(template), to
      execute "chmod 644 #{to}"

      # template 'faye_init', '/tmp/faye_init', 0750, 'deployer', 'www-run' ,locals: { 'local1' => 'value local 1'}
      # template 'faye_init', '/tmp/faye_init', 0750, locals: { 'local1' => 'value local 1'}
      # template 'faye_init', '/tmp/faye_init', locals: { 'local1' => 'value local 1'}

      execute "chmod +x /tmp/faye_init"
      # execute "#{sudo} mv /tmp/faye_init /etc/init.d/faye_#{fetch(:application)}"
      # execute "#{sudo} update-rc.d -f faye_#{fetch(:application)} defaults"
      execute "mv /tmp/faye_init /etc/init.d/faye_#{fetch(:application)}"
      execute "update-rc.d -f faye_#{fetch(:application)} defaults"
    end
  end
  # after "deploy:setup", "faye:setup"

  # %w[start stop restart].each do |command|
  #   desc "#{command} faye"
  #   task command do
  #     on roles(:app) do
  #       run "service faye_#{application} #{command}"
  #     end
  #   end
  #   after "deploy:#{command}", "faye:#{command}"
  # end
end
