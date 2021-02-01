import { tns } from 'tiny-slider/src/tiny-slider'

document.addEventListener(
  'DOMContentLoaded',
  () => {
    var slider = tns({
      container: '.slider',
      items: 3,
      slideBy: 1,
      autoWidth: true,
      gutter: 16,
      slideBy: 1,
      center: true,
      controlsPosition: 'bottom',
      arrowKeys: true,
      nav: false,
      navPosition: 'bottom',
      autoplayButton: false,
    })
  },
  false
)
