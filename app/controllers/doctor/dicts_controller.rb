class Doctor::DictsController < Doctor::BaseController
  include Concerns::Resource

  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy edit)

  def create
    dict = doctor.dicts.find_or_create_by(dict_value: dict_params[:dict_value], dict_type: Dict.dict_types[:journal_tag])

    send_json dict, resource_serializer
  end

  def index
    @response[:dicts] = Dict.default + doctor.dicts
    @response[:success] = true
    send_response(@response)
  end

  def resource_scope
    Dict
  end

  def resource_serializer
    Doctor::DictSerializer
  end

  def resource_symbol
    :dict
  end

  def update
    super
  end

  def search_by
    [:dict]
  end

  def permitted_params
    [ :dict_value, :id ]
  end

  private

  def dict_params
    params.require(:dict).permit(:dict_value)
  end

end
