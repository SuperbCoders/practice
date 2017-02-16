class Admin::BaseController < ApplicationController
  include Concerns::AdminMailsMenu

  before_action :authenticate_admin!
  layout 'admin'
end
