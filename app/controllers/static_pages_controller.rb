class StaticPagesController < ActionController::Base
  layout 'static'

  include Concerns::CounterCode
  include Concerns::LandingData

  def landing
    if doctor_signed_in?
      redirect_to doctor_root_path
    end
  end

  def why
  end

  def how
  end

  def requisites
  end
end
