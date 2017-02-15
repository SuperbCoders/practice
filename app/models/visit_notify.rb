class VisitNotify
  def send_notifications
    Visit.where(soon_notify_sent: false).each do |v|
      v.send_soon_notify!
    end
  end
end
