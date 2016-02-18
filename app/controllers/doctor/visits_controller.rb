class Doctor::VisitsController < Doctor::BaseController
  include Concerns::Resource

  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy edit)

  def resource_scope
    Visit
  end

  def resource_serializer
    Doctor::VisitSerializer
  end

  def resource_symbol
    :visit
  end

  def update
    super
  end

  def search_by
    [:email]
  end

  def permitted_params
    [ :_id,:id ]
  end

end
