<?php
    require_once('Storage/connection.php');
    require_once('handler.php');
    
    //  ---------------------------------------
    //  Get our stored access token
    //  ---------------------------------------

    $tokenFile  = $cacheDir . 'tokens/access_token.txt';

    //  Do we have this in cache already?
    if ($accessToken = getAccessToken() === FALSE)
    {
        // 'No access token was found in local storage.'
        // header("Location: https://fiesta.ga-jam.com/login.php?refresh=$uuid");
    }
    else
    {
        // refreshToken($accessToken);
        // header("Location: https://fiesta.ga-jam.com/fiesta.php?o=$accessToken");
    }

    echo $accessToken;
?>