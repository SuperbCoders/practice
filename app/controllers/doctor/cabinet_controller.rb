class Doctor::CabinetController < Doctor::BaseController
  def index
    @next_d = nil
    10.times { |i|
      @next_d = @next_d.nil? ? DateTime.now : (@next_d + i.hour - 5.minutes)
      Visit.create(doctor: Doctor.all.first,
          type: :unsigned,
          unsigned_patient: {name: Faker::Name.name},
          date: @next_d,
          duration: 60)
    }

  end
end
