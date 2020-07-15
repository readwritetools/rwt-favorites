//=============================================================================
//
// File:         /node_modules/rwt-favorites/rwt-favorites.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2019
// License:      MIT
// Initial date: Dec 2, 2019
// Purpose:      Site-specific favorites dialog
//
//=============================================================================

import FavoriteData from './favorite-data.class.js';
import FavoriteItem from './favorite-item.class.js';

const Static = {
	componentName:    'rwt-favorites',
	elementInstance:  1,
	htmlURL:          '/node_modules/rwt-favorites/rwt-favorites.blue',
	cssURL:           '/node_modules/rwt-favorites/rwt-favorites.css',
	htmlText:         null,
	cssText:          null,
	nextID:           0
};

Object.seal(Static);

export default class RwtFavorites extends HTMLElement {

	constructor() {
		super();
				
		// guardrails
		this.instance = Static.elementInstance++;
		this.isComponentLoaded = false;
		
		// properties
		this.collapseSender = `${Static.componentName} ${this.instance}`;
		this.shortcutKey = null;
		this.urlPrefix = `${document.location.protocol}//${document.location.hostname}`;
		
		// child elements
		this.dialog = null;
		this.closeButton = null;
		this.favoriteDocs = null;
		this.favoriteMessage = null;
		this.messageText = null;

		// visitor's favorites
		this.favoriteData = null;

		Object.seal(this);
	}

	//-------------------------------------------------------------------------
	// customElement life cycle callback
	//-------------------------------------------------------------------------
	async connectedCallback() {		
		if (!this.isConnected)
			return;

		try {
			var htmlFragment = await this.getHtmlFragment();
			var styleElement = await this.getCssStyleElement();

			this.attachShadow({mode: 'open'});
			this.shadowRoot.appendChild(htmlFragment); 
			this.shadowRoot.appendChild(styleElement); 
			
			this.identifyChildren();
			this.registerEventListeners();
			this.initializeShortcutKey();
			await this.preloadFavorites();
			this.sendComponentLoaded();
		}
		catch (err) {
			console.log(err.message);
		}
	}

	//-------------------------------------------------------------------------
	// initialization
	//-------------------------------------------------------------------------

	// Only the first instance of this component fetches the HTML text from the server.
	// All other instances wait for it to issue an 'html-template-ready' event.
	// If this function is called when the first instance is still pending,
	// it must wait upon receipt of the 'html-template-ready' event.
	// If this function is called after the first instance has already fetched the HTML text,
	// it will immediately issue its own 'html-template-ready' event.
	// When the event is received, create an HTMLTemplateElement from the fetched HTML text,
	// and resolve the promise with a DocumentFragment.
	getHtmlFragment() {
		return new Promise(async (resolve, reject) => {
			var htmlTemplateReady = `${Static.componentName}-html-template-ready`;
			
			document.addEventListener(htmlTemplateReady, () => {
				var template = document.createElement('template');
				template.innerHTML = Static.htmlText;
				resolve(template.content);
			});
			
			if (this.instance == 1) {
				var response = await fetch(Static.htmlURL, {cache: "no-cache", referrerPolicy: 'no-referrer'});
				if (response.status != 200 && response.status != 304) {
					reject(new Error(`Request for ${Static.htmlURL} returned with ${response.status}`));
					return;
				}
				Static.htmlText = await response.text();
				document.dispatchEvent(new Event(htmlTemplateReady));
			}
			else if (Static.htmlText != null) {
				document.dispatchEvent(new Event(htmlTemplateReady));
			}
		});
	}
	
	// Use the same pattern to fetch the CSS text from the server
	// When the 'css-text-ready' event is received, create an HTMLStyleElement from the fetched CSS text,
	// and resolve the promise with that element.
	getCssStyleElement() {
		return new Promise(async (resolve, reject) => {
			var cssTextReady = `${Static.componentName}-css-text-ready`;

			document.addEventListener(cssTextReady, () => {
				var styleElement = document.createElement('style');
				styleElement.innerHTML = Static.cssText;
				resolve(styleElement);
			});
			
			if (this.instance == 1) {
				var response = await fetch(Static.cssURL, {cache: "no-cache", referrerPolicy: 'no-referrer'});
				if (response.status != 200 && response.status != 304) {
					reject(new Error(`Request for ${Static.cssURL} returned with ${response.status}`));
					return;
				}
				Static.cssText = await response.text();
				document.dispatchEvent(new Event(cssTextReady));
			}
			else if (Static.cssText != null) {
				document.dispatchEvent(new Event(cssTextReady));
			}
		});
	}

