puts Dir.pwd
puts File.exist?('config/boot.rb')
# puts $LOAD_PATH

# require 'config/boot'
# require 'config/environment'

require_relative '../config/boot'
require_relative '../config/environment'

require 'clockwork'
include Clockwork

# handler do |job|
#   puts "Running #{job}"
# end

every(1.minutes, 'send_notifications.job') do
  VisitNotify.delay.send_notifications
end

# every(10.seconds, 'frequent.job')
# every(3.minutes, 'less.frequent.job')
# every(1.hour, 'hourly.job')

# every(1.day, 'midnight.job', :at => '00:00')
