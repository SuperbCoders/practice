# coding: utf-8
require 'spec_helper'

describe 'patient comment auto save', type: :feature, js: true do
  it 'working in schedule' do
    doctor = Doctor.create!(email: 'test@test.com', password: '12345678', password_confirmation: '12345678')
    warden_login doctor
    patient = doctor.patients.create!(full_name: 'test patient')
    patient.visits.create!(doctor: doctor, start_at: Time.now, duration: 30)
    visit root_path
    # pry
    # sleep 1
    # expect(all('.day_info_block').size).to eq 1
    expect(page).to have_selector('.day_info_block', count: 1)
    # pry
    find('.day_info_block .patient_info textarea').set 'Текст с описанием пациента'
    pry
    # must not keep entered text of field when patients change in form
  end
end
