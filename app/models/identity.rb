class Identity < ActiveRecord::Base
  # Для хранения авторизаций через соц. сети
  belongs_to :doctor

  #validates :doctor, presence: true
  validates :provider, presence: true, inclusion: { in: ['facebook', 'vkontakte'] }
  validates :uid, presence: true
  validates :doctor_id, uniqueness: { scope: :provider }
  validates :uid, uniqueness: { scope: :provider }
  after_commit :set_user_provider_id

  def self.find_for_oauth(auth)
    find_or_create_by(uid: auth.uid, provider: auth.provider, info: Identity.get_url(auth))
  end

  def self.create_user_identity(auth, current_user)
  	create(uid: auth.uid, provider: auth.provider, info: Identity.get_url(auth), 
      doctor: current_user)
  end

  def self.get_url(auth)
    case auth.provider
      when "vkontakte"
        auth.info.urls.Vkontakte
      when "facebook"
        "https://www.facebook.com/profile.php?id=" + auth.extra.raw_info.id.to_s
    end
  end

  protected
  def set_user_provider_id
  	if doctor
  		case provider
  		when "vkontakte"
  			doctor.update_attribute(:vk_id, info)
  		when "facebook"
  			doctor.update_attribute(:fb_id, info)
  		end
  	end
  end

end
