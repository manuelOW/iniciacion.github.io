let imagenResultado;
    let estiloSeleccionado;
    let qrCode;

    async function procesarImagen() {
      const archivo = document.getElementById('imagen').files[0];
      if (!archivo) {
        alert('Por favor, seleccione una imagen para procesar.');
        return;
      }

      const lector = new FileReader();
      lector.readAsDataURL(archivo);

      lector.onload = async () => {
        const imagenBase64 = lector.result.split(',')[1];

        const estilos = ["Cubismo" , "Pop Art", "Anime", "Surrealismo", "Art Deco", "Estilo Cómic"];
        estiloSeleccionado = estilos[Math.floor(Math.random() * estilos.length)];

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

        imagenResultado = new Image();
        imagenResultado.src = data.output_url;
        imagenResultado.onload = function() {
          document.getElementById('resultado').innerHTML = '';
          document.getElementById('resultado').appendChild(imagenResultado);
            
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
      const estilos = ["Cubismo" , "Pop Art", "Anime", "Surrealismo", "Art Deco", "Estilo Cómic"];
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
