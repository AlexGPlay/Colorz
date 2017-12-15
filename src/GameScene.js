var idCapaJuego = 0;

var GameLayer = cc.Layer.extend({


});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);
    }
});