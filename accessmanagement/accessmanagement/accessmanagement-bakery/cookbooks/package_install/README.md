# package_install-cookbook

This cookbook installs the given packages.

## Supported Platforms

Ubuntu

## Attributes

|                 Key                 |  Type  |                 Description                 | Default |
|:-----------------------------------:|:------:|:-------------------------------------------:|:-------:|
| ['package_install']['package_list'] | String | Comma separated list of packages to install |  `nil`       |

## Usage

### package_install::default

Include `package_install` in your node's `run_list`:

```json
{
  "package_install" : {
    "package_list": "pkg1,pkg2,...,pkgn"
  }
  "run_list": [
    "recipe[package_install::default]"
  ]
}
```

## License and Authors

Author:: Abhishek Singh (<abhishek.singh@neustar.biz>)
