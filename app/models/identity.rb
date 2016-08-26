class Identity < ActiveRecord::Base
  belongs_to :doctor

  #validates :doctor, presence: true
  validates :provider, presence: true, inclusion: { in: ['facebook', 'vkontakte'] }
  validates :uid, presence: true
  validates :doctor_id, uniqueness: { scope: :provider }
  validates :uid, uniqueness: { scope: :provider }

  def self.find_for_oauth(auth)
    find_or_create_by(uid: auth.uid, provider: auth.provider)
  end

end
