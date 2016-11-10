# copyright (c) 2013 Neustar, Inc.
require 'time'
require 'fileutils'


#include Chef::Provider::ArtifactDeploy
def load_current_resource
  # if they don't want a system service, no way to restart
  @restart_service = @new_resource.restart_service
  if !@new_resource.install_system_service
    @restart_service = false
  end
  
  
  # if latest?(@new_resource.version) && from_http?(@new_resource.artifact_location)
  #   Chef::Application.fatal! "You cannot specify the latest version for an artifact when attempting to download an artifact using http(s)!"
  # end
  # 
  if @new_resource.name =~ /\s/
    Chef::Log.warn "Whitespace detected in resource name. Failing Chef run."
    Chef::Application.fatal! "The name attribute for this resource is significant, and there cannot be whitespace. The preferred usage is to use the name of the artifact."
  end
  
  @force = false
  #determine the version, either it was passed or set in the node
  version = @new_resource.artifact_version
  if version.nil?
    version = node['neu_service'][@new_resource.name]['on_deck']
    # if they are using the 'on_deck' method, then force it cause they really want it installed.
    @force = (version != nil && !version.empty?)
  end
  Chef::Log.info "artifact version: #{version}"
  @version = version

  @artifact_log_path = @new_resource.artifact_log_path
  if @artifact_log_path.nil?
    Chef::Log.info "artifact_log_path: #{@artifact_log_path}, using default."
    # default to: <service name>-<version>/logs
    @artifact_log_path = "#{new_resource.name}-#{@version}/logs"
  end
  
  @conf = @new_resource.conf
  if @conf.nil?
    Chef::Log.info "node.chef_environment = #{node.chef_environment}, node['chef_environment'] = #{node['chef_environment']}"
    @conf = node.chef_environment    
    Chef::Log.info "conf env: #{@conf}"
  end
  
  ## Artifact file
  possible_artifact_file = "#{@new_resource.name}-#{@version}.#{@new_resource.artifact_ext}"
  begin
    cookbook = run_context.cookbook_collection['neu-service']
    @artifact_file = cookbook.preferred_filename_on_disk_location(node, :files, possible_artifact_file)
  rescue => e
    Chef::Log.info "Couldn't find local file: #{possible_artifact_file}, will try remote."
  end
  
  
  # @release_path                = get_release_path
  # @current_path                = @new_resource.current_path
  # @shared_path                 = @new_resource.shared_path
  # @artifact_cache              = ::File.join(@new_resource.artifact_deploys_cache_path, @new_resource.name)
  # @artifact_cache_version_path = ::File.join(artifact_cache, artifact_version)
  # @previous_version_paths      = get_previous_version_paths
  # @previous_version_numbers    = get_previous_version_numbers
  # @manifest_file               = ::File.join(@release_path, "manifest.yaml")
  # @deploy                      = false

  @service_name                 = @new_resource.name
  @current_resource             = Chef::Resource::NeuServiceDeploy.new(@new_resource.name)

  @current_resource
end


action :deploy do
  # ..
  delegator = self
  
  before_deploy_delegator = Proc.new {
    delegator.run_proc_delegate :before_deploy
  }
  before_extract_delegator = Proc.new {
    delegator.run_proc_delegate :before_extract
  }
  after_extract_delegator = Proc.new {
    delegator.run_proc_delegate :after_extract
  }
  before_symlink_delegator = Proc.new {
    delegator.rm_logs_dir(release_path)
    delegator.run_proc_delegate :before_symlink
  }
  after_symlink_delegator = Proc.new {
    delegator.link_log_dir(shared_path)
    delegator.run_proc_delegate :after_symlink
  }
  configure_delegator = Proc.new {
    delegator.run_proc_delegate :configure
  }
  before_migrate_delegator = Proc.new {
    delegator.run_proc_delegate :before_migrate
  }
  migrate_delegator = Proc.new {
    delegator.run_proc_delegate :migrate
  }
  after_migrate_delegator = Proc.new {
    delegator.run_proc_delegate :after_migrate
  }
  restart_proc_delegator = Proc.new {
    delegator.setup_service()
    delegator.update_status()
    delegator.run_proc_delegate :restart
  }
  after_deploy_delegator = Proc.new {
    delegator.run_proc_delegate :after_deploy
  }
  
  artifact_version = @version
  artifact_force_install = @force
  artifact_loc = find_artifact()
  artifact_name_version = ""
  deploy_to_dir = join(new_resource.deploy_to, new_resource.name, "/")
  # map shared/log to releases/<version>/<service>-<version>/logs
  sym_link_hash = { 
    'log' => @artifact_log_path
  }
  
  Chef::Log.info "installing from artifact_loc = #{artifact_loc}"
  artifact_deploy new_resource.name do
    version artifact_version
    #artifact_name new_resource.name
    artifact_location artifact_loc
    deploy_to deploy_to_dir
    owner new_resource.owner
    group new_resource.group
    
    keep new_resource.keep
    force artifact_force_install
    symlinks sym_link_hash
    
    #shared_directories %w{ data log pids system vendor_bundle assets }

    before_deploy before_deploy_delegator
    before_extract before_extract_delegator
    after_extract after_extract_delegator
    before_symlink before_symlink_delegator
    after_symlink after_symlink_delegator
    configure configure_delegator
    before_migrate before_migrate_delegator
    migrate migrate_delegator
    after_migrate after_migrate_delegator
    restart restart_proc_delegator
    after_deploy after_deploy_delegator
  end
  new_resource.updated_by_last_action(true)
