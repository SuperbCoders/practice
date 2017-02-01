class Admin::BaseController < ApplicationController

  before_action { @doctor = current_doctor }
  before_action :authenticate_admin!
  layout 'admin'
end
