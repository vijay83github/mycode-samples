name             "neu_service"
maintainer       "Neustar, Inc."
maintainer_email "jeffrey.damick@neustar.biz"
license          "All rights reserved"
description      "Installs/Configures neu-service"
long_description IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version          "0.4.4"

%w{ artifact }.each do |cb|
  depends cb
end

depends "runit", ">= 1.1.6"
