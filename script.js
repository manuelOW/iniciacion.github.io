// Accede a los elementos del DOM
const videoElement = document.getElementById('videoElement');
const captureButton = document.getElementById('captureButton');
const photoElement = document.getElementById('photoElement');
const resultElement = document.getElementById('resultElement');

// Opciones de la API
const promptText = "haz la foto como si fuese pintada por picasso";
const width = 768;
const height = 576;
const guidance = 20.2;
const iterations = 91;
const strength = 0.55;
const apiKey = "sk_atcjAePBB2ofo3pOB79p0";

// Acceder a la cámara y mostrar el flujo de video
navigator.mediaDevices.getUserMedia({ video: true })
  .then(function(stream) {
    videoElement.srcObject = stream;
  })
  .catch(function(error) {
    console.error('Error al acceder a la cámara: ', error);
  });

// Capturar la foto cuando se hace clic en el botón
captureButton.addEventListener('click', function() {
  // Obtener el ancho y alto reales del video
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;

  // Configurar el canvas con el tamaño del video
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = videoWidth;
  canvas.height = videoHeight;

  // Dibujar el video en el canvas sin reflejarlo horizontalmente
  context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

  // Crear un nuevo canvas para la foto
  const photoCanvas = document.createElement('canvas');
  const photoContext = photoCanvas.getContext('2d');
  photoCanvas.width = videoWidth;
  photoCanvas.height = videoHeight;

  // Voltear horizontalmente la foto en el nuevo canvas
  photoContext.translate(videoWidth, 0);
  photoContext.scale(-1, 1);
  photoContext.drawImage(canvas, 0, 0, videoWidth, videoHeight);

  // Convertir la foto capturada a una imagen en base64
  const imageDataURL = photoCanvas.toDataURL('image/jpeg');

  // Mostrar la imagen capturada
  photoElement.src = imageDataURL;

  // Enviar la imagen a la API para procesarla
  const formData = new FormData();
  formData.append('prompt', promptText);
  formData.append('w', width);
  formData.append('h', height);
  formData.append('guidance', guidance);
  formData.append('iterations', iterations);
  formData.append('strength', strength);
  formData.append('img', imageDataURL);

  fetch('https://computerender.com/models-sd.html', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': 'X-API-Key ' + apiKey
    }
  })
    .then(function(response) {
      // Guardar la imagen procesada en el lado del servidor
      return response.blob();
    })
    .then(function(blob) {
      // Crear una URL del blob para descargar la imagen procesada
      const resultURL = URL.createObjectURL(blob);

      // Crear un enlace para descargar la imagen procesada
      const downloadLink = document.createElement('a');
      downloadLink.href = resultURL;
      downloadLink.download = 'processed_image.jpg';
      downloadLink.textContent = 'Descargar imagen procesada';

      // Mostrar el enlace para descargar la imagen procesada
      resultElement.innerHTML = '';
      resultElement.appendChild(downloadLink);
    })
    .catch(function(error) {
      console.error('Error al procesar la foto: ', error);
    });
});
