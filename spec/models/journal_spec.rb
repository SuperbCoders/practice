require 'rails_helper'

RSpec.describe Journal, type: :model do

  # Запись в карту видна и врачу и пациенту.
  # Тэги в мед. картах мы можем менять в админки для всех докторов

  it { is_expected.to have_field(:date).of_type(DateTime) }

  it { is_expected.to belong_to(:patient).of_type(Patient) }
  it { is_expected.to belong_to(:doctor).of_type(Doctor) }

  # Запись состоит из набора текстовых полей / записей
  it { is_expected.to have_many(:journal_records) }


end
