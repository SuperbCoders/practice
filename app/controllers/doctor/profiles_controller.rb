class Doctor::ProfilesController < Doctor::BaseController
  include Concerns::Resource

  before_action :find_resources, only: %w(index)
  before_action :new_resource, only: %w(create new)
  before_action :find_resource, only: %w(show update update_password destroy edit)

  def update
    if @resource.update_attributes(resource_params)

      # Office open/closed
      if doctor_params[:office]
        @resource.office_open!
      else
        @resource.office_closed!
      end

      # Profile open/closed
      if doctor_params[:profile]
        @resource.profile_open!
      else
        @resource.profile_closed!
      end

      # Avatar
      [:avatar, :public_avatar].map do |av_type|
        if not params[:doctor][av_type].is_a? String
          @resource.attach(av_type, params[:doctor][av_type])
        end
      end

      # Delete phones
      if params[:doctor][:phones]
        phone_ids = phone_ids_to_delete params[:doctor][:phones]
        phone_ids.each do |phone_id|
          @resource.contacts.where(contact_type: Contact.contact_types[:phone], id: phone_id).delete_all
        end
      end

      # Phones & Emails
      ['phone', 'email'].map do |c_type|
        if params[:doctor][c_type.pluralize.to_sym]
          params[:doctor][c_type.pluralize.to_sym].map { |c_data|
            if c_data['id']
              @resource.contacts.find(c_data['id']).update!(
                data: c_data['data']
              )
            else
              unless c_data['data'].blank?
                @resource.contacts.find_or_create_by(
                  contact_type: Contact.contact_types[c_type.to_sym],
                  data: c_data['data']
                )
              end
            end
          }
        end
      end

      # Schedule settings
      schedule_settings_params.map { |work_schedule|
        if work_schedule[:days]
          work_schedule[:days].map { |day_schedule|
            next if day_schedule.to_i.zero?
            schedule = WorkSchedule.find_or_create_by(doctor_id: current_doctor.id, day: day_schedule, start_at: work_schedule[:start_at], finish_at: work_schedule[:finish_at])
          }
        end
      }

      # Delete
      WorkSchedule.where(doctor: current_doctor).all.each do |w_schedule|
        found = false
        schedule_settings_params.map { |work_schedule|
          if work_schedule[:days]
            work_schedule[:days].map { |day_schedule|
              next if day_schedule.to_i.zero?
              if w_schedule.day == day_schedule.to_i && w_schedule.start_at == work_schedule[:start_at] && w_schedule.finish_at == work_schedule[:finish_at]
                found = true
                break
              end
            }
            break if found
          end
        }
        unless found
          w_schedule.delete
        end
      end
    end

    if @resource.valid?
      @resource.add_message t('doctor.messages.profile_succefully_updated')
    end
    send_json serialize_resource(@resource, resource_serializer), @resource.valid?
  end

  def update_password
    if doctor_password_params[:password]
      @resource.password = doctor_password_params[:password]
      if @resource.save
        sign_in(@resource, bypass: true)
      end
    end
    send_json serialize_resource(@resource, resource_serializer), @resource.valid?
  end

  def find_resource
    @resource = current_doctor
  end

  def show
    send_json serialize_resource(@resource, resource_serializer ), true
  end

  def resource_scope
    Doctor
  end

  def resource_serializer
    Doctor::DoctorSerializer
  end

  def resource_symbol
    :doctor
  end

  def search_by
    [:profile]
  end

  def doctor_params
    params.fetch(:doctor).permit([:avatar, :public_avatar, :emails, :phones, :office, :profile] + permitted_params)
  end

  def schedule_settings_params
    params.require(:doctor).fetch(:work_schedules)
  end

  def doctor_password_params
    params.require(:doctor).permit(:password)
  end

  def permitted_params
    [   :first_name,
        :username,
        :last_name,
        :email,
        :before_schedule,
        :stand_time,
        :gender,
        :weight,
        :height,
        :phones,
        :birthday,
        :specialty,
        :education,
        :experience,
        :about,
        :vk_id,
        :fb_id,
        :twitter_id,
        :start_screen_shown,
        :public_phone]
  end

  private

  def phone_ids_to_delete phones
    received_ids = phones.map { |e| e[:id] }.compact
    existing_phones = @resource.contacts.where(contact_type: Contact.contact_types[:phone]).all
    matching_ids = existing_phones.select { |e| received_ids.include? e.id }.map { |e| e.id }
    existing_phones.map { |e| e.id } - matching_ids
  end
end
