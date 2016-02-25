namespace :seed do
  task :all => :environment do
    Rake::Task['seed:doctors'].execute
    Rake::Task['seed:dicts'].execute
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
      Doctor.find_or_create_by(email: u[:email], password: u[:password]) do |doctor|
        puts "Doctor #{doctor.email} created"
      end
    }
  end
end