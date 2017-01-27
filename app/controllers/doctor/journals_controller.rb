class Doctor::JournalsController < Doctor::BaseController
  include Concerns::Resource

  before_action :log_params
  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy)

  def search_proxy
    resource_scope.where(patient_id: params[:patient_id])
  end

  def update
    if (success = @resource.update(resource_params))
      params[:journal][:attachments].try(:each) do |file|
        attach = @resource.attachments.find_or_initialize_by(id: file.try(:[], :id)) do |new_file|
          new_file.filename = file[:filename]
        end
        if attach.new_record?
          attach.attach(:file, file)
        else
          attach.delete! if file.try(:[], :deleted)
        end
      end
    end

    send_json(serialize_resource(@resource, resource_serializer), success)
  end

  def create
    if (success = @resource.save)
      params[:journal][:attachments].try(:each) do |file|
        @resource.attachments.create(filename: file[:filename]).attach(:file, file)
      end
    end

    send_json serialize_resource(@resource, resource_serializer), success
  end

  def print
    @journal = Journal.find(params[:id])
    render layout: false
  end

  def resource_scope
    doctor.journals.order(created_at: :desc)
  end

  def resource_serializer
    Doctor::JournalSerializer
  end

  def resource_symbol
    :journal
  end

  def search_by
    [:id]
  end

  def permitted_params
    [:patient_id, journal_records_attributes: [:id, :tag, :body]]
  end

end
