<template>
    <router-view v-if="isRouterAlive"></router-view>
</template>

<script>

    // import {Button, Select, Container, Header, Main, Aside, Footer, Menu} from 'element-ui';
    // Vue.use(Button);
    // Vue.use(Select);
    // Vue.use(Container);
    // Vue.use(Header);
    // Vue.use(Main);
    // Vue.use(Aside);
    // Vue.use(Footer);
    // Vue.use(Menu);
    export default {
        name: 'app',
        provide() {
            return {
                reload: this.reload
            }
        },
        components: {
        },
        data() {
            return {
                isRouterAlive: true
            }
        },
        methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(function () {
                    this.isRouterAlive = true;
                })
            }
        }
    }
</script>

<style>
    @import "../assets/icon/iconfont.css";
</style>