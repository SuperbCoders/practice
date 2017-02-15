class VisitNotify
  class << self
    def send_notifications
      Visit.where('start_at <= ?', Time.now + 10.minutes).where(soon_notify_sent: false).each do |visit|
        visit.send_soon_notify!
      end
    end
  end
end
