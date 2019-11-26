"use strict"

/*
    
    AtomApp



*/

App.newSubclassNamed("AtomApp").newSlots({
    name: "atom",
    version: [0, 0, 1, 0],

    atomNode: null,
    atomNodeView: null,

}).setSlots({
    initProto: function() {
        //this.showVersion()
    },

    init: function () {
        App.init.apply(this)
    },

    setup: function () {
        App.setup.apply(this)
        
        this.setupAtom()
        //Mouse.shared()
        this.appDidInit()
        return this
    },

    setupAtom: function() {
        this.setAtomNode(AtomNode.clone())
        this.setAtomNodeView(AtomNodeView.clone().setNode(this.atomNode()))
        this.atomNodeView().setIsVertical(true).syncLayout()
        this.rootView().addSubview(this.atomNodeView())
    },

    
    isBrowserCompatible: function() {
        if (WebBrowserWindow.agentIsSafari()) {
            return false
        }
        return true
    },

    appDidInit: function () {
        App.appDidInit.apply(this)
        window.ResourceLoaderPanel.stop() 
    },
}).initThisProto()


