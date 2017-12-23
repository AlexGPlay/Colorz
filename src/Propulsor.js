var Propulsor = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    body:null,
    shape:null,
    direccion:null,

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

        if(direccion=="izquierda"){
            this.direccion = cp.v(-1000, 0);
        }

        else if(direccion=="derecha"){
            this.direccion = cp.v(1000, 0);
        }

        else if(direccion=="arriba"){
            this.direccion = cp.v(0,1000);
        }

        //gameLayer.space.addBody(this.body);
        gameLayer.addChild(this.sprite,10);

    },

    impulsar:function(bola){
        bola.body.applyImpulse(this.direccion, cp.v(0, 0));
    }

});