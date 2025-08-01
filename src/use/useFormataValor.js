export function useFormataValor(valor) {
  let posNegSimbolo = ''
  if(valor > 0) posNegSimbolo = '+'
  else if(valor < 0) posNegSimbolo = '-'
  
  const
    simboloMonetario = 'R$',
    valorPositivo = Math.abs(valor),
    valorFormatado = valorPositivo.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })

  return `${ posNegSimbolo } ${ simboloMonetario } ${ valorFormatado }`
}