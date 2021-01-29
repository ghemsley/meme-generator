import domtoimage from 'dom-to-image-more'

global.formSubmit = (event) => {
  event.preventDefault()

  var outerContainer = document.createElement('div')
  var innerContainer = document.createElement('div')
  var image = document.createElement('img')
  var topCaptionP = document.createElement('p')
  var bottomCaptionP = document.createElement('p')

  var reader = new FileReader()
  var name = event.target[0].value
  var file = event.target[3].files[0]
  var topCaption = event.target[1].value
  var bottomCaption = event.target[2].value

  outerContainer.className = 'outer-container'
  innerContainer.className = 'inner-container'
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
      console.log(dataUrl)
      var image2 = new Image()
      image2.src = dataUrl
      fetch(dataUrl)
        .then((response) => {
          console.log(response)
          return response.blob()
        })
        .then((file2) => {
          console.log(file.type)
          console.log(file2)
          console.log(file2.type)

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

  var button = document.createElement('button')
  button.innerHTML = 'Save meme'
  button.className = 'submit-button'
  button.onclick = buttonSubmit

  document.querySelector('.form-container form').appendChild(button)

  return false
}
