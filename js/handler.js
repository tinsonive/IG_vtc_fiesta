let PAGE_ID = "139361189263256";

var business_id = null;
var tag_id = null;

var get_user_name = null;
var get_busniess_id = null;

var medialist = null;

//Default searching tag name, can be replaced by ?q=
var search_tag = "itsarah";

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
  get: function(){
      return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
})

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
        getBusiessID()
          .then(
            (response) => {
              business_id = response.instagram_business_account.id;
              return getTagID();
            }
          ).then(
            (response) => {
              tag_id = response.data[0].id;
              return getMedia();
            }
          ).then(
            (response) => {
              medialist = response.data;
              loopList();
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

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has('q'))
    search_tag = urlParams.get('q');

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

function getUserName() {
  return getAllPosts('/me');
}

function getBusiessID() {
  return getAllPosts('/'+PAGE_ID+'?fields=instagram_business_account');
}

function getTagID() {
  return getAllPosts('/ig_hashtag_search?user_id='+business_id+'&q='+search_tag);
}

function getMedia() {
  return getAllPosts('/'+tag_id+'/recent_media?user_id='+business_id+'&fields=id,media_type,media_url,timestamp');
}

const delay = ms => new Promise(res => setTimeout(res, ms));

function AddItem (link, type)
{
    const row_id = "row";

    const newItem = document.createElement('div');
    newItem.classList.add("col-3", "px-0");

    var newhtml = "";

    if (type == "IMAGE")
    {
        newhtml = '<div class="limit"><img height="100%" class="img-responsive new-media" src="'+link+'"></div>';
    }
    else if (type == "VIDEO")
    {
        newhtml = '<div class="limit"><video loop muted playsinline height="100%" class="new-media">'+
                    '<source src="'+link+'" type="video/mp4">'+
                    '</video></div>';
    }
    
    var parent = document.getElementById(row_id);

    if (parent.children.length > 0)
    {
      document.getElementById(row_id).insertBefore(newItem, parent.children[0]).innerHTML = newhtml;
    }
    else
    {
      document.getElementById(row_id).appendChild(newItem).innerHTML = newhtml;;
    }
}

function RemoveItems (length)
{
   var parent = document.getElementById("row");

   for (var i = 0; i < length; i++)
   {
      parent.removeChild(parent.lastChild);
   }
}

var lastList = null;

const loopList = async () => {

  medialist = medialist.filter(item => (!!item.media_url));

  medialist.sort(function(a, b){
      if (a.timestamp < b.timestamp) {return -1;}
      if (a.timestamp > b.timestamp) {return 1;}
      return 0;
  });

  medialist = medialist.splice(0, medialist.length >= 8 ? 8 : medialist.length);

  if (lastList != null)
  {
    let intersection = medialist.filter(x => !lastList.includes(x));

    console.log(intersection);

    if (intersection.length > 0)
    {
      RemoveItems (intersection.length);
      for (var i = 0; i < intersection.length; i++)
        AddItem(intersection[i].media_url, intersection[i].media_type);

      PlayAllVideo ();
    }
  }
  else
  {
    for (var i = 0; i < medialist.length; i++)
        AddItem(medialist[i].media_url, medialist[i].media_type);

    PlayAllVideo ();
  }

  lastList = medialist;

  // wait for 20000 in launch
  await delay(20000);

  getMedia().then((response)=>{
    medialist = response.data;
    loopList();
  });
};

function PlayAllVideo ()
{
  // Get all videos.
  var videos = document.querySelectorAll('video');

  // Create a promise to wait all videos to be loaded at the same time.
  // When all of the videos are ready, call resolve().
  var promise = new Promise(function(resolve) {
    var loaded = 0;

    videos.forEach(function(v) {
      v.addEventListener('loadedmetadata', function() {
        loaded++;

        if (loaded === videos.length) {
          resolve();
        }
      });
    });
  });

  // Play all videos one by one only when all videos are ready to be played.
  promise.then(function() {
    videos.forEach(function(v) {
      if (!v.playing) v.play();
    });
  });
}