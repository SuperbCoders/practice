class Doctor::AttachmentSerializer < Doctor::BaseSerializer
  attributes :file, :deleted

  def deleted
    object.try(:is_deleted)
  end

  def file
    "/upload/#{object.file}"
  end

end