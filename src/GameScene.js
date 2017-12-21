var idCapaJuego = 0;
var tipoBarra=1;
var tipoSuelo=2;
var tipoPared=3;
var tipoBola=4;

var GameLayer = cc.Layer.extend({
    barra : null,
    space : null,
    bola : null,

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
        this.bola = new Bola(this, cc.p(50,300));
        this.bola.body.applyImpulse(cp.v(150, 0), cp.v(0, 0));

        //Inicializar gestores de colision
        this.space.addCollisionHandler(tipoBarra, tipoBola,
              null, this.colisionBolaConBarra.bind(this), null, null);

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



    },

    colisionBolaConBarra:function(arbiter, space){
        this.bola.rebotar();
    },

    update : function(dt){
        this.space.step(dt);
    }



});

var GameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);
    }
});