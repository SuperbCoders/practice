class Doctor::JournalRecordSerializer < Doctor::BaseSerializer
  attributes :body, :journal_id, :tag, :created_at, :updated_at, :attachments


  def attachments
    serialize_resources(object.attachments, Doctor::AttachmentSerializer)
  end

end