export function useFormataValor(valor, tipo) {
  let posNegSimbolo = ''
  if(tipo == 1) posNegSimbolo = '+'
  else if(tipo == 0) posNegSimbolo = '-'
  else posNegSimbolo = valor > 0 ? '+' : '-'
  
  const
    simboloMonetario = 'R$',
    valorPositivo = Math.abs(valor),
    valorFormatado = valorPositivo.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })

  return `${ posNegSimbolo } ${ simboloMonetario } ${ valorFormatado }`
}