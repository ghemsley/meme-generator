import { tns } from 'tiny-slider/src/tiny-slider'

var slider = tns({
  container: '.slider',
  items: 3,
  slideBy: 1,
  autoplay: true,
  autoWidth: true,
  gutter: 16,
  slideBy: 1,
  center: true,
  controlsPosition: 'bottom',
  arrowKeys: true,
  nav: false,
  autoplayButton: false,
  autoplayTimeout: 3000,
  autoplayPosition: 'bottom',
  autoplayHoverPause: true,
  controlsText: ['Previous', 'Next']
})
