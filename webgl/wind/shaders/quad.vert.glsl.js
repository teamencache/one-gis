export default `
precision mediump float;

attribute vec2 a_pos;

varying vec2 v_tex_pos;

void main() {
    v_tex_pos = a_pos;
    //将纹理坐标转换为顶点坐标
    gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);
}`
