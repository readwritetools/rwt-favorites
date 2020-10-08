











<figure>
	<img src='/img/components/favorites/favorites-pixaby-mohamed-hassan.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

##### Open Source DOM Component

# Favorites

## Site-specific favorites dialog


<address>
<img src='/img/rwtools.png' width=80 /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2019-12-10>Dec 10, 2019</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>rwt-favorites</span> DOM component uses the browser's local-storage facility to hold a website-specific list of favorite pages. Visitors can add or remove pages from the list using a popup dialog box.</td></tr>
</table>

### Motivation

When browsing for information, it's common to glance over page after page of
"not quite what I'm looking for" stuff. When you finally discover the gem you're
looking for, you naturally don't want to lose it.

Saving that page to your browser's list of favorites is a common way to keep
track of important URLs. Unfortunately, the browser's list of favorites tends to
get so cluttered over time that it's no longer useful.

This <span>rwt-favorites</span> DOM component is a way to give a
similar functionality to your visitors, but on a local website basis. Users can
save pages for later in-depth reading, or for follow-up work, or for ready
reference. It is most useful on large websites.

#### In the wild

To see an example of this component in use, visit the <a href='https://bluephrase.com'><span class=bp>BLUE</span><span class=phrase>PHRASE</span></a>
website and press <kbd>F8</kbd> "Favorites". To understand what's going on under
the hood, use the browser's inspector to view the HTML source code and network
activity, and follow along as you read this documentation.

#### Prerequisites

The <span>rwt-favorites</span> DOM component works in any browser that
supports modern W3C standards. Templates are written using <span>BLUE</span><span>
PHRASE</span> notation, which can be compiled into HTML using the free <a href='https://hub.readwritetools.com/desktop/rwview.blue'>Read Write View</a>
desktop app. It has no other prerequisites. Distribution and installation are
done with either NPM or via Github.

#### Installation using NPM

If you are familiar with Node.js and the `package.json` file, you'll be
comfortable installing the component just using this command:

```bash
npm install rwt-favorites
```

If you are a front-end Web developer with no prior experience with NPM, follow
these general steps:

   * Install <a href='https://nodejs.org'>Node.js/NPM</a>
on your development computer.
   * Create a `package.json` file in the root of your web project using the command:
```bash
npm init
```

   * Download and install the DOM component using the command:
```bash
npm install rwt-favorites
```


Important note: This DOM component uses Node.js and NPM and `package.json` as a
convenient *distribution and installation* mechanism. The DOM component itself
does not need them.

#### Installation using Github

If you are more comfortable using Github for installation, follow these steps:

   * Create a directory `node_modules` in the root of your web project.
   * Clone the <span>rwt-favorites</span> DOM component into it using the
      command:
```bash
git clone https://github.com/readwritetools/rwt-favorites.git
```


### Using the DOM component

After installation, you need to add four things to your HTML page to make use of
it.

   * Add a `script` tag to load the component's `rwt-favorites.js` file:
```html
<script src='/node_modules/rwt-favorites/rwt-favorites.js' type=module></script>             
```

   * Add the component tag somewhere on the page.

      * For scripting purposes, apply an `id` attribute.
      * Optionally, apply a `sourceref` attribute with a reference to a JSON file
         containing initial favorites.
      * And for WAI-ARIA accessibility apply a `role=search` attribute.
```html
<rwt-favorites id=favorites sourceref='/initial-favorites.json' role=search></rwt-favorites>             
```

   * Add a button for the visitor to click to show the dialog:
```html
<a id=favorite-button title='Favorites (F7)'>★</a>
```

   * Add a listener to respond to the click event:
```html
<script type=module>
    document.getElementById('favorite-button').addEventListener('click', (e) => {
        document.getElementById('favorites').toggleDialog(e);
    });
</script>
```


### Customization

#### Preset favorites

The JSON file referenced by the `sourceref` attribute is used to initialize the
local-storage area with "favorites" that you think are appropriate for
first-time visitors. It is only used the first time a visitor encounters this
component on any page in your website. It is ignored from then on.

The format for this JSON file follows this pattern:

```json
[
    {
      "filePath": "/page1.html",
      "title": "Page 1",
      "description": "The most important feature of this website",
      "star": true
    },
    {
      "filePath": "...",
      "title": "...",
      "description": "...",
      "star": true
    }
]
```

#### Dialog size and position

The dialog is absolutely positioned towards the bottom right of the viewport.
Its size may be overridden using CSS by defining new values for `--width` and `--height`
.

```css
rwt-favorites {
    --width: 70vw;
    --height: 50vh;
    --bottom: 1rem;
    --right: 1rem;
}
```

#### Dialog color scheme

The default color palette for the dialog uses a dark mode theme. You can use CSS
to override the variables' defaults:

```css
rwt-favorites {
    --color: var(--white);
    --accent-color1: var(--yellow);
    --accent-color2: var(--js-blue);
    --background: var(--black);
    --accent-background1: var(--medium-black);
    --accent-background2: var(--pure-black);
    --accent-background3: var(--nav-black);
    --accent-background4: var(--black);
}
```

### Internals

The visitor's favorites are stored in local-storage under the key `favorite-data`.

### Life-cycle events

The component issues life-cycle events.


<dl>
	<dt><code>component-loaded</code></dt>
	<dd>Sent when the component is fully loaded and ready to be used. As a convenience you can use the <code>waitOnLoading()</code> method which returns a promise that resolves when the <code>component-loaded</code> event is received. Call this asynchronously with <code>await</code>.</dd>
</dl>

---

### Reference


<table>
	<tr><td><img src='/img/read-write-hub.png' alt='DOM components logo' width=40 /></td>	<td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/components/favorites.blue'>READ WRITE HUB</a></td></tr>
	<tr><td><img src='/img/git.png' alt='git logo' width=40 /></td>	<td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwt-favorites'>github</a></td></tr>
	<tr><td><img src='/img/dom-components.png' alt='DOM components logo' width=40 /></td>	<td>Component catalog</td> 	<td><a href='https://domcomponents.com/favorites.blue'>DOM COMPONENTS</a></td></tr>
	<tr><td><img src='/img/npm.png' alt='npm logo' width=40 /></td>	<td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwt-favorites'>npm</a></td></tr>
	<tr><td><img src='/img/read-write-stack.png' alt='Read Write Stack logo' width=40 /></td>	<td>Publication venue</td>	<td><a href='https://readwritestack.com/components/favorites.blue'>READ WRITE STACK</a></td></tr>
</table>

### License

The <span>rwt-favorites</span> DOM component is licensed under the MIT
License.

<img src='/img/blue-seal-mit.png' width=80 align=right />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>

