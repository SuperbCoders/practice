require 'rails_helper'

RSpec.describe JournalRecord, type: :model do

  it { is_expected.to belong_to(:journal).of_type(Journal) }
  # каждое поле имеет тег (типа: «жалобы», «лечение»).
  # У каждой записи есть дата.
  it { is_expected.to have_field(:tag) }

  # к каждому полю можно прикреплять файлы.
  it { is_expected.to have_field(:attachments).of_type(Array) }


end
