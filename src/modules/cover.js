import hg from 'mercury';
import lodash from 'lodash';
var THREE = require('three');
const h = hg.h;

export default function(state, channel) {
    
    
    return h('div.cover-wrapper', [
        h('div.cover', new Cover()),
        h('div.greeting.container', h('div.row', [
            h('h2.col-xs-12', "Jannes Interactive CV"),
            h('div.col-xs-12', [
                h('i.fa.fa-angle-double-down'),
                h('span', "Scroll to start"),
                h('i.fa.fa-angle-double-down'),
            ])
        ]))
    ]);
};

function Cover() {}

var proto = Cover.prototype;
proto.type = 'Widget';

proto.init = function init() {
    var elem = document.createElement('div');
    var container = document.createElement('div');
    console.log(THREE)
    container.appendChild(elem);
    const widthBased = window.innerWidth > window.innerHeight;
    const width = widthBased ? window.innerWidth : window.innerHeight * 3 / 2;
    const height = widthBased ? window.innerWidth / 3 * 2 : window.innerHeight;
    THREEinit(
       width , height, 
      'media/lighthouse.png',
      [-2 * width, height / 200 * -30, 200], 
      [width / 4 * 6.7, height / 200 * 220, 10], 
      function(renderer, camera, scene, objects, width, height, lighthousesrc, lightposition, ligthhouselightposition){
        scene.add( objects.worldlight );
      scene.add( objects.light );
      scene.add(objects.ligthhouselight);
      scene.add(objects.lighthouseFull);
      elem.style.width = '100%';
      elem.style.height = '100%';
      elem.appendChild( renderer.domElement );
      var lightpower = -Math.PI;
      var lighthousepower = -Math.PI;
      var worldlightpower = -Math.PI;
      function animate() {
          requestAnimationFrame( animate );
          lighthousepower += 0.005;
          lightpower += (Math.floor(Math.random() * 100) / 10000);
          worldlightpower += Math.floor(Math.random() * 100) / 2000;
          objects.light.power = (Math.sin(lightpower) + 1) * 5;
          objects.worldlight.power = (Math.sin(worldlightpower) + 2) * 2;
          objects.ligthhouselight.power = Math.pow((Math.cos(lighthousepower) + 1) / 2, 3) * 250;
          // When Math.cos = 1 = max, then offset = 0
          objects.ligthhouselight.position.x =
            ligthhouselightposition[0] + (Math.sin(lighthousepower)) * (width / 400 * 30);
          objects.lighthousematerial.shininess = (Math.sin(lightpower) + 1) / 2 * 300 + 30;
          renderer.render( scene, camera );
      }
     animate();
    });
    return container;
};

proto.update = function update(prev, elem) {
    
};

function THREEinit(width, height, lighthousesrc, lightposition, ligthhouselightposition, cb) {
	var loader = new THREE.TextureLoader();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, width / height, 1, 10000 );
    camera.position.z = width / 2.4 *  7.5;
    var light = new THREE.PointLight( 0xFFFFFF, 1, 10000, 3 );
    light.position.set.apply( light.position, lightposition );
    var ligthhouselight = new THREE.PointLight( 0xFFFFFF, 1, 30, 2 );
    ligthhouselight.position.set.apply( ligthhouselight.position, ligthhouselightposition );
    var worldlight = new THREE.AmbientLight( 0x404040, 3 );
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( width, height );
    loader.load(
        // resource URL
        lighthousesrc,
        // Function when resource is loaded
        function ( texture ) {
          // do something with the texture
          var lighthousematerial = new THREE.MeshPhongMaterial( {
            map: texture,
            shininess: 30
           } );
           var lighthouseFull = new THREE.Mesh(
           	new THREE.PlaneGeometry(width * 7.5, height * 7.5),
            lighthousematerial
           );
           cb(renderer, camera, scene, {
             worldlight: worldlight,
             light: light,
             ligthhouselight: ligthhouselight,
             lighthouseFull: lighthouseFull,
             lighthousematerial: lighthousematerial
           }, width, height, lighthousesrc, lightposition, ligthhouselightposition);
        },
        function ( xhr ) {console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
        function ( xhr ) {console.log( 'An error happened' );}
      );
}




          



