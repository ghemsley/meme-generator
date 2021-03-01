import domtoimage from 'dom-to-image-more'
import { modal } from 'tingle.js'
import 'tingle.js/dist/tingle.min.css'

var outerContainer = document.createElement('div')
var innerContainer = document.createElement('div')
var image = document.createElement('img')
var topCaptionP = document.createElement('p')
var bottomCaptionP = document.createElement('p')

var reader = new FileReader()
reader.addEventListener('load', (event) => {
  image.src = event.target.result
})
var name
var file
var topCaption
var bottomCaption

outerContainer.className = 'outer-container'
innerContainer.className = 'inner-container'
image.className = 'meme-image'
topCaptionP.className = 'top-caption'
bottomCaptionP.className = 'bottom-caption'
innerContainer.style = { background: 'transparent' }

var memeModal = new modal({
  footer: true,
  closeMethods: ['overlay', 'button', 'escape'],
  closeLabel: 'Close'
})

memeModal.addFooterBtn(
  'Save to account',
  'create-button tingle-create-button',
  () => {
    buttonSubmit()
  }
)

global.formSubmit = (event) => {
  event.preventDefault()
  name = event.target[0].value
  topCaption = event.target[1].value
  bottomCaption = event.target[2].value
  file = event.target[3].files[0]
  reader.readAsDataURL(file)
  topCaptionP.innerHTML = topCaption
  bottomCaptionP.innerHTML = bottomCaption

  innerContainer.appendChild(topCaptionP)
  innerContainer.appendChild(image)
  innerContainer.appendChild(bottomCaptionP)
  outerContainer.appendChild(innerContainer)
  memeModal.setContent(outerContainer)
  memeModal.open()
  setTimeout(() => {
    document.querySelector('.tingle-create-button').scrollIntoView(false)
  }, 500)
  return false
}

global.buttonSubmit = () => {
  domtoimage.toPng(innerContainer).then(function (dataUrl) {
    var image2 = new Image()
    image2.src = dataUrl
    fetch(dataUrl)
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
        formData.append(
          'meme[original_image]',
          file,
          name + `_original.${file.type.split('/').pop()}`
        )
        fetch('/memes', {
          method: 'POST',
          body: formData
        })
          .then(() => {
            window.location.href = `/users/${user_id}/memes`
          })
          .catch(function (error) {
            console.error(error)
          })
      })
  })
}
