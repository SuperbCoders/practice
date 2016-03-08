class Doctor::AttachmentSerializer < Doctor::BaseSerializer
  attributes :file, :deleted

  def file
    "/upload/#{object.file}"
  end
end