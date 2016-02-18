module Attachable
  # Concern by github/corehook based on
  # https://github.com/adonespitogo/angular-base64-upload/
  extend ActiveSupport::Concern

  included do

  end



  # Attach one base64 file and save path to array attr
  def attach_to_array(attribute_name, base64_file)
    resource = self
    resource[attribute_name] ||= Array
    resource[attribute_name] = write_base64_file(base64_file)
    resource.save
  end

  # Attach one base64 file and save path to attribute_name
  def attach(attribute_name, base64_file)
    resource = self
    resource[attribute_name] = write_base64_file(base64_file)
    resource.save
  end

  # Deattach from array
  def detach_from_array(attribute_name, file_path)
    resource = self
    result = false

    files_list = resource[attribute_name]

    if file_list.is_a? Array
      files_list.map { |array_file_name|
        if array_file_name.include? file_path
          if destroy_file(array_file_name)
            files_list.delete(array_file_name)
          end
        end
      }

    end

    result
  end

  # Deattach full array
  def detach_array(attribute_name)
    resource = self

    if resource[attribute_name].is_a? Array
      resource[attribute_name].map { |file_path|
        detach_from_array(attribute_name, file_path)
      }

      resource[attribute_name] = []
      resource.save
    end
  end

  # Deattach attachment and delete file
  def detach(attribute_name)
    resource = self
    if resource[attribute_name] and destroy_file(self[attribute_name])
      self.update_attributes(attribute_name => nil)
    end
  end

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
