/* Copyright (c) 2021 Read Write Tools. Legal use subject to the Favorites DOM Component Software License Agreement. */
export default class FavoriteItem {
    constructor(t, s, i, r) {
        'Object' == t.constructor.name ? this.copyConstructor(t) : this.normalConstructor(t, s, i, r);
    }
    copyConstructor(t) {
        this.filePath = t.filePath, this.title = t.title, this.description = t.description, 
        this.star = t.star, Object.seal(this);
    }
    normalConstructor(t, s, i, r) {
        this.filePath = t, this.title = s, this.description = i, this.star = r, Object.seal(this);
    }
}