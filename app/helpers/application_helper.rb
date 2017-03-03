module ApplicationHelper
  # def private_pub_sign
  #   subscription = PrivatePub.subscription(:channel => channel)
  #   content_tag "script", :type => "text/javascript" do
  #     raw("PrivatePub.sign(#{subscription.to_json});")
  #   end

  def practice_counter_code
    @counter_code
  end

  def practice_phone
    @practice_phone || '+7 800 123-45-67'
  end
    
end
