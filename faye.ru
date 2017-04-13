# require 'faye'
# # Ruby: Faye::Logging.log_level = :debug
# # JS: Faye.Logging.logLevel = 'debug'
# Faye::Logging.log_level = :debug
# faye_server = Faye::RackAdapter.new(:mount => '/faye', :timeout => 45)
# run faye_server

require 'faye'
require 'faye/redis'

Faye::Logging.log_level = :debug
notifications = Faye::RackAdapter.new(
  :mount => '/faye',
  :timeout => 5,
  # :engine => {
  #   :type => Faye::Redis,
  #   :host => '127.0.0.1'
  # }
)

Faye::WebSocket.load_adapter('thin')
run notifications
