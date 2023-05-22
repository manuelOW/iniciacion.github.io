console.log("from script file");
 src="https://unpkg.com/@midjourney/midjourney-js@1.1.0"
    
      function procesarImagen() {
        // Obtener la imagen cargada
        const archivo = document.getElementById('imagen').files[0];
        if (!archivo) {
          alert('Por favor, seleccione una imagen para procesar.');
          return;
        }

        // Leer la imagen como objeto de tipo File
        const lector = new FileReader();
        lector.readAsArrayBuffer(archivo);

        lector.onload = async () => {
          // Procesar la imagen con Midjourney
          const imagen = new Uint8Array(lector.result);
          const estilo = obtenerEstiloAleatorio();
          const resultado = await midjourney.predict(imagen, { style: estilo });

          // Crear un elemento de imagen y mostrar el resultado en la página web
          const imagenResultado = new Image();
          imagenResultado.src = 'data:image/jpeg;base64,' + resultado.toString('base64');
          document.getElementById('resultado').appendChild(imagenResultado);

          // Crear un enlace de descarga para la imagen procesada
          const enlaceDescarga = document.createElement('a');
          enlaceDescarga.download = 'imagen-procesada.jpg';
          enlaceDescarga.href = imagenResultado.src;
          enlaceDescarga.innerHTML = 'Descargar imagen';
          document.getElementById('resultado').appendChild(document.createElement('br'));
          document.getElementById('resultado').appendChild(enlaceDescarga);
        };
      }

      function obtenerEstiloAleatorio() {
        // Generar un número aleatorio entre 0 y 2 para seleccionar un estilo de pintor aleatorio
        const indiceEstilo = Math.floor(Math.random() * 3);
        const estilos = ['vangogh', 'picasso', 'velazquez'];
        return estilos[indiceEstilo];
      }
   
