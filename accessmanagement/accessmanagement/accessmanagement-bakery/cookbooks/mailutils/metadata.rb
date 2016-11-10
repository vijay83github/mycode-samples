name             "mailutils"
maintainer       "Kyle Sloan"
maintainer_email "github.com@kylesloan.33mail.com"
license          "Apache 2.0"
description      "Installs/Configures mailutils"
long_description IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version          "0.1.0"

recipe "mailutils", "Installs mail utils"

%w{ debian ubuntu }.each do |os|
  supports os
end
