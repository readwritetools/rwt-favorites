/* Copyright (c) 2021 Read Write Tools. Legal use subject to the Favorites DOM Component Software License Agreement. */
import FavoriteData from './favorite-data.class.js';

import FavoriteItem from './favorite-item.class.js';

const Static = {
    componentName: 'rwt-favorites',
    elementInstance: 1,
    htmlURL: '/node_modules/rwt-favorites/rwt-favorites.html',
    cssURL: '/node_modules/rwt-favorites/rwt-favorites.css',
    htmlText: null,
    cssText: null,
    nextID: 0
};

Object.seal(Static);

export default class RwtFavorites extends HTMLElement {
    constructor() {
        super(), this.instance = Static.elementInstance++, this.isComponentLoaded = !1, 
        this.collapseSender = `${Static.componentName} ${this.instance}`, this.shortcutKey = null, 
        this.urlPrefix = `${document.location.protocol}//${document.location.hostname}`, 
        this.dialog = null, this.closeButton = null, this.favoriteDocs = null, this.favoriteMessage = null, 
        this.messageText = null, this.favoriteData = null, Object.seal(this);
    }
    async connectedCallback() {
        if (this.isConnected) try {
            var t = await this.getHtmlFragment(), e = await this.getCssStyleElement();
            this.attachShadow({
                mode: 'open'
            }), this.shadowRoot.appendChild(t), this.shadowRoot.appendChild(e), this.identifyChildren(), 
            this.registerEventListeners(), this.initializeShortcutKey(), await this.preloadFavorites(), 
            this.sendComponentLoaded();
        } catch (t) {
            console.log(t.message);
        }
    }
    getHtmlFragment() {
        return new Promise((async (t, e) => {
            var i = `${Static.componentName}-html-template-ready`;
            if (document.addEventListener(i, (() => {
                var e = document.createElement('template');
                e.innerHTML = Static.htmlText, t(e.content);
            })), 1 == this.instance) {
                var a = await fetch(Static.htmlURL, {
                    cache: 'no-cache',
                    referrerPolicy: 'no-referrer'
                });
                if (200 != a.status && 304 != a.status) return void e(new Error(`Request for ${Static.htmlURL} returned with ${a.status}`));
                Static.htmlText = await a.text(), document.dispatchEvent(new Event(i));
            } else null != Static.htmlText && document.dispatchEvent(new Event(i));
        }));
    }
    getCssStyleElement() {
        return new Promise((async (t, e) => {
            var i = `${Static.componentName}-css-text-ready`;
            if (document.addEventListener(i, (() => {
                var e = document.createElement('style');
                e.innerHTML = Static.cssText, t(e);
            })), 1 == this.instance) {
                var a = await fetch(Static.cssURL, {
                    cache: 'no-cache',
                    referrerPolicy: 'no-referrer'
                });
                if (200 != a.status && 304 != a.status) return void e(new Error(`Request for ${Static.cssURL} returned with ${a.status}`));
                Static.cssText = await a.text(), document.dispatchEvent(new Event(i));
            } else null != Static.cssText && document.dispatchEvent(new Event(i));
        }));
    }
    identifyChildren() {
        this.dialog = this.shadowRoot.getElementById('favorite-dialog'), this.closeButton = this.shadowRoot.getElementById('close-button'), 
        this.favoriteDocs = this.shadowRoot.getElementById('favorite-docs'), this.favoriteMessage = this.shadowRoot.getElementById('favorite-message'), 
        this.messageText = this.shadowRoot.getElementById('message-text');
    }
    registerEventListeners() {
        document.addEventListener('click', this.onClickDocument.bind(this)), document.addEventListener('keydown', this.onKeydownDocument.bind(this)), 
        document.addEventListener('collapse-popup', this.onCollapsePopup.bind(this)), document.addEventListener('toggle-favorites', this.onToggleEvent.bind(this)), 
        this.dialog.addEventListener('click', this.onClickDialog.bind(this)), this.closeButton.addEventListener('click', this.onClickClose.bind(this));
    }
    initializeShortcutKey() {
        this.hasAttribute('shortcut') && (this.shortcutKey = this.getAttribute('shortcut'));
    }
    async preloadFavorites() {
        this.favoriteData = new FavoriteData, 0 == this.favoriteData.readFromStorage() && (await this.fetchInitialFavorites(), 
        this.favoriteData.writeToStorage());
    }
    async fetchInitialFavorites() {
        if (0 != this.hasAttribute('sourceref')) {
            var t = this.getAttribute('sourceref'), e = await fetch(t, {
                cache: 'no-cache',
                referrerPolicy: 'no-referrer'
            });
            if (200 == e.status || 304 == e.status) {
                var i = await e.json();
                if ('Array' == i.constructor.name) for (let t = 0; t < i.length; t++) {
                    var a = i[t];
                    'Object' == a.constructor.name && 'filePath' in a && this.favoriteData.addPage(a.filePath, a.title, a.description, a.star);
                }
            }
        }
    }
    sendComponentLoaded() {
        this.isComponentLoaded = !0, this.dispatchEvent(new Event('component-loaded', {
            bubbles: !0
        }));
    }
    waitOnLoading() {
        return new Promise((t => {
            1 == this.isComponentLoaded ? t() : this.addEventListener('component-loaded', t);
        }));
    }
    onClickDocument(t) {
        this.hideDialog(), t.stopPropagation();
    }
    onKeydownDocument(t) {
        'Escape' == t.key && (this.hideDialog(), t.stopPropagation()), t.key == this.shortcutKey && null != this.shortcutKey && (this.toggleDialog(), 
        t.stopPropagation(), t.preventDefault());
    }
    collapseOtherPopups() {
        var t = new CustomEvent('collapse-popup', {
            detail: this.collapseSender
        });
        document.dispatchEvent(t);
    }
    onCollapsePopup(t) {
        t.detail != this.collapseSender && this.hideDialog();
    }
    onToggleEvent(t) {
        t.stopPropagation(), this.toggleDialog();
    }
    onClickDialog(t) {
        t.stopPropagation();
    }
    appendFavoriteDoc(t) {
        var e = document.createElement('div');
        e.className = 'favitem', Static.nextID++;
        var i = `favitem${Static.nextID}`, a = 1 == t.star ? 'filled-star' : 'open-star', s = 1 == t.star ? 'Remove this from your favorites' : 'Add this to your favorites', o = '/' == t.filePath.charAt(0) ? `${this.urlPrefix}${t.filePath}` : t.filePath, n = `<button class='${a} no-animation' id='${i}' data-file-path='${t.filePath}' title='${s}'></button>\n<a href='${o}'>\n\t<p class='textline'><span class='title'>${t.title}</span> <span class='description'>${t.description}</span></p>\n\t<p class='url'>${o}</p>\n</a>`;
        e.innerHTML = n, this.favoriteDocs.appendChild(e), this.shadowRoot.getElementById(i).addEventListener('click', this.onClickStar.bind(this));
    }
    onClickClose(t) {
        this.hideDialog(), t.stopPropagation();
    }
    onClickStar(t) {
        var e = t.target, i = e.getAttribute('data-file-path');
        e.classList.contains('filled-star') ? (e.classList.remove('no-animation'), e.classList.remove('filled-star'), 
        e.classList.add('open-star'), e.title = 'Add this to your favorites', this.favoriteData.unstarFavorite(i), 
        this.messageText.innerText = '✗ Removed', this.messageText.style.color = 'var(--yellow)') : (e.classList.remove('no-animation'), 
        e.classList.remove('open-star'), e.classList.add('filled-star'), e.title = 'Remove this from your favorites', 
        this.favoriteData.starFavorite(i), this.messageText.innerText = '✓ Added', this.messageText.style.color = 'var(--title-blue)'), 
        this.favoriteData.writeToStorage(), t.stopPropagation();
    }
    toggleDialog() {
        'none' == this.dialog.style.display ? this.showDialog() : this.hideDialog(), event.stopPropagation();
    }
    showDialog() {
        this.collapseOtherPopups(), this.favoriteData.readFromStorage(), this.favoriteData.addCurrentPage(), 
        this.favoriteDocs.innerHTML = '';
        for (let [t, e] of this.favoriteData.itemsMap.entries()) this.appendFavoriteDoc(e);
        this.dialog.style.display = 'block';
    }
    hideDialog() {
        'block' == this.dialog.style.display && (this.dialog.style.display = 'none', this.favoriteData.writeToStorage());
    }
}

window.customElements.define(Static.componentName, RwtFavorites);