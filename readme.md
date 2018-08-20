

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

- `APP_SOCIAL_*`: These create popouts with the value for the specified social network. 

- `APP_SOCIAL_DELAY`: Delay between each social network rotation
- `APP_SOCIAL_PAUSE`: The pause at the end before it starts over
- `APP_SOCIAL_BGADJUSTMENT`: The background adjustment for the secondary background. This will lighten the background color by this amount when applying to the secondary.

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

### CUSTOMIZE

You can create custom entries by using the following ENVIRONMENT VARIABLES:

- `APP_SOCIAL_<SOCIAL_NAME>`: SOCIAL_NAME must be unique.
- `APP_SOCIAL_CUSTOM_BACKGROUND_<SOCIAL_NAME>`: The background color. If not set, it will use the default of `#000`.
- `APP_SOCIAL_CUSTOM_BACKGROUND2_<SOCIAL_NAME>`: The secondary background color. If not set, the `APP_SOCIAL_BGADJUSTMENT` will adjust the set background color.
- `APP_SOCIAL_CUSTOM_COLOR_<SOCIAL_NAME>`: The foreground color. If not set, it will use the default of `#fff`.
- `APP_SOCIAL_CUSTOM_IMAGE_<SOCIAL_NAME>`: The social icon. If not set, it will use the default of `/images/social/blank.png`.
