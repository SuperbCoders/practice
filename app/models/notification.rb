class Notification < ActiveRecord::Base
  after_create :push_notification
  belongs_to :doctor
  serialize :data, JSON

  def push_notification
    # PrivatePub.publish_to "/notifications/doctor/#{doctor_id}", data[:message]
    # PrivatePub.publish_to "/notifications", data[:message]
    uri = URI.parse("http://localhost:9292/faye")
    Rails.logger.debug "data: #{data.inspect}"
    message = { channel: "/notifications/doctor/#{doctor_id}", data: {message: data['message']} }
    Net::HTTP.post_form(uri, message: message.to_json)
  end
end
