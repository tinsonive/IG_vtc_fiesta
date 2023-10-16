let PAGE_ID = "139361189263256";
let TAG_NAME = "cat";

var onInitCompleted = null;

var business_id = null;
var tag_id = null;
var isInit = false;

var login = null;
var get_busniess_id = null;
var get_tag_id = null;
var get_media_by_tag = null;

var medialist = null;

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        get_media_by_tag.then(
            function(datalist) { medialist = datalist; },
            function(code, msg) { console.log(msg); }
        );
    } else {
        login.then(
            function(response) { checkLoginState(); },
            function(code, msg) { console.log(msg); }
        );
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

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

    login = new Promise(function(resolve, reject)
        {
            FB.login(function(response) {
                if (response.authResponse) {
                    FB.api('/me', function(response) {
                        if (response.error != null)
                        reject(response.error.code, response.error.message);
                        else
                        resolve(response);
                    });
                } else { 
                    //    <!-- If you are not logged in, the login dialog will open for you to login asking for permission to get your public profile and email -->
                    reject(-1, 'User cancelled login or did not fully authorize.'); 
                }
            },{scope: [
                'pages_show_list', 
                'instagram_basic', 
                'instagram_content_publish', 
                'pages_read_engagement', 
                'instagram_manage_insights'
            ]});
        }
    );

    get_busniess_id = new Promise(function(resolve, reject)
    {
      if (business_id != null)
      {
        resolve(business_id);
        return;
      }

      FB.api('/'+PAGE_ID+'?fields=instagram_business_account', function(response) {
          if (response.error != null)
            reject(response.error.code, response.error.message);
          else
          {
            business_id = response.instagram_business_account.id;
            resolve(business_id);
          }
      });
    }
  );

  get_tag_id = new Promise(function(resolve, reject)
    {
      if (tag_id != null)
      {
        resolve(tag_id);
        return;
      }

      if (business_id == null)
        get_busniess_id.then(getTagID,reject);
      else
        getTagID(business_id);

      function getTagID(bid) {
        FB.api('ig_hashtag_search?user_id='+bid+'&q='+TAG_NAME, function(response) {
            if (response.error != null)
              reject(response.error.code, response.error.message);
            else
            {
                tag_id = response.data[0].id;
                resolve(tag_id);
            }
        });
      }
    }
  );

  get_media_by_tag = new Promise(function(resolve, reject)
    {
      if (tag_id == null)
      {
        get_tag_id.then(getMedia, reject);
      }
      else
      {
        getMedia(tid);
      }

      function getMedia(tid) {
        FB.api(tid+'/recent_media?user_id='+business_id+'&fields=id,media_type,media_url,timestamp', function(response) {
            if (response.error != null)
              reject(response.error.code, response.error.message);
            else
            {
                resolve(response.data);
            }
        });
      }
    }
  ); 
};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));