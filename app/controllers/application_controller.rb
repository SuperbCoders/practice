class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  include Concerns::CounterCode

  before_action { @response = {success: false, messages: [], errors: []} }
  before_action :_set_current_session
  
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

  protected
  def _set_current_session
    # Define an accessor. The session is always in the current controller
    # instance in @_request.session. So we need a way to access this in
    # our model
    accessor = instance_variable_get(:@_request)

    # This defines a method session in ActiveRecord::Base. If your model
    # inherits from another Base Class (when using MongoMapper or similar),
    # insert the class here.
    ActiveRecord::Base.send(:define_method, "session", proc {accessor.session})
  end

end
