export default `
precision mediump float;

attribute vec3 a_pos;
attribute vec2 a_uv;

uniform mat4 u_mvpMatrix; 

varying vec2 v_uv;

void main(){
    gl_Position = u_mvpMatrix * vec4(a_pos, 1.0);
    v_uv = a_uv;
}
`