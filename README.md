# hue-image-ie

Intended as a convenience component for images in the vue eco-system, works with ie11+, without the need for a polyfill, does not use the IntersectionObserver broswer API.

Intended to be used by copying and modifying the source file, not intended to be used as a dependency.

## What It Does

Basically, this component ensures that any images contained within a view are only requested from the server when scrolled into the viewport (by default), or are loaded at a configutable point X pixels before being scrolled into the viewport.

Provides a placeholder SVG so the page does'nt jump around as images are requested, loaded and painted. The placeholders have a fucntion attached to vary the background color by default, the background color can also be configured easily by changing the `fill` property in the svg elements `:style` attribute.

Provides the ability to provide a value to the images `srcset` attribute, via the prop `srcmap`, the documentation for `srcset` can be found (here)[https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes]

The format of the `srcmap` prop attempts to simplify the `<img>` `srcset` attribute an example of the prop value follows:
```
this.srcmap = {
    'small': 'path/to/small/image', // for screen widths below 480px
    'medium': 'path/to/medium/image', // for screen widths between 481px and 1280px
    'large': 'path/to/large/image', // for screen widths larger than 1281px
}
```