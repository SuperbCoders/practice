class Doctor::PatientsController < Doctor::BaseController
  include Concerns::Resource

  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy edit)

  def create
    logger.info "Patient #{@resource.to_json}"
    @resource.password = Patient.temporary_password
    @resource.register_date = DateTime.now

    if @resource.save
      logger.info "-> params #{params.to_json}"
      logger.info "-> resource_params #{resource_params.to_json}"

      # Gender
      case resource_params[:gender]
        when 'male' then @resource.male!
        when 'female' then @resource.female!
      end

      # Avatar
      if params[:patient][:avatar]
        @resource.attach(:avatar, params[:patient][:avatar])
      end

      # Phones
      params[:patient][:phones].map { |phone_data|
        @resource.contacts.create(contact_type: Contact.contact_types[:phone],
            data: phone_data[:number])
      } if params[:patient][:phones]


      current_doctor.appointments.create(patient: @resource)

      @response[:success] = true
      @response[:messages] << t('doctor.messages.patient_succefully_created')
      @response[:patient] = serialize_resource(@resource, Doctor::PatientSerializer)
    else
      @response[:errors] += @resource.errors.full_messages
    end
    send_response @response
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

  def update
    super
  end

  def search_by
    [:email]
  end

  def permitted_params
    [   :first_name,
        :last_name,
        :email,
        :gender,
        :weight,
        :height,
        :blood,
        :diseases,
        :habits,
        :profession,
        :comment,
        :contract_id,
        :register_date,
        :phones,
        :avatar]
  end

end
