
include_recipe 'runit::default'

if !node['neu_service']['install_system_service']
  node.set['neu_service']['restart_service'] = false
end

neu_service_deploy node['neu_service']['name'] do
  artifact_ext node['neu_service']['pkg_ext']
  artifact_namespace node['neu_service']['service_namespace']
  artifact_log_path node['neu_service']['artifact_log_path']
  conf node['neu_service']['conf'] unless node['neu_service']['conf'].empty?
  owner node['neu_service']['user']
  group node['neu_service']['user']
  
  restart_service node['neu_service']['restart_service']
  install_system_service node['neu_service']['install_system_service']
  
end

