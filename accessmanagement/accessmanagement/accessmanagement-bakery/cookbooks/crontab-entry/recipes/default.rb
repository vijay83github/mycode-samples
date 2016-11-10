cookbook_file "accessMgmtScheduler.sh" do
  path "/usr/local/bin/accessMgmtScheduler.sh"
  mode 0755 
  action :create_if_missing
end
  cron "add cron tab entry" do
    action :create
    hour "*"
    minute "*/30"
	command "/usr/local/bin/accessMgmtScheduler.sh"
  end