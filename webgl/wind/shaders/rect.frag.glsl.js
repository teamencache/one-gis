export default `
precision highp float; 

varying vec2 v_uv; 
uniform float u_opacity;
uniform sampler2D u_sampler2D;

void main(){ 
  vec4 color = texture2D(u_sampler2D, v_uv);
  gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
}
`