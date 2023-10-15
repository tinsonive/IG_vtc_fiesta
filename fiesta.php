<?php
    require_once('Storage/connection.php');
    require_once('handler.php');
?>

<html>
<head>
    <title>VTC Skill Fiesta - IT Sarah</title>
</head>
<body>
    <?php

        // //  ---------------------------------------
        // //  Check for cached feed for today
        // //  ---------------------------------------

        // $cacheFile  = $cacheDir . 'cache/' . $today . '.json';

        // //  Do we have this in cache already?
        // if (($json = file_get_contents($cacheFile)) !== FALSE)
        // {
        //     echo file_get_contents($cacheFile);
        //     exit();
        // }

        // //  ---------------------------------------
        // //  Clear the cache
        // //  ---------------------------------------

        // array_map('unlink', glob($cacheDir . 'cache/*.json'));
        
        if ($accessToken = getAccessToken() === FALSE)
        {
            // 'No access token was found in local storage.'
            header("Location: https://fiesta.ga-jam.com/login.php?refresh=$uuid");
        }
        else
        {
            $uid = getUserID($accessToken);

            echo $uid;
        }
    ?>
</body>
</html>