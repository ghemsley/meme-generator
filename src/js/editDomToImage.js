import domtoimage from 'dom-to-image-more'
import { modal } from 'tingle.js'
import 'tingle.js/dist/tingle.min.css'

var outerContainer = document.createElement('div')
var innerContainer = document.createElement('div')
var image = document.createElement('img')
var topCaptionP = document.createElement('p')
var bottomCaptionP = document.createElement('p')

var reader = new FileReader()

var name
var file
var topCaption
var bottomCaption

outerContainer.className = 'outer-container'
innerContainer.className = 'inner-container'
image.className = 'meme-image'
topCaptionP.className = 'top-caption'
bottomCaptionP.className = 'bottom-caption'

var memeModal = new modal({
  footer: true,
  closeMethods: ['overlay', 'button', 'escape'],
  closeLabel: 'Close'
})

memeModal.addFooterBtn('Save to account', 'create-button', () => {
  buttonSubmit()
})

global.formSubmit = (event) => {
  event.preventDefault()
  if (
    event.target[0].value != null &&
    event.target[0].value != undefined &&
    event.target[0].value != ''
  ) {
    name = event.target[0].value
  } else {
    name = originalName
  }
  if (
    event.target[1].value != null &&
    event.target[1].value != undefined &&
    event.target[1].value != ''
  ) {
    topCaption = event.target[1].value
  } else {
    topCaption = originalTopCaption
  }
  if (
    event.target[2].value != null &&
    event.target[2].value != undefined &&
    event.target[2].value != ''
  ) {
    bottomCaption = event.target[2].value
  } else {
    bottomCaption = originalBottomCaption
  }

  if (
    event.target[3].files[0] != null &&
    event.target[3].files[0] != undefined
  ) {
    reader.addEventListener('load', (event) => {
      image.src = event.target.result
    })
    file = event.target[3].files[0]
    reader.readAsDataURL(file)
  } else {
    fetch(originalImageSrc).then((result) => {
      result
        .blob()
        .then((blob) => {
          reader.addEventListener('load', (event) => {
            image.src = event.target.result
          })
          reader.readAsDataURL(blob)
        })
        .then((result) => {
          image.src = result
        })
    })
  }

  topCaptionP.innerHTML = topCaption
  bottomCaptionP.innerHTML = bottomCaption
  innerContainer.appendChild(topCaptionP)
  innerContainer.appendChild(image)
  innerContainer.appendChild(bottomCaptionP)
  outerContainer.appendChild(innerContainer)
  memeModal.setContent(outerContainer)
  memeModal.open()
  return false
}

global.buttonSubmit = () => {
  domtoimage.toPng(innerContainer).then(function (dataUrl2) {
    var image2 = new Image()
    image2.src = dataUrl2
    fetch(dataUrl2)
      .then((response) => {
        return response.blob()
      })
      .then((file2) => {
        const formData = new FormData()
        formData.append('meme[name]', name)
        formData.append('meme[top_caption]', topCaption)
        formData.append('meme[bottom_caption]', bottomCaption)
        formData.append(
          'meme[image]',
          file2,
          name + `.${file2.type.split('/').pop()}`
        )
        fetch(`/memes/${meme_id}`, {
          method: 'PATCH',
          body: formData
        })
          .then(() => {
            window.location.href = `/users/${user_id}/memes`
          })
          .catch(function (error) {
            console.error('error', error)
          })
      })
  })
}
