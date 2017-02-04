class Notification < ActiveRecord::Base
  after_create :send_faye

  def send_faye
    
  end
end
