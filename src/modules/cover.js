import hg from 'mercury';
import lodash from 'lodash';
var THREE = require('three');
const h = hg.h;

let counter = 0;
export default function(state, channel) {
    counter += 1;
    return h('div.cover-wrapper', [
        h('div.cover', new Cover()),
        h('div.greeting.container', state.contactname ? h('div.row.animated.fadeIn', [
            h('h2.col-xs-12.signature', `${state.contactname}'${state.contactname.slice(-1) === "s" ? '' : 's'} Interactive CV`),
            h(`div.col-xs-12${(counter % 8 === 0) ? '.animated.infinite.shake' : ''}`, [
                h('i.fa.fa-angle-double-down'),
                h('span', "Scroll to start"),
                h('i.fa.fa-angle-double-down'),
            ])
        ]) : '')
    ]);
};

function Cover() {}

var proto = Cover.prototype;
proto.type = 'Widget';

proto.init = function init() {
    var elem = document.createElement('div');
    var container = document.createElement('div');
    container.className = 'hidden-print';
    container.appendChild(elem);
    const widthBased = window.innerWidth > window.innerHeight;
    const width = widthBased ? window.innerWidth : window.innerHeight * 3 / 2;
    const height = widthBased ? window.innerWidth / 3 * 2 : window.innerHeight;
    THREEinit(
       width , height, 
      'media/lighthouse.png',
      [-2 * width, height / 200 * -30, 200],
      [width, height * 3, 200],
      [width / 4 * 6.7, height / 200 * 220, 10], 
      function(renderer, camera, scene, objects, width, height, lighthousesrc, lightposition, ligthhouselightposition){
        scene.add( objects.worldlight );
      scene.add( objects.light );
      scene.add( objects.light2 );
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
          objects.light.power = (Math.sin(lightpower) + 1) * 10;
          objects.light2.power = (Math.sin(lightpower * 2) * 0.5 + 0.75);
          objects.light2.position.x = width + (Math.sin(lighthousepower)) * (width / 400 * 30);
          objects.worldlight.power = (Math.sin(worldlightpower) + 2) * 3;
          objects.ligthhouselight.power = Math.pow((Math.cos(lighthousepower) + 1) / 2, 3) * 800;
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

function THREEinit(width, height, lighthousesrc, lightposition, lightposition2, ligthhouselightposition, cb) {
	var loader = new THREE.TextureLoader();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, width / height, 1, 10000 );
    camera.position.z = width / 2.4 *  7.5;
    var light = new THREE.PointLight( 0xFFFFFF, 1, 10000, 3 );
    var light2 = new THREE.PointLight( 0xFF6666, 1, 0, 2 );
    light.position.set.apply( light.position, lightposition );
    light2.position.set.apply( light2.position, lightposition2 );
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
             light2: light2,
             ligthhouselight: ligthhouselight,
             lighthouseFull: lighthouseFull,
             lighthousematerial: lighthousematerial
           }, width, height, lighthousesrc, lightposition, ligthhouselightposition);
        },
        function ( xhr ) {console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
        function ( xhr ) {console.log( 'An error happened' );}
      );
}




          



