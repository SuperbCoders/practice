require 'faye'
# Ruby: Faye::Logging.log_level = :debug
# JS: Faye.Logging.logLevel = 'debug'
Faye::Logging.log_level = :debug
faye_server = Faye::RackAdapter.new(:mount => '/faye', :timeout => 45)
run faye_server