	//^ Identify this component's children
	identifyChildren() {
		this.dialog = this.shadowRoot.getElementById('favorite-dialog');
		this.closeButton = this.shadowRoot.getElementById('close-button');
		this.favoriteDocs = this.shadowRoot.getElementById('favorite-docs');
		this.favoriteMessage = this.shadowRoot.getElementById('favorite-message');
		this.messageText = this.shadowRoot.getElementById('message-text');
	}
	
	registerEventListeners() {
		// document events
		document.addEventListener('click', this.onClickDocument.bind(this));
		document.addEventListener('keydown', this.onKeydownDocument.bind(this));
		document.addEventListener('collapse-popup', this.onCollapsePopup.bind(this));
		document.addEventListener('toggle-favorites', this.onToggleEvent.bind(this));
		
		// component events
		this.dialog.addEventListener('click', this.onClickDialog.bind(this));
		this.closeButton.addEventListener('click', this.onClickClose.bind(this));
	}
	
	//^ Get the user-specified shortcut key. This will be used to open the dialog.
	//  Valid values are "F1", "F2", etc., specified with the *shortcut attribute on the custom element
	initializeShortcutKey() {
		if (this.hasAttribute('shortcut'))
			this.shortcutKey = this.getAttribute('shortcut');
	}

	// Read the visitor's favorites from browser localStorage,
	// or if this is the first time for any page, fetch the developer-specified initial favorites
	// from the URL specified in the customElement's sourceref attribute
	async preloadFavorites() {
		this.favoriteData = new FavoriteData();			
		var rc = this.favoriteData.readFromStorage();
		if (rc == false) {
			await this.fetchInitialFavorites();
			this.favoriteData.writeToStorage();		// immediately save to localStorage
		}
	}

	//^ Fetch the user-specified initial favorites from the JSON file specified in
	//  the custom element's sourceref attribute, which is a URL.
	//  That file should contain an array of objects in JSON format like this:
	/*
	[
	    {
	      "filePath": "/document1.blue",
	      "title": "Document 1 title",
	      "description": "Document 1 description",
	      "star": true
	    }
	]
	*/
	async fetchInitialFavorites() {
		if (this.hasAttribute('sourceref') == false)
			return;
		var sourceref = this.getAttribute('sourceref');

		var response = await fetch(sourceref, {cache: "no-cache", referrerPolicy: 'no-referrer'});
		if (response.status != 200 && response.status != 304)
			return;
		var jsonData = await response.json();

		// parse and save each user-specified favorite 
		if (jsonData.constructor.name == 'Array') {
			for (let i=0; i < jsonData.length; i++) {
				var obj = jsonData[i];
				if (obj.constructor.name == 'Object') {
					if ('filePath' in obj)
						this.favoriteData.addPage(obj.filePath, obj.title, obj.description, obj.star);
				}
			}
		}
	}

	//^ Inform the document's custom element that it is ready for programmatic use 
	sendComponentLoaded() {
		this.isComponentLoaded = true;
		this.dispatchEvent(new Event('component-loaded', {bubbles: true}));
	}

	//^ A Promise that resolves when the component is loaded
	waitOnLoading() {
		return new Promise((resolve) => {
			if (this.isComponentLoaded == true)
				resolve();
			else
				this.addEventListener('component-loaded', resolve);
		});
	}
	
	//-------------------------------------------------------------------------
	// document events
	//-------------------------------------------------------------------------
	
	// close the dialog when user clicks on the document
	onClickDocument(event) {
		this.hideDialog();
		event.stopPropagation();
	}
	
	// close the dialog when user presses the ESC key
	// toggle the dialog when user presses the assigned shortcutKey
	onKeydownDocument(event) {		
		if (event.key == "Escape") {
			this.hideDialog();
			event.stopPropagation();
		}
		// like 'F1', 'F2', etc
		if (event.key == this.shortcutKey && this.shortcutKey != null) {
			this.toggleDialog();
			event.stopPropagation();
			event.preventDefault();
		}
	}

	//^ Send an event to close/hide all other registered popups
	collapseOtherPopups() {
		var collapseEvent = new CustomEvent('collapse-popup', {detail: this.collapseSender});
		document.dispatchEvent(collapseEvent);
	}
	
