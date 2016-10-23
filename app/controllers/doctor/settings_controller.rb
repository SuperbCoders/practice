class Doctor::SettingsController < Doctor::BaseController
  include Concerns::Resource

  def show
    send_json serialize_resource(current_doctor.get_settings, resource_serializer), true
  end

  def update
    current_doctor.get_settings.update_attributes(setting_params)
  end

  def resource_scope
    Setting
  end

  def resource_serializer
    Doctor::SettingsSerializer
  end

  private

  def setting_params
    params.require(:setting).permit(:calendar_view, :standart_shedule_interval)
  end
end
