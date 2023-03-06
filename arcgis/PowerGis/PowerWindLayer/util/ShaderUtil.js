define(["dojo/_base/declare"], function (declare) {
  return {
    createShader(gl, type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);

      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
      }
      return shader;
    },

    createProgram(gl, vertexSource, fragmentSource) {
      var program = gl.createProgram();

      var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
      var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);

      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
      }

      var wrapper = { program: program };

      var numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
      for (var i = 0; i < numAttributes; i++) {
        var attribute = gl.getActiveAttrib(program, i);
        wrapper[attribute.name] = gl.getAttribLocation(program, attribute.name);
      }
      var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (var i$1 = 0; i$1 < numUniforms; i$1++) {
        var uniform = gl.getActiveUniform(program, i$1);
        wrapper[uniform.name] = gl.getUniformLocation(program, uniform.name);
      }

      return wrapper;
    },

    createTexture(gl, filter, data, width, height) {
      // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      if (data instanceof Uint8Array) {
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          width,
          height,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          data
        );
      } else {
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          data
        );
      }
      gl.bindTexture(gl.TEXTURE_2D, null);
      return texture;
    },

    bindTexture(gl, texture, unit) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
    },

    createBuffer(gl, data) {
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return buffer;
    },

    createIndexBuffer(gl, data) {
      var buffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return buffer;
    },

    bindAttribute(gl, buffer, attribute, numComponents) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(attribute, numComponents, gl.FLOAT, false, 0, 0);
    },

    bindAttribute2(
      gl,
      buffer,
      attribute,
      attribLength,
      groupLength,
      start,
      size
    ) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(
        attribute,
        attribLength,
        gl.FLOAT,
        false,
        groupLength * size,
        start * size
      );
    },

    bindFramebuffer(gl, framebuffer, texture) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      if (texture) {
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          texture,
          0
        );
      }
    },
  };
});
