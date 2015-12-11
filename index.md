---
title: "Overview"
theme: "Business theme"
repo: "https://github.com/seedstack/w20-business-theme"
author: "SeedStack"
description: "W20 theme for enterprise business applications."
min-version: "15.7+"
menu:
    BusinessTheme:
        weight: 10
---

# Business Theme

The Business Theme is a responsive Bootstrap 3 based theme that provides upfront integration of aspects such as
routes navigation, authentication or internationalization in your front end application.

{{% callout tips %}}
Running demo available [here](http://seedstack.org/w20-business-theme).
{{% /callout %}}

# Installation

Two fragments are required: `w20-bootstrap-3` and `w20-business-theme`. You can install them
through bower if you are developing a stand alone front end or you can use the front-back integration bridge to serve
the required dependencies through dedicated JARs.

## Bower

```
$ bower install w20-bootstrap-3 w20-business-theme
```

You can also add them to your `bower.json` file. Check for the latest release [here](https://github.com/seedstack/w20-business-theme/releases).

## Using the [Bridge addon](http://seedstack.org/addons/w20-bridge/)

If the frontend files are served from resource JARs, the theme dependencies are added in the following way
in your Web module:

### Bootstrap 3 fragment

{{< dependency g="org.seedstack.addons.w20" a="w20-bridge-web-bootstrap-3" v="[insert version]">}}

### Theme fragment 

{{< dependency g="org.seedstack.addons.w20" a="w20-bridge-web-business-theme" v="[insert version]">}}

# Configuration

## Fragment declaration

To include the theme, declare it in your fragment manifest (If you are using the bridge addon it will be included by default).

```
"bower_components/w20-business-theme/w20-business-theme.w20.json": {
    "modules": {
        "main": {}
    }
}
```

## Options

Options can be declared in the `main` module configuration.

* `sidebar`: (Object) Options for the theme sidebar.
    * `width`: (Number) Specify a fixed size in px for the sidebar. If not configured a default 270px width is applied.
* `brand`: (Object) Options for the upper-left corner which displays the application brand/name.
    * `fixedWith`: (Boolean) If true, the brand name size will not exceed the default sidebar width.
    * `backgroundColor`: (Any CSS color compatible declaration) Set the background color of the brand.
    * `textColor`: (Any CSS color compatible declaration) Set the color of the brand test.
* `links`: (Array) Add additional links to the topbar. The `links` array will contain Object link with the following properties:
    * `label`: (String) The value to display as the link name if no i18n key is provided.
    * `i18n`: (String) The i18n key to use for the link (ex: 'custom.link.key'). See the culture module of w20 for more information.
    * `href`: (String) The href attribute value of the link.
    * `target`: (String) The target attribute value of the link (ex: '_blank').
    * `security`: (String) The link display security expression. See the security module of w20 for more information.
* `hideConnectivity`: (Boolean) Hide the connectivity status.
* `hideCulture`: (Boolean) Hide the culture dropdown.
* `hideSecurity`: (Boolean) Hide the authentication action.
    
## Sidebar routes

Routes declaration of fragments are aggregated in the sidebar menu. You can group related route under a category by declaring
a `category` attribute on the route declaration.

```
"routes": {
    "topLevelRoute": {
        "templateUrl":"{Fragment}/views/topLevelRoute.html",
        "controller":"TopLevelRouteController as tlr",
    },
    "route1OfCatOne": {
        "templateUrl":"{Fragment}/views/route1.html",
        "controller":"Route1Controller as rc1",
        "category": "catOne"
    },
   "route2OfCatOne": {
       "templateUrl":"{Fragment}/views/route2.html",
       "controller":"Route1Controller as rc2",
       "category": "catOne"
   }
}
```

The category will appear as an i18n key in your route (`application.viewcategory.[category name]`) which you can
then localize.

You can order the category in the menu by delcaring a `navigation` property in your fragment manifest:

```
"navigation": {
    "": [ "catTwo", "catOne"]
}
```

## Topbar actions

The topbar will automatically include actions such as a culture dropdown, login/logout button or connectivity status if 
the relevant module have been declared and if these actions have not been hidden using `hideXXXX` properties.
You can include your own actions using the `MenuService`.

* First you need to register an action type:

```
service.registerActionType('my-action-type', {
    templateUrl: '{Fragment}/templates/action-my-action.html',
    showFn: function () {
        var show = true;
        // You can specify conditions for displaying the action
        return show;
    }
});
```

* Then you can add this action to the topbar:

```
service.addAction('action', 'my-action-type', {
    sortKey: 300
});
```
This register an action of name 'action' of type 'my-action-type'. The last parameter is an
object which will extend the default one you provided in the action type registration. Use
the `sortKey` attribute to order your actions display.

## Components

### Background colors

These background classes can be used to style background. Text color will be set appropriately to
contrast with them.

*  {{% colors "#999999" %}} .bg-grey
*  {{% colors "#f7f7f7" %}} .bg-gray-light
*  {{% colors "#111111" %}} .bg-black
*  {{% colors "#DD4B39" %}} .bg-red
*  {{% colors "#F39C12" %}} .bg-yellow
*  {{% colors "#00C0EF" %}} .bg-aqua
*  {{% colors "#428BCA" %}} .bg-blue
*  {{% colors "#3C8DBC" %}} .bg-light-blue
*  {{% colors "#00A65A" %}} .bg-green
*  {{% colors "#001F3F" %}} .bg-navy
*  {{% colors "#39CCCC" %}} .bg-teal
*  {{% colors "#3D9970" %}} .bg-olive
*  {{% colors "#01FF70" %}} .bg-lime
*  {{% colors "#FF851B" %}} .bg-orange
*  {{% colors "#F012BE" %}} .bg-fuchsia
*  {{% colors "#605CA8" %}} .bg-purple
*  {{% colors "#D81B60" %}} .bg-maroon

### Infobox

Infobox are components that display information associated with an icon.

```
<div class="col-md-3">
    <!-- Apply a bg-* to the info-box to color it completely -->
    <div class="info-box">
        <!-- Apply any bg-* class to to the icon to color it -->
        <span class="info-box-icon bg-red"><i class="fa fa-star-o"></i></span>
        <div class="info-box-content">
            <span class="info-box-text">Text</span>
            <span class="info-box-number">100</span>
        </div>
    </div>
</div>
```

### Callout

Callout can be used as an alternative to Bootstrap `alert` to carry visual emphasis.

```
<div class="col-md-6">
    <div class="callout callout-info|warning|success|danger">
        <h4>Title</h4>
        <p> Message to display to the user </p>
    </div>
</div>
```


