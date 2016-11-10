# java_cert_install-cookbook

This cookbook downloads the SSL certificate from the given host and installs in in the said keystore.

## Supported Platforms

Ubuntu

## Attributes

|                   Key                  |  Type  |                                      Description                                      |   Default   |
|:--------------------------------------:|:------:|:-------------------------------------------------------------------------------------:|:-----------:|
| ['java_cert_install]['host']           | String | The host or site or IP from where to download the SSL certificate.                    | example.com |
| ['java_cert_install']['port']          | Fixnum | The download port. For HTTPS it is 443 and for LDAP it is 636.                        | 443         |
| ['java_cert_install']['keytool_alias'] | String | The alias using which you want to import the downloaded certificate in your keystore. | example     |
| ['java_cert_install']['keystore_pass'] | String | The password of the keystore. This is a mandatory attribute.                          | nil         |

## Usage

### java_cert_install::default

Include `java_cert_install` in your node's `run_list`:

```json
{
  "java_cert_install": {
    "host" : "<myhost>",
    "port" : <my_port>,
    "keytool_alias": "<my_alias>",
    "keystore_pass": "<my_pass>"
  },
  "run_list": [
    "recipe[java_cert_install::default]"
  ]
}
```

## License and Authors

Author:: Abhishek Singh (<abhishek.singh@neustar.biz>)
