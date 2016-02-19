class Doctor::VisitsController < Doctor::BaseController
  include Concerns::Resource

  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy edit)

  def index
    visit_start = params[:start]
    visit_end = params[:end]
    visits = []
    @resources.where("start_at > ?", visit_start).map { |visit|
      if visit.end < visit_end.to_datetime
        visits.push serialize_resource(visit, resource_serializer)
      end
    }

    send_json visits, true
  end

  def create
    @patient = doctor.patients.find_by(email: patient_params[:email])

    if @patient
      @response[:visit] = create_visit
    else
      @patient = Patient.create(
          email: patient_params[:email],
          password: Patient.temporary_password,
          register_date: DateTime.now)

      if @patient.valid?
        @response[:messages] << t('doctor.messages.patient_succefully_created')

        @patient.contacts.phone.create(data: patient_params[:phone])

        doctor.appointments.create(patient: @patient)

        @response[:visit] = create_visit
      else
        @response[:errors] += new_patient.errors.full_messages
      end
    end

    if @response[:visit] and @response[:visit].id
      logger.info "->>"
      logger.info "#{@response[:visit].valid?}"
      logger.info "#{@response[:visit].errors.full_messages}"
      @response[:messages]<< t('visit.messages.visit_succefully_created')
      @response[:success] = true
    else
      @response[:errors] += @response[:visit].errors.full_messages
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

  def update
    super
  end

  def search_by
    [:visit]
  end

  def permitted_params
    [ :start_at, :duration, :comment, :id ]
  end

  private

  def create_visit
    if @patient and @patient.valid?
      doctor.visits.create(patient: @patient,
          start_at: resource_params[:start_at],
          duration: doctor.default_visit_duration)
    end
  end

  def patient_params
    params.require(:visit).require(:patient).permit(:email, :first_name, :phone, :comment)
  end

end
