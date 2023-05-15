<template>
    <section id="home" class="home-section">
        <div class="loader">
            <p> Loading </p>
            <i class='bx bx-loader-alt'></i>
        </div>
        <header>
            <div class="left-header" :class="slideRightAnimation" v-show="visibleAnimationHelper">
                <img src="@/assets/logo/RCGILogoTransparent.png" alt="" id="logo" />
                <h6 class="header-username">Random_CGI</h6>
            </div>
            <div class="right-header" :class="slideBottomAnimation" v-show="visibleAnimationHelper">
                <h6 class="name">Moritz Brand</h6>

            </div>
        </header>
        <main>
            <router-view v-slot="{ Component }">
                <transition transition enter-active-class="animate__animated animate__fadeIn"
                    leave-active-class="animate__animated animate__fadeOut" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>


            <ul class="sidebar" :class="slideLeftAnimation" v-show="visibleAnimationHelper">
                <li class="nav-link" @click="loadAnimation"><router-link to="/randomcgi/"
                        :class="{ active: isPathActive('/randomcgi/') }">Home</router-link></li>
                <li class="nav-link" @click="loadAnimation"><router-link to="/randomcgi/projects"
                        :class="{ active: isPathActive('/randomcgi/projects') }">Projects</router-link></li>
                <li class="nav-link" @click="loadAnimation"><router-link to="/randomcgi/contact"
                        :class="{ active: isPathActive('/randomcgi/contact') }">Contact</router-link>
                </li>
            </ul>

        </main>

        <footer>
            <div class="left-info" :class="slideTopAnimation" v-show="visibleAnimationHelper">
                <h6>3D Artist</h6>
                <p>From <span>GER</span></p>
            </div>
            <div class="right-socials" :class="slideTopAnimation" v-show="visibleAnimationHelper">
                <ul>
                    <li class="socials-link"><a href="https://www.instagram.com/random_cgi/"><i
                                class='bx bxl-instagram'></i></a></li>
                    <li class="socials-link"><a href="https://www.fiverr.com/random_cgi"><i class='bx bx-store-alt'></i></a>
                    </li>

                </ul>
            </div>
        </footer>
    </section>
</template>

<script>

export default {
    name: "HomePage",
    data() {
        return {
            slideLeftAnimation: '',
            slideRightAnimation: '',
            slideTopAnimation: '',
            slideBottomAnimation: '',
            visibleAnimationHelper: false,
        };
    },

    computed: {
        isPathActive() {
            return (path) => this.$route.path === path;
        }
    },
    created() {
        setTimeout(() => {
            this.slideLeftAnimation = 'animate__animated animate__slideInRight';
            this.slideRightAnimation = 'animate__animated animate__slideInLeft';
            this.slideTopAnimation = 'animate__animated animate__slideInUp';
            this.slideBottomAnimation = 'animate__animated animate__slideInDown';
            this.visibleAnimationHelper = true;
        }, 3000);

    },
    methods: {
        loadAnimation() {
            const loader = document.getElementsByClassName('loader')[0];
            loader.style.opacity = 1;
            setTimeout(() => {
                loader.style.opacity = 0;
            }, 2000);
        }
    }

}
</script>
<style lang="scss" scoped>
@import "@/global_css/variables.scss";
@import "../../node_modules/animate.css/animate.css";

main {
    position: relative;
    top: 0;
    left: 0;
    width: 100vw;
    height: calc(100% - 200px);
    min-height: 500px;
    pointer-events: none;
}



section {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: visible;
    min-height: 720px;
    min-height: -webkit-fill-available;
    min-width: 319px;
    pointer-events: none;
}

#home {
    padding: 0px !important;
}

