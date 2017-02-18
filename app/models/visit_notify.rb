class VisitNotify
  class << self
    def send_notifications
      Visit.where('start_at <= ?', Time.now + 5.minutes).where(soon_notify_sent: false).each do |visit|
        puts "send_soon_notify for #{visit.id}"
        visit.send_soon_notify!
      end

      Visit.where("start_at + duration * interval '60 second' <= ?", Time.now).where(end_notify_sent: false).each do |visit|
        puts "send_end_notify for #{visit.id}"
        visit.send_end_notify!
      end
      nil
    end
  end
end
