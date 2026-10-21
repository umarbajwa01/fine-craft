import * as THREE from "three";

// One articulated fish, softened beneath the real content layer.
// DOM panels sit above this canvas; no per-scroll mask upload is necessary.
export function createDepthComposite(renderer) {
  const target = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: true });
  const uniforms = {
    fish: { value: target.texture },
    pixel: { value: new THREE.Vector2(1, 1) }, depth: { value: 0 },
    submergedOpacity: { value: .46 }, softness: { value: 2.4 },
  };
  const material = new THREE.ShaderMaterial({
    transparent: true, depthTest: false, depthWrite: false,
    uniforms,
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
    fragmentShader: `
      uniform sampler2D fish;
      uniform vec2 pixel;
      uniform float depth, submergedOpacity, softness;
      varying vec2 vUv;
      void main(){
        vec4 body=texture2D(fish,vUv);
        if(depth > .001){
          vec2 radius=pixel*softness*depth;
          body*=.4;
          body+=texture2D(fish,vUv+vec2(radius.x,0.))*.1;
          body+=texture2D(fish,vUv-vec2(radius.x,0.))*.1;
          body+=texture2D(fish,vUv+vec2(0.,radius.y))*.1;
          body+=texture2D(fish,vUv-vec2(0.,radius.y))*.1;
          body+=texture2D(fish,vUv+radius)*.05;
          body+=texture2D(fish,vUv-radius)*.05;
          body+=texture2D(fish,vUv+vec2(radius.x,-radius.y))*.05;
          body+=texture2D(fish,vUv+vec2(-radius.x,radius.y))*.05;
        }
        // The offscreen target contains premultiplied color from normal blending.
        vec3 color=body.rgb/max(body.a,.0001);
        gl_FragColor=vec4(color,body.a*mix(1.,submergedOpacity,depth));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const geometry = new THREE.PlaneGeometry(2, 2);
  const scene = new THREE.Scene(); scene.add(new THREE.Mesh(geometry, material));
  const camera = new THREE.Camera();
  return {
    resize(w, h) { const ratio = Math.min(window.devicePixelRatio || 1, 1.5); target.setSize(Math.round(w * ratio), Math.round(h * ratio)); uniforms.pixel.value.set(1 / w, 1 / h); },
    render(fishScene, fishCamera, visual) {
      if (!visual) { renderer.render(fishScene, fishCamera); return; }
      uniforms.depth.value = visual.depth;
      uniforms.softness.value = visual.softness;
      uniforms.submergedOpacity.value = visual.submergedOpacity;
      renderer.setRenderTarget(target); renderer.clear(); renderer.render(fishScene, fishCamera);
      renderer.setRenderTarget(null); renderer.clear(); renderer.render(scene, camera);
    },
    dispose() { target.dispose(); geometry.dispose(); material.dispose(); },
  };
}
