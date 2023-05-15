<template>
    <div class="projects-container">
        <div class="splide" ref="splide">
            <div class="splide__track">
                <ul class="splide__list">
                    <li class="splide__slide"></li>
                    <li class="splide__slide"></li>
                    <li class="splide__slide"></li>
                    <li class="splide__slide"></li>
                    <li class="splide__slide"></li>
                    <li class="splide__slide"></li>
                </ul>
            </div>
            <div class="splide__arrows">
                <button class="splide__arrow splide__arrow--prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="splide__arrow splide__arrow--next">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="splide__pagination" style="margin-top: 1rem;"></div>
        </div>
    </div>
</template>

<script>
import Splide from "@splidejs/splide";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import ghostModel from "@/assets/3dmodels/ghost/ghostThreejs.glb";
import ghostHeightMap from "@/assets/3dmodels/ghost/ghostThreejs_Ghost_Height.png";
import ghostAlphaMap from "@/assets/3dmodels/ghost/ghostThreejs_Ghost_RGB-Alpha.png";
import ghostRoughnessMap from "@/assets/3dmodels/ghost/ghostThreejs_Ghost_Roughness.png";
import ghostAOMap from "@/assets/3dmodels/ghost/AO.png";

export default {
    name: "TheProjects",
    data() {
        return {
            splideInstance: null,
            fullyLoaded: false,
            loadedModels: 0,
            initialized: false,
            slides: [],
            scenes: [],
            cameras: [],
            renderers: [],
            materials: [],
            heightMapTextures: [],
            diffuseTextures: [],
            roughnessMapTextures: [],
            aoMapTextures: [],
            animationFrameIds: [],
        }
    },

    async mounted() {


        if (this.initialized) {
            return;
        }
        if (!this.scenes.length) {
            this.initThree();
        }
        if (this.splideInstance) {
            this.splideInstance.destroy();
            this.splideInstance = null;
        }
        await this.initSplide();
        this.initialized = true;
        if (document.getElementsByTagName("canvas").length > 1) {
            this.cleanupCanvases();
        }

    },
    updated() {
        this.initSplide();
    },
    methods: {
        async initSplide() {
            if (!this.splideInstance) {
                this.splideInstance = new Splide(this.$refs.splide, {
                    type: "loop",
                    perPage: 1,
                    gap: "1rem",
                    autoplay: false,
                    arrows: true,
                    pagination: true,
                    breakpoints: this.breakpoints,
                }).mount();
            }
        },
        cleanupCanvases() {
            const slideElements = this.$refs.splide.querySelectorAll(".splide__slide");

            slideElements.forEach((slide) => {
                const canvasElements = slide.getElementsByTagName("canvas");

                // Behalte nur das letzte Canvas-Element und entferne die restlichen
                for (let i = 0; i < canvasElements.length - 1; i++) {
                    slide.removeChild(canvasElements[i]);
                }
            });
        },


        initThree() {
            this.slides = Array.from(this.$refs.splide.querySelectorAll(".splide__slide"));

            const gltfLoader = new GLTFLoader();
            const textureLoader = new TextureLoader();

            this.scenes = [];
            this.cameras = [];
            this.renderers = [];
            this.materials = [];
            this.heightMapTextures = [];
            this.diffuseTextures = [];
            this.roughnessMapTextures = [];
            this.aoMapTextures = [];

            this.slides.forEach((slide, index) => {
                slide.slideId = index;
                slide.modelLoaded = false;
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(
                    75,
                    slide.clientWidth / slide.clientHeight,
                    0.1,
                    1000
                );

                const ambientLight = new THREE.AmbientLight(0xffffff, 1);
                scene.add(ambientLight);

                const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                directionalLight.position.set(0, 1, 1);
                scene.add(directionalLight);

                const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
                renderer.setSize(slide.clientWidth, slide.clientHeight);
                slide.appendChild(renderer.domElement);

                camera.position.set(0, 0, 10);

                const heightMapTexture = textureLoader.load(ghostHeightMap);
                const diffuseTexture = textureLoader.load(ghostAlphaMap);
                const roughnessMapTexture = textureLoader.load(ghostRoughnessMap);
                const aoMapTexture = textureLoader.load(ghostAOMap);

                gltfLoader.load(ghostModel, (gltf) => {
                    const model = gltf.scene.children[0];

                    diffuseTexture.flipY = false;
                    roughnessMapTexture.flipY = false;
                    aoMapTexture.flipY = false;
                    heightMapTexture.flipY = false;

                    const material = new THREE.MeshStandardMaterial({
                        map: diffuseTexture,
                        roughnessMap: roughnessMapTexture,
                        aoMap: aoMapTexture,
                        displacementMap: heightMapTexture,
                        displacementScale: 0.05,
                    });

                    model.material = material;
                    model.position.set(0, 2, 0);
                    model.scale.set(3, 3, 3);

                    scene.add(model);

                    const animate = () => {
                        const animationFrameId = requestAnimationFrame(animate);
                        this.animationFrameIds[index] = animationFrameId;


                        model.rotation.y -= 0.005;

                        renderer.render(scene, camera);

                    };

                    this.loadedModels++;

                    if (this.loadedModels === this.slides.length) {
                        this.fullyLoaded = true;
                        document.getElementsByClassName("splide")[0].style.opacity = 1;
                    }

                    this.scenes.push(scene);
                    this.cameras.push(camera);
                    this.renderers.push(renderer);
                    this.materials.push(material);
                    this.heightMapTextures.push(heightMapTexture);
                    this.diffuseTextures.push(diffuseTexture);
                    this.roughnessMapTextures.push(roughnessMapTexture);
                    this.aoMapTextures.push(aoMapTexture);

                    animate();
                });
            });
        },
        async cleanupThreeJS() {
            console.log("TheProjects.vue", "cleanupThreeJS");
            try {
                document.getElementsByClassName("projects-container")[0].style.opacity = 0;
            } catch (error) {

            }

            await new Promise(resolve => setTimeout(resolve, 2000));
            document.getElementsByClassName("projects-container")[0].style.display = "none";
            if (this.splideInstance) {
                this.splideInstance.destroy();
                this.splideInstance = null;
            }

            // Animationsschleifen beenden
            this.animationFrameIds.forEach((id) => {
                if (id) {
                    cancelAnimationFrame(id);
                }
            });

            // Textur- und Materialressourcen freigeben
            this.heightMapTextures.forEach((texture) => texture.dispose());
            this.diffuseTextures.forEach((texture) => texture.dispose());
            this.roughnessMapTextures.forEach((texture) => texture.dispose());
            this.aoMapTextures.forEach((texture) => texture.dispose());
            this.materials.forEach((material) => material.dispose());

            // Renderer bereinigen
            this.renderers.forEach((renderer) => {
                if (renderer) {
                    renderer.dispose();
                    renderer.forceContextLoss();
                }
            });

            // Arrays leeren und Variablen zurücksetzen
            this.slides = [];
            this.scenes = [];
            this.cameras = [];
            this.renderers = [];
            this.materials = [];
            this.heightMapTextures = [];
            this.diffuseTextures = [];
            this.roughnessMapTextures = [];
            this.aoMapTextures = [];
            this.animationFrameIds = [];
            this.loadedModels = 0;
            this.fullyLoaded = false;
        }



    },

    beforeRouteLeave(to, from, next) {

        this.cleanupThreeJS();
        next();


    },



};
</script>

