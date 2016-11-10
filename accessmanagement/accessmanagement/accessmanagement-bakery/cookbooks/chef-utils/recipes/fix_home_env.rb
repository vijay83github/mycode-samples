#
# Cookbook Name:: nexus_fixes
# Recipe:: default
#
# Copyright 2012, YOUR_COMPANY_NAME
#
# All rights reserved - Do Not Redistribute
#

ruby_block "fix home env" do
  block do
    require 'etc'
    user_dir = Etc.getpwuid.dir
    if Chef::Config[:user_home].nil? || Chef::Config[:user_home] == "" 
      Chef::Log.info("Fixing Chef::Config[:user_home] to #{user_dir}")
      Chef::Config[:user_home] = user_dir
    end
    if ENV['HOME'].nil? || ENV['HOME'] == ""
      Chef::Log.info("Fixing ENV['HOME'] to #{user_dir}")
      ENV['HOME'] = user_dir
    end

    begin
      test_path = File.expand_path('~/.nothing')
    rescue => e
      Chef::Log.error("Error, fixing the home env didnt work! rescue: #{e}")
    end
  end
end

