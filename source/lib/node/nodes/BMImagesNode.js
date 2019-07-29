"use strict"

/*
    
    BMImageResourcesNode 

*/  

BMStorableNode.newSubclassNamed("BMImageResourcesNode").newSlots({
}).setSlots({
    init: function () {
        BMStorableNode.init.apply(this)

        this.setViewClassName("ImageView")
        this.setSubnodeProto("ImageNode")
        
        this.setNodeTitleIsEditable(true)
        this.setNodeSubtitleIsEditable(false)
        this.setNodeMinWidth(200)
        this.setTitle(null)
        this.setSubtitle(null)
        
        //this.addActions(["add"])
        //this.setCanDelete(true)

        //this.addStoredSlots(["title", "dataURL"])
    },        
    
})
