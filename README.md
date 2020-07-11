# hue-image-ie

Intended as a convenience component for images in the vue eco-system, works with ie11+, without the need for a polyfill, does not use the IntersectionObserver broswer API.

Intended to be used by copying and modifying the source file, not intended to be used as a dependency.

## What It Does

Basically, this component ensures that any images contained within a view are only requested from the server when scrolled into the viewport (by default), or are loaded at a configutable point X pixels before being scrolled into the viewport.

Provides a placeholder SVG so the page does'nt jump around as images are requested, loaded and painted. The placeholders have a fucntion attached to vary the background color by default, the background color can also be configured easily by changing the `fill` property in the svg elements `:style` attribute.

## Copy source below

```
<template>
    <div class="image-con">
        <div :id="`img-${hash}`" class="base" :class="status === 'loaded' ? 'show' : 'hide'" >
            
        </div>
        <svg :id="`svg-${hash}`" class="base" width="100%" :height="svgheight" :class="status !== 'loaded' ? 'show' : 'hide'">
            <rect width="100%" :height="svgheight" :style="{ fill: perc2color(Math.floor(hash / 10000000)), stroke:'none'}" />
        </svg>
    </div>
</template>

<script>
// TODO:
// - define array of various image sizes for request at different screen widths
//
// - possible choice between loading spinner and svg background
//
// - implement error behavior, if src incorrect or server unresponsive
//
export default {
    name: 'vueimage',
    props: {
        imgsrc: String,
        srcmap: Object,
    },
    data () {
        return {
            image: null,
            status: 'loading',
            loaderror: false,
            hash: null,
            el: null,
            hidesvg: false,
            attr: '',
            eltop: null,
            windowtop: null,
            scrollticking: false,
            scrollloc: 0,
            ratio: null,
            svgel: null,
            svgheight: 0,
            scrolltrigger: 2000,
        }
    },
    created() {
        this.hash = Math.floor((Math.random() * 99999999) + 1)
        this.scrollloc = window.scrollY
    },
    mounted() {
        this.svgel = document.getElementById(`svg-${this.hash}`)
        this.svgheight = Math.floor((this.svgel.getBoundingClientRect().right - this.svgel.getBoundingClientRect().left) * 0.66)
        this.windowtop = Math.abs(document.body.getBoundingClientRect().top)
        window.addEventListener('scroll', this.scrolling)
    
        this.windowpos = Math.abs(document.body.getBoundingClientRect().top)
        this.attr = this.$el.firstElementChild.attributes[0].nodeName
        this.el = document.getElementById(`img-${this.hash}`)
        this.$nextTick(() => { 
            this.eltop = this.$el.getBoundingClientRect().top 
            if (this.imgsrc && this.el && this.shouldinit) this.createLoader()
            else if (!this.imgsrc || !this.el) this.handleError()
        })
    },
    methods: {
        scrolling () {
            this.scrollloc = window.scrollY
            if (!this.scrollticking) {
                window.requestAnimationFrame(() => {
                    if (this.status !== 'loaded' && (this.scrolltrigger + this.scrollloc > this.eltop)) {
                        this.createLoader()
                    }
                    this.scrollticking = false
                })
                this.scrollticking = true
            }
        },
        perc2color(perc) {
            let h = Math.round(510 - 5.10 * perc) * 0x10000 + 62965
            return '#' + ('000000' + h.toString(16)).slice(-6)
        },
        handleError() {
            this.loaderror = true
            this.status = 'error'
        },
        createLoader() {
            this.image = new Image()
            this.image.onload = this.handleLoad
            this.image.onerror = this.handleError
            this.image.src = this.imgsrc
            this.image.setAttribute(this.attr, '')
            this.el.appendChild(this.image)
            if (this.srcmap) {
                this.applysrcset()
            }
            this.status = 'loaded'
        },
        applysrcset() {
            this.image.setAttribute('srcset', `${this.srcmap['small']} 480w, ${this.srcmap['medium']} 1280w, ${this.srcmap['large']} 1980w`)
        },
        handleLoad() {
            // TODO unsure that this even needs impl
        }
    },
    computed: {
        shouldinit() {
            return this.eltop < this.scrolltrigger
        },
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.scrolling)
    },
}
</script>
<style scoped>
.base {
    opacity: 1;
    transition: opacity 0.5s ease, visibility 0.5s ease;
    object-fit: fill;
    width: 100%;
}
.show {
    visibility: visible;
    opacity: 1;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}
.hide {
    visibility: hidden;
    opacity: 0;
    height: 0;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}
img {
    width: 100%;
    object-fit: fill;
}
</style>
```

