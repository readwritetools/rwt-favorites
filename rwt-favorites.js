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
            this.sendComponentLoaded(), this.validate();
        } catch (t) {
            console.log(t.message);
        }
    }
    getHtmlFragment() {
        return new Promise((async (t, e) => {
            var a = `${Static.componentName}-html-template-ready`;
            if (document.addEventListener(a, (() => {
                var e = document.createElement('template');
                e.innerHTML = Static.htmlText, t(e.content);
            })), 1 == this.instance) {
                var i = await fetch(Static.htmlURL, {
                    cache: 'no-cache',
                    referrerPolicy: 'no-referrer'
                });
                if (200 != i.status && 304 != i.status) return void e(new Error(`Request for ${Static.htmlURL} returned with ${i.status}`));
                Static.htmlText = await i.text(), document.dispatchEvent(new Event(a));
            } else null != Static.htmlText && document.dispatchEvent(new Event(a));
        }));
    }
    getCssStyleElement() {
        return new Promise((async (t, e) => {
            var a = `${Static.componentName}-css-text-ready`;
            if (document.addEventListener(a, (() => {
                var e = document.createElement('style');
                e.innerHTML = Static.cssText, t(e);
            })), 1 == this.instance) {
                var i = await fetch(Static.cssURL, {
                    cache: 'no-cache',
                    referrerPolicy: 'no-referrer'
                });
                if (200 != i.status && 304 != i.status) return void e(new Error(`Request for ${Static.cssURL} returned with ${i.status}`));
                Static.cssText = await i.text(), document.dispatchEvent(new Event(a));
            } else null != Static.cssText && document.dispatchEvent(new Event(a));
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
                var a = await e.json();
                if ('Array' == a.constructor.name) for (let t = 0; t < a.length; t++) {
                    var i = a[t];
                    'Object' == i.constructor.name && 'filePath' in i && this.favoriteData.addPage(i.filePath, i.title, i.description, i.star);
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
        var a = `favitem${Static.nextID}`, i = 1 == t.star ? 'filled-star' : 'open-star', o = 1 == t.star ? 'Remove this from your favorites' : 'Add this to your favorites', s = '/' == t.filePath.charAt(0) ? `${this.urlPrefix}${t.filePath}` : t.filePath, n = `<button class='${i} no-animation' id='${a}' data-file-path='${t.filePath}' title='${o}'></button>\n<a href='${s}'>\n\t<p class='textline'><span class='title'>${t.title}</span> <span class='description'>${t.description}</span></p>\n\t<p class='url'>${s}</p>\n</a>`;
        e.innerHTML = n, this.favoriteDocs.appendChild(e), this.shadowRoot.getElementById(a).addEventListener('click', this.onClickStar.bind(this));
    }
    onClickClose(t) {
        this.hideDialog(), t.stopPropagation();
    }
    onClickStar(t) {
        var e = t.target, a = e.getAttribute('data-file-path');
        e.classList.contains('filled-star') ? (e.classList.remove('no-animation'), e.classList.remove('filled-star'), 
        e.classList.add('open-star'), e.title = 'Add this to your favorites', this.favoriteData.unstarFavorite(a), 
        this.messageText.innerText = '✗ Removed', this.messageText.style.color = 'var(--yellow)') : (e.classList.remove('no-animation'), 
        e.classList.remove('open-star'), e.classList.add('filled-star'), e.title = 'Remove this from your favorites', 
        this.favoriteData.starFavorite(a), this.messageText.innerText = '✓ Added', this.messageText.style.color = 'var(--title-blue)'), 
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
    async validate() {
        if (1 == this.instance) {
            var t = (s = window.location.hostname).split('.'), e = 25;
            if (t.length >= 2) {
                var a = t[t.length - 2].charAt(0);
                (a < 'a' || a > 'z') && (a = 'q'), e = a.charCodeAt(a) - 97, e = Math.max(e, 0), 
                e = Math.min(e, 25);
            }
            var i = new Date;
            i.setUTCMonth(0, 1);
            var o = (Math.floor((Date.now() - i) / 864e5) + 1) % 26, s = window.location.hostname, n = `Unregistered ${Static.componentName} component.`;
            try {
                var r = (await import('../../rwt-registration-keys.js')).default;
                for (let t = 0; t < r.length; t++) {
                    var c = r[t];
                    if (c.hasOwnProperty('product-key') && c['product-key'] == Static.componentName) return s != c.registration && console.warn(`${n} See https://readwritetools.com/licensing.blue to learn more.`), 
                    void (o == e && window.setTimeout(this.authenticate.bind(this, c), 1e3));
                }
                console.warn(`${n} rwt-registration-key.js file missing "product-key": "${Static.componentName}"`);
            } catch (t) {
                console.warn(`${n} rwt-registration-key.js missing from website's root directory.`);
            }
        }
    }
    async authenticate(t) {
        var e = encodeURIComponent(window.location.hostname), a = encodeURIComponent(window.location.href), i = encodeURIComponent(t.registration), o = encodeURIComponent(t['customer-number']), s = encodeURIComponent(t['access-key']), n = {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            cache: 'no-cache',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            body: `product-name=${Static.componentName}&hostname=${e}&href=${a}&registration=${i}&customer-number=${o}&access-key=${s}`
        };
        try {
            var r = await fetch('https://validation.readwritetools.com/v1/genuine/component', n);
            if (200 == r.status) await r.json();
        } catch (t) {
            console.info(t.message);
        }
    }
}

window.customElements.define(Static.componentName, RwtFavorites);