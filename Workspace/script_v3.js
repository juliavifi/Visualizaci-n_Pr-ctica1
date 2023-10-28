console.log("Cargando fichero script_v2.js")
// Datos de ejemplo en formato JSON
d3.json ("parados_edad_com_t.json").then (function (datosCompletos){
    
console.log("Datos cargados parados.js")
console.log(datosCompletos);
    
//Selección de variables
    
function filtrar(VariableNombre, Nombre ,datos){
    const subconj=[];
    datos.forEach(function (d){
            const Filtro=d.MetaData.find(meta=> (meta.Variable.Nombre === VariableNombre));
 
        if (Filtro && Filtro.Nombre === Nombre){
        subconj.push(d);} 
    });
    return subconj};
    
 datos_tot = filtrar('Sexo','Ambos sexos',filtrar('Totales de edad', 'Total', datosCompletos));
    
console.log(datos_tot);
    
// Configuración del gráfico
const width = 1000;
const height = 600;
const margin = { 
    left: 50,
    right: 10,
    top: 20,
    bottom: 50
 };

    
// Crear el contenedor SVG
const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    
// Obtener las fechas mínima y máxima de tus datos
const maxDate = d3.max(datos_tot[0].Data, d => d.Fecha);
const minDate = d3.min(datos_tot[0].Data, d => d.Fecha);
    
// Define las escalas para los ejes X e Y
const xScale = d3.scaleTime()
                .domain([new Date(minDate), new Date(maxDate)])// Asegúrate de crear objetos Date
                .range([0+margin.left, width-margin.right]);
    
    
const yScale = d3.scaleLinear()
    .domain([0, 40])
    .range([height - margin.bottom, 0 + margin.top]);


// Define una escala de colores
const colorScale = d3.scaleOrdinal(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5", "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5"]);  
    
    

const mesesEnEspanol = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

// Función personalizada para formatear la fecha con nombres de meses abreviados en español
function formatoFechaEnEspanol(d) {
  const mes = mesesEnEspanol[d.getMonth()]; // Obtiene el nombre del mes en español
  const año = d.getFullYear(); // Obtiene el año
  return mes + " " + año.toString(); // Combina el mes y el año
}

var ejeX = d3.axisBottom(xScale)
  .ticks(12)
  .tickFormat(formatoFechaEnEspanol); // Utiliza la función de formato personalizada
    
svg.append("g")
    .attr("transform","translate (0," + (height - margin.bottom)+ ")")
    .call(ejeX)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
        return "rotate(-45)";
    });
    
    

var ejeY = d3.axisLeft (yScale)
    .ticks(10);
    
svg.append("g")
        .attr("transform","translate (" + margin.left + ",0)")
        .call(ejeY)
    
    
    
    
// Crear un objeto para llevar un seguimiento del estado de los botones
const estadoBotones = {};
    
function dibujarBoton(datos, posicion) {
  const color = colorScale(posicion); // Obtén un color único para este botón
  const button = document.createElement("button");
  button.textContent = Comunidad=datos.MetaData.find(meta=> (meta.Variable.Nombre === 'Comunidades y Ciudades Autónomas') || (meta.Variable.Nombre === 'Total Nacional')).Nombre;
    
    

button.addEventListener("click", () => {
      // Verifica si el botón ya está en el estado de visibilidad
  const visible = estadoBotones[posicion] === true;
    
    if (estadoBotones[posicion]) {
      // Si las líneas están visibles, ocúltalas
      ocultarLineas(datos);
    // Actualiza el estado del botón
        estadoBotones[posicion] = false
    } else {
      // Si las líneas no están visibles, muéstralas
      mostrarLineas(datos, xScale, yScale, color, posicion);
        
        // Actualiza el estado del botón
        estadoBotones[posicion] = true;

    }
  });
    


  // Define la posición del botón en función de la posición
  button.style.position = "absolute";
  button.style.top = `${25 * posicion+ 30}px`; // Ajusta el espaciado vertical
  button.style.left = width+50; // Ajusta la posición horizontal

  // Asigna el color de fondo al botón
  button.style.backgroundColor = color;
  button.style.width = '200px';

  // Agrega el botón al documento
  document.body.appendChild(button);
}
    
    
// Pintamos
    
 
function mostrarLineas(datos, escalaX, escalaY, color, posicion) {
    const lineas = svg.append("g")
        .selectAll("line")
        .data(datos.Data)
        .enter()
        .append("line")
        .attr("class", `lineas-${posicion}`) // Agregar una clase específica
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

    // Crea un círculo oculto
    const circle = svg.append("circle")
        .attr("r", 3)
        .attr("fill", color)
        .style("opacity", 0);

    // EVENTOS
    lineas.on("mouseover", function (d, i, nodes) {
        // Resaltar todas las líneas al pasar el cursor
        lineas.style("opacity", 1).attr("stroke-width", 3);

        // Crear y mostrar el círculo en el punto específico
        svg.append("circle")
            .attr("r", 4)
            .attr("cx", escalaX(new Date(d.Fecha)))
            .attr("cy", escalaY(d.Valor))
            .attr("fill", color);})
    
       .on("mouseout", function (d, i, nodes) {
        // Restaurar la opacidad de todas las líneas
        lineas.style("opacity", 0.3).attr("stroke-width", 3);

        // Eliminar el círculo al retirar el cursor
        svg.selectAll("circle").remove();
    });
}

// Función para ocultar líneas
function ocultarLineas(posicion) {
  // Elimina todas las líneas del botón específico
  svg.selectAll(`.lineas-${posicion}`).remove();
}
    
//dibujarBoton(datos_tot[0], 0);

// Itera a través de tus datos y dibuja botones para cada conjunto de datos
datos_tot.forEach((datos, i) => {
  dibujarBoton(datos, i);
});

                                        

    
//datos_tot.forEach((datos, i) => {
//    dibujarlineas(datos, xScale, yScale, colorScale(i));
//});
//    

    
})
