var Cannon = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    body:null,
    shape:null,
    bolas:null,
    bolasDisparadas:null,
    tiempo:null,
    tiempoEspera:null,
    direccionDisparoX:null,

    ctor:function (gameLayer, posicion) {
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

        this.shape.setCollisionType(tipoCanon);
        gameLayer.space.addShape(this.shape);

        this.sprite.setBody(this.body);

        //gameLayer.space.addBody(this.body);
        gameLayer.addChild(this.sprite,10);

        this.bolas=0;
        this.bolasDisparadas=0;
        this.tiempo=0;
        this.tiempoEspera=0;

    },

    impulsar:function(bola){
        if(this.tiempo<=this.tiempoEspera){
            if(this.bolasDisparadas<this.bolas){
                bola.body.applyImpulse(this.direccionDisparoX, cp.v(0, 0));
                this.bolasDisparadas++;
            }
        }
    },

    update:function(dt){
        this.tiempoEspera += dt;

        if( this.getBolas()<=0 ){
            this.tiempo= Math.random()+1;
            this.tiempoEspera=0;

            this.bolasDisparadas=0;
            this.bolas= (Math.random()*5)+1;

            direccionRandom = (Math.random()*500)+100;

            this.direccionDisparoX = cp.v(direccionRandom, 0);
        }
    },

    getBolas:function(){
        return this.bolas - this.bolasDisparadas;
    },

    getTiempo:function(){
        return this.tiempo - this.tiempoEspera;
    }

});