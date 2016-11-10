#
# Cookbook Name:: java_cert_install
# Recipe:: default
#
# Copyright (C) 2014 Abhishek Singh
#
# All rights reserved - Do Not Redistribute
#

#Check if the password is defined or not
unless node['java_cert_install']['keystore_pass']
	raise <<-EOS
		Keystore password is not set!
		Please set the attribute node['java_cert_install']['keystore_pass'] to the keystore password
	EOS
end

#Update the apt cache
execute "update_apt_cache" do
	cwd Chef::Config[:file_cache_path]
	command "apt-get update"
end

#Include java recipe here
include_recipe 'java'

#Install the openssl package
package "openssl" do
	action :install
end

#Form the domain url with port for certificate download
cert_source = node['java_cert_install']['host']
cert_port = node['java_cert_install']['port']
cert_download_url = "#{cert_source}:#{cert_port}"

#Download the certificate
bash "download_certificate" do
	cwd Chef::Config[:file_cache_path]
	code <<-EOH
	if [ -f "certificate.cer" ]
		then
		rm -f certificate.cer
	fi
	echo -n | openssl s_client -showcerts -connect "#{cert_download_url}" | sed -ne '/-----BEGIN CERTIFICATE-----/,/-----END CERTIFICATE-----/p' > certificate.cer
	EOH
end

#Get the keystore details
keystore = "/usr/lib/jvm/default-java/jre/lib/security/cacerts"
keytool_alias = node['java_cert_install']['keytool_alias']
keystore_password = node['java_cert_install']['keystore_pass']
temp_cert_file = Chef::Config[:file_cache_path] + "/certificate.cer"

#Install the certificate
bash "install_certificate" do
	cwd Chef::Config[:file_cache_path]
	code <<-EOH
	if [ -f "certificate.cer" ]
		then
		#Remove the splitted files if any
		rm -f xx* || true
		#Split the file if it contains multiple certificates
		csplit certificate.cer '/^-----BEGIN CERTIFICATE-----$/' '{*}'
		split_files=$(ls xx*)
		certCounter=0
		for cFile in $split_files
		do
			#Check if file size
			file_size=$(du -ks $cFile | awk '{print $1}')
			if [ $file_size -gt 0 ]
				then
				#Import the file to the keystore
				keytool -import -trustcacerts -alias #{keytool_alias}$certCounter -file $cFile -storepass #{keystore_password} -noprompt -keystore #{keystore} 2>&1 >> /tmp/output.log
				if [ $? -eq 0 ]
					then
					certCounter=$((certCounter + 1))
				else
					exit 1
				fi
			fi
		done
	else
		exit 2
	fi 
	EOH
	only_if { ::File.exists?(temp_cert_file) }
end