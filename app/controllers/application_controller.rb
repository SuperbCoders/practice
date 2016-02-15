class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action { @response = {success: false, messages: [], errors: []} }

  def serialize_resources(resources, serializer)
    ActiveModel::SerializableResource.new(
        resources,
        each_serializer: serializer,
        root: false
    ).serializable_hash
  end

  def serialize_resource(resource, serializer)
    ActiveModel::SerializableResource.new(
        resource,
        serializer: serializer,
        root: false
    ).serializable_hash
  end
end
