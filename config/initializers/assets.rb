Rails.application.config.assets.version = '1.0'
Rails.application.config.assets.precompile += %w( admin.js admin.css )
Rails.application.config.assets.precompile += %w( doctor.css doctor.js )
Rails.application.config.assets.precompile += %w( patient.js patient.css )
Rails.application.config.assets.precompile += %w( public.js public.css )
Rails.application.config.assets.precompile += %w( static/landing.js static/landing.css )
