# coding: utf-8
require 'spec_helper'

describe 'refetch events bug', type: :feature, js: true do
  it 'test' do
    doctor = Doctor.create!(email: 'test@test.com', password: '12345678', password_confirmation: '12345678')
    warden_login doctor
    patient = doctor.patients.create!(full_name: 'test patient')
    # patient = doctor.patients.create!(full_name: 'test patient', cart_color: 0)
    now = Time.now
    format = now.strftime '%Y-%m-%d'
    start = DateTime.strptime("#{format}T11:30:00+04:00", '%Y-%m-%dT%H:%M:%S%z')
    patient.visits.create!(doctor: doctor, start_at: start, duration: 30)
    visit root_path
    # pry
    sleep 1
    # expect(all('.day_info_block').size).to eq 1
    expect(page).to have_selector('.day_info_block', count: 1)
    # pry
    find('.day_info_block .patient_info textarea').set 'Текст с описанием пациента'
    # sleep 5
    find("tr[data-time='12:00:00']").click()
    expect(page).to have_field 'Имя пациента'
    fill_in 'Имя пациента', with: 'patient'
    # pry
    # sleep 1
    find('.new_patient_btn').click()
    pry
    # must not keep entered text of field when patients change in form
  end
end
