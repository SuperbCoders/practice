module Attachable
  # Concern by github/corehook based on
  # https://github.com/adonespitogo/angular-base64-upload/
  extend ActiveSupport::Concern

  included do
  end

  # Save base64 file and save path to file in attribute_name
  def attach(attribute_name, base64_file)
    resource = self
    resource[attribute_name] = write_base64_file(base64_file)
    resource.save
  end

  def write_base64_file(file)
    # file[:base64] = base64 file data
    # file[:filename] = file name
    # file[:filetype] = image/jpeg
    upload_file_path = nil
    begin

      upload_file_path = file_path(file)

      File.open(upload_file_path, "wb") { |f|
        if File.writable? upload_file_path and f.write(Base64.decode64(file[:base64]))
          return upload_file_path
        end
      }

    rescue
      upload_file_path = nil
    end
    upload_file_path
  end

  def file_path(file)
    if file.has_key? :filename and file[:filename].split('.').length >= 2
      file_type = file[:filename].split('.')[-1]
    else
      file_type = 'dat'
    end

    "#{Rails.application.config.upload_path}/#{random_string}.#{file_type}"
  end

  def random_string
    "#{rand(2**256).to_s(36)[0..32]}"
  end


end

