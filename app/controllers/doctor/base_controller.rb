class Doctor::BaseController < ApplicationController
  before_action :authenticate_doctor!
  layout 'doctor'

  def doctor
    current_doctor
  end

end
