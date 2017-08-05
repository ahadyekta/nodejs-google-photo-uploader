# Batch upload in google photos (picasa)
this nodejs application walk through folders containing images to upload it into an album of google photo account. 
## How to use:
1- first you have to install nodejs on your system.
2- clone the project and inside the directory run :
`
npm install
`
3- run the server to authenticate your google account:
`
node index.js
`
4- now , navigate to http://localhost:4000 and it will redirect you to gogole sign authentication page
5- after giving access to the app you can get the list of your albums from this url: http://localhost:4000/albums
6- get the id of your target album and copy it into the config.json file . you should place it in albumId field. 
7- provide the images path in the imagePath field of the config file. The image directory should be like this

imagePath 
------------->album1
----------------------->image1.jpg          
----------------------->image2.jpg 
----------------------->image3.jpg 
------------->album2
----------------------->image4.jpg          
----------------------->image5.jpg 
----------------------->image6.jpg 

it means that all images should be placed inside an album folder and (just one level )
8- now start the looper to upload:
`
node looper
`
this will save logs of uploaded photos in logs folder . whenever an album get finished, it changes the status of it to complete. So it never process that folder again. 
9- you can kill the process and start it again . the app will resume the process by the help of log files.
so you can use cronjob to control the start and finish time (when the net is free at nights for example).

for example:
`
40 17 * * * /usr/bin/node /home/ahad/projects/photo-backup/looper.js
41 17 * * * killall node
41 17 * * * kill -9 $(ps aux | grep '\snode\s' | awk '{print $2}')

`
(you should write the looper absolute path there)