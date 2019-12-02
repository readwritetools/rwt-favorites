//=============================================================================
//
// File:         /node_modules/rwt-favorites/favorite-data.class.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2019
// License:      MIT
// Initial date: Dec 2, 2019
// Contents:     An object containing a list of this visitor's favorite pages
//               suitable for storing in browser localStorage
//
//=============================================================================

import FavoriteItem 		from './favorite-item.class.js';

export default class FavoriteData {

	static localStorageKey() {
		return 'favorite-data';
	}
	
	constructor() {
		this.itemsMap = new Map();			// filePath => FavoriteItem
    	Object.seal(this);
	}
	
	static exists() {
		return localStorage.getItem(FavoriteData.localStorageKey()) != null;
	}
	
	//< true if localStorage exists
	//< false if localStorage does not exist
	readFromStorage() {
		var json = localStorage.getItem(FavoriteData.localStorageKey());
		if (json) {
			var anonymousMap = new Map(JSON.parse(json));
			// cast the items of the map to be FavoriteItems
			for (let [itemKey, anonymousObj] of anonymousMap)
				this.itemsMap.set(itemKey, new FavoriteItem(anonymousObj));
			return true;
		}
		else
			return false;
	}

	// Convert data to JSON and save to localStorage
	writeToStorage() {
		// first, remove any pending items
		for (let [filePath, favoriteItem] of this.itemsMap) {
			if (favoriteItem.star == false)
				this.itemsMap.delete(filePath);
		}
		
		// now save to local storage
		var json = JSON.stringify(Array.from(this.itemsMap.entries()));
		localStorage.setItem(FavoriteData.localStorageKey(), json);
	}
	
	//^ Add a page to the list of favorites, if it doesn't already exist
	addPage(filePath, title, description, star) {		
		if (this.itemsMap.get(filePath) == undefined) {
			var favoriteItem = new FavoriteItem(filePath, title, description, star);
			this.itemsMap.set(filePath, favoriteItem);
		}
	}
	
	//^ Add the current page, as a pending item
	addCurrentPage() {
		var filePath = document.location.pathname;
		var title = document.title;
		var descriptionEl = document.querySelector('meta[name="description"]');
		var description = (descriptionEl) ? descriptionEl.content : '';
			
		this.addPage(filePath, title, description, false);
	}

	// set the item with the given path to be a favorite
	starFavorite(filePath) {
		var favoriteItem = this.itemsMap.get(filePath);
		if (favoriteItem)
			favoriteItem.star = true;
	}

	// set the item with the given path to be pending delete
	unstarFavorite(filePath) {
		var favoriteItem = this.itemsMap.get(filePath);
		if (favoriteItem)
			favoriteItem.star = false;
	}
}	