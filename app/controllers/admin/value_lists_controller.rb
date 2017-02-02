class Admin::ValueListsController < Admin::BaseController
  include Concerns::Resource

  skip_before_action :authenticate_admin!

  def show
  	@value_list = ValueList.find_by(name: params[:name])
  	send_json serialize_resource(@value_list, resource_serializer), true
  end

  def resource_serializer
    Admin::ValueListSerializer
  end

  def resource_symbol
    :value_list
  end

  def update
    super
  end

end
