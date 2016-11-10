#
# Cookbook Name:: neu-service
# Recipe:: default
#
# Copyright 2012 (c) Neustar, Inc.
#
# All rights reserved - Do Not Redistribute
#

# we need curl, make sure it's there
package "curl" do
  action :install
end

package "zip" do
  action :install
end

# TODO, support multiple services per machine
service_name = node['neu_service']['name']

installed_ver = node['neu_service'][service_name]['installed'] rescue nil
on_deck_ver = node['neu_service'][service_name]['on_deck'] rescue nil

if on_deck_ver != nil && on_deck_ver != '' && installed_ver != on_deck_ver 

  log ("Installing #{service_name} current: #{installed_ver.inspect} on_deck: #{on_deck_ver.inspect}")
  include_recipe 'neu-service::install'

else
  log ("Not installing #{service_name} current: #{installed_ver.inspect} on_deck: #{on_deck_ver.inspect}")

end

