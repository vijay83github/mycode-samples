IMPORTANT - read this before upgrading DataTables, TableTools or any other plugin for DataTables.

DataTable plugins do not work with our js compression without some changes to the source files:
- convert to a requirejs module: add "define", etc
- TableTools.js is missing a section of code which can be found at the beginning of TableTools.min.js. This has been
copied to the beginning of TableTools.js
- TableTools.js does not need to execute itself once it is turned into a module

Be very careful when changing any DataTables file!