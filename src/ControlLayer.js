

var ControlLayer = cc.Layer.extend({
    etiquetaPuntos : null,
    puntosActuales : 0,
    ctor:function () {
        this._super();
        var size = cc.winSize;


                this.etiquetaPuntos = new cc.LabelTTF("Puntos: 0", "Helvetica", 20);
                this.etiquetaPuntos.setPosition(cc.p(size.width - 90, size.height - 20));
                this.etiquetaPuntos.fillStyle = new cc.Color(255, 255, 255, 0);
                this.addChild(this.etiquetaPuntos);


    },update:function (dt) {


    }, updateNumeroPuntos : function(puntos){
            this.puntosActuales = puntos;
            this.etiquetaPuntos.setString ("Puntos :"+this.puntosActuales);

    }
});
