# OpenTokJS

OpenTok javascript and typescript module using nodejs

## How To Use

- [x] Download the script in dist folder `openvcal.client.js`
- [x] Add to your server and add script tag in head:

```html
<script src="htps://yourdomain.com/path/to/openvcall.client.js"></script>
```

- [x] Init the scripts:

```html
<script type="text/javascript">
  // Run the script after page loaded
  window.onload = function () {
    // Get the params from URL
    var url = new URL(window.location.href);
    var token = url.searchParams.get("token");
    var sessionId = url.searchParams.get("sessionId");

    // Init class with params order: API Key, sessionId, localUserTagId, subscriberTagId, screenShareTagId
    var openVcall = new OpenVCallClient("45992642", sessionId, "local-user", "subscribers", "videos")

    // You can use onclick elemnt to trigger the actions
    document.getElementById("join").onclick = function () {
      // Connect to video call
      openVcall.connect(token);
    };
    document.getElementById("disconnect").onclick = function () {
      // Disconnect from video call
      openVcall.disconnect();
    };
    document.getElementById("share-screen").onclick = function () {
      // Start screen sharring
      openVcall.startShareScreen();
    };
  };
</script>
```

- [x] You can use default styles for references in file `styles.css`
- [x] For more detail please see file `live.html`
