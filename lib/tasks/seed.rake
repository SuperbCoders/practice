namespace :seed do
  task :all => :environment do
    Rake::Task['seed:doctors'].execute
    Rake::Task['seed:patients'].execute
  end

  desc 'seed dicts'
  task :dicts => :environment do
    [
        {type: :doctor_stand_time, dict_value: '40'},
        {type: :doctor_stand_time, dict_value: '60'},
        {type: :doctor_stand_time, dict_value: '80'},
        {type: :doctor_before_schedule, dict_value: '4'},
        {type: :doctor_before_schedule, dict_value: '6'},
        {type: :doctor_before_schedule, dict_value: '8'}
    ].map { |d_type|
      Dict.find_or_create_by(dict_type: Dict.dict_types[d_type[:type]], dict_value: d_type[:dict_value])
    }
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