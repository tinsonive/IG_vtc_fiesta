let PAGE_ID = "139361189263256";
let TAG_NAME = "cat";

var access_token = "";
var business_id = null;
var tag_id = null;

var get_user_name = null;
var get_busniess_id = null;

var medialist = null;

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // access_token = response.authResponse.accessToken;
        // console.log(access_token);
        // Logged into your app and Facebook.
        getUserName()
          .then(
            (name) => {
              console.log(name);
              return getBusiessID
            }
          ).then(
            (id) => {
              console.log(id);
            }
          ).catch(
            (error) => {
              console.log(error);
            }
          );
    } else {
      login();
    }
}

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId            : '1377261053219740',
        cookie           : true,
        xfbml            : true,
        version          : 'v18.0'
    });

  get_busniess_id = new Promise(getBusiessID);
  get_user_name = new Promise(getUserName);

  FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
  });

};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function login() {
  FB.login(function(response) {
      checkLoginState();
  },{scope: [
      'pages_show_list', 
      'instagram_basic', 
      'instagram_content_publish', 
      'pages_read_engagement', 
      'instagram_manage_insights'
  ]});
}

function getAllPosts(uri) {
  return new Promise((resolve, reject) => {
    function recursiveAPICall(apiURL) {
      FB.api(apiURL, (response) => {
        if (response && response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      });
    }
    recursiveAPICall(uri);
  });
}

function getUserName(resolve, reject) {
  return getAllPosts('/me');
}

function getBusiessID() {
  return getAllPosts('/'+PAGE_ID+'?fields=instagram_business_account');
}

function getTagID(resolve, reject) {
  FB.api('ig_hashtag_search?user_id='+business_id+'&q='+TAG_NAME, function(response) {
      if (response.error != null)
          reject(response.error);
      else
      {
          tag_id = response.data[0].id;
          resolve(tag_id);
      }
  });
}

function getMedia(resolve, reject) {
  FB.api(tid+'/recent_media?user_id='+business_id+'&fields=id,media_type,media_url,timestamp', function(response) {
      if (response.error != null)
          reject(response.error);
      else
      {
          resolve(response.data);
      }
  });
}