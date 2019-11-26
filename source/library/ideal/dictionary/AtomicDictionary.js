"use strict"

/*

    AtomicDictionary

    TODO: map dictionary operators to methods or raise exceptions?

*/

window.ideal.AtomicDictionary = class AtomicDictionary extends ideal.Dictionary {

    init () {
        super.init()
        this.newSlot("hasBegun", false) // private method
        this.newSlot("oldVersion", null) // private method
        this.newSlot("isOpen", true) // private method
        this.newSlot("keysAndValuesAreStrings", true) // private method
    }

    open () {
        this.setIsOpen(true)
        return this
    }

    assertOpen () {
        assert(this.isOpen())
    }

    asyncOpen (callback) {
        this.setIsOpen(true)
        callback()
    }

    begin () {
        this.assertAccessible()
        this.assertNotInTx()
        this.setOldVersion(this.jsDict().shallowCopy()) // so no one else has a reference to our copy
        this.setJsDict(this.jsDict())
        this.setHasBegun(true)
        return this
    }

    revert() {
        this.assertInTx()
        this.setJsDict(this.oldVersion()) // rever to old version
        this.setOldVersion(null)
        this.setHasBegun(false)
        return this
    }

    commit () {
        this.assertInTx()
        this.setOldVersion(null) // no more need for old version
        this.setHasBegun(false)
        return this
    }

    // just need to make sure writes happen within a transaction

    assertInTx () { // private
	    assert(this.hasBegun())
    }

    assertNotInTx () { // private
	    assert(!this.hasBegun())
    }

    atPut (k, v) {
        if (this.keysAndValuesAreStrings()) {
            assert(Type.isString(k))
            assert(Type.isString(v))
        }

        this.assertAccessible()
        this.assertInTx()
        return super.atPut(k, v)
    }

    removeKey (k) {        
        if (this.keysAndValuesAreStrings()) {
            assert(Type.isString(k))
        }

        this.assertAccessible()
        this.assertInTx()
        return this.removeKey(k);
    }

    // extras 

    assertAccessible () {
        this.assertOpen()
    }

    keys () {
        this.assertAccessible()
        return Object.keys(this.jsDict());
    }
	
    values () {
        this.assertAccessible()
        return Object.values(this.jsDict());
    }

    size () {
        this.assertAccessible()
        return this.keys().length
    }	

    asJsonString () {
        this.assertAccessible()
        // WARNING: this can be slow for a big store!
        return this.jsDict()
    }

    totalBytes () {
        this.assertAccessible()
        let byteCount = 0
        this.jsDict().forEachKV((k, v) => {
            byteCount += k.length + v.length
        })
        return byteCount
    }

    // test

    test () {

    }
}.initThisClass()
