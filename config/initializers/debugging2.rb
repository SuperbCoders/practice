if Rails.env.development?
  class Object
    def _p1 message = nil
      if message
        Rails.logger.debug "DEBUG22, #{message}"
      else
        Rails.logger.debug "DEBUG22 NO MSG, #{caller[1]}"
      end
    end
  end
end
