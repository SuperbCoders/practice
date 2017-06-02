module WaitForAjax
  def wait_for_ajax
    # Timeout.timeout(Capybara.default_wait_time) do
    Timeout.timeout(5) do
      loop until finished_all_ajax_requests?
    end
  end

  def finished_all_ajax_requests?
    page.evaluate_script('jQuery.active').zero?
  end
end
