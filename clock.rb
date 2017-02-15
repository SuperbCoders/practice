require 'clockwork'
include Clockwork

handler do |job|
  puts "Running #{job}"
end

# every(1.day, 'midnight.job', at: '23:59') do
every(10.seconds, 'frequent.job') do
  t = Time.new Time.at(Time.new+100).to_s.sub(/\s.+\s/," 00:00:00 ")
  # ^ There must be a better way to do this, can't think right now.

  VisitNotify.delay.send_notifications
end

every(10.seconds, 'frequent.job')
every(3.minutes, 'less.frequent.job')
every(1.hour, 'hourly.job')

every(1.day, 'midnight.job', :at => '00:00')
