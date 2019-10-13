"use strict"
      
/*

    BMBooleanField

    
*/

BMField.newSubclassNamed("BMBooleanField").newSlots({
    unsetVisibleValue: "unset",
}).setSlots({
    init: function () {
        BMField.init.apply(this)
        this.setViewClassName("BMFieldRowView")
        this.setKeyIsEditable(false)
        this.setValueIsEditable(false)
        //this.setValue(false)
    },

    valueIsBool: function() {
        const b = this.value()
        return Type.isBoolean(b);
    },
	
    validate: function() {
        const isValid = this.valueIsBool()
		
        if (!isValid) {
            this.setValueError("This needs to be a boolean (true or false).")
        } else {
            this.setValueError(null)
        } 
		
        return isValid
    },
	
    normalizeThisValue: function(v) {
	    if (v === true || v === "t" || v === "true" | v === 1) { return true; }
	    return false
    },
	
    didUpdateNode: function() {
        this.validate()
        return BMField.didUpdateNode.apply(this)
    },

})