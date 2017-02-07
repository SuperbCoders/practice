class Admin::DoctorsController < Admin::BaseController
  include Concerns::Resource

  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update destroy edit)

  def resource_scope
    return Doctor unless params.has_key? :q
    q = params[:q]
    t = Doctor.arel_table
    Doctor.where(t[:first_name].matches("%#{q}%")
                   .or(t[:last_name].matches("%#{q}%"))
                   .or(t[:email].matches("%#{q}%")))
  end

  def resource_serializer
    Admin::DoctorSerializer
  end

  def resource_symbol
    :doctor
  end

  def update
    super
  end

  def search_by
    [:email]
  end

  def permitted_params
    [ :_id, :id ]
  end
end
