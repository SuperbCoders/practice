class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action { @response = {success: false, messages: [], errors: []} }

  def serialize_resources(resources, serializer)
    ActiveModel::SerializableResource.new(
        resources,
        each_serializer: serializer,
        scope: current_doctor,
        root: false
    ).serializable_hash
  end

  def serialize_resource(resource, serializer)
    ActiveModel::SerializableResource.new(
        resource,
        serializer: serializer,
        scope: current_doctor,
        root: false
    ).serializable_hash
  end

  def templates
    if Rails.env == 'development'
      render '/templates/' + params[:url], layout: false
    else
      begin
        render '/templates/' + params[:url], layout: false
      rescue Exception => e
        render nothing: true, layout: false
      end
    end
  end

end
