let PAGE_ID = "139361189263256";

var business_id = "";
var tag_id = "";

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      return true;
    } else {
      login();
      return false;
    }
  }
  
  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      return statusChangeCallback(response);
    });
  }
  
  // <!-- Add the Facebook SDK for Javascript -->

  (function(d, s, id)
    {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk')
  );

  function login() {
    window.fbAsyncInit = function() {
        // <!-- Initialize the SDK with your app and the Graph API version for your app -->
        FB.init({
                    appId            : '1377261053219740',
                    cookie           : true,
                    xfbml            : true,
                    version          : 'v18.0'
                });
        
        FB.login(function(response) {
            if (response.authResponse) {
                FB.api('/me', function(response) {
                    console.log(response.id);
                });
            } else { 
            //    <!-- If you are not logged in, the login dialog will open for you to login asking for permission to get your public profile and email -->
            console.log('User cancelled login or did not fully authorize.'); 
            }
        },{scope: [
            'pages_show_list', 
            'instagram_basic', 
            'instagram_content_publish', 
            'pages_read_engagement', 
            'instagram_manage_insights'
        ]});
    };
    }

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function get_busniess_id() {
    checkLoginState();
    FB.api('/'+PAGE_ID+'?fields=instagram_business_account', function(response) {
        business_id = response.instagram_business_account.id;
    });
  }

  function get_tag_id(tag_name) {
    checkLoginState();
    FB.api('ig_hashtag_search?user_id='+business_id+'&q=tag_name', function(response) {
        tag_id = response.data[0].id;
    });
  }