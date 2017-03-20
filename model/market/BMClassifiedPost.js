
BMClassifiedPost = BMStorableNode.extend().newSlots({
    type: "BMClassifiedPost",
    title: null, // string
    price: 0,
    currency: "BTC",
    description: null, // string
    path: null, // string
    isEditable: false,
    objMsg: null,
    
    postDate: null,
    postPeriod: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    uuid: null,
   // imagesNode:null,
    imageDataURLs: null,
    hasSent: false,
}).setSlots({
    init: function () {
        BMStorableNode.init.apply(this)
        this.setActions(["delete"])
        this.setNodeMinWidth(550)
        
        this.setTitle("Untitled")
        this.setPrice(0)
        this.setDescription("Item or service description")
        this.addStoredSlots(["price", "title", "description"])

        //this.setImagesNode(BMNode.clone().setViewClassName("ImageView").setSubnodeProto("ImageNode"))
        this.setImageDataURLs([]) 
        
        this.setObjMsg(BMObjectMessage.clone())

        this._powDoneObs   = NotificationCenter.shared().newObservation().setName("powDone").setObserver(this)
        this._powUpdateObs = NotificationCenter.shared().newObservation().setName("powUpdate").setObserver(this)
    },
    
    // images
    
    setEncodedImages: function(base64images) {
        var imgs = base64images.map(function (b64) { return ImageNode.clone().setBase64Encoded(b64); });
        this.setImages(imgs)
        return this
    },
    
    getEncodedImages: function() {
        return this.images().map(function (image) { return image.base64Encoded(); });
    },
    
    subtitle: function() {
        if (this.powObj().isFinding()) {
            return "stamping... " + this.powObj().estimatedPercentageDone() + "%";
        } else if (!this.hasSent()) {
            return "unposted"
        }
        return "expires in " + this.expireDescription()
        //return this.price() + " " + this.currency()
    },
    
    setPrice: function(p) {
        this._price = p; //parseFloat(p)
        return this
    },
    
    postDict: function () {
        return {
            title: this.title(),
            price: parseFloat(this.price()),
            currency: this.currency(),
            description: this.description(),
            path: this.path(),
            postDate: this.postDate(),
            postPeriod: this.postPeriod(),
            uuid: this.uuid(),
            imageDataURLs: this.imageDataURLs()
        }
    },
    
    setPostDict: function(aDict) {
        this.setTitle(aDict.title)
        this.setPrice(aDict.price)
        this.setCurrency(aDict.currency)
        this.setDescription(aDict.description)
        this.setPath(aDict.path)
        this.setPostDate(aDict.postDate)
        this.setPostPeriod(aDict.postPeriod)
        this.setUuid(aDict.uuid)
        this.setImageDataURLs(aDict.imageDataURLs)
        //this.objMsg().setContent(this.postDict())
        this.objMsg().setContent(aDict)
        return this
    },
    
    syncSend: function () {
        this.objMsg().setContent(this.postDict())
        
        //var myId = App.shared().network().localIdentities().current()
        //var toId = App.shared().network().openIdentity().current()        
        this.objMsg().send()
    },

    prepareToSend: function() {
        this.setUuid(GUID()) 
        var currentTime = new Date().getTime()
        // add a random time interval of 5 mintues so a receiving node
        // can't guess that a sender is the source if the dt is very small
        var randomInterval = Math.random() * 1000 * 60 * 5; 
        this.setPostDate(currentTime + randomInterval)
        this.objMsg().setContent(this.postDict())
        return this
    },
    
    send: function () {
        this.prepareToSend()
        this.setIsEditable(false)
        
        //var myId = App.shared().network().localIdentities().current()
        //var toId = App.shared().network().openIdentity().current()
        
        this.watchPow() // watch for pow update and done notifications
        this.objMsg().asyncPackContent() // will send notification when pow ready        
    },
    
    // pow notifications
    
    watchPow: function() {
        this._powDoneObs.watch()
        this._powUpdateObs.watch()
    },
    
    unwatchPow: function() {
        this._powDoneObs.stopWatching()
        this._powUpdateObs.stopWatching()
    },
    
    powObj: function() {
        return this.objMsg().payload().powObject()
    },
    
    powUpdate: function(note) {
        if (note.sender() == this.powObj()) {
            //console.log("got powUpdate")
            this.didUpdate()
        }
    },
    
    calcHasSent: function() {
        this.objMsg().setContent(this.postDict())
        this.setHasSent(this.objMsg().hasValidPow())
        return this    
    },
    
    powDone: function(note) {
        if (note.sender() == this.powObj()) {
            //console.log("got powDone")
            this.unwatchPow()
            //if (this.objMsg().hasValidPow()) {
            if (this.powObj().isValid()) {
                this.objMsg().send()
                this.setHasSent(true)
            }
            this.didUpdate()
            //this.syncToView()
        }
    },
    
    powStatus: function() {
        return this.powObj().status()
    },
    
    /////////////////////////
    descriptionOfMsTimePeriod: function(ms) {
        
        var seconds = Math.floor(ms / 1000);
        /*
        if (seconds < 60) {
            return seconds + " seconds"
        }
        */
        
        var minutes = Math.floor(seconds / 60);
        /*
        if (minutes < 60) {
            return minutes + " minutes"
        }
        */
        
        var hours = Math.floor(minutes / 60);
        if (hours < 24) {
            //return hours + " hours"
            return "today"
        }
        
        var days = Math.ceil(hours / 24);
        return days + " days"
    },
    
    expireDescription: function() {
        var dt = this.remainingPeriodInMs();
        return this.descriptionOfMsTimePeriod(dt)
    },
    
    expirationDate: function() {
         return new Date(this.postDate() + this.postPeriod())
    },
    
    remainingPeriodInMs: function() {
         return new Date().getTime() - this.postDate() + this.postPeriod()
    },
    
    postPeriodDayCount: function() {
        return Math.floor(this.postPeriod() / (24 * 60 * 60 * 1000));
    },
    
    cancelSend: function() {
        
    },
    
    onDropFiles: function(filePaths) {
        var parts = []
    },
    
    placeInPathString: function(pathString) {
        var rootNode = App.shared()
        var pathComponents = pathString.split("/")
        var region = rootNode.nodeAtSubpath(pathComponents)
        if (region) {
            console.log("inserting post into region path " + this.path())
            if (!region.containsItem(this)) {
                region.addItem(this)
            }
        } else {
            throw new Error("missing region for path " + this.path())
        }
    },
    
    placeInRegion: function() {
        this.placeInPathString(this.path())
        return this
    },
    
    placeInAll: function() {
        this.placeInPathString("Classifieds/All")
        return this
    },
    
    isEqual: function(aPost) {
        return this.hash() == aPost.hash()
    },
    
    hash: function() {
        return this.postDict().toStableHash()
    },
    
    incrementPowTarget: function() {
        //console.log("Post incrementPowTarget")
        this.prepareToSend() // shouldn't need this if there's a default BMPow hash
        this.powObj().incrementDifficulty()
        this.didUpdate()
    },
    
    decrementPowTarget: function() {
        //console.log("Post decrementPowTarget")
        this.prepareToSend() // shouldn't need this if there's a default BMPow hash
        this.powObj().decrementDifficulty()
        this.didUpdate()
    },
    
    powDifficulty: function() {
        return this.powObj().difficulty()
    },
    
    compare: function(other) {
        var d1 = this.powDifficulty()
        var d2 = other.powDifficulty()
        var p1 = this.postDate()
        var p2 = other.postDate()
        
        var c = d1 - d2
        if (c == 0) { 
            c = p1 - p2;
        }
        
        return c;
    }

})
