class Doctor::JournalsController < Doctor::BaseController
  include Concerns::Resource

  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy)
  before_action :set_journal, only: %w(create)

  def create
    logger.info "params -> #{params.to_json}"
    logger.info "journal_params -> #{journal_params}"
    logger.info "Journal #{@journal.id}"

    journal_records.map { |jr|
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
    doctor.journals
  end

  def resource_serializer
    Doctor::JournalSerializer
  end

  def resource_symbol
    :journal
  end

  def update
    super
  end

  def search_by
    [:email]
  end

  def permitted_params
    [ :id,:patient_id, :journal_records, :body, :tag]
  end

  private

  def set_journal
    @journal = doctor.journals.where(patient_id: journal_params[:patient_id]).create
  end

  def journal_records
    if params[:journal][:journal_records]
      params[:journal][:journal_records]
    else
      []
    end
  end

  def journal_params
    params.fetch(:journal).permit(:journal_records, :patient_id)
  end
end
