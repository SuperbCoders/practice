class ApplicationMailer < ActionMailer::Base

  layout false

  default from: "noreply-dev-pract@onomnenado.ru"
  default template_path: "mailers/templates/#{self.name.underscore}"

  before_action :check_template

  private

  def check_template
    MailerTemplatesChecker.run(mailer_name, action_name)
  end


end
