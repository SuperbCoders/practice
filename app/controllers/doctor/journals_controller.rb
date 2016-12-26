class Doctor::JournalsController < Doctor::BaseController
  include Concerns::Resource

  before_action :log_params
  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy)
  before_action :set_journal, only: %w(create)

  def search_proxy
    resource_scope.where(patient_id: params[:patient_id])
  end

  def update
    if @resource
      journal_records_params.map { |jr|
        next if not jr[:body]

        if jr[:id]
          jr_obj = @resource.journal_records.find_by(id: jr[:id])
        else
          jr_obj = @resource.journal_records.create(body: jr[:body],tag:  jr[:tag])
        end

        if jr_obj
          jr_obj.body = jr[:body]
          jr_obj.tag = jr[:tag]

          if jr_obj.save && jr[:attachments]

            jr[:attachments].map { |jr_file|

              # Delete journal record attachment if preset id and delete=true
              if jr_file[:id] and jr_file[:delete]
                logger.info "Mark as deleted ID #{jr_file[:id]} - #{jr_file[:file]}"
                jr_attach = jr_obj.attachments.find_by(id: jr_file[:id])
                logger.info "Deleted #{jr_attach.file}"
                jr_attach.delete! if jr_attach
              elsif not jr_file[:id]
                jr_obj.attachments.create do |jr_attach|
                  jr_attach.attach(:file, jr_file)
                end
              end
            }
          end

          jr_obj.delete! if jr[:id] and jr[:delete]
        end
      }
    end

    send_json(serialize_resource(@resource, resource_serializer), true)
  end

  def create
    journal_records_params.map { |jr|
      next if not jr[:body]

      jr_obj = @journal.journal_records.create(body: jr[:body],tag:  jr[:tag])

      if jr_obj.save && jr[:attachments]

        jr[:attachments].map { |jr_file|
          jra = jr_obj.attachments.create
          jra.attach(:file, jr_file)
          logger.info "File #{jr_file[:filename]} attached"
        }
      end
    }
    send_json serialize_resource(@journal, resource_serializer), true
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
    [ :id,:patient_id, :journal_records, :body, :tag]
  end

  private

  def set_journal
    @journal = doctor.journals.where(patient_id: journal_params[:patient_id]).create
  end

  def journal_records_params
    if params[:journal][:journal_records]
      params[:journal][:journal_records]
    elsif params[:journal_records]
      params[:journal_records]
    else
      []
    end
  end

  def journal_params
    params.fetch(:journal).permit(:journal_records, :patient_id)
  end
end
