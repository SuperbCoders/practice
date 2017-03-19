class Doctor::PatientsController < Doctor::BaseController
  include Concerns::Resource

  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy edit)

  def index
    if params[:archivated]  == "true"
      @resources = current_doctor.patients.archivated
                   .order('updated_at DESC')
    elsif params[:unsigned] == "true"
      @resources = Patient
                   .where(in_archive: false)
                   .joins('INNER JOIN visits ON visits.patient_id = patients.id')
                   .where('visits.start_at > ?', Time.now.to_date)
                   .where("visits.created_by != 'doctor'")
                   .where(doctor_id: current_doctor.id)
                   .select('DISTINCT patients.*')
                   .order('patients.updated_at DESC')
    elsif params[:signed] == "true"
      @resources = Patient
                   .where(in_archive: false)
                   .joins('INNER JOIN visits ON visits.patient_id = patients.id')
                   .where('visits.start_at > ?', Time.now.to_date)
                   .where("visits.created_by = 'doctor'")
                   .where(doctor_id: current_doctor.id)
                   .select('DISTINCT patients.*')
                   .order('patients.updated_at DESC')
    else
      @resources = current_doctor.patients.where(in_archive: false)
                   .order('updated_at DESC')
    end
    super
  end

  def update
    if @resource.update_attributes(resource_params)

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
      if params[:phones]
        phone_ids = phone_ids_to_delete params[:phones]
        phone_ids.each do |phone_id|
          @resource.contacts.where(contact_type: Contact.contact_types[:phone], id: phone_id).delete_all
        end
      end

      params[:phones].map { |phone_data|
        if phone_data[:id]
          @resource.contacts.where(contact_type: Contact.contact_types[:phone], id: phone_data[:id]).first.update(data: phone_data[:data])
        else
          unless phone_data[:data].blank?
            @resource.contacts.create(contact_type: Contact.contact_types[:phone], data: phone_data[:data])
          end
        end
      } if params[:phones]

    end

    if @resource.valid?
      @resource.add_message t('patient.messages.patient_succefully_updated')
    end
    send_json serialize_resource(@resource, resource_serializer), @resource.valid?
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

    # if @resource.id?
    #   @resource.add_message t('patient.messages.patient_succefully_created')
    # end
    send_json serialize_resource(@resource, Doctor::PatientSerializer), @resource.id?
  end

  def autocomplete
    if params[:full_name]
      patients = current_doctor.patients.includes(:contacts).where('lower(full_name) LIKE lower(?)', "%#{params[:full_name]}%")
    elsif params[:email]
      patients = current_doctor.patients.includes(:contacts).where('lower(email) LIKE lower(?)', "%#{params[:email]}%")
    elsif params[:phone]
      contacts = Contact.phone.where(contactable_id: current_doctor.patients.pluck(:id)).where(contactable_type: 'Patient').includes(:contactable).where('data LIKE ?', "%#{params[:phone]}%")
    else
      patients = []
    end

    if params[:phone]
      patients = contacts.map do |contact|
        if contact.contactable
          {
            id: contact.contactable.id,
            full_name: contact.contactable.full_name,
            email: contact.contactable.email,
            cart_color: contact.contactable.cart_color,
            phone: contact.data
          }
        else
          {}
        end
      end
    else
      patients = patients.map do |patient|
        {
          id: patient.id,
          full_name: patient.full_name,
          email: patient.email,
          cart_color: patient.cart_color,
          phone: patient.contacts.phone.first.try(:data)
        }
      end
    end

    send_json patients, true
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

  protected

  def phone_ids_to_delete phones
    received_ids = phones.map { |e| e[:id] }.compact
    existing_phones = @resource.contacts.where(contact_type: Contact.contact_types[:phone]).all
    matching_ids = existing_phones.select { |e| received_ids.include? e.id }.map { |e| e.id }
    existing_phones.map { |e| e.id } - matching_ids
  end
end
