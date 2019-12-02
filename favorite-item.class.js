//=============================================================================
//
// File:         /node_modules/rwt-favorites/favorite-item.class.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2019
// License:      MIT
// Initial date: Dec 2, 2019
// Contents:     An object representing a single visitor favorite
//
//=============================================================================

export default class FavoriteItem {

	constructor(arg0, arg1, arg2, arg3) {
		if (arg0.constructor.name == 'Object')
			this.copyConstructor(arg0);
		else
			this.normalConstructor(arg0, arg1, arg2, arg3);
	}
	
	copyConstructor(rhs) {
		this.filePath		= rhs.filePath;
		this.title 			= rhs.title;
		this.description 	= rhs.description;
		this.star 			= rhs.star;
		Object.seal(this);
	}
	
	normalConstructor(filePath, title, description, star) {
		this.filePath 		= filePath;			// full directory and filename path, without host or protocol
		this.title 			= title;			// page title
		this.description 	= description;		// page description
		this.star 			= star;				// true == favorite, false == pending
		Object.seal(this);
	}
}
