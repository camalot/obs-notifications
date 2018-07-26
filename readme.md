


## STREAM LABELS SESSION TEMPLATES



### OBS API

- `/obs`
	- `/sources` : `GET` : List all the sources, that match the `filter` pattern in the `obs.config.json`  
		- `/sources/aliases/:all?` : `GET` : list the defined aliases 
		- `/sources/keys/:all?` : `GET` : an array of the alias keys 
		- `/sources/alias/:alias/name` : `GET` : Get an item name from the alias 
		- `/sources/alias/:alias/` : `GET` : Get item info from the alias 
	- `/source/:source/visible/:render` : `PUT` : Set the visible state of the `:source` from the `:render` value 

