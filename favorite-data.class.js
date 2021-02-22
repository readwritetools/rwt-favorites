/* Copyright (c) 2021 Read Write Tools. Legal use subject to the Favorites DOM Component Software License Agreement. */
import FavoriteItem from './favorite-item.class.js';

export default class FavoriteData {
    static localStorageKey() {
        return 'favorite-data';
    }
    constructor() {
        this.itemsMap = new Map, Object.seal(this);
    }
    static exists() {
        return null != localStorage.getItem(FavoriteData.localStorageKey());
    }
    readFromStorage() {
        var t = localStorage.getItem(FavoriteData.localStorageKey());
        if (t) {
            var e = new Map(JSON.parse(t));
            for (let [t, a] of e) this.itemsMap.set(t, new FavoriteItem(a));
            return !0;
        }
        return !1;
    }
    writeToStorage() {
        for (let [t, e] of this.itemsMap) 0 == e.star && this.itemsMap.delete(t);
        var t = JSON.stringify(Array.from(this.itemsMap.entries()));
        localStorage.setItem(FavoriteData.localStorageKey(), t);
    }
    addPage(t, e, a, r) {
        if (null == this.itemsMap.get(t)) {
            var o = new FavoriteItem(t, e, a, r);
            this.itemsMap.set(t, o);
        }
    }
    addCurrentPage() {
        var t = document.location.pathname, e = document.title, a = document.querySelector('meta[name="description"]'), r = a ? a.content : '';
        this.addPage(t, e, r, !1);
    }
    starFavorite(t) {
        var e = this.itemsMap.get(t);
        e && (e.star = !0);
    }
    unstarFavorite(t) {
        var e = this.itemsMap.get(t);
        e && (e.star = !1);
    }
}