

## SETUP ENVIRONMENT VARIABLES

### REQUIRED

- `APP_STREAMLABELS_PATH`: The path to where the StreamLabels files are located

### OPTIONAL
- `APP_DATABASE_PATH`: Path to store database files (Default: `./databases`)





## STREAM LABELS SESSION TEMPLATES



### OBS API

- `/obs`
	- `/sources` : `GET` : List all the sources, that match the `filter` pattern in the `obs.config.json`  
		- `/sources/aliases/:all?` : `GET` : list the defined aliases 
		- `/sources/keys/:all?` : `GET` : an array of the alias keys 
		- `/sources/alias/:alias/name` : `GET` : Get an item name from the alias 
		- `/sources/alias/:alias/` : `GET` : Get item info from the alias 
	- `/source/:source/visible/:render` : `PUT` : Set the visible state of the `:source` from the `:render` value 


## SOCIAL OVERLAY

- `/social/[position:left|right]/[animation:flip|fade]/`


### BUILT-IN SOCIAL NETWORKS
- twitch
- mixer
- twitter
- reddit
- facebook
- instagram
- snapchat
- github
- discord
- patreon
- tumblr
- psn
- xbox
- steam
- battlenet
- uplay
- origin
- nintendo
- playstv
- gamewisp
- paypal
- google+
- skype
- linkedin
- pinterest

### CUSTOMIZE

- `/admin/social` : configuration for the social overlay
