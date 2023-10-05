
var endpoint = "http://localhost/snipessence/";
var endpoint = "https://snipesensei.online/app/";
chrome.storage.local.set({endpoint:endpoint});


chrome.runtime.onMessage.addListener(function(req,sender,sendResponse){
  if (req.msg == "ajax") {

      async function ajax() {

          if (req.method == "POST" && !req.headers) {
              req.headers = {
                  'content-type': 'application/x-www-form-urlencoded'
              };
              req.data = new URLSearchParams(req.data).toString();
          }

          let response = await fetch(req.url || endpoint+"master.php", {
              method: req.method,
              body: req.data,
              headers: req.headers,
          });

          if (response.status == 200) {
              let res = await response.text();
              try {
                  res = JSON.parse(res);
              } catch (e) {}

              sendResponse(res);
          } else {
              sendResponse("");
          }

      };

      ajax();
  }
})
