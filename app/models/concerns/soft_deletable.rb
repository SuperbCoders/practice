module SoftDeletable
  extend ActiveSupport::Concern


  included do
    scope :only_deleted, -> { unscope(where: :is_deleted).where(is_deleted: true) }
    scope :not_deleted, -> { where(is_deleted: true) }
  end

  def deleted?
    is_deleted
  end

  def delete!
    set_deleted(true)
  end

  def restore!
    set_deleted(false)
  end

  def set_deleted(s)
    update_attribute :is_deleted, s if has_attribute? :is_deleted
  end


end