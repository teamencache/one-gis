// 动画中上下边长度不一样，会导致上下三角形纹理有偏差，且随距离增加逐渐增大
// 1、上下边以短边对齐
// 2、拐角处插入三个三角形过渡（上下边在拐角处两个偏差三角形，一个拐角三角形）
// 3、拐角过度三角形纹理要特殊处理
// 4、不能丢失真实线长