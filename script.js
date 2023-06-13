let imagenResultado;
    let estiloSeleccionado;
    let qrCode;

    async function procesarImagen() {
      // Obtener la imagen cargada
      const archivo = document.getElementById('imagen').files[0];
      if (!archivo) {
        alert('Por favor, seleccione una imagen para procesar.');
        return;
      }

      // Leer la imagen como objeto de tipo File
      const lector = new FileReader();
      lector.readAsDataURL(archivo);

      lector.onload = async () => {
        const imagenBase64 = lector.result.split(',')[1];

        // Obtener un estilo aleatorio
        const estilos = ["cubismo", "impresionismo", "romanico", "bizantino", "expresionismo"];
        estiloSeleccionado = estilos[Math.floor(Math.random() * estilos.length)];

        // Hacer la solicitud a DeepAI Image API
        const formData = new FormData();
        formData.append("image", archivo);
        formData.append("text", new Blob([estiloSeleccionado], { type: "text/plain" }));

        const response = await fetch('https://api.deepai.org/api/image-editor', {
          method: 'POST',
          headers: {
            'api-key': 'fe10a5a6-bccd-410e-a138-c43f99b62ce5',
          },
          body: formData,
        });

        const data = await response.json();
        console.log(data);

        // Mostrar el resultado en la página web
        imagenResultado = new Image();
        imagenResultado.src = data.output_url;
        imagenResultado.onload = function() {
          document.getElementById('resultado').innerHTML = '';
          document.getElementById('resultado').appendChild(imagenResultado);

          // Mostrar botones para cada estilo posible
          const botonesEstilo = document.createElement('div');
          for (let i = 0; i < estilos.length; i++) {
            const boton = document.createElement('button');
            boton.innerHTML = estilos[i];
            boton.onclick = function() {
              verificarEstilo(i);
            };
            botonesEstilo.appendChild(boton);
          }
          document.getElementById('resultado').appendChild(botonesEstilo);
        };
      };
    }

    function verificarEstilo(estiloBoton) {
      const estilos = ["cubismo", "impresionismo", "romanico", "bizantino", "expresionismo"];
      const estiloActual = estilos[estiloBoton];
      if (estiloActual === estiloSeleccionado) {
        alert("¡Has seleccionado el estilo correcto!");
        const qrCodeDiv = document.createElement('div');
        qrCodeDiv.id = 'qrCode';
        document.getElementById('resultado').appendChild(qrCodeDiv);
        qrCode = new QRCode(qrCodeDiv, {
          text: imagenResultado.src,
          width: 200,
          height: 200
        });
      } else {
        alert("El estilo seleccionado no coincide con el estilo de la imagen procesada.");
        if (qrCode) {
          qrCode.clear();
          const qrCodeDiv = document.getElementById('qrCode');
          if (qrCodeDiv) {
            qrCodeDiv.parentNode.removeChild(qrCodeDiv);
          }
        }
      }
    }
