
default['neu_service']['name'] = ""
default['neu_service']['pkg'] = ""
default['neu_service']['conf'] = "" # configuration to use, setting for CONF, default is chef environment.

default['neu_service']['repo_url'] = "https://repo.nexgen.neustar.biz/nexus/content/repositories/services"
default['neu_service']['repo_credentials'] = "ci_user:ngBu1ldr" # user:pass

default['neu_service']['user'] = "root"
default['neu_service']['pkg_basedir'] = "/opt"
default['neu_service']['pkg_ext'] = "zip"

default['neu_service']['deployer_user'] = ""

# service install behaviors
default['neu_service']['restart_service'] = true
default['neu_service']['install_system_service'] = true

default['neu_service']['pkg_max_count'] = 10
default['neu_service']['service_namespace'] = "biz/neustar"

