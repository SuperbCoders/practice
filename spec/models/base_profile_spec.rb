require 'rails_helper'

RSpec.describe BaseProfile, type: :model do
  SOCIAL_TYPES = [:fb, :twitter, :vk]
  PHONE_TYPES = [:mobile, :work]
  CONTACT_TYPES = [:phone, :email, :social]

  let(:base_profile) { BaseProfile.create(first_name: "Test", last_name: 'Test') }

  it { is_expected.to have_fields(:first_name, :last_name, :birthday, :avatar)}
  it { is_expected.to validate_presence_of(:first_name) }
  it { is_expected.to validate_presence_of(:last_name) }

  it 'can be male' do
    base_profile.male!
    expect(base_profile).to be_male
  end

  it 'can be female' do
    base_profile.female!
    expect(base_profile).to be_female
  end

  it 'should return name' do
    expect(base_profile.name).eql? 'Test Test'
  end

  it 'can upload avatar' do
    avatar_params = {
        filename: 'test_avatar.png',
        base64: Base64::encode64(SecureRandom.hex),
        filetype: 'image/png'
    }

    expect(base_profile.change_avatar(avatar_params)).to be_truthy
    expect(base_profile.avatar).not_to be_nil

    expect(File.exist?(base_profile.avatar)).to be_truthy

    base_profile.destroy_avatar
    expect(base_profile.avatar).to be_nil
  end

  it 'can destroy avatar' do
    avatar_params = {
        filename: 'test_avatar.png',
        base64: Base64::encode64(SecureRandom.hex),
        filetype: 'image/png'
    }

    expect(base_profile.change_avatar(avatar_params)).to be_truthy
    expect(base_profile.avatar).not_to be_nil

    expect(File.exist?(base_profile.avatar)).to be_truthy

    avatar_path = base_profile.avatar
    base_profile.destroy_avatar
    expect(File.exist?(avatar_path)).not_to be_truthy
  end

  it { is_expected.to have_many(:contacts).with_dependent(:destroy).of_type(Contact) }

  context(:contact) {
    CONTACT_TYPES.map { |contact_type|

      case contact_type
        when :phone
          data = Faker::PhoneNumber.phone_number
          data_type = PHONE_TYPES.sample
        when :email then data = Faker::Internet.safe_email
        when :social
          data = ['http://vk.com/id1', 'http://facebook.com/id2', 'http://twitter.com/corehook'].sample
          data_type = SOCIAL_TYPES.sample
      end

      it "can save #{contact_type} as contact" do
        contact = base_profile.contacts.create(type: contact_type, data: data, data_type: data_type)
        expect(contact.data).eql? data
        expect(contact.type).eql? contact_type
        expect(contact.data_type).eql? data_type
      end
    }
  }

  it 'should respond to change_avatar' do
    expect(base_profile).respond_to? :change_avatar
  end
end
