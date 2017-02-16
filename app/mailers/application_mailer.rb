class ApplicationMailer < ActionMailer::Base
  default from: "noreply-dev-pract@onomnenado.ru"
  default template_path: "mailers/#{self.name.underscore}"
  layout false
end
