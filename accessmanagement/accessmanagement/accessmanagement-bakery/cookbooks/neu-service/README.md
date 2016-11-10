Description
===========

Install a neustar service onto a box that has configuration managed.

For more details see confluence (https://confluence.nexgen.neustar.biz/display/NGSERVICES/Continuous+Deployment+with+Chef)[Continus Deployment]

Requirements
============

Your deliverable contains:

bin/start.sh
  And it accepts: -f to run the service in the foreground.

We assume that the image contains the aws cli being present.


Attributes
==========


* `node['neu_service']['name']` - 

* `node['neu_service']['pkg']` - 

* `node['neu_service']['conf']` - configuration to use, setting for CONF, order is: this, EC2 TAG 'conf', finally chef_environment.

* `
` - 
* `
` - 

These values should never normally need to be changed.
* ` node['neu_service']['user'] ` - (default: root)
* ` node['neu_service']['pkg_basedir'] ` - (default: /opt)
* ` node['neu_service']['pkg_ext']` -  (default: zip)


node['neu_service']['deployer_user'] = ""

# service install behaviors
node['neu_service']['restart_service'] = true
node['neu_service']['install_system_service'] = true

node['neu_service']['pkg_max_count'] = 10
node['neu_service']['service_namespace'] = "biz/neustar"



Usage
=====



