requirejs.config({
    baseUrl: (window.location.href.indexOf("http://") == 0 ? "src/main/web/javascript/" : "src")
});

var console = (console ? console : {
    log: function() { }
});

var _executeJasmine = jasmine.getEnv().execute;

jasmine.getEnv().execute = function() {
    var thisRef = this;

    require(["navigator"], function() {
        _executeJasmine.apply(thisRef);
    });
};
