if Rails.env.development?
  class Object
    def _debug message
      Rails.logger.debug "DEBUG, #{message}"
    end
  end
end
