console.log("Cargando fichero script_v2.js");

// Datos de ejemplo en formato JSON
d3.json("parados_edad_com_t.json").then(function (datosCompletos) {
  console.log("Datos cargados parados.js");
  console.log(datosCompletos);

  // Selección de variables
  function filtrar(VariableNombre, Nombre, datos) {
    const subconj = [];
    datos.forEach(function (d) {
      const Filtro = d.MetaData.find(meta => meta.Variable.Nombre === VariableNombre);

      if (Filtro && Filtro.Nombre === Nombre) {
        subconj.push(d);
      }
    });
    return subconj;
  }

  datos_tot = filtrar(
    "Sexo",
    "Ambos sexos",
    filtrar("Totales de edad", "Total", datosCompletos)
  );

  console.log(datos_tot);

  // Configuración del gráfico
  const width = 1000;
  const height = 700;
  const margin = {
    left: 90,
    right: 150,
    top: 20,
    bottom: 100,
  };

  // Crear el contenedor SVG
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Obtener las fechas mínima y máxima de tus datos
  const maxDate = d3.max(datos_tot[0].Data, (d) => d.Fecha);
  const minDate = d3.min(datos_tot[0].Data, (d) => d.Fecha);

  // Define las escalas para los ejes X e Y
  const xScale = d3
    .scaleTime()
    .domain([new Date(minDate), new Date(maxDate)]) // Asegúrate de crear objetos Date
    .range([0 + margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, 40])
    .range([height - margin.bottom, 0 + margin.top]);

//  // Define una escala de colores
//  const colorScale = d3.scaleOrdinal([
//    "#1f77b4",
//    "#ff7f0e",
//    "#2ca02c",
//    "#d62728",
//    "#9467bd",
//    "#8c564b",
//    "#e377c2",
//    "#7f7f7f",
//    "#bcbd22",
//    "#17becf",
//    "#aec7e8",
//    "#ffbb78",
//    "#98df8a",
//    "#ff9896",
//    "#c5b0d5",
//    "#c49c94",
//    "#f7b6d2",
//    "#c7c7c7",
//    "#dbdb8d",
//    "#9edae5",
//  ]);
    
  var colorScale = d3.scaleLinear()
    .range(["purple", "red", "orange", "green", "blue"])
    .domain([0,4,9,14,19]);

  const mesesEnEspanol = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  // Función personalizada para formatear la fecha con nombres de meses abreviados en español
  function formatoFechaEnEspanol(d) {
    const mes = mesesEnEspanol[d.getMonth()]; // Obtiene el nombre del mes en español
    const año = d.getFullYear(); // Obtiene el año
    return mes + " " + año.toString(); // Combina el mes y el año
  }
    
////////////    EJES  ////////////////////

  var ejeX = d3.axisBottom(xScale)
    .ticks(12)
    .tickFormat(formatoFechaEnEspanol); // Utiliza la función de formato personalizada

  svg
    .append("g")
    .attr("transform", "translate (0," + (height - margin.bottom) + ")")
    .call(ejeX)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function (d) {
      return "rotate(-45)";
    });
    // Agregar título al eje X
svg
    .append("text")
   .attr("x", width / 2)
   .attr("y", height- margin.bottom/4) // Ajusta la posición vertical según tus necesidades
   .attr("text-anchor", "middle")
   .text("Fecha");
    
    

  var ejeY = d3.axisLeft(yScale).ticks(10);

  svg
    .append("g")
    .attr("transform", "translate (" + margin.left + ",0)")
    .call(ejeY);
    
// Agregar título al eje Y
svg
    .append("text")
   .attr("transform", "rotate(-90)")
   .attr("x", 0 - height / 2)
   .attr("y", margin.left *0.5 ) // Ajusta la posición vertical según tus necesidades
   .attr("text-anchor", "middle")
   .text("Tasa de paro  (%)");
 
    
///////////////////////////////////////
function dibujarCheckbox(datos, posicion) {
    const color = colorScale(posicion); // Obtén un color único para este checkbox

    // Crea un checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = `checkbox-${posicion}`; // Agrega una clase específica
    checkbox.checked = false; // Por defecto, los checkboxes no están marcados

    // Escucha el evento "change" del checkbox
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        // Si el checkbox está marcado, muestra las líneas
        mostrarLineas(datos, xScale, yScale, color, posicion);
      } else {
        // Si el checkbox no está marcado, oculta las líneas
        ocultarLineas(posicion);
      }
    });
     // Define la posición del botón en función de la posición
    checkbox.style.position = "absolute";
    checkbox.style.top = `${25 * posicion+ 40}px`; // Ajusta el espaciado vertical
    checkbox.style.left = width+50; // Ajusta la posición horizontal
   
    // Agrega el checkbox al documento
    document.body.appendChild(checkbox);

    // Crea una etiqueta para el checkbox (mostrar el nombre de la comunidad)
    const label = document.createElement("label");
    label.textContent = datos.MetaData.find(
      (meta) =>
        meta.Variable.Nombre === "Comunidades y Ciudades Autónomas" ||
        meta.Variable.Nombre === "Total Nacional"
    ).Nombre;

      
     // Define la posición del botón en función de la posición
     label.style.position = "absolute";
     label.style.top = `${25 * posicion+ 40}px`; // Ajusta el espaciado vertical
     label.style.left = width+100; // Ajusta la posición horizontal
     label.style.color= color; 
      
    // Agrega la etiqueta al documento
    document.body.appendChild(label);

  }

  // Pintamos
