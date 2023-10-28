console.log("Cargando fichero script.js")


d3.json('parados_edad_com_t.json')
  .then(datos => {
    // Solamente para depurar en la Consola para visualizar la variable local como global
    window.datosglobal = datos;
    console.log(datos);
    
    // Nueva section
    d3.select("body").append("h1").text("Mi segundo título con D3");
    
                                                           
    // Vamos a crear la lista
    var elementoUl = d3.select("body").append("ul");
    
    //Posibilidad 1: recorriendo los elementos
    /*datos.forEach(function (d){
        elementoUl.append("li").text(d.partido);        
    });
    */
    
    //////////////////////////////////////////////
    function filtrar(VariableNombre, Nombre ,datos){
    const subconj=[];
    datos.forEach(function (d){
            const Filtro=d.MetaData.find(meta=> (meta.Variable.Nombre === VariableNombre));
 
        if (Filtro && Filtro.Nombre === Nombre){
        subconj.push(d);} 
    });
    return subconj};
    
    subconj = filtrar('Sexo','Ambos sexos',filtrar('Totales de edad', 'Total', datos));
    
    console.log(subconj);
//    
    ////////////////////////////////////////
//    const subconj=[];
//    datos.forEach(function (d){
//            Comunidad=d.MetaData.find(meta=> (meta.Variable.Nombre === 'Comunidades y Ciudades Autónomas') || (meta.Variable.Nombre === 'Total Nacional')).Nombre;
//        
//           RangoEdad=d.MetaData.find(meta=> (meta.Variable.Nombre === 'Semiintervalos de edad') || (meta.Variable.Nombre === 'Grupos de edad')).Nombre;  
//        if (RangoEdad === 'Total'){
//        subconj.push(d);} 
//    });
    
    
    // Posibilidad 2: usando la función enter 
    elementoUl
        .selectAll("li")
        .data(datos) // JOIN
        .enter()
        .append("li")
        // Solo para testear
        //.text("hola")
        .text(function (d) {
        
            Comunidad=d.MetaData.find(meta=> (meta.Variable.Nombre === 'Comunidades y Ciudades Autónomas') || (meta.Variable.Nombre === 'Total Nacional')).Nombre;
        
           RangoEdad=d.MetaData.find(meta=> (meta.Variable.Nombre === 'Totales de edad') || (meta.Variable.Nombre === 'Semiintervalos de edad') || (meta.Variable.Nombre === 'Grupos de edad')).Nombre;   
        
             Sexo=d.MetaData.find(meta=> (meta.Variable.Nombre === 'Sexo')).Nombre; 
            return  Comunidad +' '+  RangoEdad + ' '+ Sexo;
    })
        
        
    
    
    
//        .style("font-size", function (d) { return escalaTamanio(d.votantes); } )
//        .style("color", function (d) { return escalaColor(d.mediaAutoubicacion); })
  })
  .catch(error => {
    console.error('Error al cargar el archivo JSON', error);
  });
