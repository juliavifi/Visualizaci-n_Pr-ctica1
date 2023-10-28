// Datos de ejemplo en formato JSON
const datos = [
    { fecha: "2023-01-01", valor: 100 },
    { fecha: "2023-02-01", valor: 150 },
    { fecha: "2023-03-01", valor: 200 },
    { fecha: "2023-04-01", valor: 120 },
    // Agrega más datos temporales aquí
];

// Configuración del gráfico
const width = 600;
const height = 400;
const margin = { top: 20, right: 30, bottom: 40, left: 40 };

// Crear el contenedor SVG
const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Escalas para ejes X e Y
const xScale = d3.scaleTime()
    .domain(d3.extent(datos, d => new Date(d.fecha)))
    .range([margin.left, width - margin.right]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(datos, d => d.valor)])
    .nice()
    .range([height - margin.bottom, margin.top]);

// Crear líneas para el gráfico
const linea = d3.line()
    .x(d => xScale(new Date(d.fecha)))
    .y(d => yScale(d.valor));

// Dibujar el gráfico de líneas
svg.append("path")
    .datum(datos)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", linea);

// Agregar ejes X e Y
const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%b '%y")));

const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale).ticks(5));

svg.append("g").call(xAxis);
svg.append("g").call(yAxis);

