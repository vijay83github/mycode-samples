#
# Cookbook Name:: package_install
# Recipe:: default
#
# Copyright (C) 2014 Neustar
#
# All rights reserved - Do Not Redistribute
#

#Check if any package is defined
unless node['package_install']['package_list']
	raise <<-EOS
	Package list not provided.

	Please provide a comma separated list of packages that needs to be installed. Use node.default['package_install']['package_list'] attribute to define the list.
	EOS
end

#Update apt cache
execute "update_apt_cache" do 
	command "apt-get update"
end

package_list = node['package_install']['package_list']
packages = package_list.split(",")

#Loop through each package and install it
packages.each do |pkg|
	package pkg do
		action :install
	end
end