<style lang="scss" scoped>
@import "@/global_css/variables.scss";

.projects-container {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 75%;
    min-width: 319px;
    min-height: 500px;
    margin: 0 0;
    transition: 2s;
}

.splide {
    height: 100%;
    min-width: 319px;
    min-height: 500px;
    opacity: 0;
    transition: 2000ms;
    pointer-events: auto;
}

.splide__list {
    max-width: 100%;
    margin: 0 auto;
}

.splide__track {
    position: relative;
}

.splide__slide {
    position: relative;
    background-color: $effect-color !important;
    height: 40vh;
    min-height: 500px;
    width: 100%;
    padding: 1rem;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

canvas {
    position: relative;
    width: 100%;
    height: 100%;
}

.splide__arrow {
    font-size: 2rem;
    background-color: $color1-fg !important;
    transition: 0.25s;

    &.splide__arrow--prev {
        left: 1rem;
    }

    &.splide__arrow--next {
        right: 1rem;
    }
}

@media (max-width: 500px) {
    .projects-container {
        width: 100%;
        top: calc(50% + 100px);
        left: 0%;
        transform: translate(0%, -50%);
        min-height: 600px;

    }


    .splide__slide {
        border-radius: 0px;
    }
}

@media (max-height: 751px) {
    .splide__slide {
        min-height: 450px !important;
        top: 5rem;
    }

    .splide__pagination {
        bottom: 7rem !important;
    }
}
</style>

