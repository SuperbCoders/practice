class User < BaseModel
  rolify
  self.table_name = 'users'

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
end
