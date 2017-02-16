class MailersGathererService

  def self.run
    new.run
  end

  def initialize
    Dir['app/mailers/*.rb'].each { |f| require File.basename(f, '.rb') }
  end

  def run
    mailers.map do |m|
      {
        name: humanized_mailer_name(m),
        slug: mailer_slug(m),
        emails: humanized_mailer_emails(m)
      }
    end
  end

  def mailers
    ActionMailer::Base.descendants
  end

  def humanized_mailer_name(mailer)
    mailer.name.underscore.humanize.titlecase
  end

  def mailer_slug(mailer)
    mailer.name.underscore
  end

  def humanized_mailer_emails(mailer)
    mailer_emails(mailer).map do |email|
      {
        name: humanized_email_name(email),
        slug: email_slug(email)
      }
    end
  end

  def mailer_emails(mailer)
     mailer.instance_methods(false)
  end

  def humanized_email_name(email)
    email = email.to_s
    email.humanize.titlecase
  end

  def email_slug(email)
    email.to_s
  end
end