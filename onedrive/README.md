# describo-ui-plugins : onedrive

A plugin providing a component to authenticate to Microsoft and produce an rclone configuration for onedrive access.

The plugin has one component: `onedrive-authenticator-component`

Usage:

```
<onedrive-authenticator-component
    v-if="onedrive"
    :client-id="onedrive.clientID"
    :redirect-uri="onedrive.redirectURI"
    v-on:rclone-configuration="postRcloneConfiguration"
/>
```

The component takes two parameters:

-   client-id
-   repositroy-id

And it will emit an rclone configuration to do with as you like.
