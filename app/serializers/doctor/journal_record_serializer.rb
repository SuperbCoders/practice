class Doctor::JournalRecordSerializer < Doctor::BaseSerializer
  attributes :body, :journal_id, :tag, :created_at, :updated_at, :attachments, :deleted


  def deleted
    object.try(:deleted?)
  end

  def attachments
    serialize_resources(object.attachments.where(is_deleted: false), Doctor::AttachmentSerializer)
  end

end