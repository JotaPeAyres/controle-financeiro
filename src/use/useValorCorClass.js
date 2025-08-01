export function useValorCorClass(tipo) {
  if(tipo === 1) return 'text-positive'
  else if(tipo === 0) return 'text-negative'  
  else return 'text-grey-6'
}

