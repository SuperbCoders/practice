class Doctor::ProfilesController < Doctor::BaseController
  include Concerns::Resource

  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy edit)

  def update
    if @resource.update_attributes(resource_params)

      logger.info "Params #{doctor_params}"

      # Office open/closed
      if doctor_params[:office]
        @resource.office_open!
      else
        @resource.office_closed!
      end

      # Profile open/closed
      if doctor_params[:profile]
        @resource.profile_open!
      else
        @resource.profile_closed!
      end

      # Avatar
      [:avatar, :public_avatar].map do |av_type|
        if not params[:doctor][av_type].is_a? String
          @resource.attach(av_type, params[:doctor][av_type])
        end

      end

      # Phones & Emails
      ['phone', 'email'].map do |c_type|
        logger.info "#{c_type} -> #{params[:doctor][c_type.pluralize.to_sym]}"
        if params[:doctor][c_type.pluralize.to_sym]
          params[:doctor][c_type.pluralize.to_sym].map { |c_data|
            logger.info "Add #{c_type.to_sym} with #{c_data}"
            @resource.contacts.find_or_create_by(contact_type: Contact.contact_types[c_type.to_sym], data: c_data['data'])
          }
        end

      end

      if doctor_password_params[:password]
        @resource.password = doctor_password_params[:password]
        if @resource.save
          sign_in(@resource, bypass: true)
        end
      end


    end
    send_json serialize_resource(@resource, resource_serializer), @resource.valid?
  end

  def find_resource
    @resource = current_doctor
  end

  def show
    send_json serialize_resource(@resource, resource_serializer ), true
  end

  def resource_scope
    Doctor
  end

  def resource_serializer
    Doctor::DoctorSerializer
  end

  def resource_symbol
    :doctor
  end

  def search_by
    [:profile]
  end

  def doctor_params
    params.fetch(:doctor).permit([:avatar, :public_avatar, :emails, :phones, :office, :profile] + permitted_params)
  end

  def doctor_password_params
    params.require(:doctor).permit(:password)
  end

  def permitted_params
    [   :first_name,
        :last_name,
        :email,
        :gender,
        :weight,
        :height,
        :phones,
        :birthday,
        :specialty,
        :education,
        :experience,
        :about,
        :vk_id,
        :fb_id,
        :twitter_id]
  end

  private


end
