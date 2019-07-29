"use strict"

/*

    BMDateField

*/
        
BMField.newSubclassNamed("BMDateField").newSlots({
    unsetVisibleValue: "unset",
}).setSlots({
    init: function () {
        BMField.init.apply(this)
        this.setViewClassName("BMFieldRowView")
        this.setKeyIsEditable(false)
        this.setValueIsEditable(false)
    },

    visibleValue: function() {
        const v = this.value()
        if (!v) { 
            return this.unsetVisibleValue()
        }
        return new Date(v).toDateString()
    },
})