// Crea un elemento de tooltip
var tooltip = d3.select("body").append("div").attr("class", "tooltip");
    
function mostrarLineas(datos, escalaX, escalaY, color, posicion) {
  const lineasGroup = svg.append("g"); // Crea un grupo para las líneas

  const lineas = lineasGroup
    .selectAll("line")
    .data(datos.Data)
    .enter()
    .append("line")
    .attr("class", `lineas-${posicion}`)
    .attr("x1", (d, i) => escalaX(new Date(d.Fecha)))
    .attr("y1", (d, i) => escalaY(d.Valor))
    .attr("x2", (d, i) => {
      if (i < datos.Data.length - 1) {
        return escalaX(new Date(datos.Data[i + 1].Fecha));
      }
      return escalaX(new Date(d.Fecha));
    })
    .attr("y2", (d, i) => {
      if (i < datos.Data.length - 1) {
        return escalaY(datos.Data[i + 1].Valor);
      }
      return escalaY(d.Valor);
    })
    .attr("stroke", color)
    .attr("stroke-width", 3)
    .style("opacity", 0.3);

  // Agregar texto solo al último punto de la línea
    
  lineasGroup
    .append("text")
    .attr("class", `texto-${posicion}`)
    .attr("x", escalaX(new Date(datos.Data[0].Fecha)))
    .attr("y", escalaY(datos.Data[0].Valor)) // Ajusta la posición vertical del texto
    .attr("dx", 10)
    .text(datos.MetaData.find(
      (meta) =>
        meta.Variable.Nombre === "Comunidades y Ciudades Autónomas" ||
        meta.Variable.Nombre === "Total Nacional"
    ).Nombre) // El texto que se mostrará
    .style("fill", color);
    
  // EVENTOS
  lineas
    .on("mouseover", function (d, i, nodes) {
      // Resaltar todas las líneas al pasar el cursor
      lineas.style("opacity", 1).attr("stroke-width", 3);

      // Crear y mostrar el círculo en el punto específico
      svg
        .append("circle")
        .attr("r", 4)
        .attr("cx", escalaX(new Date(d.Fecha)))
        .attr("cy", escalaY(d.Valor))
        .attr("fill", color);
      
      pintarTooltip(d);
      
    })
    .on("mouseout", function (d, i, nodes) {
      // Restaurar la opacidad de todas las líneas
      lineas.style("opacity", 0.3).attr("stroke-width", 3);

      // Eliminar el círculo al retirar el cursor
      svg.selectAll("circle").remove();
      
      borrarTooltip();
    });
    
}

    
    /* Funciones para gestionar los Tooltips */
function borrarTooltip(){
         tooltip.style("display", "none");
    };
    
function pintarTooltip(d){
        tooltip.text(formatoFechaEnEspanol(new Date(d.Fecha))+": "+d.Valor+" %")
               .style ("top", d3.event.pageY + "px")
               .style ("left", d3.event.pageX + 5+ "px")
               // Para que la aparición no se brusca
               //.transition()
               .style("opacity",1)
               .style("display", "block");
    }
    
    
  // Función para ocultar líneas
  function ocultarLineas(posicion) {
    // Elimina todas las líneas del checkbox específico
    svg.selectAll(`.lineas-${posicion}`).remove();
    svg.selectAll(`.texto-${posicion}`).remove();
  }

  // Itera a través de tus datos y dibuja checkboxes para cada conjunto de datos
  datos_tot.forEach((datos, i) => {
    dibujarCheckbox(datos, i);
  });
});
