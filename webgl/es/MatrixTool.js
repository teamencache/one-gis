import * as mat4 from '../../plugin/gl-Matrix/esm/mat4.js'
import * as vec3 from '../../plugin/gl-Matrix/esm/vec3.js'
import * as glMatrix from '../../plugin/gl-Matrix/esm/common.js'

let MatrixTool = {

    mat4:mat4,
    vec3:vec3,
    glMatrix:glMatrix,

    eye:vec3.fromValues(0, 0, 30),
    direction:vec3.fromValues(0, 0, 0),
    up:vec3.fromValues(0, 1, 0),
    projection:mat4.create(),
    view:mat4.create(),
    model:mat4.create(),

    setEye(eye){
        this.eye = vec3.fromValues(eye);
        return this.viewMatrix();
    },
    setDirection(direction){
        this.direction = vec3.fromValues(direction);
        return this.viewMatrix();
    },
    setUp(up){
        this.eye = vec3.fromValues(up);
        return this.viewMatrix();
    },
    modelMatrix(){
        return this;
    },
    viewMatrix(eye, direction, up){
        eye && (this.eye = vec3.fromValues(eye));
        direction && (this.direction = vec3.fromValues(direction));
        up && (this.up = vec3.fromValues(up));
        mat4.lookAt(this.view, this.eye, this.direction, this.up);
        return this;
    },
    projectionMartrix(radian, width, height, near, far){
        mat4.perspective(this.projection, radian, width/height, near, far);
        return this;
    }
}

export default MatrixTool