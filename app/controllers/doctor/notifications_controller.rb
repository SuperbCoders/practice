class Doctor::NotificationsController < Doctor::BaseController
  include Concerns::Resource

  before_action :log_params
  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy)

  # def search_proxy
  #   resource_scope.where(patient_id: params[:patient_id])
  # end

  def resource_scope
    doctor.notifications.order(created_at: :desc)
  end

  def resource_serializer
    Doctor::NotificationSerializer
  end

  def resource_symbol
    :notification
  end

  def search_by
    [:id]
  end

  # def permitted_params
  #   [:patient_id, journal_records_attributes: [:id, :tag, :body]]
  # end

end
