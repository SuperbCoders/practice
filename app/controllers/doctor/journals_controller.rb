class Doctor::JournalsController < Doctor::BaseController
  include Concerns::Resource

  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy edit)

  def resource_scope
    current_doctor.journals
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
    [ :_id,:id ]
  end

end
