module Alertable
  extend ActiveSupport::Concern

  included do
    attr_accessor :messages

    def add_message(message)
      self.messages ||= []
      self.messages << message if not self.messages.include? message
    end
  end
end
