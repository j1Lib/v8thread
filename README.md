# v8thread
Thread DOM element

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/amaWlD13eeQ/0.jpg)](https://www.youtube.com/watch?v=amaWlD13eeQ)

      new v8t("file url",[optional] thread ,[optional] partial).done(function(url){
          
          //this event will trigger twice
          // 1 - meta data downloaded
          // 2 - file completed
          
      }).load(function(val){
      
          // val - progress value
      
      });
