"use strict"

/*
    
    BMColor
    
    Helpful for manipulating css colors.
	
*/


const RGB2HSV = function (rgb) {
    var hsv = new Object();
    var max = max3(rgb.r, rgb.g, rgb.b);
    var dif = max - min3(rgb.r, rgb.g, rgb.b);
    hsv.saturation = (max == 0.0) ? 0 : (100 * dif / max);
    if (hsv.saturation == 0) hsv.hue = 0;
    else if (rgb.r == max) hsv.hue = 60.0 * (rgb.g - rgb.b) / dif;
    else if (rgb.g == max) hsv.hue = 120.0 + 60.0 * (rgb.b - rgb.r) / dif;
    else if (rgb.b == max) hsv.hue = 240.0 + 60.0 * (rgb.r - rgb.g) / dif;
    if (hsv.hue < 0.0) hsv.hue += 360.0;
    hsv.value = Math.round(max * 100 / 255);
    hsv.hue = Math.round(hsv.hue);
    hsv.saturation = Math.round(hsv.saturation);
    return hsv;
}

// RGB2HSV and HSV2RGB are based on Color Match Remix [http://color.twysted.net/]
// which is based on or copied from ColorMatch 5K [http://colormatch.dk/]
const HSV2RGB = function (hsv) {
    var rgb = new Object();
    if (hsv.saturation == 0) {
        rgb.r = rgb.g = rgb.b = Math.round(hsv.value * 2.55);
    } else {
        hsv.hue /= 60;
        hsv.saturation /= 100;
        hsv.value /= 100;
        let i = Math.floor(hsv.hue);
        let f = hsv.hue - i;
        let p = hsv.value * (1 - hsv.saturation);
        let q = hsv.value * (1 - hsv.saturation * f);
        let t = hsv.value * (1 - hsv.saturation * (1 - f));
        switch (i) {
        case 0: rgb.r = hsv.value; rgb.g = t; rgb.b = p; break;
        case 1: rgb.r = q; rgb.g = hsv.value; rgb.b = p; break;
        case 2: rgb.r = p; rgb.g = hsv.value; rgb.b = t; break;
        case 3: rgb.r = p; rgb.g = q; rgb.b = hsv.value; break;
        case 4: rgb.r = t; rgb.g = p; rgb.b = hsv.value; break;
        default: rgb.r = hsv.value; rgb.g = p; rgb.b = q;
        }
        rgb.r = Math.round(rgb.r * 255);
        rgb.g = Math.round(rgb.g * 255);
        rgb.b = Math.round(rgb.b * 255);
    }
    return rgb;
}

//Adding HueShift via Jacob (see comments)
const HueShift = function (h, s) {
    h += s; 
    while (h >= 360.0) { 
        h -= 360.0; 
    }
    while (h < 0.0) { 
        h += 360.0; 
    }
    return h;
}

//min max via Hairgami_Master (see comments)
const min3 = function(a, b, c) {
    return (a < b) ? ((a < c) ? a : c) : ((b < c) ? b : c);
}
const max3 = function(a, b, c) {
    return (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
}

window.BMColor = ideal.Proto.extend().newSlots({
    type: "BMColor",
    red: 0, // values between 0.0 and 1.0
    green: 0,
    blue: 0,
    opacity: 1,
    //isMutable: true,
}).setSlots({
    init: function () {
        ideal.Proto.init.apply(this)
    },

    copy: function() {
        return BMColor.clone().set(this.red(), this.green(), this.blue(), this.opacity())
    },

    set: function(r, g, b, opacity) {
        this.setRed(r)
        this.setGreen(g)
        this.setBlue(b)

        if (!opacity) {
            this.setOpacity(0)
        } else {
            this.setOpacity(opacity)
        }

        return this
    },

    // conversion helpers

    v255toUnit: function(v) {
        return v / 255;
    },

    unitTo255: function(v) {
        return Math.round(v * 255)
    },

    red255: function() {
        return this.unitTo255(this.red());
    },

    green255: function() {
        return this.unitTo255(this.green());
    },

    blue255: function() {
        return this.unitTo255(this.blue());
    },

    /*
    setCssColorString: function(s) {

    },
    */

    cssColorString: function() {
        return "rgba(" + this.red255() + ", " + this.green255() + ", " + this.blue255() + ", " + this.opacity()  + ")"
    },

    // operations

    interpV1V2Ratio(v1, v2, r) {
        const diff = v2 - v1;
        if (v1 > v2) {
            return v1 - (v1 - v2)*r
        }
        return v2 - (v2 - v1)*r
    },

    interpolateWithColorTo: function(other, v) {
        const r1 = this.red()
        const g1 = this.green()
        const b1 = this.blue()
        const o1 = this.opacity()

        const r2 = other.red()
        const g2 = other.green()
        const b2 = other.blue()
        const o2 = other.opacity()

        const r = this.interpV1V2Ratio(r1, r2, v)
        const g = this.interpV1V2Ratio(g1, g2, v)
        const b = this.interpV1V2Ratio(b1, b2, v)
        const o = this.interpV1V2Ratio(o1, o2, v)

        const result = BMColor.clone().set(r, g, b, o)
        return result
    },

    darken: function(v) {
        assertDefined(v)
        const r = this.red()
        const g = this.green()
        const b = this.blue()
        this.setRed(r * v)
        this.setGreen(g * v)
        this.setBlue(b * v)
        return this
    },

    lighten: function(v) {
        assertDefined(v)
        const r = this.red()
        const g = this.green()
        const b = this.blue()
        this.setRed(r + (1 - r) * v)
        this.setGreen(g + (1 - g) * v)
        this.setBlue(b + (1 - b) * v)
        return this
    },

    whiteColor: function() {
        return BMColor.clone().set(1, 1, 1, 1)
    },

    blackColor: function() {
        return BMColor.clone().set(0, 0, 0, 1)
    },

    lightGrayColor: function() {
        return BMColor.clone().set(0.75, 0.75, 0.55, 1)
    },

    grayColor: function() {
        return BMColor.clone().set(0.5, 0.5, 0.5, 1)
    },

    darkGrayColor: function() {
        return BMColor.clone().set(0.25, 0.25, 0.25, 1)
    },

    redColor: function() {
        return BMColor.clone().set(1, 0, 0, 1)
    },

    greenColor: function() {
        return BMColor.clone().set(0, 1, 0, 1)
    },

    blueColor: function() {
        return BMColor.clone().set(0, 0, 1, 1)
    },

    yellowColor: function() {
        return BMColor.clone().set(1, 1, 0, 1)
    },

    asDict255: function() {
        return { r:this.red255(), g:this.green255(), b:this.blue255() }
    },

    fromDict255: function(d) {
        this.setRed(d.r / 255)
        this.setGreen(d.g / 255)
        this.setBlue(d.b / 255)
        return this
    },

    complement: function() {
        let temprgb = this.asDict255();
        let temphsv = RGB2HSV(temprgb);
        temphsv.hue = HueShift(temphsv.hue,180.0);
        temprgb = HSV2RGB(temphsv);
        return BMColor.clone().fromDict255(temprgb)
    },

})
