class AddSocialNetworkToDoctor < ActiveRecord::Migration
  def change
    add_column :doctors, :vk_id, :string, default: 'https://vk.com/'
    add_column :doctors, :fb_id, :string, default: 'https://www.facebook.com/'
    add_column :doctors, :twitter_id, :string, default: 'https://twitter.com/'
  end
end
