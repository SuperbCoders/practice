# coding: utf-8
require 'spec_helper'

describe 'test', type: :feature, js: true do
  def setup1
    @doctor = Doctor.create!(email: 'test@test.com', password: '12345678', password_confirmation: '12345678')
    warden_login @doctor
    @patient = @doctor.patients.create!(full_name: 'test patient')
    @visit1 = @patient.visits.create!(doctor: @doctor, start_at: Time.now + 1.hour, duration: 30)
  end

  def setup2
    @doctor = Doctor.create!(email: 'test@test.com', password: '12345678', password_confirmation: '12345678')
    warden_login @doctor
    @patient = @doctor.patients.create!(full_name: 'test patient')
    @visit1 = @patient.visits.create!(doctor: @doctor, start_at: Time.now + 1.hour, duration: 30)
    @visit2 = @patient.visits.create!(doctor: @doctor, start_at: Time.now + 1.day + 1.hour, duration: 30)
  end

  def visit1_active_caption
    "Изменить прием на #{Russian::strftime(@visit1.start_at.in_time_zone('Europe/Samara'), '%d %b, в %H:%M')}"
  end

  def visit2_active_caption
    "Изменить прием на #{Russian::strftime(@visit2.start_at.in_time_zone('Europe/Samara'), '%d %b, в %H:%M')}"
  end

  def create_visit_caption
    'Записать на прием'
  end

  def start_visit_caption
    'Начать прием'
  end

  def visit1_start
    Timecop.travel Time.now + 1.hour
    VisitNotify.send_notifications
  end

  def visit1_end
    Timecop.travel Time.now + 1.day
    VisitNotify.send_notifications
  end

  def wait
    sleep 2
  end

  it 'schedule: visit doesnt change button on visit end notify' do
    setup2
    visit root_path
    wait
    expect(find('.day_info_block .patient_btn').text).to eq visit1_active_caption
    visit1_end
    wait
    expect(find('.day_info_block .patient_btn').text).to eq visit1_active_caption
  end

  it 'patient list: visit change button to first closest next visit if there are such' do
    setup2
    visit root_path
    wait
    click_on 'Пациенты'
    wait
    expect(find('.patient_unit .patient_btn').text).to eq visit1_active_caption
    visit1_end
    wait
    expect(find('.patient_unit .patient_btn').text).to eq visit2_active_caption
  end

  it 'patient list: visit change button to start visit when time of visit come' do
    setup1
    visit root_path
    wait
    click_on 'Пациенты'
    wait
    expect(find('.patient_unit .patient_btn').text).to eq visit1_active_caption
    visit1_start
    wait
    expect(find('.patient_unit .patient_btn').text).to eq start_visit_caption
  end

  it 'patient list: visit change button to create visit if there no more visits' do
    setup1
    visit root_path
    wait
    click_on 'Пациенты'
    wait
    expect(find('.patient_unit .patient_btn').text).to eq visit1_active_caption
    visit1_end
    wait
    expect(find('.patient_unit .patient_btn').text).to eq create_visit_caption
  end

  it 'patient journal: first visit should gone when end notify received' do
    setup2
    visit root_path
    wait
    find('.day_info_block .patient_avatar').click
    wait
    expect(all('.patient_card .patient_btn').size).to eq 2
    visit1_end
    wait
    expect(all('.patient_card .patient_btn').size).to eq 1
    expect(find('.patient_card .patient_btn').text).to eq visit2_active_caption
  end
end
