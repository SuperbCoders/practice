class Identity < ActiveRecord::Base
  belongs_to :doctor

  validates :doctor, presence: true
  validates :provider, presence: true, inclusion: { in: ['facebook', 'vkontakte'] }
  validates :uid, presence: true
  validates :doctor_id, uniqueness: { scope: :provider }
  validates :uid, uniqueness: { scope: :provider }

end
