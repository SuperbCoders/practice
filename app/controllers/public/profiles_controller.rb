class Public::ProfilesController < ApplicationController
  # include ActionView::Helpers::JavaScriptHelper
  layout 'public'

  before_filter :find_doctor
  before_filter :find_patient, only: [:create_visit]

  def public

  end

  def create_visit
    logger.info "Dirty #{params}"
    logger.info "Visit #{visit_params}"

    if @patient
      @visit = @doctor.visits.new(doctor: @doctor, patient: @patient)
      @visit.start_at = visit_params[:start]
      @visit.duration = visit_params[:duration]
      @visit.save
    end

    logger.info @visit.errors.full_messages

    if @visit.persisted?
      data = {message: 'Новая запись на прием'}
      Notification.create doctor_id: @doctor.id, data: data
    end

    render json: serialize_resource(@visit, Doctor::VisitSerializer)
  end

  def remove_visit
    doctor_id = Visit.find(params[:id]).doctor_id
    if Visit.destroy(params[:id])
      data = {message: 'Пациент отменил запись на прием'}
      Rails.logger.debug "doctor_id: #{doctor_id}"
      Notification.create doctor_id: doctor_id, data: data
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
    Rails.logger.debug "params: #{params}"
    Rails.logger.debug "params[:username]: #{params[:username]}"
    @doctor = Doctor.find_by(username: params[:username])
  end

  def find_patient
    logger.info "Patient #{patient_params}"

    if patient_params[:email]
      @patient = Patient.find_by(email: patient_params[:email])
      if not @patient
        @patient = Patient.new(email: patient_params[:email], password: Patient.temporary_password)
      end
    else
      @patient = Patient.new(email: Patient.temporary_email, password: Patient.temporary_password)
    end

    @patient.first_name = patient_params.try(:name)

    if @patient.save
      if patient_params[:phone]
        @patient.contacts.phone.find_or_create_by(data: patient_params[:phone])
      end

      @doctor.appointments.find_or_create_by(patient: @patient)
    end

  end

  private

  # def to_javascript_hash hash
  #   "JSON.parse(\"#{escape_javascript(hash.to_json)}\")"
  # end
end