end


def rm_logs_dir(release_path)
  log_dir = "#{release_path}/#{@artifact_log_path}"
  Chef::Log.info "Deleting log dir (if exists): #{log_dir} exists? #{::File.exists?(log_dir)}"
  if ::File.exists?(log_dir)
    ::FileUtils.rm_rf(log_dir)
    Chef::Log.info "After deleting log dir (as with rm_rf): #{log_dir} exists? #{::File.exists?(log_dir)}"
  end
end

def update_status()
  node.set['neu_service'][@service_name] = {} if node['neu_service'][@service_name].nil?
  node.set['neu_service'][@service_name]['previous'] = node.set['neu_service'][@service_name]['installed'] || '' 
  node.set['neu_service'][@service_name]['installed'] = @version
  node.set['neu_service'][@service_name]['installed_on'] = Time.now.utc.iso8601
  # clear on_deck*
  node.set['neu_service'][@service_name]['on_deck'] = ''
  node.set['neu_service'][@service_name]['on_deck_on'] = ''
  
  Chef::Log.info "Installed #{@service_name} version: #{@version}"
end

def link_log_dir(shared_path)
  Chef::Log.info "linking system log file dir: /var/log/#{new_resource.name} to #{shared_path}/log"
  link "/var/log/#{new_resource.name}" do
    to "#{shared_path}/log"
    user new_resource.owner
    group new_resource.group
  end
end

# A wrapper that adds debug logging for running a recipe_eval on the 
# numerous Proc attributes defined for this resource.
# 
# @param name [Symbol] the name of the proc to execute
# 
# @return [void]
def run_proc_delegate(name)
  proc = new_resource.send(name)
  proc_name = name.to_s
  Chef::Log.info "neu_service_deploy[run_proc::#{proc_name}] Determining whether to execute #{proc_name} proc."
  if proc
    Chef::Log.debug "neu_service_deploy[run_proc::#{proc_name}] Beginning execution of #{proc_name} proc."
    recipe_eval(&proc)
    Chef::Log.debug "neu_service_deploy[run_proc::#{proc_name}] Ending execution of #{proc_name} proc."
  else
    Chef::Log.info "neu_service_deploy[run_proc::#{proc_name}] Skipping execution of #{proc_name} proc because it was not defined."
  end
end


def setup_service
  ##  only if they want a system service..
  Chef::Log.info "neu_service_deploy setup_service"
  if new_resource.install_system_service
    template_options = {
      :deploy_home => "#{new_resource.deploy_to}/#{new_resource.name}",
      :service_name => new_resource.name,
      :owner => new_resource.owner,
      :version => @version,
      :conf => @conf
    }
    
    Chef::Log.info "neu_service_deploy installing service and restarting: #{@restart_service}"

    restart_service = @restart_service
    
    # setup the system service through runit
    runit_service new_resource.name do
      run_template_name "neu-service"
      log_template_name "neu-service"
      options template_options
      restart_on_update true
    end

    # link runit log
    link "/var/log/#{new_resource.name}/runit.log" do
      to "/etc/sv/#{new_resource.name}/log/main/current"
      notifies :restart, resources(:runit_service => template_options[:service_name]), :immediately # queue it up for later
    end
    
    ruby_block "force_restart" do
      block do
        nil
      end
      action :create
      notifies :restart, resources(:runit_service => template_options[:service_name]), :immediately # queue it up for later
      only_if { restart_service } # only if we are allowed
    end
  end
end

private

def find_artifact
  # see if the artifact exists on disk, as a Chef File.
  if @artifact_file != nil
    @artifact_file
  else
    # example:
    # https://repo.nexgen.neustar.biz/nexus/content/repositories/services/biz/neustar/dataDistribution/0.0.1-1359150711/dataDistribution-0.0.1-1359150711.zip
    # <repo url>/<namespace>/<artifact>/<version>/<versioned artifact>.<artifact ext>
    url = repo_url()
    url = join(url, new_resource.artifact_namespace, "/")
    url = join(url, new_resource.name, "/")
  
    url = join(url, @version, "/")
    url = join(url, "#{new_resource.name}-#{@version}", "/")
    url = join(url, new_resource.artifact_ext, ".")
  end
end

def join(str1, str2, sep)
  return str1 if str2 == nil || str2.empty?
  if str1.end_with?(sep) && str2.start_with?(sep)
    # if both have a separator, then strip one end off and concat
    str1[0..-2] + str2
  elsif str1.end_with?(sep) || str2.start_with?(sep)
    # one alread has the separator, just smack them together
    str1 + str2
  else
    [str1, str2].join(sep)
  end
end

def repo_url
  # add credentials (if given) to the repo_url

  repo_url_with_creds = new_resource.repo_location
  if !new_resource.repo_credentials.empty?
    repo_url_with_creds = new_resource.repo_location.gsub(/\:\/\//, "://#{new_resource.repo_credentials}@")
  end
  repo_url_with_creds
end

