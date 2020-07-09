<template>
    <div class="placeholder-wrap">
        <div class="placeholder-box" :style="style">
            <span class="placeholder-item placeholder-ani"></span>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'placeholder',
        props: {
            value: [String, Number],
            height: Number,
            width: Number
        },
        computed: {
            style () {
                return {
                    'width': `${this.width}px`,
                    'height': `${this.height}px`,
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
.placeholder-wrap{
    display: inline-block;
}
.placeholder-box{
    display: flex;
    justify-content: stretch;
    align-items: stretch;
}
.placeholder-item{
    display: inline-block;
    line-height: 100%;
}
.placeholder-ani{
    border-radius: 2px;
    margin-left: 6px;
    flex: 1 1 auto;
    background: linear-gradient(90deg,#2F2D32 0,#323033 20%,#2F2D32 40%,#2F2D32);
    animation: linear-double 1s linear 1ms infinite forwards;
    background-size: 300% 100%;
}
.app-white{
    .placeholder-ani{
        background: linear-gradient(90deg,#f6f6f6 0,#ebebeb 20%,#f6f6f6 40%,#f6f6f6);
    }
}
@keyframes linear-double {
    0% {
        background-position-x: -56%;
    }

    to {
        background-position-x: 56%;
    }
}
</style>
