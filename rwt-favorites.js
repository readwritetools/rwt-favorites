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

export default class RwtFavorites extends HTMLElement {

	static nextID = 0;
	
	constructor() {
		super();
				
		// child elements
		this.dialog = null;
		this.closeButton = null;
		this.favoriteDocs = null;
		this.favoriteMessage = null;
		this.messageText = null;

		// properties
		this.shortcutKey = null;
		this.urlPrefix = `${document.location.protocol}//${document.location.hostname}`;
		
		// visitor's favorites
		this.favoriteData = null;

		Object.seal(this);
	}

	//-------------------------------------------------------------------------
	// customElement life cycle callbacks
	//-------------------------------------------------------------------------
	async connectedCallback() {		
		// guard against possible call after this has been disconnected
		if (!this.isConnected)
			return;

		var htmlFragment = await this.fetchTemplate();
		if (htmlFragment == null)
			return;
		
		var styleElement = await this.fetchCSS();
		if (styleElement == null)
			return;

		 // append the HTML and CSS to the custom element's shadow root
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(htmlFragment); 
		this.shadowRoot.appendChild(styleElement); 
		
		this.identifyChildren();
		this.registerEventListeners();
		this.initializeShortcutKey();
		
		await this.preloadFavorites();
	}

	//-------------------------------------------------------------------------
	// initialization
	//-------------------------------------------------------------------------

	//^ Fetch the HTML template
	//< returns a document-fragment suitable for appending to shadowRoot
	//< returns null if server does not respond with 200 or 304
	async fetchTemplate() {
		var response = await fetch('/node_modules/rwt-favorites/rwt-favorites.blue');
		if (response.status != 200 && response.status != 304)
			return null;
		var templateText = await response.text();
		
		// create a template and turn its content into a document fragment
		var template = document.createElement('template');
		template.innerHTML = templateText;
		return template.content;
	}
	
	//^ Fetch the CSS styles and turn it into a style element
	//< returns an style element suitable for appending to shadowRoot
	//< returns null if server does not respond with 200 or 304
	async fetchCSS() {
		var response = await fetch('/node_modules/rwt-favorites/rwt-favorites.css');
		if (response.status != 200 && response.status != 304)
			return null;
		var css = await response.text();

		var styleElement = document.createElement('style');
		styleElement.innerHTML = css;
		return styleElement;
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
	//  Default value is "F7"
	initializeShortcutKey() {
		if (this.hasAttribute('shortcut'))
			this.shortcutKey = this.getAttribute('shortcut');
		else
			this.shortcutKey = 'F7';
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

		var response = await fetch(sourceref, {cache: "no-cache"});		// send conditional request to server with ETag and If-None-Match
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
		if (event.key == this.shortcutKey) {
			this.toggleDialog();
			event.stopPropagation();
			event.preventDefault();
		}
	}

	//^ Send an event to close/hide all other registered popups
	collapseOtherPopups() {
		var collapseEvent = new CustomEvent('collapse-popup', {detail: { sender: 'RwtFavorites'}});
		document.dispatchEvent(collapseEvent);
	}
	
	//^ Listen for an event on the document instructing this dialog to close/hide
	//  But don't collapse this dialog, if it was the one that generated it
	onCollapsePopup(event) {
		if (event.detail.sender == 'RwtFavorites')
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
		
		RwtFavorites.nextID++;
		var buttonID = `favitem${RwtFavorites.nextID}`;
		
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

window.customElements.define('rwt-favorites', RwtFavorites);
