var Bola = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    body:null,
    shape:null,
    rebote:null,

    ctor:function (gameLayer, posicion) {
        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("res/bola.png");
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

        rebote = 1;
    },

    rebotar:function(){
        impulso = 1000/rebote;

        if(impulso<400)
            impulso = 400;

        this.body.applyImpulse(cp.v(0, impulso), cp.v(0, 0));
        rebote++;
    },

    eliminar:function(){
        this.gameLayer.space.removeShape(this.shape);
        this.gameLayer.removeChild(this.sprite);
    }

});