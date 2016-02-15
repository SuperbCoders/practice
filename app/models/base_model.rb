class BaseModel
  include Mongoid::Document
  include Mongoid::Timestamps::Short
  include GlobalID::Identification
  include SimpleEnum::Mongoid

  include Alertable

  private

  def destroy_file(file_path)
    result = false
    begin
      if File.exist?(file_path) and File.delete(file_path)
        result = true
      end
    rescue Exception => e

    end
    result
  end

end
