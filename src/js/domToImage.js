import domtoimage from 'dom-to-image-more'

global.formSubmit = (event) => {
  event.preventDefault()

  let outerContainer = document.createElement('div')
  let innerContainer = document.createElement('div')
  let image = document.createElement('img')
  let topCaptionP = document.createElement('p')
  let bottomCaptionP = document.createElement('p')

  let reader = new FileReader()
  let name = event.target[0].value
  let file = event.target[3].files[0]
  let topCaption = event.target[1].value
  let bottomCaption = event.target[2].value

  innerContainer.className = 'image-container'
  image.className = 'meme-image'
  topCaptionP.className = 'top-caption'
  bottomCaptionP.className = 'bottom-caption'
  topCaptionP.innerHTML = topCaption
  bottomCaptionP.innerHTML = bottomCaption

  reader.addEventListener('load', (event) => {
    image.src = event.target.result
  })
  reader.readAsDataURL(file)

  innerContainer.appendChild(topCaptionP)
  innerContainer.appendChild(image)
  innerContainer.appendChild(bottomCaptionP)
  outerContainer.appendChild(innerContainer)
  document.querySelector('.layout').appendChild(outerContainer)

  const buttonSubmit = () => {
    domtoimage.toPng(innerContainer).then(function (dataUrl) {
      let image2 = new Image()
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
          formData.append('meme[image]', file2, name + '.png')
          formData.append('meme[original_image]', file, name + '_original.png')
          fetch('/memes', {
            method: 'POST',
            body: formData
          })
            .then((response) => console.log(response)).then(() => {
              window.location.href = `/users/${user_id}`
            })
            .catch(function (error) {
              console.error('Error: Failed to save image to server', error)
            })
        })
    })
  }

  let button = document.createElement('button')
  button.innerHTML = 'Save meme'
  button.onclick = buttonSubmit
  document.querySelector('.layout').appendChild(button)

  return false
}
