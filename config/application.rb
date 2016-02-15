require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Practice
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
    config.generators do |generate|
      generate.template_engine :haml
      generate.helper false
      generate.assets false
      generate.view_specs false
      generate.views false
    end

    config.action_view.logger = nil
    config.time_zone = 'Europe/Moscow'

    config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    config.i18n.default_locale = :en
    config.i18n.locale = :en
    config.i18n.enforce_available_locales = true
    I18n.config.enforce_available_locales = true
    config.autoload_paths += %W(#{config.root}/lib)

    config.templates_path = Rails.root.join('app', 'views', 'templates')
    config.assets.paths << Rails.root.join("vendor", "assets", "bower_components")
    config.assets.paths << Rails.root.join("vendor", "assets", "bower_components", "bootstrap", "assets", "fonts")

    config.generators.assets = false
    config.generators.helper = false
    config.generators.views = false
    config.generators.controller_specs = false
    config.generators.views_specs = false
    config.active_record.raise_in_transactional_callbacks = true


    # Avatar upload path
    config.upload_path = Rails.root.join('public', 'upload').to_s
  end
end
