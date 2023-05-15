<template>
    <div class="bg-container">
        <div class="bg-model" :class="{ 'fade-in': ghostFadeIn }" ref="bgModel"></div>
    </div>
</template>
<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";
import ghostModel from "@/assets/3dmodels/ghost/ghostThreejs.glb";
import ghostHeightMap from "@/assets/3dmodels/ghost/ghostThreejs_Ghost_Height.png";
import ghostAlphaMap from "@/assets/3dmodels/ghost/ghostThreejs_Ghost_RGB-Alpha.png";
import ghostRoughnessMap from "@/assets/3dmodels/ghost/ghostThreejs_Ghost_Roughness.png";
import ghostAOMap from "@/assets/3dmodels/ghost/AO.png";

export default {
    name: 'TheHome',
    data() {
        return {
            ghostFadeIn: false,
            animationFrameId: null,
            renderer: null,
            camera: null,
            gltfLoader: null,
            textureLoader: null,
            heightMapTexture: null,
            diffuseTexture: null,
            roughnessMapTexture: null,
            aoMapTexture: null,
            ambientLight: null,
            directionalLight: null,
            material: null,
            mousePosition: new THREE.Vector2(),
            hoverOffset: 0,

        }
    },
    created() {
        this.model = null;
        this.scene = null;
        window.addEventListener("resize", this.onResize);
        window.addEventListener("mousemove", this.onMouseMove);
    },
    mounted() {
        this.gltfLoader = new GLTFLoader();
        this.textureLoader = new TextureLoader();

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            Math.max(window.innerWidth, 329) / Math.max(window.innerHeight, 500),
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);

        // Lichtquellen hinzufügen
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.set(0, 1, 1);
        this.scene.add(this.directionalLight);


        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setClearAlpha(0);
        this.updateRendererSize(this.renderer, this.camera);

        const bgModel = this.$refs.bgModel;
        bgModel.appendChild(this.renderer.domElement);

        // Laden der Texturen
        this.heightMapTexture = this.textureLoader.load(ghostHeightMap);
        this.diffuseTexture = this.textureLoader.load(ghostAlphaMap);
        this.roughnessMapTexture = this.textureLoader.load(ghostRoughnessMap);
        this.aoMapTexture = this.textureLoader.load(ghostAOMap);

        // Laden des Modells
        this.gltfLoader.load(ghostModel, (gltf) => {
            this.model = gltf.scene.children[0];

            this.ghostFadeIn = true

            this.diffuseTexture.flipY = false;
            this.roughnessMapTexture.flipY = false;
            this.aoMapTexture.flipY = false;
            this.heightMapTexture.flipY = false;
            // Erstellen der Materialien
            this.material = new THREE.MeshStandardMaterial({
                map: this.diffuseTexture,
                roughnessMap: this.roughnessMapTexture,
                aoMap: this.aoMapTexture,
                displacementMap: this.heightMapTexture,
                displacementScale: 0.05,

            });


            // Anwenden der Materialien auf das Modell
            this.model.material = this.material

            // Positionieren und Skalieren des Modells
            this.camera.position.set(0, 0, 10)
            this.model.position.set(0, 0, 0)

            this.model.scale.set(2, 2, 2)

            this.scene.add(this.model)

            // Variablen für die Schweb- und Schwingbewegung
            let clock = new THREE.Clock();
            let hoveringSpeed = 0.15;
            let swingSpeed = 0.5;

            // Variablen für die Ausrichtung in Richtung des Mauszeigers

            let targetRotation = new THREE.Euler();

            // Skalierungsfaktor für die Bewegungsgeschwindigkeit
            let movementScale = 0.003;

            // Animationsschleife
            const animate = () => {
                this.animationFrameId = requestAnimationFrame(animate);

                // Zeit seit dem letzten Frame berechnen
                let elapsedTime = clock.getElapsedTime();

                // Schwebende Bewegung in der Y-Achse
                this.hoverOffset = Math.sin(elapsedTime * hoveringSpeed) * 0.55;

                // Schwingbewegung in der Z-Achse
                let swingAngle = Math.sin(elapsedTime * swingSpeed) * Math.PI / 80;
                this.model.rotation.z = swingAngle;

                // Ausrichtung in Richtung des Mauszeigers
                targetRotation.x = -this.mousePosition.y * 0.5;
                targetRotation.y = this.mousePosition.x * 0.5;
                this.model.rotation.x += (targetRotation.x - this.model.rotation.x) * 0.1;
                this.model.rotation.y += (targetRotation.y - this.model.rotation.y) * 0.1;

                // Grenzen des Bildschirms
                let maxX = (Math.max(window.innerWidth, 329) / 2 - 500) / 100; // 100px von den Rändern entfernt
                let maxY = (Math.max(window.innerHeight, 500) / 2 - 200) / 100;
                let minX = -maxX;
                let minY = -maxY + 3;

                // Geist zum Mauszeiger bewegen 
                let targetX = Math.max(minX, Math.min(maxX, this.mousePosition.x * 10));
                let targetY = Math.max(minY, Math.min(maxY, this.mousePosition.y * 10 + this.hoverOffset)); // unabhängig von der Mausposition
                let deltaX = targetX - this.model.position.x;
                let deltaY = targetY - this.model.position.y;
                let deltaZ = this.model.position.z;

                // Berechnungen in Variablen speichern
                let deltaVec = new THREE.Vector3(deltaX, deltaY, deltaZ);
                deltaVec.multiplyScalar(movementScale);

                // Position aktualisieren
                this.model.position.add(deltaVec);

                this.renderer.render(this.scene, this.camera);
            };

            animate();


        })
    },
    methods: {
        updateRendererSize(renderer, camera) {
            // Aktualisieren Sie die Größe des Renderers
            renderer.setSize(Math.max(window.innerWidth, 329), Math.max(window.innerHeight, 500));

            // Aktualisieren Sie das Seitenverhältnis der Kamera
            camera.aspect = Math.max(window.innerWidth, 329) / Math.max(window.innerHeight, 500);

            // Aktualisieren Sie die Projektionsmatrix der Kamera
            camera.updateProjectionMatrix();

        },
        onResize() {
            this.updateRendererSize(this.renderer, this.camera);
        },

        onMouseMove(event) {
            this.mousePosition.x = (event.clientX / Math.max(window.innerWidth, 329)) * 2 - 1;
            this.mousePosition.y = -(event.clientY / Math.max(window.innerHeight, 500)) * 2 + 1;

            this.hoverOffset = Math.sin(event.clientX * 0.01) * 0.1;
        },
        async cleanupThreeJS() {

            try {
                document.getElementsByClassName("bg-container")[0].style.opacity = 0;
            } catch (error) {

            }

            await new Promise(resolve => setTimeout(resolve, 2000));


            console.log('TheHome.vue', "cleanupThreeJS");

            await new Promise(resolve => {
                window.removeEventListener("resize", this.onResize);
                window.removeEventListener("mousemove", this.onMouseMove);
                // Animationsschleife beenden
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;
                }

                // Objekte aus der Szene entfernen
                if (this.scene) {
                    this.scene.remove(this.ambientLight);
                    this.scene.remove(this.directionalLight);
                    this.scene.remove(this.model);
                }

                // Textur- und Materialressourcen freigeben
                if (this.heightMapTexture) this.heightMapTexture.dispose();
                if (this.diffuseTexture) this.diffuseTexture.dispose();
                if (this.roughnessMapTexture) this.roughnessMapTexture.dispose();
                if (this.aoMapTexture) this.aoMapTexture.dispose();
                if (this.material) this.material.dispose();

                // Renderer bereinigen
                if (this.renderer) {
                    this.renderer.dispose();
                    this.renderer.forceContextLoss();
                    this.renderer = null;
                }

                // Referenzen auf Objekte aufheben
                this.gltfLoader = null;
                this.textureLoader = null;
                this.scene = null;
                this.camera = null;
                this.ambientLight = null;
                this.directionalLight = null;
                this.model = null;
                this.material = null;
                this.heightMapTexture = null;
                this.diffuseTexture = null;
                this.roughnessMapTexture = null;
                this.aoMapTexture = null;
            }).then(() => {
                document.getElementsByClassName("bg-container")[0].style.opacity = 1;
            })

        },
    },
    watch: {
        $route(to, from) {
            // Prüfen, ob die Route gewechselt hat und ob die vorherige Route die gewünschte Route war
            if (from.name === "home" && to.name !== "home") {
                this.cleanupThreeJS();
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.bg-container {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    min-height: 500px;
    min-width: 329px;
   
    pointer-events: none;
}

.bg-model {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
    opacity: 0;
    transition: 2000ms;
    width: 100%;
    height: 100%;
}


.fade-in {
    opacity: 1;
    transition: opacity 2s ease-in-out;
}
</style>