header {
    position: relative;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100px;
    background: transparent;
    z-index: 2;
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 0;
    padding: 1rem;
    //spointer-events: none;

    .left-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin: 1rem;
        margin-top: 0;
        width: 50%;
        height: 100%;

        img {
            width: 60px;
            aspect-ratio: 1/1;
        }

        h6 {
            margin: 0.5rem 0 0 0;
            padding: 0;
            font-size: $fs-md;
            font-weight: $fw-extra-light;
            color: $effect-color;
            margin-left: 1rem;
        }
    }

    .right-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        margin: 1rem;
        margin-top: 0;
        width: 50%;
        height: 100%;

        .name {
            margin: 0 1rem;
            margin-top: 0.5rem;
            line-height: 2rem;
            font-size: $fs-lg;
            font-weight: $fw-extra-light;
            color: $effect-color;



        }
    }
}

.sidebar {
    position: absolute;
    right: 3rem;
    top: 50%;
    width: 50px;
    transform: translate(0%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 3;
    margin-top: -125px;

    .nav-link {
        a {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: $color1-fg;
            font-size: $fs-md;
            font-weight: $fw-light;
            margin: 1rem 0;
            writing-mode: vertical-rl;
            text-orientation: sideways;
            transition: 0.25s;
            pointer-events: auto;

            &:hover {
                color: $effect-color;
            }

            &.active {

                color: $effect-color;

            }
        }


    }
}

@media (max-height: 600px) {
    .nav-link {
        margin: 0 1rem;
    }



    .header {
        height: 50px !important;
    }


    .left-info {
        margin: 1rem;
    }




}

@media (max-width: 500px) {



    .sidebar {

        flex-direction: row;
        justify-content: center;
        align-self: center;
        width: 100%;
        min-width: 319px;
        margin-top: 0;
        padding: 0;
        left: 0;
        top: 0px !important;
        border-bottom: 1px solid $effect-color;
        border-top: 1px solid $effect-color;

        .nav-link {
            margin: 1rem;
            align-self: center;

            a {
                writing-mode: initial;
                text-orientation: initial;
            }
        }
    }

    header {
        flex-direction: column;
    }

    .name {
        display: none;
        margin: 0;
        padding: 0;
    }

}


footer {
    position: static;
    height: 110px;
    bottom: 0;
    width: 100%;
    min-width: 319px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;


    .left-info {
        width: 50%;
        margin-left: 3rem;

        h6 {
            margin: 0;
            padding: 0;
            font-size: $fs-xl;
            font-weight: $fw-extra-light;
            color: $color1-fg;

        }

        p {
            margin: 0;
            padding: 0;
            font-size: $fs-sm;
            font-weight: $fw-extra-light;
            color: $color1-fg;

            span {
                font-size: $fs-sm;
                font-weight: $fw-extra-light;
                color: $effect-color;

            }
        }
    }

    .right-socials {
        width: 50%;
        margin-right: 3rem;

        ul {
            display: flex;
            justify-content: flex-end;

            li {
                a {
                    i {
                        pointer-events: auto;
                        margin-left: 1rem;
                        text-decoration: none;
                        color: $color1-fg;
                        font-size: $fs-lg;
                        font-weight: $fw-extra-light;
                        transition: 0.25s;

                        &:hover {
                            color: $effect-color;
                        }
                    }

                }
            }
        }

    }
}

@media (max-width: 500px) {
    .left-info {
        h6 {
            font-size: $fs-md !important;


        }

        p {

            font-size: $fs-sm !important;


            span {
                font-size: $fs-sm !important;


            }
        }
    }
}

.loader {
    height: 100px;
    width: 250px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
    z-index: 1000;
    background: $color2-bg;
    border: 1px solid $effect-color;
    border-radius: 1rem;
    opacity: 0;
    pointer-events: none;
    transition: all 0.35s;

    p {
        margin: 0;
        padding: 0;
        font-size: $fs-lg;
        font-weight: $fw-extra-light;
        color: $color1-fg;
        margin-left: 1rem;

        i {
            animation: rotate 2s ease-in-out infinite;
        }
    }

    i {
        margin: 0;
        padding: 0;
        font-size: $fs-lg;
        font-weight: $fw-extra-light;
        color: $color1-fg;
        margin-left: 1rem;


        animation: rotate 2s ease-in-out infinite;

    }
}


@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>