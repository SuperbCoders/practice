class Public::ProfilesController < ApplicationController
  # include ActionView::Helpers::JavaScriptHelper
  layout 'public'

  before_filter :find_doctor
  before_filter :access_filter
  before_filter :find_patient, only: [:create_visit]

  def public
  end

  def create_visit
    if @patient
      @visit = @doctor.visits.new(doctor: @doctor, patient: @patient)
      @visit.start_at = visit_params[:start]
      @visit.duration = visit_params[:duration]
      @visit.created_by = ''
      @visit.save
    end
    if @visit.persisted?
      # "message" is needed for popup otherwise it will be failed
      Notification.create doctor_id: @doctor.id, patient_id: @visit.patient_id, start_at: @visit.start_at, visit_id: @visit.id, notification_type: 'visit_created', message: 'Новая запись на прием'
    end
    render json: serialize_resource(@visit, Doctor::VisitSerializer)
  end

  def remove_visit
    visit = Visit.find(params[:id])
    doctor_id = visit.doctor_id
    patient_id = visit.patient_id
    start_at = visit.start_at
    if Visit.destroy(params[:id])
      # "message" is needed for popup otherwise it will be failed
      Notification.create doctor_id: doctor_id, patient_id: patient_id, start_at: start_at, notification_type: 'visit_canceled', message: 'Пациент отменил запись на прием'
    end
    head 204
  end

  def visits
    render json: @doctor.public_visits(params[:start], params[:end])
  end

  def profile
    result = {}
    if @doctor
      result = serialize_resource(@doctor, Doctor::DoctorSerializer)
    end
    render json: result
  end

  private

  def patient_params
    params.fetch(:patient).permit!
  end

  def visit_params
    params.permit(:start, :duration)
  end

  def find_doctor
    @doctor = Doctor.find_by(username: params[:username])
  end

  def access_filter
    unless @doctor && (@doctor.profile_open? || current_doctor == @doctor)
      redirect_to root_path
    end
  end

  def find_patient
    if patient_params[:email]
      @patient = @doctor.patients.find_by(email: patient_params[:email])
      if not @patient
        @patient = @doctor.patients.new(email: patient_params[:email], password: Patient.temporary_password)
      end
    else
      @patient = @doctor.patients.new(email: Patient.temporary_email, password: Patient.temporary_password)
    end
    @patient.full_name = patient_params.fetch(:name, @patient.email)
    @patient.cart_color = 0
    if @patient.save
      if patient_params[:phone]
        @patient.contacts.phone.find_or_create_by(data: patient_params[:phone])
      end
      @doctor.appointments.find_or_create_by(patient: @patient)
    end
  end
end
