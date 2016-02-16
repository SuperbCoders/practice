namespace :seed do
  task :all => :environment do
    Rake::Task['seed:doctors'].execute
    Rake::Task['seed:patients'].execute
  end

  desc 'seed doctors'
  task :doctors => :environment do
    [
        {email: 'corehook@gmail.com', password: 'corehook'},
        {email: 'doctor@gmail.com', password: 'doctorpassword'}
    ].map { |u|
      User.find_or_create_by(u) do |doctor|
        puts "Doctor #{doctor.email} created"
        doctor.add_role :doctor
      end
    }
  end

  task :patients => :environment do
    [
        {email: 'patient@gmail.com', password: 'patientpatient'}
    ].map { |u|
      User.find_or_create_by(u) do |patient|
        puts "Patient #{patient.email} created"
        patient.add_role :patient
      end
    }
  end
end