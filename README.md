
# Leaflet-copyright-loader.

Simple JSON copyright loader for Leaflet with HERE hybrid map.

--

#####HOWTO:

Get the loader: [HERE](https://github.com/J-F-O/Leaflet-copyright-loader/archive/master.zip)

Add your app id and app code to the copyright query url in the leaflet-copyright-loader.js file.
And any other attribution not queried from the JSON to the: ``` L.control.attribution().addAttribution(...) ```

Link file:

```html
<script type="text/javascript" src="leaflet-copyright-loader.js"></script>
```

Add the copyright loader to the map:

```javascript
var map = L.map('...', { attributionControl: false });
L.tileLayer('https://...').addTo(map);
L.copyrightLoader(map);
```
