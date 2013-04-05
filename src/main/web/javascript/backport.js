if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach = function(f) {
        for(var i = 0; i < this.length; i++) {
            f(this[i]);
        }
    }
}