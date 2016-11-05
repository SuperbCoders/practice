module Alertable
  extend ActiveSupport::Concern

  included do
    Rails.logger.debug "__ALERTS REG #{name}"
    attr_accessor :messages

    after_create  {
      Rails.logger.debug "AL C"
      add_message("#{self.class.name} - #{I18n.t('concerns.alertable.succefull_created')}")
    }
    after_save    {
      Rails.logger.debug "AL S"
      add_message("#{self.class.name} - #{I18n.t('concerns.alertable.succefull_updated')}")
    }

    def add_message(message)
      if self.valid?
        self.messages ||= []
        self.messages << message if not self.messages.include? message
      end
    end

  end


end
