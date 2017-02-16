module Concerns::AdminMailsMenu
  extend ActiveSupport::Concern

  included do

    before_action :set_mails_menu_items

    def set_mails_menu_items
      @mails_menu_items = MailersGathererService.run
    end

  end


end