"use strict"

/*

    BMFontResources

*/

BMNode.newSubclassNamed("BMFontResources").newSlots({
    extensions: ["ttf", "woff", "woff2"],
}).setSlots({
    shared: function() {   
        return this.sharedInstanceForClass(BMFontResources)
    },

    init: function () {
        BMNode.init.apply(this)

        this.setTitle("Fonts")
        this.setNodeMinWidth(270)

        this.watchOnceForNote("appDidInit")
        return this
    },

    appDidInit: function() {
        //console.log(this.typeId() + ".appDidInit()")
        this.setupSubnodes()
        return this
    },
    
    addFamily: function(aFontFamily) {
        this.addSubnode(aFontFamily)
        return this
    },

    families: function() {
        return this.subnodes()
    },

    resourcePaths: function() {
        return ResourceLoader.resourceFilePathsWithExtensions(this.extensions())
    },

    setupSubnodes: function() {
        this.resourcePaths().forEach(path => this.addFontWithPath(path))
        return this
    },

    fontFamilyNamed: function(aName) {
        let family = this.families().detect(family => family.name() === aName);

        if (!family) {
            family = BMFontFamily.clone().setName(aName)
            this.addFamily(family)
        }

        return family
    },

    addFontWithPath: function(aPath) {
        const components = aPath.split("/")

        // verify path is in expected format 
        const dot = components.removeFirst()
        assert(dot === ".")

        const resources = components.removeFirst()
        assert(resources === "resources")

        const fonts = components.removeFirst()
        assert(fonts === "fonts")

        const familyName = components.removeFirst()
        const family = this.fontFamilyNamed(familyName) 
        family.addFontWithPath(aPath)

        return this
    },

})
