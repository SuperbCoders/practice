# coding: utf-8
require 'spec_helper'

describe 'not show day info block if no events', type: :feature, js: true do
  it 'hidden when no events' do
    doctor = Doctor.create!(email: 'test@test.com', password: '12345678', password_confirmation: '12345678')
    warden_login doctor
    patient = doctor.patients.create!(full_name: 'test patient')
    patient.visits.create!(doctor: doctor, start_at: Time.now, duration: 30)
    visit root_path
    expect(all('.day_info_block').size).to eq 1
    # pry
  end

  it 'showed when events' do
    doctor = Doctor.create!(email: 'test@test.com', password: '12345678', password_confirmation: '12345678')
    warden_login doctor
    visit root_path
    # close new visit welcome
    find('.ui-dialog-titlebar-close').click
    pry
    expect(all('.day_info_block').size).to eq 0
  end

  it 'still working in float mode' do
    doctor = Doctor.create!(email: 'test@test.com', password: '12345678', password_confirmation: '12345678')
    warden_login doctor
    visit root_path
    click_on 'Неделя'
    expect(all('.day_info_block').size).to eq 0
    find('.some calendar area').click
    expect(all('.day_info_block').size).to eq 1
  end
end
