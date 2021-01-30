import domtoimage from 'dom-to-image-more'

var outerContainer = document.createElement('div')
var innerContainer = document.createElement('div')
var image = document.createElement('img')
var topCaptionP = document.createElement('p')
var bottomCaptionP = document.createElement('p')

var button = document.querySelector('.create-button')

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

global.formSubmit = (event) => {
  event.preventDefault()
  button.style = { display: 'inline block' }
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
  document.querySelector('.layout').appendChild(outerContainer)
  return false
}

global.buttonSubmit = () => {
  domtoimage.toPng(innerContainer).then(function (dataUrl) {
    console.log(dataUrl)
    var image2 = new Image()
    image2.src = dataUrl
    fetch(dataUrl)
      .then((response) => {
        console.log(response)
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
          .then((response) => console.log(response))
          .then(() => {
            window.location.href = `/users/${user_id}/memes`
          })
          .catch(function (error) {
            console.error('error', error)
          })
      })
  })
}
