












<figure>
	<img src='/img/components/favorites/favorites-1500x750.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

##### Premium DOM Component

# Favorites

## Site-specific favorites dialog


<address>
<img src='/img/48x48/rwtools.png' /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2019-12-10>Dec 10, 2019</time></address>



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

### Installation

#### Prerequisites

The <span>rwt-favorites</span> DOM component works in any browser that
supports modern W3C standards. Templates are written using <span>BLUE</span><span>
PHRASE</span> notation, which can be compiled into HTML using the free <a href='https://hub.readwritetools.com/desktop/rwview.blue'>Read Write View</a>
desktop app. It has no other prerequisites. Distribution and installation are
done with either NPM or via Github.

#### Download


<details>
	<summary>Download using NPM</summary>
	<p><b>OPTION 1:</b> Familiar with Node.js and the <code>package.json</code> file?<br />Great. Install the component with this command:</p>
	<pre lang=bash>
npm install rwt-favorites<br />	</pre>
	<p><b>OPTION 2:</b> No prior experience using NPM?<br />Just follow these general steps:</p>
	<ul>
		<li>Install <a href='https://nodejs.org'>Node.js/NPM</a> on your development computer.</li>
		<li>Create a <code>package.json</code> file in the root of your web project using the command:</li>
		<pre lang=bash>
npm init<br />		</pre>
		<li>Download and install the DOM component using the command:</li>
		<pre lang=bash>
npm install rwt-favorites<br />		</pre>
	</ul>
	<p style='font-size:0.9em'>Important note: This DOM component uses Node.js and NPM and <code>package.json</code> as a convenient <i>distribution and installation</i> mechanism. The DOM component itself does not need them.</p>
</details>


<details>
	<summary>Download using Github</summary>
	<p>If you prefer using Github directly, simply follow these steps:</p>
	<ul>
		<li>Create a <code>node_modules</code> directory in the root of your web project.</li>
		<li>Clone the <span class=product>rwt-favorites</span> DOM component into it using the command:</li>
		<pre lang=bash>
git clone https://github.com/readwritetools/rwt-favorites.git<br />		</pre>
	</ul>
</details>

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
	<tr><td><img src='/img/48x48/read-write-hub.png' alt='DOM components logo' width=48 /></td>	<td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/components/favorites.blue'>READ WRITE HUB</a></td></tr>
	<tr><td><img src='/img/48x48/git.png' alt='git logo' width=48 /></td>	<td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwt-favorites'>github</a></td></tr>
	<tr><td><img src='/img/48x48/dom-components.png' alt='DOM components logo' width=48 /></td>	<td>Component catalog</td> 	<td><a href='https://domcomponents.com/components/favorites.blue'>DOM COMPONENTS</a></td></tr>
	<tr><td><img src='/img/48x48/npm.png' alt='npm logo' width=48 /></td>	<td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwt-favorites'>npm</a></td></tr>
	<tr><td><img src='/img/48x48/read-write-stack.png' alt='Read Write Stack logo' width=48 /></td>	<td>Publication venue</td>	<td><a href='https://readwritestack.com/components/favorites.blue'>READ WRITE STACK</a></td></tr>
</table>

### License

The <span>rwt-favorites</span> DOM component is not freeware. After
evaluating it and before using it in a public-facing website, eBook, mobile app,
or desktop application, you must obtain a license from <a href='https://readwritetools.com/licensing.blue'>Read Write Tools</a>
.

<img src='/img/blue-seal-premium-software.png' width=80 align=right />

<details>
	<summary>Favorites Software License Agreement</summary>
	<ol>
		<li>This Software License Agreement ("Agreement") is a legal contract between you and Read Write Tools ("RWT"). The "Materials" subject to this Agreement include the "Favorites" software and associated documentation.</li>
		<li>By using these Materials, you agree to abide by the terms and conditions of this Agreement.</li>
		<li>The Materials are protected by United States copyright law, and international treaties on intellectual property rights. The Materials are licensed, not sold to you, and can only be used in accordance with the terms of this Agreement. RWT is and remains the owner of all titles, rights and interests in the Materials, and RWT reserves all rights not specifically granted under this Agreement.</li>
		<li>Subject to the terms of this Agreement, RWT hereby grants to you a limited, non-exclusive license to use the Materials subject to the following conditions:</li>
		<ul>
			<li>You may not distribute, publish, sub-license, sell, rent, or lease the Materials.</li>
			<li>You may not decompile or reverse engineer any source code included in the software.</li>
			<li>You may not modify or extend any source code included in the software.</li>
			<li>Your license to use the software is limited to the purpose for which it was originally intended, and does not include permission to extract, link to, or use parts on a separate basis.</li>
		</ul>
		<li>Each paid license allows use of the Materials under one "Fair Use Setting". Separate usage requires the purchase of a separate license. Fair Use Settings include, but are not limited to: eBooks, mobile apps, desktop applications and websites. The determination of a Fair Use Setting is made at the sole discretion of RWT. For example, and not by way of limitation, a Fair Use Setting may be one of these:</li>
		<ul>
			<li>An eBook published under a single title and author.</li>
			<li>A mobile app for distribution under a single app name.</li>
			<li>A desktop application published under a single application name.</li>
			<li>A website published under a single domain name. For this purpose, and by way of example, the domain names "alpha.example.com" and "beta.example.com" are considered to be separate websites.</li>
			<li>A load-balanced collection of web servers, used to provide access to a single website under a single domain name.</li>
		</ul>
		<li>THE MATERIALS ARE PROVIDED BY READ WRITE TOOLS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL READ WRITE TOOLS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</li>
		<li>This license is effective for a one year period from the date of purchase or until terminated by you or Read Write Tools. Continued use, publication, or distribution of the Materials after the one year period, under any of this Agreement's Fair Use Settings, is subject to the renewal of this license.</li>
		<li>Products or services that you sell to third parties, during the valid license period of this Agreement and in compliance with the Fair Use Settings provision, may continue to be used by third parties after the effective period of your license.</li>
		<li>If you decide not to renew this license, you must remove the software from any eBook, mobile app, desktop application, web page or other product or service where it is being used.</li>
		<li>Without prejudice to any other rights, RWT may terminate your right to use the Materials if you fail to comply with the terms of this Agreement. In such event, you shall uninstall and delete all copies of the Materials.</li>
		<li>This Agreement is governed by and interpreted in accordance with the laws of the State of California. If for any reason a court of competent jurisdiction finds any provision of the Agreement to be unenforceable, that provision will be enforced to the maximum extent possible to effectuate the intent of the parties and the remainder of the Agreement shall continue in full force and effect.</li>
	</ol>
</details>

#### Activation

To activate your license, copy the `rwt-registration-keys.js` file to the *root
directory of your website*, providing the `customer-number` and `access-key` sent to
your email address, and replacing `example.com` with your website's hostname.
Follow this example:

<pre>
export default [{
    "product-key": "rwt-favorites",
    "registration": "example.com",
    "customer-number": "CN-xxx-yyyyy",
    "access-key": "AK-xxx-yyyyy"
}]
</pre>

