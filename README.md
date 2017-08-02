{
folder : {
            albumId: albumId,
            status: pending|complete
            photos : [...names]
         }
}

we start from zero every time , first check if we have worked on a directory and its status is complete, so we ignore it
then we check the name of the file exists in the photo item and ignore it . otherwise we upload it . 