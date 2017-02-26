class StaticPagesController < ActionController::Base

  include Concerns::CounterCode

  def landing
    if doctor_signed_in?
      redirect_to doctor_root_path
    end
  end
end
