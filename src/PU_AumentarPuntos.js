var PU_AumentarPuntos = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    body:null,
    shape:null,
    tiempo:null,
    tiempoEnPantalla:null,

    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("res/pu_puntos_1.png");
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
            this.sprite.getContentSize().width ,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoPowerUp);
        gameLayer.space.addShape(this.shape);

        this.sprite.setBody(this.body);

        //gameLayer.space.addBody(this.body);
        gameLayer.addChild(this.sprite,10);

        this.tiempo=5;
        this.tiempoEnPantalla=0;

    },

    doStuff:function(bola){
        //bola.setPuntos(bola.getPuntos()+1);
        if(bola.isPowerUpped()==false){
            bola.setPuntos(2);
            bola.setPowerUpped(true);
        }

    },

    timeToDisappear:function(){
        if(this.tiempoEnPantalla>=this.tiempo){
            return true;
        }

        return false;
    },

    update:function(dt){
        this.tiempoEnPantalla+=dt;
    }

});