module Concerns::CounterCode
  extend ActiveSupport::Concern

  included do

    before_action :set_counter_code

    def set_counter_code
      @counter_code = SystemSettings.find_by(slug: 'counter_code').try(:value)
    end

  end


end