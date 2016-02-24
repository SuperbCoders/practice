module Alertable
  extend ActiveSupport::Concern

  included do
    attr_accessor :messages

    after_save {
      if self.valid?
        self.messages ||= []
        message = "#{self.class.name} - #{I18n.t('concerns.alertable.succefull_updated')}"
        self.messages << message if not self.messages.include? message
      end
    }
  end


end
