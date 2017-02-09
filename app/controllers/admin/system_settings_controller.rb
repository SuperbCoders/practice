class Admin::SystemSettingsController < Admin::BaseController
  include Concerns::Resource

  skip_before_action :authenticate_admin!, only: :index

  def index
    settings = search_proxy.each_with_object({success: true}) { |s, o| o[s[:slug]] = s[:value] }
    send_response settings
  end

  def update
    settings = resource_params.map { |k, v| {slug: k, value: v}}
    settings.each do |s|
      SystemSettings.where(slug: s[:slug]).update_all(value: s[:value])
    end
    head 200
  end

  def resource_scope
    SystemSettings
  end

  def permitted_params
    [ :_id,:id, :counter_code]
  end

end
