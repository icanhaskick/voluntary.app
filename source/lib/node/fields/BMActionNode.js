"use strict"

/*

    BMActionNode
    
    An abstraction of a UI visible action that can be performed on an object.
    the value is the action method name, the target is the field owner.

*/
        
window.BMActionNode = BMStorableNode.extend().newSlots({
    type: "BMActionNode",
    target: null,
    methodName: null,
    info: null,
    isEnabled: true,
    isEditable: false,
}).setSlots({
    init: function () {
        BMStorableNode.init.apply(this)
        this.setShouldStore(true)
        this.addStoredSlots(["title", "methodName", "info", "isEnabled", "isEditable"])
        this.setNodeRowIsSelectable(true)
    },

    canDoAction: function() {
        const t = this.target()
        const m = this.methodName()
        return t && t[m]
    },

    doAction: function() {
        if (this.canDoAction()) {
            const func = this.target()[this.methodName()]
            
            if (Type.isFunction(func)) {
                func.apply(this.target(), [this])
            } else {
                //this.setValueError("no method with this name")
                console.warn("no method with this name")
            }
        } else {
            console.log(this.typeId() + " can't perform action ", this.methodName(), " on ", this.target())
        }
	    
	    return this
    },
})
