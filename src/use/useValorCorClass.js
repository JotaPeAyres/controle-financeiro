export function useValorCorClass(valor) {
  if(valor > 0) return 'text-positive'
  else if(valor < 0) return 'text-negative'  
  else return 'text-grey-6'
}