<?php

function getAccessToken()
{
    require_once('Storage/connection.php');

    //  ---------------------------------------
    //  Get our stored access token
    //  ---------------------------------------

    $tokenFile  = $cacheDir . 'tokens/access_token.txt';

    $access_token = file_get_contents($tokenFile, true);

    if (empty($access_token))
    {
        return FALSE;
    }
    else
    {
        return $access_token;
    }
}

function refreshToken($accessToken)
{
    require_once('Storage/connection.php');
    require_once('Storage/userprofile.php');
    
    //  ---------------------------------------
    //  Refresh our access token
    //  ---------------------------------------

    $tokenUrl   = 'https://graph.instagram.com/refresh_access_token?';

    $postFields   = array(
        'grant_type'    => 'ig_refresh_token',
        'access_token'  => $accessToken
    );

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $tokenUrl . http_build_query($postFields));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $feed   = curl_exec($ch);

    if (curl_errno($ch))
    {
        $error = curl_error($ch);
        print_r($error);
        exit();
    }

    curl_close($ch);

    $json   = json_decode($feed);

    $accessToken    = $json->access_token;

    //  ---------------------------------------
    //  Store the long lived token
    //  ---------------------------------------

    $tokenFile  = $cacheDir . 'tokens/access_token.txt';

    file_put_contents($tokenFile, $accessToken);

    return $accessToken;
}

function getUserID($accessToken)
{
    if (!empty($user_id))
    {
        return $user_id;
    }

    $userUrl = "https://graph.instagram.com/me?";

    $postFields = array (
        'fields'        => 'id',
        'access_token'  => $accessToken
    );

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $userUrl . http_build_query($postFields));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $user_id = curl_exec($ch);

    if (curl_errno($ch))
    {
        $error = curl_error($ch);
        print_r($error);
        exit();
    }

    curl_close($ch);

    return $user_id;
}

function getStory($accessToken)
{
    // $storyUrl   = 'https://graph.instagram.com/refresh_access_token?';

    // $postFields   = array(
    //     'grant_type'    => 'ig_refresh_token',
    //     'access_token'  => $accessToken
    // );

}
?>