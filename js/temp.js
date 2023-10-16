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
          console.log(response);
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
          console.log(response);
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
          console.log(response);
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