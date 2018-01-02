var BarraEnemiga = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    body:null,
    shape:null,
    tiempo:null,
    tiempoEnPantalla:null,
    animacionBucle:null,
    posicion:null,
    estaEnPantalla:null,

    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("res/barra.png");
        // Cuerpo estática , no le afectan las fuerzas
        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(Infinity,Infinity);
        //gameLayer.space.addBody(body);

        posicion.x += 50;

        this.body.setPos(posicion);
        this.body.setAngle(0);
        // Se añade el cuerpo al espacio

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width ,
            this.sprite.getContentSize().height);

        this.sprite.setBody(this.body);

        //gameLayer.space.addBody(this.body);
        this.estaEnPantalla=true;

        this.addToSpace();
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

        this.tiempo=10;
        this.tiempoEnPantalla=0;
    },

    removeFromSpace:function(){
        this.gameLayer.space.removeShape(this.shape);
        this.gameLayer.removeChild(this.sprite);
        this.estaEnPantalla=false;
        this.tiempoEnPantalla=0;
    },

    update:function(dt){
        this.tiempoEnPantalla+=dt;
        if(this.timeToDisappear()==true && this.estaEnPantalla==true){
        this.removeFromSpace();
        }
        if(this.timeToDisappear()==true && this.estaEnPantalla==false){
        this.addToSpace();
        this.estaEnPantalla=true;
        }


    }

});