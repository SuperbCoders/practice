class Admin::BaseController < ApplicationController

  before_action { @doctor = current_doctor }
  layout 'admin'
end
