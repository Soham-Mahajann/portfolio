import * as THREE from "three";

import {
  OrbitControls
} from "three/addons/controls/OrbitControls.js";

import {
  GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";


// ==========================================
// 3D WORKSTATION
// ==========================================

const container =
  document.getElementById("workstation-3d");


if (container) {


  // ========================================
  // SCENE
  // ========================================

  const scene =
    new THREE.Scene();


  // ========================================
  // CAMERA
  // ========================================

  const width =
    container.clientWidth;

  const height =
    container.clientHeight;


  const camera =
    new THREE.PerspectiveCamera(
      32,
      width / height,
      0.01,
      1000
    );


  camera.position.set(
    5.4,
    3.1,
    7.4
  );


  // ========================================
  // RENDERER
  // ========================================

  const renderer =
    new THREE.WebGLRenderer({

      antialias: true,

      alpha: true,

      powerPreference:
        "high-performance"

    });


  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio,
      2
    )
  );


  renderer.setSize(
    width,
    height
  );


  renderer.outputColorSpace =
    THREE.SRGBColorSpace;


  renderer.shadowMap.enabled =
    true;


  renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


  renderer.domElement.style.display =
    "block";


  renderer.domElement.style.width =
    "100%";


  renderer.domElement.style.height =
    "100%";


  container.appendChild(
    renderer.domElement
  );


  // ========================================
  // LIGHTING
  // ========================================

  const ambientLight =
    new THREE.AmbientLight(
      0xffffff,
      2.2
    );


  scene.add(
    ambientLight
  );


  const keyLight =
    new THREE.DirectionalLight(
      0xffffff,
      3.2
    );


  keyLight.position.set(
    5,
    8,
    6
  );


  keyLight.castShadow =
    true;


  keyLight.shadow.mapSize.width =
    2048;


  keyLight.shadow.mapSize.height =
    2048;


  scene.add(
    keyLight
  );


  // Orange rim light

  const orangeLight =
    new THREE.PointLight(
      0xff7200,
      18,
      18
    );


  orangeLight.position.set(
    -4,
    3,
    4
  );


  scene.add(
    orangeLight
  );


  // Warm secondary light

  const warmLight =
    new THREE.PointLight(
      0xff9d3d,
      9,
      18
    );


  warmLight.position.set(
    4,
    2.5,
    -4
  );


  scene.add(
    warmLight
  );


  // ========================================
  // ORBIT CONTROLS
  // ========================================

  const controls =
    new OrbitControls(
      camera,
      renderer.domElement
    );


  // Smooth rotation

  controls.enableDamping =
    true;


  controls.dampingFactor =
    0.055;


  // Rotation ON

  controls.enableRotate =
    true;


  controls.rotateSpeed =
    0.55;


  // Zoom OFF

  controls.enableZoom =
    false;


  // Pan OFF

  controls.enablePan =
    false;


  // Vertical rotation limits

  controls.minPolarAngle =
    Math.PI * 0.22;


  controls.maxPolarAngle =
    Math.PI * 0.68;


  controls.target.set(
    0,
    0.15,
    0
  );


  controls.update();


  // ========================================
  // GLB LOADER
  // ========================================

  const loader =
    new GLTFLoader();


  loader.load(

    "./models/workstation.glb",


    // ======================================
    // MODEL SUCCESS
    // ======================================

    (gltf) => {

      const model =
        gltf.scene;


      console.log(
        "✅ 3D workstation loaded successfully"
      );


      // ====================================
      // MODEL MATERIALS
      // ====================================

      model.traverse(
        (object) => {

          if (!object.isMesh) {

            return;

          }


          object.castShadow =
            true;


          object.receiveShadow =
            true;


          console.log(
            "Mesh:",
            object.name
          );


          // ==================================
          // MATTE BLACK DESK
          // ==================================

          const deskCandidates = [

            "Cube",
            "Cube002",
            "Cube009",
            "Cube013",
            "Cube018"

          ];


          if (
            deskCandidates.includes(
              object.name
            )
          ) {

            object.material =
              object.material.clone();


            object.material.color.set(
              0x111111
            );


            object.material.roughness =
              0.88;


            object.material.metalness =
              0.03;


            object.material.needsUpdate =
              true;


            console.log(
              "🖤 Matte black desk:",
              object.name
            );

          }

        }
      );


      // ====================================
      // ORIGINAL MODEL SIZE
      // ====================================

      const originalBox =
        new THREE.Box3()
          .setFromObject(
            model
          );


      const originalSize =
        originalBox.getSize(
          new THREE.Vector3()
        );


      const originalCenter =
        originalBox.getCenter(
          new THREE.Vector3()
        );


      console.log(
        "Original model size:",
        originalSize
      );


      console.log(
        "Original model center:",
        originalCenter
      );


      // ====================================
      // PROPORTIONAL SCALE
      // ====================================

      const largestDimension =
        Math.max(
          originalSize.x,
          originalSize.y,
          originalSize.z
        );


      /*
       * Important:
       *
       * setScalar() scales X, Y and Z
       * equally.
       *
       * Therefore the model itself
       * cannot become stretched.
       */

      const targetSize =
        7.8;


      const scale =
        targetSize /
        largestDimension;


      model.scale.setScalar(
        scale
      );


      console.log(
        "Model scale:",
        scale
      );


      // ====================================
      // CENTER MODEL
      // ====================================

      const scaledBox =
        new THREE.Box3()
          .setFromObject(
            model
          );


      const scaledCenter =
        scaledBox.getCenter(
          new THREE.Vector3()
        );


      model.position.set(

        -scaledCenter.x,

        -scaledCenter.y + 0.12,

        -scaledCenter.z

      );


      // ====================================
      // ADD MODEL
      // ====================================

      scene.add(
        model
      );


      // ====================================
      // MONITOR SCREEN
      // ====================================

      const textureLoader =
        new THREE.TextureLoader();


      textureLoader.load(

        "./assets/monitor-screen.png",


        (texture) => {

          console.log(
            "✅ monitor-screen.png loaded"
          );


          texture.colorSpace =
            THREE.SRGBColorSpace;


          texture.flipY =
            false;


          texture.wrapS =
            THREE.ClampToEdgeWrapping;


          texture.wrapT =
            THREE.ClampToEdgeWrapping;


          texture.anisotropy =
            renderer
              .capabilities
              .getMaxAnisotropy();


          texture.needsUpdate =
            true;


          let screenFound =
            false;


          model.traverse(
            (object) => {

              if (
                object.isMesh &&
                object.name ===
                "MY_SCREEN"
              ) {

                screenFound =
                  true;


                console.log(
                  "✅ MY_SCREEN FOUND"
                );


                const screenMaterial =
                  new THREE.MeshBasicMaterial({

                    map:
                      texture,

                    side:
                      THREE.DoubleSide,

                    toneMapped:
                      false

                  });


                object.material =
                  screenMaterial;


                object.material
                  .needsUpdate =
                  true;


                object.visible =
                  true;


                console.log(
                  "✅ Monitor screen updated"
                );

              }

            }
          );


          if (!screenFound) {

            console.warn(
              "⚠️ MY_SCREEN was not found"
            );

          }

        },


        (progress) => {

          if (progress.total) {

            const percentage =
              (
                progress.loaded /
                progress.total
              ) * 100;


            console.log(
              `Screen image loading: ${percentage.toFixed(0)}%`
            );

          }

        },


        (error) => {

          console.error(
            "❌ Could not load monitor-screen.png",
            error
          );

        }

      );


      // ====================================
      // FINAL SIZE
      // ====================================

      const finalBox =
        new THREE.Box3()
          .setFromObject(
            model
          );


      const finalSize =
        finalBox.getSize(
          new THREE.Vector3()
        );


      console.log(
        "Final model size:",
        finalSize
      );


      // ====================================
      // CAMERA
      // ====================================

      camera.position.set(
        5.4,
        3.1,
        7.4
      );


      controls.target.set(
        0,
        0.15,
        0
      );


      controls.update();


      // ====================================
      // REMOVE LOADING
      // ====================================

      const loading =
        container.querySelector(
          ".model-loading"
        );


      if (loading) {

        loading.remove();

      }


      console.log(
        "✅ Workstation positioned correctly"
      );

    },


    // ======================================
    // LOADING PROGRESS
    // ======================================

    (progress) => {

      if (progress.total) {

        const percentage =
          (
            progress.loaded /
            progress.total
          ) * 100;


        console.log(
          `Loading workstation: ${percentage.toFixed(0)}%`
        );

      }

    },


    // ======================================
    // ERROR
    // ======================================

    (error) => {

      console.error(
        "❌ Failed to load workstation.glb",
        error
      );


      const loading =
        container.querySelector(
          ".model-loading"
        );


      if (loading) {

        loading.innerHTML = `
          <span></span>
          Failed to load workstation
        `;

      }

    }

  );


  // ========================================
  // ANIMATION
  // ========================================

  function animate() {

    requestAnimationFrame(
      animate
    );


    controls.update();


    renderer.render(
      scene,
      camera
    );

  }


  animate();


  // ========================================
  // RESPONSIVE
  // ========================================

  window.addEventListener(
    "resize",
    () => {

      const newWidth =
        container.clientWidth;


      const newHeight =
        container.clientHeight;


      if (
        newWidth <= 0 ||
        newHeight <= 0
      ) {

        return;

      }


      camera.aspect =
        newWidth /
        newHeight;


      camera.updateProjectionMatrix();


      renderer.setSize(
        newWidth,
        newHeight
      );


      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio,
          2
        )
      );

    }
  );

}


// ==========================================
// SCROLL REVEAL
// ==========================================

const revealElements =
  document.querySelectorAll(
    ".reveal"
  );


const revealObserver =
  new IntersectionObserver(

    (entries) => {

      entries.forEach(
        (entry) => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "visible"
            );


            revealObserver.unobserve(
              entry.target
            );

          }

        }
      );

    },

    {
      threshold: 0.12
    }

  );


revealElements.forEach(
  (element) => {

    revealObserver.observe(
      element
    );

  }
);