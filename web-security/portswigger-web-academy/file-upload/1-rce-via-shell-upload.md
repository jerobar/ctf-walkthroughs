# 1 - RCE Via Shell Upload

To solve the lab, upload a basic PHP web shell and use it to exfiltrate the contents of the file `/home/carlos/secret`. Submit this secret using the button provided in the lab banner.

You can log in to your own account using the following credentials: `wiener:peter`

### Notes

After logging in, use the "My Account" form to upload a PHP exploit. You can then view the HTML of your avatar to see the path to the exploit file. Simply navigate to the file in the browser to retrieve the secret key.

### Solution

#### Simple PHP Exploit

```php
<?= file_get_contents( '/home/carlos/secret' );
```
