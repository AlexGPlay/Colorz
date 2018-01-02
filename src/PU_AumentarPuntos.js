var PU_AumentarPuntos = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    body:null,
    shape:null,
    tiempo:null,
    tiempoEnPantalla:null,
    animacionBucle:null,

    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        var framesAnimacion = [];
        for (var i = 1; i <= 7; i++) {
            var str = "pu_puntos_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionBucle = new cc.RepeatForever(new cc.Animate(animacion));

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#pu_puntos_1.png");
        // Cuerpo estática , no le afectan las fuerzas
        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(Infinity,Infinity);
        //gameLayer.space.addBody(body);

        posicion.x += 40;
        posicion.y += 40;

        this.body.setPos(posicion);
        this.body.setAngle(0);
        // Se añade el cuerpo al espacio

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width+25 ,
            this.sprite.getContentSize().height+25);

        this.shape.setCollisionType(tipoPowerUp);

        this.sprite.setBody(this.body);
        this.sprite.runAction(this.animacionBucle);

        this.tiempo=5;
        this.tiempoEnPantalla=0;

    },

    doStuff:function(bola){
        //bola.setPuntos(bola.getPuntos()+1);
        if(bola.isPowerUpped()==false){
            bola.updatePoints();
            bola.setPowerUpped(true);
        }

    },

    timeToDisappear:function(){
        if(this.tiempoEnPantalla>=this.tiempo){
            return true;
        }

        return false;
    },

    addToSpace:function(){
        this.gameLayer.space.addShape(this.shape);
        this.gameLayer.addChild(this.sprite,10);
        this.sprite.runAction(this.animacionBucle);

        this.tiempo=5;
        this.tiempoEnPantalla=0;
    },

    removeFromSpace:function(){
        this.gameLayer.space.removeShape(this.shape);
        this.gameLayer.removeChild(this.sprite);
    },

    update:function(dt){
        this.tiempoEnPantalla+=dt;
    }

});