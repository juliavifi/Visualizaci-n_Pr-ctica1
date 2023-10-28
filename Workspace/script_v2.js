// Define una variable para rastrear si las líneas se han dibujado
let lineasDibujadas = false;

// Función para dibujar las líneas o eliminarlas
function dibujarlineas(datos, escalaX, escalaY, color) {
  // Si las líneas ya se han dibujado, elimínalas
  if (lineasDibujadas) {
    svg.selectAll("line").remove();
    lineasDibujadas = false;
  } else {
    // Dibuja las líneas
    const lineas = svg.append("g")
      .selectAll("line")
      .data(datos.Data)
      .enter()
      .append("line")
      .attr("x1", (d, i) => escalaX(new Date(d.Fecha)))
      .attr("y1", (d, i) => escalaY(d.Valor))
      .attr("x2", (d, i) => {
        if (i < datos.Data.length - 1) {
          return escalaX(new Date(datos.Data[i + 1].Fecha));
        }
        return escalaX(new Date(d.Fecha)); // Evita un error al final de los datos
      })
      .attr("y2", (d, i) => {
        if (i < datos.Data.length - 1) {
          return escalaY(datos.Data[i + 1].Valor);
        }
        return escalaY(d.Valor); // Evita un error al final de los datos
      })
      .attr("stroke", color)
      .attr("stroke-width", 3)
      .style("opacity", 0.3);

    // Actualiza la variable para indicar que las líneas se han dibujado
    lineasDibujadas = true;
  }
}

// Luego, en tu función dibujarBoton, simplemente llama a dibujarlineas
// para que verifique si debe dibujar o eliminar las líneas.

function dibujarBoton(datos, posicion) {
  const color = colorScale(posicion); // Obtén un color único para este botón

  const button = document.createElement("button");
  button.textContent = Comunidad=datos.MetaData.find(meta=> (meta.Variable.Nombre === 'Comunidades y Ciudades Autónomas') || (meta.Variable.Nombre === 'Total Nacional')).Nombre;
  button.addEventListener("click", () => {
    // Llama a la función dibujarlineas para dibujar o eliminar las líneas
    dibujarlineas(datos, xScale, yScale, color);
  });

  // Define la posición del botón en función de la posición
  button.style.position = "absolute";
  button.style.top = `${25 * posicion + 30}px`; // Ajusta el espaciado vertical
  button.style.left = width + 50; // Ajusta la posición horizontal

  // Asigna el color de fondo al botón
  button.style.backgroundColor = color;
  button.style.width = '200px';

  // Agrega el botón al documento
  document.body.appendChild(button);
}
