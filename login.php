<?php

//  ---------------------------------------
//  This script connects with the Instagram API to grab recent images from an Instagram feed.
//  ---------------------------------------

//  If the access token expires, generate a new one by hitting this url in a browser:

//  https://fiesta.ga-jam.com?refresh=f993efcc-7205-4be7-b4b4-46c8260e590f

//  You will be taken to a page on Instagram that has you login as the Instagram user associated with the client_id below. You will then bounce back to this script and the token generation will take place.

//  ---------------------------------------
//  Set main storage location
//  ---------------------------------------

require_once('Storage/connection.php');

//  ---------------------------------------
//  Are we getting a fresh token?
//  ---------------------------------------

// if (! empty($_GET['refresh']) AND $_GET['refresh'] == $uuid)
// {
//     header('Location: ' . 'https://api.facebook.com/oauth/authorize?client_id=' . $client_id . '&redirect_uri=' . $redirect_uri . '&scope=user_profile,user_media&response_type=code');
//     exit();
// }

//  ---------------------------------------
//  Do we have a code?
//  ---------------------------------------

if (! empty($_GET['code']) AND strlen($_GET['code']) >= 238)
{
    //  ---------------------------------------
    //  Get initial access token from Instagram using an Instagram authorization code
    //  ---------------------------------------
    
    // $tokenUrl   = 'https://api.instagram.com/oauth/access_token';

    // $postFields   = array(
    //     'client_id'     => $client_id,
    //     'client_secret' => $client_secret,
    //     'grant_type'    => 'authorization_code',
    //     'redirect_uri'  => $redirect_uri,
    //     'code'          => $_GET['code']
    // );

    $tokenUrl   = 'https://graph.facebook.com/oauth/access_token';

    $postFields   = array(
        'client_id'     => $client_id,
        'client_secret' => $client_secret,
        'grant_type'    => 'authorization_code',
        'redirect_uri'  => $redirect_uri,
        'code'          => $_GET['code']
    );

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $tokenUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);

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
    //  Exchange short lived access token for long lived token
    //  ---------------------------------------

    $tokenUrl   = 'https://graph.instagram.com/access_token?';

    $postFields   = array(
        'client_secret' => $client_secret,
        'grant_type'    => 'ig_exchange_token',
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
    
    if (file_put_contents($tokenFile, $accessToken))
    {
        echo 'A new long-lived access token has been successfully obtained from Instagram.';

        header('Location: https://fiesta.ga-jam.com/fiesta.php');
    }
    else
    {
        echo 'Fail to store a new long-lived access token has been successfully obtained from Instagram.';
    }

    exit();
}
require_once('handler.php');

$accessToken = getAccessToken();

refreshToken($accessToken);

?>