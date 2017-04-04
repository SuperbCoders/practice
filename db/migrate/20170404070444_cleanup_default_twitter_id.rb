class CleanupDefaultTwitterId < ActiveRecord::Migration
  def up
    Doctor.where(twitter_id: 'https://twitter.com/').update_all(twitter_id: '')
  end
end
