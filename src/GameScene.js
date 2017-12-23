var idCapaJuego = 0;
var tipoBarra=1;
var tipoSuelo=2;
var tipoPared=3;
var tipoBola=4;
var tipoPropulsor=5;

var GameLayer = cc.Layer.extend({
    barra : null,
    space : null,
    bolas : [],
    propulsores : [],
    bolasEliminar : [],

    ctor:function(){
        this._super();
        var size = cc.winSize;

        //Inicializar space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0,-350);

        //Depuracion
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

        //Inicializar barra
        this.barra = new Barra(this, cc.p(50,15));

        //Inicializar bola
        for(i=0;i<20;i++)
            this.bolas.push(new Bola(this, cc.p(300,500)));

        //Inicializar gestores de colision
        this.space.addCollisionHandler(tipoBarra, tipoBola,
              null, this.colisionBolaConBarra.bind(this), null, null);

        this.space.addCollisionHandler(tipoPropulsor, tipoBola,
              null, this.colisionBolaConPropulsor.bind(this), null, null);

        this.space.addCollisionHandler(tipoSuelo, tipoBola,
              null, this.colisionBolaConSuelo.bind(this), null, null);

        this.cargarMapa();
        this.scheduleUpdate();


        //Añadimos eventos de teclado
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                var actionMoverBarraX = null;
                var instancia = event.getCurrentTarget();

                if(instancia.keyPulsada == keyCode)
                    return;

                instancia.keyPulsada = keyCode;

                if( keyCode == 37){
                    instancia.barra.moverIzquierda();
                }

                if( keyCode == 39){
                     instancia.barra.moverDerecha();
                }

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

         // Solicitar los objeto dentro de la capa Suelos
         var grupoSuelos = this.mapa.getObjectGroup("Suelos");
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
                 shapeSuelo.setCollisionType(tipoSuelo);
                 this.space.addStaticShape(shapeSuelo);
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

    update : function(dt){
        this.space.step(dt);

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

    }



});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);
    }
});