	//^ Listen for an event on the document instructing this dialog to close/hide
	//  But don't collapse this dialog, if it was the one that generated it
	onCollapsePopup(event) {
		if (event.detail == this.collapseSender)
			return;
		else
			this.hideDialog();
	}
	
	//^ Anybody can use: document.dispatchEvent(new Event('toggle-favorites'));
	// to open/close this component.
	onToggleEvent(event) {
		event.stopPropagation();
		this.toggleDialog();
	}
	
	//-------------------------------------------------------------------------
	// component events
	//-------------------------------------------------------------------------

	// Necessary because clicking anywhere on the dialog will bubble up
	// to onClickDocument which will close the dialog
	onClickDialog(event) {
		event.stopPropagation();
	}
	
	//^ Append one favorite item to the DOM 
	appendFavoriteDoc(favoriteItem) {
		var el = document.createElement('div');
		el.className = 'favitem';
		
		Static.nextID++;
		var buttonID = `favitem${Static.nextID}`;
		
		var starClass = (favoriteItem.star == true) ? 'filled-star' : 'open-star';
		var tooltipTitle = (favoriteItem.star == true) ? 'Remove this from your favorites' : 'Add this to your favorites';
		
		// if the filePath is site-local, add the site's url as a prefix
		// otherwise the filePath should be a full protocol://host.tld/path-to-file
		var src =  (favoriteItem.filePath.charAt(0) == '/') ? `${this.urlPrefix}${favoriteItem.filePath}` : favoriteItem.filePath;
		
		var s =
`<button class='${starClass} no-animation' id='${buttonID}' data-file-path='${favoriteItem.filePath}' title='${tooltipTitle}'></button>
<a href='${src}'>
	<p class='textline'><span class='title'>${favoriteItem.title}</span> <span class='description'>${favoriteItem.description}</span></p>
	<p class='url'>${src}</p>
</a>`;
		el.innerHTML = s;
		this.favoriteDocs.appendChild(el);
		
		// setup click handler
		this.shadowRoot.getElementById(buttonID).addEventListener('click', this.onClickStar.bind(this));
	}
	
	// User has clicked on the dialog box's Close button
	onClickClose(event) {
		this.hideDialog();
		event.stopPropagation();
	}
	
	onClickStar(event) {
		var target = event.target;		
		var filePath = target.getAttribute('data-file-path');
		
		// already a favorite, so set it to pending delete
		if (target.classList.contains('filled-star')) {
			target.classList.remove('no-animation');
			target.classList.remove('filled-star');
			target.classList.add('open-star');
			target.title = 'Add this to your favorites';
			this.favoriteData.unstarFavorite(filePath);
			this.messageText.innerText = '✗ Removed';
			this.messageText.style.color = 'var(--yellow)';
		}
		
		// still a pending item, so set it to be a favorite
		else { // (target.classList.contains('open-star'))
			target.classList.remove('no-animation');
			target.classList.remove('open-star');
			target.classList.add('filled-star');
			target.title = 'Remove this from your favorites';
			this.favoriteData.starFavorite(filePath);
			this.messageText.innerText = '✓ Added';
			this.messageText.style.color = 'var(--title-blue)';
		}
		
		this.favoriteData.writeToStorage();
		event.stopPropagation();
	}
	
	//-------------------------------------------------------------------------
	// component methods
	//-------------------------------------------------------------------------

	toggleDialog() {
		if (this.dialog.style.display == 'none')
			this.showDialog();
		else
			this.hideDialog();
		event.stopPropagation();
	}
	
	// retrieve and show
	showDialog() {
		this.collapseOtherPopups();
		
		this.favoriteData.readFromStorage();

		// add the current page to the dataset (as a pending item) if it's not already there
		this.favoriteData.addCurrentPage();
		
		// remove all previous items, and add everything back in all at once
		this.favoriteDocs.innerHTML = '';
		for (let [filePath, favoriteItem] of this.favoriteData.itemsMap.entries()) {
			this.appendFavoriteDoc(favoriteItem);
		}
		
		this.dialog.style.display = 'block';		
	}

	// hide and save
	hideDialog() {
		if (this.dialog.style.display == 'block') {
			this.dialog.style.display = 'none';
			this.favoriteData.writeToStorage();
		}
	}
}

window.customElements.define(Static.componentName, RwtFavorites);
