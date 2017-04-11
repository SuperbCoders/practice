require 'faye'
require 'faye/redis'

notifications = Faye::RackAdapter.new(
  :mount => '/faye',
  :timeout => 5,
  :engine => {
    :type => Faye::Redis,
    :host => '127.0.0.1'
  }
)

Faye::WebSocket.load_adapter('thin')
run notifications
