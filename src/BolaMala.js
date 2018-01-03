var BolaMala = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    body:null,
    shape:null,
    puntos: null,
    yaPuntuo: false,
    powerUpped : false,
    bigBall : false,

    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("res/bola_mala.png");
        // Cuerpo estática , no le afectan las fuerzas
        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(5, cp.momentForBox(1,
                this.sprite.getContentSize().width,
                this.sprite.getContentSize().height));
        //gameLayer.space.addBody(body);

        this.body.setPos(posicion);
        this.body.setAngle(0);
        // Se añade el cuerpo al espacio

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoBola);
        gameLayer.space.addShape(this.shape);

        this.sprite.setBody(this.body);

        gameLayer.space.addBody(this.body);
        gameLayer.addChild(this.sprite,10);

        this.puntos =-1;
    },

    rebotar:function(){
        impulso = 1000;

        this.body.applyImpulse(cp.v(0, impulso), cp.v(0, 0));
    },

    eliminar:function(){
        this.gameLayer.space.removeShape(this.shape);
        this.gameLayer.removeChild(this.sprite);
    },

    getPuntos:function(){
        return this.puntos;
    },

    setPuntos:function(puntos){
        this.puntos = puntos;
    },

    updatePoints:function(){
        this.puntos--;
    },

    isYaPuntuo:function(){
        return this.yaPuntuo;
    },

    setYaPuntuo:function(puntuo){
        this.yaPuntuo = puntuo;
    },

    isPowerUpped:function(){
        return this.powerUpped;
    },

    setPowerUpped:function(powerUpped){
        this.powerUpped = powerUpped;
    },

    getTipo:function(){
        return 1;
    },

    setBig:function(big){
        this.bigBall = big;
    },

    createPuntos:function(puntos){
        this.puntos = puntos+1;
        this.updatePoints();
    },

    setBigBall:function(){
        if(this.bigBall==false){
            this.convertToBigBall();
            this.bigBall = true;
        }
    },

    getBigBall:function(){
        return this.bigBall;
    },

    convertToBigBall:function(){    }

});