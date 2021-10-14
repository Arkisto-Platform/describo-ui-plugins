# describo-ui-plugins : reva

- [describo-ui-plugins : reva](#describo-ui-plugins--reva)
  - [Using the plugin](#using-the-plugin)
    - [Register the plugin with vue](#register-the-plugin-with-vue)
    - [Store events](#store-events)

A plugin providing components to authenticate to s3 implementations (AWS and Minio) and preview
content residing on them.

The plugin has two components:

-   `reva-authenticator-component`
-   `reva-file-preview-component`

Usage:

```
<reva-authenticator-component />
```

And it registers one service: `this.revaAuthenticationManager`:

## Using the plugin

### Register the plugin with vue

```
    Vue.use(RevaPlugin, {
            log,
            $http: Vue.prototype.$http,
            configuration: "/session/configuration/reva",
        });
```

In order to register the plugin you need to provide:

-   `log`: a logging function with log, debug, info, etc methods..
-   `configuration`: the endpoint to get / post the configuration

```
await $http.get({ route: this.config.configurationEndpoint })

```

-   a method `post` that takes two params: route and body

```

await $http.post({ route: this.config.configurationEndpoint, body: configuration, });

```

-   `configuration`: your API path from which to get the owncloud configuration (GET) and to save
    configuration to (POST)

See the main documentation for configuring the application for more information on defining
services.

### Store events

This plugin will try to set the target resource in the store using:

```
this.$store.commit("setTargetResource", {
    resource: "reva",
});
```
