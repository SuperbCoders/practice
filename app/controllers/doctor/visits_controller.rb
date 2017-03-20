class Doctor::VisitsController < Doctor::BaseController
  include Concerns::Resource

  before_action :find_resources, only: %w(index)
  before_action :find_resource, only: %w(show update destroy edit)

  def index
    visit_start = params[:start]
    visit_end = params[:end]
    visits = []
    @resources.find_each do |visit|
      if visit.end < visit_end.to_datetime and visit.start >= visit_start.to_datetime
        visits.push serialize_resource(visit, resource_serializer)
      end
    end

    send_json visits, true
  end

  def create
    if params[:visit][:completed_patient]
      @patient = doctor.patients.find(params[:visit][:completed_patient][:id])
    else
      @patient = doctor.patients.where('lower(full_name) = lower(?)', params[:visit][:patient_data][:full_name]).first
    end

    if @patient
      @response[:visit] = current_doctor.create_visit(visit_params, @patient)
    else
      @patient = current_doctor.create_patient(patient_params)

      if @patient.valid?
        @response[:messages] << t('doctor.messages.patient_succefully_created')
        @patient.contacts.phone.create(data: params[:visit][:patient_data][:phone])
        @response[:visit] = current_doctor.create_visit(visit_params, @patient)
      else
        @response[:errors] += @patient.errors.full_messages
      end
    end

    if @response[:visit]
      unless @response[:visit].new_record?
        @response[:messages]<< t('visit.messages.visit_succefully_created')
        @response[:success] = true
      else
        @response[:errors] += @response[:visit].errors.full_messages
      end
    end

    send_response @response
  end


  def update
    if @resource.update(visit_params)
      @response[:messages] << t('visit.messages.visit_succefully_updated')
      @response[:success] = true
    else
      @response[:errors] << @resource.errors.full_messages
    end

    send_response @response
  end

  def resource_scope
    doctor.visits
  end

  def resource_serializer
    Doctor::VisitSerializer
  end

  def resource_symbol
    :visit
  end

  def search_by
    [:visit]
  end

  private

  def patient_params
    params[:visit][:patient_data].permit(Patient.new.attributes.keys)
  end

  def visit_params
    params[:visit][:visit_data].permit(Visit.new.attributes.keys)
  end

end
