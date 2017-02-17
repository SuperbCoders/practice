require 'fileutils'

class MailerTemplatesChecker

  def self.run(mailer_name, action_name)
    new(mailer_name, action_name).run
  end

  def initialize(mailer_name, action_name)
    @mailer_name    = mailer_name
    @action_name    = action_name

    @mailers_templates_root = File.join(Rails.root, 'app', 'views', 'mailers')
    @default_template_ext   = '.erb'

    @dest_template =
      File.join(@mailers_templates_root, 'templates', @mailer_name, @action_name) + @default_template_ext
  end

  def run
    create_template unless template_exist?
    @dest_template
  end

  def template_exist?
    File.exist?(@dest_template)
  end

  def create_template
    default_template =
      File.join(@mailers_templates_root, 'default_templates', @mailer_name, @action_name) + @default_template_ext
    FileUtils.mkdir_p(File.dirname(@dest_template))
    FileUtils.cp(default_template, @dest_template)
  end
end