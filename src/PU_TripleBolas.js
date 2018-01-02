var PU_Triples = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    body:null,
    shape:null,
    tiempo:null,
    tiempoEnPantalla:null,
    animacionBucle:null,
    posicion:null,

    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;
        this.posicion = posicion;

        var framesAnimacion = [];
        for (var i = 1; i <= 6; i++) {
            var str = "pu_triplicar_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionBucle = new cc.RepeatForever(new cc.Animate(animacion));

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#pu_triplicar_1.png");
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
            this.sprite.getContentSize().width+75 ,
            this.sprite.getContentSize().height+75);

        this.shape.setCollisionType(tipoPowerUp);

        this.sprite.setBody(this.body);
        this.sprite.runAction(this.animacionBucle);

        this.tiempo=5;
        this.tiempoEnPantalla=0;

    },

    doStuff:function(bola){
        if(bola.isPowerUpped()==false){
            var position = cc.p(this.posicion.x,this.posicion.y);
            var position2 = cc.p(this.posicion.x,this.posicion.y);
            var bloque = {posicion:position, tipo:bola.getTipo()};
            var bloque2 = {posicion:position2, tipo:bola.getTipo()};
            this.gameLayer.bolasToAdd.push(bloque);
            this.gameLayer.bolasToAdd.push(bloque2);
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

        this.tiempo=30;
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