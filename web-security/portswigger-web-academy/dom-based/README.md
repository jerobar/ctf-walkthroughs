# DOM-Based

DOM-based vulnerabilities arise when a website contains JavaScript that takes an attacker-controllable value, known as a source, and passes it into a dangerous function, known as a sink.

Typical sources include:

* document.URL&#x20;
* document.documentURI&#x20;
* document.URLUnencoded&#x20;
* document.baseURI&#x20;
* location document.cookie&#x20;
* document.referrer&#x20;
* window.name&#x20;
* history.pushState&#x20;
* history.replaceState&#x20;
* localStorage&#x20;
* sessionStorage&#x20;
* IndexedDB (mozIndexedDB, webkitIndexedDB, msIndexedDB)&#x20;
* Database
