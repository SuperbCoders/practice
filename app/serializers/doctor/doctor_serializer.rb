class Doctor::DoctorSerializer < Doctor::BaseSerializer
  attributes :email, :first_name, :last_name, :name, :avatar, :public_avatar,
      :gender, :birthday, :specialty, :education, :experience, :about, :office,
      :profile, :vk_id, :fb_id, :twitter_id, :phones, :emails, :doctor_stand_times,
      :doctor_before_schedule, :before_schedule, :stand_time, :work_schedules, :phone,
      :username, :start_screen_shown, :has_visits, :public_phone, :initials, :errors

  def work_schedules
    @schedule = {}
    @result = []
    object.work_schedules.map { |work_schedule|
      index = "#{work_schedule.start_at} #{work_schedule.finish_at}"
      @schedule[index] ||= {days: []}
      @schedule[index][:days] << work_schedule.day.to_s
      @schedule[index][:finish_at] = work_schedule.finish_at
      @schedule[index][:start_at] = work_schedule.start_at
    }

    @schedule.each_with_index do |sc, index|
      @result << {days: sc[1][:days], start_at: sc[1][:start_at], finish_at: sc[1][:finish_at]}
    end
    @result
  end

  def doctor_before_schedule
    @before = []
    Dict.doctor_before_schedule.default.map {|dst|
      @before << {type: dst.dict_type, name: "#{dst.dict_value} часа до приема", value: dst.dict_value.to_i}
    }
    @before
  end

  def doctor_stand_times
    @times = []
    Dict.doctor_stand_time.default.map {|dst|
      @times << {type: dst.dict_type, name: "#{dst.dict_value} минут", value: dst.dict_value.to_i}
    }
    @times
  end

  def avatar
    "/upload/#{object.avatar}" if object.avatar
  end

  def public_avatar
    # if object.try(:public_avatar)
    #   return "/upload/#{object.public_avatar}"
    # else
    #   "/i/user_1.png"
    # end
    "/upload/#{object.public_avatar}" if object.public_avatar
  end

  def phones
    object.contacts.phone
  end

  def emails
    object.contacts.email
  end

  def office
    object.office_open?
  end

  def profile
    object.profile_open?
  end

  def has_visits
    object.visits.any?
  end

  def errors
    # byebug
    object.valid?
    object.errors.full_messages
  end
end
