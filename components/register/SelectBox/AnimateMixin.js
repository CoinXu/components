/**
 * Created by Freax on 2016/4/14.
 * @website http://www.myfreax.com
 */
module.exports = {
    /**
     * 动画
     * @param animateElement
     * @param opacityInit
     * @param opacityEnd
     * @param time
     * @param onComplete
     */
    animation: function (animateElement, opacityInit, opacityEnd, time, onComplete) {

        new TWEEN.Tween({opacity: opacityInit})
            .onStart(function () {
            })
            .to({opacity: opacityEnd}, time)
            .onUpdate(function () {

                animateElement.style.opacity = this.opacity;
            })
            .onComplete(function () {
                onComplete()
            })
            .start();

       var animate = function (time) {
            requestAnimationFrame(animate);
            TWEEN.update(time);
        };
        animate();
    }

};
