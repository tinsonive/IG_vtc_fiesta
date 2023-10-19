let PAGE_ID = "139361189263256";

var business_id = null;
var tag_id = null;

var get_user_name = null;
var get_busniess_id = null;

var medialist = null;

//Default searching tag name, can be replaced by ?q=
var search_tag = "itsarah";
//Default refresh time is 1 min. can be replaced be ?refresh
var refresh_time = 60000; 

Object.defineProperty(HTMLMediaElement.prototype, 'isPlaying', {
  get: function(){
      return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
  }
})

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    if (response.status === 'connected') {
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
  if (urlParams.has('refresh'))
    refresh_time = urlParams.get('refresh');

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
    newItem.classList.add("col-3", "px-0", "d-flex");

    var newhtml = "";

    if (type == "IMAGE")
    {
        newhtml = '<div class="limit d-flex align-items-center justify-content-center"><div class="img-bg d-flex align-items-center"><img class="isImgWaiting" src="'+link+'" hidden></div></div>';
    }
    else if (type == "VIDEO")
    {
        newhtml = '<div class="limit d-flex align-items-center justify-content-center"><video loop muted playsinline class="isVideoWaiting" hidden>'+
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
    let lastIDList = lastList.map(a => a.id);
    let intersection = medialist.filter(x => !lastIDList.includes(x.id));
    
    if (intersection.length > 0)
    {
      RemoveItems (intersection.length);
      for (var i = 0; i < intersection.length; i++)
        AddItem(intersection[i].media_url, intersection[i].media_type);

      OnVideoLoaded();
      OnImageLoaded();
    }
  }
  else
  {
    for (var i = 0; i < medialist.length; i++)
        AddItem(medialist[i].media_url, medialist[i].media_type);

    OnVideoLoaded();
    OnImageLoaded();
  }

  lastList = medialist;
  
  await delay(refresh_time);

  getMedia().then((response)=>{
    medialist = response.data;
    loopList();
  });
};

var filter = Array.prototype.filter,
  result   = document.querySelectorAll('div'),
  filtered = filter.call( result, function( node ) {
      return !!node.querySelectorAll('span').length;
  });

function OnVideoLoaded()
{
  var videos = document.querySelectorAll('.isVideoWaiting');

  videos.forEach(function(v) {
    v.addEventListener('loadedmetadata', function() {
      v.classList.add('new-media');
      v.classList.remove("isVideoWaiting");
      v.removeAttribute('hidden');
      v.play();
    });
  });
}

function OnImageLoaded ()
{
  var imgs = document.querySelectorAll('.isImgWaiting');

  imgs.forEach(function(i) {
    i.addEventListener('load', function() {
      i.classList.add('new-media');
      i.classList.remove("isImgWaiting");
      i.removeAttribute('hidden');
    });
  });
}

