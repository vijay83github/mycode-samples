

actions :deploy
default_action :deploy


attribute :artifact_name, :kind_of  => String, :required => true
attribute :artifact_ext, :kind_of  => String, :default => "zip"
attribute :artifact_namespace, :kind_of => String, :default => "biz/neustar" # this may vary..

attribute :owner, :kind_of => String, :regex => Chef::Config[:user_valid_regex], :default => "root"
attribute :group, :kind_of => String, :regex => Chef::Config[:user_valid_regex], :default => "root"

# relative path within the artifact to the log directory
attribute :artifact_log_path, :kind_of => String, :default => nil # nil will use <service name>-<version>/logs

# restart service upon install
attribute :restart_service, :kind_of     => [ TrueClass, FalseClass ], :default => true
# install init.d service
attribute :install_system_service, :kind_of     => [ TrueClass, FalseClass ], :default => true

# callbacks (delegated from the artifact lwrp)
attribute :before_deploy, :kind_of      => Proc
attribute :before_extract, :kind_of     => Proc
attribute :after_extract, :kind_of      => Proc
attribute :before_symlink, :kind_of     => Proc
attribute :after_symlink, :kind_of      => Proc
attribute :configure, :kind_of          => Proc
attribute :before_migrate, :kind_of     => Proc
attribute :after_migrate, :kind_of      => Proc
attribute :migrate, :kind_of            => Proc
attribute :restart, :kind_of            => Proc
attribute :after_deploy, :kind_of       => Proc

attribute :conf, :kind_of => String, :default => nil # nil will use the node environment to set the CONF

## these you probably will never need to, nor should change.
attribute :keep, :kind_of => Integer, :default => 10 # number of versions to keep on the box
attribute :deploy_to, :kind_of => String, :default => "/opt"
attribute :artifact_version, :kind_of => String, :default => nil # nil will use the node value
## you really shouldn't touch these..
attribute :repo_location, :kind_of  => String, :default => "https://repo.nexgen.neustar.biz/nexus/content/repositories/services"
attribute :repo_credentials, :kind_of  => String, :default => "ci_user:ngBu1ldr" # user:pass

