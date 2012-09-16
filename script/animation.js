function AnimationManager() {
    this._currentAnimation = null;
}

/**
 * Requests to run the provided animation. If an animation is currently running,
 * the request will be rejected.
 *
 * @param animation The animation that should be run.
 * @param options Animation options.
 * @return True if the animation request was accepted and false otherwise.
 */
AnimationManager.prototype.animate = function(animation, options) {
    if (this._currentAnimation) {
        return false;
    }

    this._currentAnimation = {
        callback: animation,
        options: options
    };

    var thiz = this;
    var startTime = new Date().getTime();

    var animate = function() {
        if (options.timeout) {
            var now = new Date().getTime();

            if (now - startTime > options.timeout) {
                thiz._currentAnimation = null;

                if (options.onTimeout) {
                    options.onTimeout();
                }

                return;
            }
        }

        if (animation()) {
            thiz._nextFrame(animate);
        } else {
            thiz._currentAnimation = null;

            if (options.onComplete) {
                options.onComplete();
            }
        }
    };

    thiz._nextFrame(animate);

    return true;
};

AnimationManager.prototype.getCurrentAnimation = function() {
    return this._currentAnimation;
};

AnimationManager.prototype._nextFrame = function(animation) {
    var nextFrame0 = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    nextFrame0(animation);
};

AnimationManager.getAnimationManager = function() {
    if (!AnimationManager._animationManager) {
        AnimationManager._animationManager = new AnimationManager();
    }

    return AnimationManager._animationManager;
};

// Predefined animations
//

function move(element, x, y, options) {
    if (!options.onTimeout) {
        options.onTimeout = function() {
            with (element.style) {
                left = x + "px";
                top = y + "px";
            }
        };
    }

    return AnimationManager.getAnimationManager().animate(function() {
        var currentPosition = $(element).position();
        var deltaX = (x - currentPosition.left);
        var deltaY = (y - currentPosition.top);

        if (Math.abs(deltaX) < 50 && Math.abs(deltaY) < 50) {
            with (element.style) {
                left = x + "px";
                top = y + "px";
            }

            return false;
        }

        with (element.style) {
            left = (currentPosition.left + deltaX / 2) + "px";
            top = (currentPosition.top + deltaY / 2) + "px";
        }

        return true;
    }, options);
}