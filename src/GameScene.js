var idCapaJuego = 0;
var tipoBarra=1;
var tipoSuelo=2;
var tipoPared=3;
var tipoBola=4;
var tipoPropulsor=5;
var tipoFalsoSuelo=6;
var tipoBarraPuntos=7;
var tipoCanon=8;
var tipoPowerUp=9;

var GameLayer = cc.Layer.extend({
    barra : null,
    space : null,
    bolas : [],
    propulsores : [],
    bolasEliminar : [],
    bolasToAdd : [],
    bodiesAndShapesToAdd : [],
    shapesToEliminar : [],
    powerUps : [],
    selectedPowerUp : null,
    puntuacion:null,
    canon:null,
    cierre : [],
    cierreQuitado : null,
    keyPulsada : null,
    activePowerUp : false,
    time : null,
    timeToPowerUp : null,
    barrasEnemigas: [],

    ctor:function(){
        this._super();
        var size = cc.winSize;

        //Inicializar space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0,-350);

        //Inicializar variables power ups
        this.time = 0;
        this.timeToPowerUp = 10;

        //Cachear sprites
        cc.spriteFrameCache.addSpriteFrames(res.pu_puntos_plist);
        cc.spriteFrameCache.addSpriteFrames(res.pu_duplicar_plist);
        cc.spriteFrameCache.addSpriteFrames(res.pu_triplicar_plist);
        cc.spriteFrameCache.addSpriteFrames(res.pu_size_plist);

        //Depuracion
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

        //Inicializar barra
        this.barra = new Barra(this, cc.p(50,200));

        //Inicializar bola
        for(i=0;i<20;i++)
            this.bolas.push(new Bola(this, cc.p(300,700)));

        //Inicializar bolas malas
        for(i=0;i<5;i++)
            this.bolas.push(new BolaMala(this, cc.p(300,700)));

        //Inicializar gestores de colision
        this.space.addCollisionHandler(tipoBarra, tipoBola,
              null, this.colisionBolaConBarra.bind(this), null, null);

        this.space.addCollisionHandler(tipoPropulsor, tipoBola,
              null, this.colisionBolaConPropulsor.bind(this), null, null);

        this.space.addCollisionHandler(tipoSuelo, tipoBola,
              null, this.colisionBolaConSuelo.bind(this), null, null);

        this.space.addCollisionHandler(tipoFalsoSuelo, tipoBola,
              null, this.colisionBolaConFalsoSuelo.bind(this), null, null);

        this.space.addCollisionHandler(tipoBola, tipoBarraPuntos,
                      null, this.colisionBolaConBarraPuntos.bind(this), null, null);

        this.space.addCollisionHandler(tipoBola, tipoCanon,
                      null, this.colisionBolaConCanon.bind(this), null, null);

        this.space.addCollisionHandler(tipoBola, tipoPowerUp,
                      null, this.colisionBolaConPU.bind(this), null, null);

        this.puntuacion = 0;
        this.cierreQuitado = false;

        this.cargarMapa();

        //Añadimos eventos de teclado
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                var actionMoverBarraX = null;
                var instancia = event.getCurrentTarget();

                if(instancia.keyPulsada == keyCode)
                    return;

                instancia.keyPulsada = keyCode;

            },
            onKeyReleased: function(keyCode, event){
                if(keyCode == 37 || keyCode == 39){
                      var instancia = event.getCurrentTarget();
                      instancia.keyPulsada = null;
                      cc.director.getActionManager().
                      removeAllActionsFromTarget(instancia.barra, true);
                }
            }
        }, this);

        this.scheduleUpdate();
        return true;
    },

    cargarMapa:function () {
         this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
         // Añadirlo a la Layer
         this.addChild(this.mapa);
         // Ancho del mapa
         this.mapaAncho = this.mapa.getContentSize().width;

         var grupoPropulsoresIzquierdos = this.mapa.getObjectGroup("PropulsoresIzquierda");
         var propulsoresIzquierdosArray = grupoPropulsoresIzquierdos.getObjects();
         for (var i = 0; i < propulsoresIzquierdosArray.length; i++) {
             var enemigo = new Propulsor(this, cc.p(propulsoresIzquierdosArray[i]["x"],propulsoresIzquierdosArray[i]["y"]), "izquierda");

             this.propulsores.push(enemigo);
         }


         var grupoPropulsoresDerechos = this.mapa.getObjectGroup("PropulsoresDerecha", "derecha");
         var propulsoresDerechosArray = grupoPropulsoresDerechos.getObjects();
         for (var i = 0; i < propulsoresDerechosArray.length; i++) {
             var enemigo = new Propulsor(this, cc.p(propulsoresDerechosArray[i]["x"],propulsoresDerechosArray[i]["y"]), "derecha");

             this.propulsores.push(enemigo);
         }



         var grupoPropulsoresArriba = this.mapa.getObjectGroup("PropulsoresArriba", "arriba");
         var propulsoresArribaArray = grupoPropulsoresArriba.getObjects();
         for (var i = 0; i < propulsoresArribaArray.length; i++) {
             var enemigo = new Propulsor(this, cc.p(propulsoresArribaArray[i]["x"],propulsoresArribaArray[i]["y"]), "arriba");

             this.propulsores.push(enemigo);
         }

         var grupoPropulsoresArriba = this.mapa.getObjectGroup("Canon");
         var propulsoresArribaArray = grupoPropulsoresArriba.getObjects();
         for (var i = 0; i < propulsoresArribaArray.length; i++) {
             this.canon = new Cannon(this, cc.p(propulsoresArribaArray[i]["x"],propulsoresArribaArray[i]["y"]));
         }

         var grupoBarrasEnemigas = this.mapa.getObjectGroup("BarraEnemiga");
         var barrasEnemigasArray = grupoBarrasEnemigas.getObjects();
         for (var i = 0; i < barrasEnemigasArray.length; i++) {
             var enemigo = new BarraEnemiga(this, cc.p(barrasEnemigasArray[i]["x"],barrasEnemigasArray[i]["y"]));

             this.barrasEnemigas.push(enemigo);
         }

         var grupoPowerUp = this.mapa.getObjectGroup("PowerUp");
         var powerUpArray = grupoPowerUp.getObjects();
         for (var i = 0; i < powerUpArray.length; i++) {
             this.powerUps.push( new PU_AumentarPuntos(this, cc.p(powerUpArray[i]["x"],powerUpArray[i]["y"])) );
             this.powerUps.push( new PU_Duplicar(this, cc.p(powerUpArray[i]["x"],powerUpArray[i]["y"])) );
             this.powerUps.push( new PU_Triples(this, cc.p(powerUpArray[i]["x"],powerUpArray[i]["y"])) );
             this.powerUps.push( new PU_Size(this, cc.p(powerUpArray[i]["x"],powerUpArray[i]["y"])) );
         }

         // Solicitar los objeto dentro de la capa Suelos
         var grupoSuelos = this.mapa.getObjectGroup("FalsoSuelo");
         var suelosArray = grupoSuelos.getObjects();

         // Los objetos de la capa suelos se transforman a
         // formas estáticas de Chipmunk ( SegmentShape ).
         for (var i = 0; i < suelosArray.length; i++) {
             var suelo = suelosArray[i];
             var puntos = suelo.polylinePoints;
             for(var j = 0; j < puntos.length - 1; j++){
                 var bodySuelo = new cp.StaticBody();

                 var shapeSuelo = new cp.SegmentShape(bodySuelo,
                     cp.v(parseInt(suelo.x) + parseInt(puntos[j].x),
                         parseInt(suelo.y) - parseInt(puntos[j].y)),
                     cp.v(parseInt(suelo.x) + parseInt(puntos[j + 1].x),
                         parseInt(suelo.y) - parseInt(puntos[j + 1].y)),
                     10);
                 shapeSuelo.setCollisionType(tipoFalsoSuelo);
                 shapeSuelo.setFriction(1);
                 this.space.addStaticShape(shapeSuelo);
             }
         }

         // Solicitar los objeto dentro de la capa Suelos
         var grupoPuntos = this.mapa.getObjectGroup("BarraPuntos");
         var puntosArray = grupoPuntos.getObjects();

         // Los objetos de la capa suelos se transforman a
         // formas estáticas de Chipmunk ( SegmentShape ).
         for (var i = 0; i < puntosArray.length; i++) {
             var barraPuntos = puntosArray[i];
             var puntos = barraPuntos.polylinePoints;
             for(var j = 0; j < puntos.length - 1; j++){
                 var bodyBarraPuntos = new cp.StaticBody();

                 var shapeBarraPuntos = new cp.SegmentShape(bodyBarraPuntos,
                     cp.v(parseInt(barraPuntos.x) + parseInt(puntos[j].x),
                         parseInt(barraPuntos.y) - parseInt(puntos[j].y)),
                     cp.v(parseInt(barraPuntos.x) + parseInt(puntos[j + 1].x),
                         parseInt(barraPuntos.y) - parseInt(puntos[j + 1].y)),
                     10);
                 shapeBarraPuntos.setCollisionType(tipoBarraPuntos);
                 this.space.addStaticShape(shapeBarraPuntos);
             }
         }


         var grupoParedes = this.mapa.getObjectGroup("Paredes");
         var paredesArray = grupoParedes.getObjects();

         for (var i = 0; i < paredesArray.length; i++) {
             var pared = paredesArray[i];
             var puntos = pared.polylinePoints;
             for(var j = 0; j < puntos.length - 1; j++){
                 var bodyPared = new cp.StaticBody();

                 var shapePared = new cp.SegmentShape(bodyPared,
                     cp.v(parseInt(pared.x) + parseInt(puntos[j].x),
                         parseInt(pared.y) - parseInt(puntos[j].y)),
                     cp.v(parseInt(pared.x) + parseInt(puntos[j + 1].x),
                         parseInt(pared.y) - parseInt(puntos[j + 1].y)),
                     10);
                 shapeSuelo.setCollisionType(tipoPared);
                 this.space.addStaticShape(shapePared);
             }
         }

         var grupoMuros = this.mapa.getObjectGroup("Muros");
         var murosArray = grupoMuros.getObjects();

         for (var i = 0; i < murosArray.length; i++) {
             var muro = murosArray[i];
             var puntos = muro.polylinePoints;
             for(var j = 0; j < puntos.length - 1; j++){
                 var bodyMuro = new cp.StaticBody();

                 var shapeMuro = new cp.SegmentShape(bodyMuro,
                     cp.v(parseInt(muro.x) + parseInt(puntos[j].x),
                         parseInt(muro.y) - parseInt(puntos[j].y)),
                     cp.v(parseInt(muro.x) + parseInt(puntos[j + 1].x),
                         parseInt(muro.y) - parseInt(puntos[j + 1].y)),
                     10);
                 shapeMuro.setCollisionType(tipoPared);
                 this.space.addStaticShape(shapeMuro);
             }
         }

         var grupoFalsoSuelo = this.mapa.getObjectGroup("Suelos");
         var falsoSueloArray = grupoFalsoSuelo.getObjects();

         for (var i = 0; i < falsoSueloArray.length; i++) {
             var falsoSuelo = falsoSueloArray[i];
             var puntos = falsoSuelo.polylinePoints;
             for(var j = 0; j < puntos.length - 1; j++){
                 var bodyFalsoSuelo = new cp.StaticBody();

                 var shapeFalsoSuelo = new cp.SegmentShape(bodyFalsoSuelo,
                     cp.v(parseInt(falsoSuelo.x) + parseInt(puntos[j].x),
                         parseInt(falsoSuelo.y) - parseInt(puntos[j].y)),
                     cp.v(parseInt(falsoSuelo.x) + parseInt(puntos[j + 1].x),
                         parseInt(falsoSuelo.y) - parseInt(puntos[j + 1].y)),
                     10);
                 shapeFalsoSuelo.setCollisionType(tipoSuelo);
                 shapeFalsoSuelo.setFriction(1);
                 this.space.addStaticShape(shapeFalsoSuelo);
             }
         }

         var grupoCierre = this.mapa.getObjectGroup("Cierre");
         var cierreArray = grupoCierre.getObjects();

         for (var i = 0; i < cierreArray.length; i++) {
             var cierre = cierreArray[i];
             var puntos = cierre.polylinePoints;
             for(var j = 0; j < puntos.length - 1; j++){
                 var bodyCierre = new cp.StaticBody();

                 var shapeCierre = new cp.SegmentShape(bodyCierre,
                     cp.v(parseInt(cierre.x) + parseInt(puntos[j].x),
                         parseInt(cierre.y) - parseInt(puntos[j].y)),
                     cp.v(parseInt(cierre.x) + parseInt(puntos[j + 1].x),
                         parseInt(cierre.y) - parseInt(puntos[j + 1].y)),
                     10);
                 this.cierre.push(shapeCierre);
                 this.space.addStaticShape(shapeCierre);
             }
         }

    },

    colisionBolaConBarra:function(arbiter, space){
        var shapes = arbiter.getShapes();

        for(i=0;i<this.bolas.length;i++){
            for(j=0;j<shapes.length;j++){
                if(this.bolas[i].shape == shapes[j]){
                    this.bolas[i].rebotar();
                }
            }
        }

    },

    colisionBolaConBarraPuntos:function(arbiter, space){
    var shapes = arbiter.getShapes();

        for(i=0;i<this.bolas.length;i++){
            for(j=0;j<shapes.length;j++){
                if(this.bolas[i].shape == shapes[j]){
                    var b = this.bolas[i];
                    if(b.isYaPuntuo()==false){
                        this.puntuacion+=b.getPuntos();
                        this.getParent().getChildByTag(idCapaControles).updateNumeroPuntos(this.puntuacion);
                        b.setYaPuntuo(true);
                    }
                }
            }
        }

    },

    colisionBolaConPropulsor:function(arbiter, space){
        var shapes = arbiter.getShapes();
        var propulsor = null;

        for(i=0;i<this.propulsores.length;i++){
            for(j=0;j<shapes.length;j++){
                if(this.propulsores[i].shape == shapes[j]){
                    propulsor = this.propulsores[i];
                }
            }
        }

        for(i=0;i<this.bolas.length;i++){
            for(j=0;j<shapes.length;j++){
                if(this.bolas[i].shape == shapes[j]){
                    propulsor.impulsar(this.bolas[i]);
                }
            }
        }

    },

    colisionBolaConSuelo:function(arbiter,space){
        var shapes = arbiter.getShapes();

        for(i=0;i<this.bolas.length;i++){
            for(j=0;j<shapes.length;j++){
                if(this.bolas[i].shape == shapes[j]){
                    this.bolasEliminar.push(this.bolas[i]);
                }
            }
        }
    },

    colisionBolaConCanon:function(arbiter,space){
        var shapes = arbiter.getShapes();

        for(i=0;i<this.bolas.length;i++){
            for(j=0;j<shapes.length;j++){
                if(this.bolas[i].shape == shapes[j]){
                    this.canon.impulsar(this.bolas[i]);
                    this.bolas[i].setYaPuntuo(false);
                    this.bolas[i].setPowerUpped(false);
                }
            }
        }
    },

    colisionBolaConPU:function(arbiter,space){
        var shapes = arbiter.getShapes();

        for(i=0;i<this.bolas.length;i++){
            for(j=0;j<shapes.length;j++){
                if(this.bolas[i].shape == shapes[j]){
                    this.selectedPowerUp.doStuff(this.bolas[i]);
                }
            }
        }
    },

    colisionBolaConFalsoSuelo:function(arbiter,space){ },

    abrirCierre:function(){
        if(this.cierreQuitado==false){
            for(i=0;i<this.cierre.length;i++){
                this.space.removeShape(this.cierre[i]);
            }
            this.cierreQuitado = true;
        }
    },

    cerrarCierre:function(){
        if(this.cierreQuitado==true){
            for(i=0;i<this.cierre.length;i++){
                this.space.addStaticShape(this.cierre[i]);
            }

            this.cierreQuitado = false;
        }
    },

    update : function(dt){
        this.space.step(dt);

        if(this.bolas.length<=0){
            cc.director.pause();
            this.unscheduleUpdate();
            this.getParent().addChild(new GameOverLayer());
        }

        for(i=0;i<this.bolasEliminar.length;i++){
            var shape = this.bolasEliminar[i].shape;

            for (var j = 0; j < this.bolas.length; j++) {
                if (this.bolas[j].shape == shape) {
                    this.bolas[j].eliminar();
                    this.bolas.splice(j, 1);
                }
            }


        }

        this.bolasEliminar = [];

        for(i=0;i<this.bodiesAndShapesToAdd.length;i++){
            var bloque = this.bodiesAndShapesToAdd[i];
            this.space.addShape(bloque.shape);
            this.space.addBody(bloque.body);
        }

        this.bodiesAndShapesToAdd = [];

        for(i=0;i<this.bolasToAdd.length;i++){
            var temp = null;

            if(this.bolasToAdd[i].tipo==0)
                temp = new Bola(this, this.bolasToAdd[i].posicion);

            else if(this.bolasToAdd[i].tipo==1)
                temp = new BolaMala(this, this.bolasToAdd[i].posicion);

            temp.setPowerUpped(true);
            this.bolas.push(temp);
        }

        for(i=0;i<this.shapesToEliminar.length;i++){
            this.space.removeShape(this.shapesToEliminar[i]);
        }

        this.shapesToEliminar = [];

        this.bolasToAdd = [];

        this.setPosition(cc.p( 0, -150));
        this.canon.update(dt);

        for(i = 0;i<this.barrasEnemigas.length;i++){
            this.barrasEnemigas[i].update(dt);
        }

        if(this.canon.getTiempo()>=0){
            this.cerrarCierre();
        }

        else{
            this.abrirCierre();
        }

        if( this.keyPulsada == 37){
            this.barra.moverIzquierda();
        }

        if( this.keyPulsada == 39){
             this.barra.moverDerecha();
        }

        if(!this.activePowerUp){
            this.time += dt;

            if(this.timeToPowerUp<=this.time){
                this.selectedPowerUp = this.powerUps[Math.floor(Math.random() * this.powerUps.length)];
                this.activePowerUp = true;
                this.selectedPowerUp.addToSpace();
            }

        }

        if(this.activePowerUp){
            this.selectedPowerUp.update(dt);

            if(this.selectedPowerUp.timeToDisappear()){
                this.selectedPowerUp.removeFromSpace();
                this.activePowerUp = false;

                this.time = 0;
                this.timeToPowerUp = 5;
            }

        }

    }



});
var idCapaControles=2;
var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);

        var controlLayer = new ControlLayer();
        this.addChild(controlLayer, 0, idCapaControles);
    }
});