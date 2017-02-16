class Admin::MailTemplatesController < Admin::BaseController

  require 'fileutils'

  def index
    mailers = MailersGathererService.run
    render json: { mailers: mailers }
  end

  def show
    mailer_slug = params[:mailer_slug]
    email_slug = params[:email_slug]
    template_path = get_template_path(mailer_slug, email_slug)
    prepare_template(template_path)
    result = {
      email: {
        name: 'TEST',
        template: File.read(template_path)
      }
    }
    render json: result
  end

  def update
    mailer_slug = params[:mailer_slug]
    email_slug = params[:email_slug]
    template = params.fetch(:template, '')
    template_path = get_template_path(mailer_slug, email_slug)
    prepare_template(template_path)
    File.write(template_path, template)
    head :ok
  end

  private

  def get_template_path(mailer_slug, email_slug)
    File.join(Rails.root, 'app', 'views', 'mailers', mailer_slug, email_slug) + '.erb'
  end

  def prepare_template(template_path)
    FileUtils.mkdir_p(File.dirname(template_path))
    FileUtils.touch(template_path)
  end

end
