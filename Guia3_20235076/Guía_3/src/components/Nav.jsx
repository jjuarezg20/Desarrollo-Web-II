
//no pongo la deficnicion directamente del nav, solo le paso los hijos que tiene que renderizar
export const Nav = ({children}) => {
    return (
      <nav className="nav-bar">
        {children}
      </nav>
    )
  }
  //prop Drilling, obtener datos en varias capas,App se lo pasa a nav, nav se lo pasa a search, y asi pasamos componentes de padres a hijos
  // el problema se soluciona con variables de estado que esten disponibles de forma global, pero para este proyecto uysaremos descomposicion de componentes
  
  //decomponerlo en 3: logo, cuadrito de busqueda y muestra de resultados
  //componentes con responsabilidades especificas
  
  //les agrego exporta a las funciones para utilizarlas desde otros archivos
  
export function Logo(){
    return(
      <div className="logo">
        <span role="img">🍿</span>
        <h1>Palomitas de papel</h1>
      </div>
    )
}
  
export function Search({query, setQuery}){
    return(
      <input
        className="search"
        type="text"
        placeholder="Buscar peliculas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    )
}
  
//le paso movies como prop
export function NumResults({movies}){
    return(
      <p className="num-results">
        <strong>{movies.length}</strong> resultados encontrados
      </p>
    )
}
  