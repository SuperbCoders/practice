class Doctor::PatientsController < Doctor::BaseController
  include Concerns::Resource

  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy edit)

  def index
    if params[:archivated]  == "true"
      @resources = current_doctor.patients.archivated
    else
      @resources = current_doctor.patients
    end

    # if params[:query]
    #   @resources = @resources.where("lower(full_name) like :query or lower(email) like :query", 
    #     query: "%" + params[:query].to_s.mb_chars.downcase.strip + "%") 
    # end

    super
  end

  def update
    if @resource and @resource.update_attributes(resource_params)

      # Avatar
      if params[:patient][:avatar].is_a? Hash
        @resource.attach(:avatar, params[:patient][:avatar])
      end

      # Rhesus
      case params[:rhesus]
        when '+' then @resource.rhesus = true
        when '-' then @resource.rhesus = false
      end

      # Gender
      case params[:gender]
        when 'male' then @resource.male!
        when 'female' then @resource.female!
      end

      # Phones
      params[:phones].map { |phone_data|
        @resource.contacts.find_or_create_by(contact_type: Contact.contact_types[:phone],
            data: phone_data[:data])
      } if params[:phones]

    end

    send_json serialize_resource(@resource, resource_serializer), true
  end

  def create
    
    if @resource.save
      # Avatar
      if params[:patient][:avatar].is_a? Hash
        @resource.attach(:avatar, params[:patient][:avatar])
      end

      # Rhesus
      case resource_params[:rhesus]
        when '+' then @resource.rhesus = true
        when '-' then @resource.rhesus = false
      end

      # Gender
      case resource_params[:gender]
        when 'male' then @resource.male!
        when 'female' then @resource.female!
      end

      # Phones
      params[:patient][:phones].map { |phone_data|
        @resource.contacts.create(contact_type: Contact.contact_types[:phone],
            data: phone_data[:data])
      } if params[:patient][:phones]

      @resource.save
    end

    send_json serialize_resource(@resource, Doctor::PatientSerializer), @resource.id?
    # send_response @response
  end

  def resource_scope
    current_doctor.patients
  end

  def resource_serializer
    Doctor::PatientSerializer
  end

  def resource_symbol
    :patient
  end

  def search_by
    [:email]
  end

  def permitted_params
    [   :full_name,
        :email,
        :gender,
        :weight,
        :rhesus,
        :height,
        :blood,
        :diseases,
        :birthday,
        :habits,
        :profession,
        :comment,
        :contract_id,
        :register_date,
        :phones,
        :in_archive,
        :cart_color]
  end

end
