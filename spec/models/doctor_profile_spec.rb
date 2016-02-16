require 'rails_helper'

RSpec.describe DoctorProfile, type: :model do
  let(:doctor) { FactoryGirl.build(:doctor_profile) }

  it { is_expected.to belong_to(:doctor).of_type(Doctor) }

  it 'should respond to change_public_avatar' do
    expect(doctor).respond_to? :change_public_avatar
  end

  it 'can upload public_avatar' do
    avatar_params = {
        filename: 'test_avatar.png',
        base64: Base64::encode64(SecureRandom.hex),
        filetype: 'image/png'
    }

    expect(doctor.change_public_avatar(avatar_params)).to be_truthy
    expect(doctor.public_avatar).not_to be_nil

    expect(File.exist?(doctor.public_avatar)).to be_truthy

    doctor.destroy_public_avatar
  end

  it 'can destroy public_avatar' do
    avatar_params = {
        filename: 'test_avatar.png',
        base64: Base64::encode64(SecureRandom.hex),
        filetype: 'image/png'
    }

    expect(doctor.change_public_avatar(avatar_params)).to be_truthy
    expect(doctor.public_avatar).not_to be_nil

    expect(File.exist?(doctor.public_avatar)).to be_truthy

    avatar_path = doctor.public_avatar
    doctor.destroy_public_avatar
    expect(File.exist?(avatar_path)).not_to be_truthy
  end

  it { is_expected.to have_fields(:specialty, :education, :experience, :about, :public_avatar) }

  it { is_expected.to have_many(:contacts) }

  [:profile, :office].map { |status_type|
    [:open, :closed].map { |status|
      it "can #{status} #{status_type}" do
        doctor.send("#{status_type}_#{status}!")
        expect(doctor[:status_type]).eql? "#{status_type}_#{status}"
      end
    }

  }

  it { is_expected.to embed_one(:setting).of_type(GlobalSetting) }
end
