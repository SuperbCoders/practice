class Admin::MailTemplatesController < Admin::BaseController

  def index
    mailers = MailersGathererService.run
    render json: { mailers: mailers }
  end

  def show
    mailer_slug = params[:mailer_slug]
    email_slug = params[:email_slug]
    template_path = MailerTemplatesChecker.run(mailer_slug, email_slug)
    result = {
      email: {
        name: email_slug.humanize.titlecase,
        template: File.read(template_path)
      }
    }
    render json: result
  end

  def update
    mailer_slug = params[:mailer_slug]
    email_slug = params[:email_slug]
    template = params.fetch(:template, '')
    template_path = MailerTemplatesChecker.run(mailer_slug, email_slug)
    File.write(template_path, template)
    head :ok
  end

end
