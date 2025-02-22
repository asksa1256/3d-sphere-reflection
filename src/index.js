import * as THREE from 'three'
import { WEBGL } from './webgl'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { CubeCamera } from 'three/src/cameras/CubeCamera'

if (WEBGL.isWebGLAvailable()) {
  const scene = new THREE.Scene()
  let urls = [
    '/3d-sphere-reflection/static/textures/posx.jpg',
    '/3d-sphere-reflection/static/textures/negx.jpg',
    '/3d-sphere-reflection/static/textures/posy.jpg',
    '/3d-sphere-reflection/static/textures/negy.jpg',
    '/3d-sphere-reflection/static/textures/posz.jpg',
    '/3d-sphere-reflection/static/textures/negz.jpg',
  ]
  let imgLoader = new THREE.CubeTextureLoader()
  scene.background = imgLoader.load(urls)

  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    5000
  )
  //controls.update() must be called after any manual changes to the camera's transform
  camera.position.set(0, 2, 10)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  // Create cube render target
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  })
  cubeRenderTarget.texture.type = THREE.HalfFloatType

  // Mesh Camera
  let cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget)
  scene.add(cubeCamera)

  // Mesh
  let geometry = new THREE.SphereGeometry(3, 64, 32)
  let material = new THREE.MeshBasicMaterial({
    envMap: cubeRenderTarget.texture,
    side: THREE.DoubleSide,
  })
  let sphere = new THREE.Mesh(geometry, material)
  sphere.position.set(0, 0, 0)
  scene.add(sphere)

  // OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()
  controls.enableDamping = true

  function animate() {
    requestAnimationFrame(animate)
    sphere.visible = false // `CubeCamera` 업데이트 전에 메쉬 숨기기
    cubeCamera.update(renderer, scene)
    sphere.visible = true // `CubeCamera` 업데이트 후 메쉬 다시 보이기
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  // responsive
  function windowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', windowResize)
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
