class Doctor::BaseController < ApplicationController
  before_action :authenticate_doctor!
  layout 'doctor'

end
