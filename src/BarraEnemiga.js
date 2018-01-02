var barraEnemiga = cc.Class.extend({
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

               // Crear Sprite - Cuerpo y forma
               this.sprite = new cc.PhysicsSprite("res/barra.png");
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

               this.shape.setElasticity(1);
               this.shape.setFriction(1);

               this.shape.setCollisionType(tipoBarra);
               gameLayer.space.addShape(this.shape);

               this.sprite.setBody(this.body);

               gameLayer.space.addBody(this.body);
               gameLayer.addChild(this.sprite,10);

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

        this.tiempo=10;
        this.tiempoEnPantalla=0;
    },

    removeFromSpace:function(){
        this.gameLayer.space.removeShape(this.shape);
        this.gameLayer.removeChild(this.sprite);
    },

    update:function(dt){
        this.tiempoEnPantalla+=dt;
        if(this.timeToDisappear()==true){
            this.removeFromSpace();
            }
            else{
                this.addToSpace();
            }
    }

});