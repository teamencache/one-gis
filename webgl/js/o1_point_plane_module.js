import {initNode, initSource} from '../module/InitWebgl.js'

function MyWebGL(){
    initNode({
        width:window.innerWidth + 'px',
        height:window.innerHeight + 'px',
    });
    initSource();
}

MyWebGL()