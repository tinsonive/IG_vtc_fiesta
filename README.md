# VTC Skill Fiesta - IT Sarah IG filter screen

## How to use

Go to https://fiesta.ga-jam.com

#### URL parameter:<br>
q : The hashtag name to query, default is "itdsarah".<br>
refresh : Set the refresh time (in ms) to request the new media content, default is 60000.<br>
col : Set the item number in each row, default is 4.<br>
search : Set the searching method for searching tagged media recently or top, default is recent.

| Param  | Description                                                                                                   |
|--------|---------------------------------------------------------------------------------------------------------------|
| recent | Get a list of the most recently published photo and video IG Media objects published with a specific hashtag. |
| top    | Returns the most popular photo and video IG Media objects that have been tagged with the hashtag.             |


logbug : Set the debug log to true will enable the debug log, default is false. 

#### Usage: 
1. To search a specific tag "tonyng":<br>https://fiesta.ga-jam.com/?q=tonyng
2. To set the refresh time to 30 seconds:<br>https://fiesta.ga-jam.com/?refresh=30000
3. To set the each row contain 5 items:<br>https://fiesta.ga-jam.com/?col=5
4. To set the searching method to "top":<br>https://fiesta.ga-jam.com/?search=top

5. To set the debug log enabled. <br>https://fiesta.ga-jam.com/?logbug=true

##### For Multiple parameters:
6. To search a specific tag "tonyng" and set the refresh time to 30 seconds:<br>https://fiesta.ga-jam.com/?q=tonyng&refresh=30000
<hr>

## Warning
<span style="background-color:darkred; color:white; font-weight:bold; font-size:20px;">Please note that each INSTAGRAM account can only query up to 30 TAG name within 7 days (duplicate topics are not counted).</span>
