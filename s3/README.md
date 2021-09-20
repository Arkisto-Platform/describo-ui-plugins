# describo-ui-plugins : s3

- [describo-ui-plugins : s3](#describo-ui-plugins--s3)
  - [Using the plugin](#using-the-plugin)
    - [Register the plugin with vue](#register-the-plugin-with-vue)
    - [Required configuration](#required-configuration)
    - [Store events](#store-events)

A plugin providing components to authenticate to s3 implementations (AWS and Minio) and preview
content residing on them.

The plugin has two components:

-   `s3-authenticator-component`
-   `s3-file-preview-component`

Usage:

```
<s3-authenticator-component />
```

And it registers one service: `this.s3AuthenticationManager`:

## Using the plugin

### Register the plugin with vue

```
    Vue.use(S3Plugin, {
            log,
            $http: Vue.prototype.$http,
            configuration: "/session/configuration/s3",
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

### Required configuration

When the plugin does a `GET` to the endpoint defined by `configuration` it must return the following
information:

```
[
    {
        "name": "Test Minio",
        "provider": "AWS | Minio"
    }
]
```

See the main documentation for configuring the application for more information on defining
services.

### Store events

This plugin will try to set the target resource in the store using:

```
this.$store.commit("setTargetResource", {
    resource: "s3",
});
```
