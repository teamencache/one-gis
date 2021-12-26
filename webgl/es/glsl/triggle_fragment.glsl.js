export default /* glsl */`
precision mediump float;
uniform float u_Time;
uniform float u_Length;
uniform sampler2D u_Sampler2D;

varying vec2 v_Uv;

void main(){
    
    //静态拐角纹理=>矩形纹理缩放到三角纹理
    /* float fixed_s = (v_Uv.s-0.5)/v_Uv.t * 1.0 + 0.5;
    gl_FragColor = texture2D(u_Sampler2D, vec2(fixed_s, v_Uv.t)); */
    //动态拐角纹理
    float cornerLength = 1.0;
    float cornerStart = 0.0;
    float cornerEnd = cornerStart + cornerLength;
    float uv_move = fract(u_Time/cornerLength);
    float fixed_c = (cornerStart + cornerEnd)/2.0;
    float fixed_s = (v_Uv.s-fixed_c)/v_Uv.t + fixed_c;
    fixed_s = fract(cornerEnd - uv_move + fixed_s);
    gl_FragColor = texture2D(u_Sampler2D, vec2(fixed_s, v_Uv.t));
    //cornerStart,cornerLength改变之后，旋转中心变了=>v_Uv.s 的范围和cornerEnd不一致引起
}
`