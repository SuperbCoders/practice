module Concerns::LandingData
  extend ActiveSupport::Concern

  included do

    before_action :load_practice_phone

    def load_practice_phone
      @practice_phone = SystemSettings.find_by(slug: 'practice_phone').try(:value)
    end

  end


end