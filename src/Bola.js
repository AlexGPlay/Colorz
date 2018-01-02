var Bola = cc.Class.extend({
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

        this.puntos = 1;
        this.bigBall = false;
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
        this.puntos++;

        if(this.puntos==2){
            this.gameLayer.removeChild(this.sprite);

            var temp = null;

            if(this.bigBall==false)
                temp = new cc.PhysicsSprite("res/bola_2.png");

            else
                temp = new cc.PhysicsSprite("res/bola_2_big.png");


            temp.setBody(this.body);
            this.sprite = temp;

            this.gameLayer.addChild(this.sprite,10);
        }

        if(this.puntos==3){
            this.gameLayer.removeChild(this.sprite);

            var temp = null;

            if(this.bigBall==false)
                temp = new cc.PhysicsSprite("res/bola_3.png");

            else
                temp = new cc.PhysicsSprite("res/bola_3_big.png");

            temp.setBody(this.body);
            this.sprite = temp;

            this.gameLayer.addChild(this.sprite,10);
        }

        if(this.puntos==4){
            this.gameLayer.removeChild(this.sprite);

            var temp = null;

            if(this.bigBall==false)
                temp =  new cc.PhysicsSprite("res/bola_4.png");

            else
                temp = new cc.PhysicsSprite("res/bola_4_big.png");

            temp.setBody(this.body);
            this.sprite = temp;

            this.gameLayer.addChild(this.sprite,10);
        }

        if(this.puntos==5){
            this.gameLayer.removeChild(this.sprite);

            var temp = null;

            if(this.bigBall==false)
                temp = new cc.PhysicsSprite("res/bola_5.png");

            else
                temp = new cc.PhysicsSprite("res/bola_5_big.png");

            temp.setBody(this.body);
            this.sprite = temp;

            this.gameLayer.addChild(this.sprite,10);
        }

        if(this.puntos==6){
            this.gameLayer.removeChild(this.sprite);

            var temp = null;

            if(this.bigBall==false)
                temp = new cc.PhysicsSprite("res/bola_6.png");

            else
                temp = new cc.PhysicsSprite("res/bola_6_big.png");

            temp.setBody(this.body);
            this.sprite = temp;

            this.gameLayer.addChild(this.sprite,10);
        }

        if(this.puntos==7){
            this.gameLayer.removeChild(this.sprite);

            var temp = null;

            if(this.bigBall==false)
                temp = new cc.PhysicsSprite("res/bola_7.png");

            else
                temp = new cc.PhysicsSprite("res/bola_7_big.png");

            temp.setBody(this.body);
            this.sprite = temp;

            this.gameLayer.addChild(this.sprite,10);
        }

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
        return 0;
    },

    setBigBall:function(posicion){
        if(this.bigBall==false){
            this.convertToBigBall(posicion);
            this.bigBall = true;
        }
    },

    convertToBigBall:function(posicion){
        if(this.puntos==1){
            this.gameLayer.removeChild(this.sprite);

            var temp  = new cc.PhysicsSprite("res/bola_big.png");
            this.sprite = temp;
        }

        if(this.puntos==2){
            this.gameLayer.removeChild(this.sprite);

            var temp  = new cc.PhysicsSprite("res/bola_2_big.png");
            this.sprite = temp;
        }

        if(this.puntos==3){
            this.gameLayer.removeChild(this.sprite);

            var temp  = new cc.PhysicsSprite("res/bola_3_big.png");
            this.sprite = temp;
        }

        if(this.puntos==4){
            this.gameLayer.removeChild(this.sprite);

            var temp  = new cc.PhysicsSprite("res/bola_4_big.png");
            this.sprite = temp;
        }

        if(this.puntos==5){
            this.gameLayer.removeChild(this.sprite);

            var temp  = new cc.PhysicsSprite("res/bola_5_big.png");
            this.sprite = temp;
        }

        if(this.puntos==6){
            this.gameLayer.removeChild(this.sprite);

            var temp  = new cc.PhysicsSprite("res/bola_6_big.png");
            this.sprite = temp;
        }


        if(this.puntos>=7){
            this.gameLayer.removeChild(this.sprite);

            var temp  = new cc.PhysicsSprite("res/bola_7_big.png");
            this.sprite = temp;
        }

        var temp = new cp.Body(5, cp.momentForBox(1,
                this.sprite.getContentSize().width,
                this.sprite.getContentSize().height));

        var position = cc.p(posicion.x,posicion.y);
        temp.setPos(position);
        temp.setAngle(0);

        var temp2 = new cp.BoxShape(temp,
                    this.sprite.getContentSize().width,
                    this.sprite.getContentSize().height);

        temp2.setCollisionType(tipoBola);

        this.gameLayer.shapesToEliminar.push(this.shape);
        var bloque = {shape:temp2, body:temp};
        this.gameLayer.bodiesAndShapesToAdd.push(bloque);

        this.shape = temp2;
        this.body = temp;

        this.sprite.setBody(temp);
        this.gameLayer.addChild(this.sprite,10);
    }

});