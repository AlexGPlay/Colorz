var Propulsor = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    body:null,
    shape:null,

    ctor:function (gameLayer, posicion, direccion) {
        this.gameLayer = gameLayer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("res/propulsor.png");
        // Cuerpo estática , no le afectan las fuerzas
        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(Infinity,Infinity);
        //gameLayer.space.addBody(body);

        posicion.x += 50;
        posicion.y += 37;

        this.body.setPos(posicion);
        this.body.setAngle(0);
        // Se añade el cuerpo al espacio

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width ,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoPropulsor);
        gameLayer.space.addShape(this.shape);

        this.sprite.setBody(this.body);

        //gameLayer.space.addBody(this.body);
        gameLayer.addChild(this.sprite,10);

    }

});