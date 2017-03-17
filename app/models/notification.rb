class Notification < ActiveRecord::Base
  after_create :push_notification
  belongs_to :doctor
  belongs_to :patient
  belongs_to :visit
  serialize :data, JSON

  def push_notification
    if Rails.env.development?
      uri = URI.parse("http://localhost:9292/faye")
    else
      uri = URI.parse("http://0.0.0.0:9292/faye")
    end
    Rails.logger.debug "serialization: #{Doctor::NotificationSerializer.new(self).as_json.inspect}"
    message = { channel: "/notifications/doctor/#{doctor_id}", data: ActiveModel::Serializer::Adapter::Attributes.new(Doctor::NotificationSerializer.new(self)).as_json }
    begin
      Net::HTTP.post_form(uri, message: message.to_json)
    rescue StandardError
    end
  end
end
