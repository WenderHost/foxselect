import { aecq200Options } from '../components/data/data';

export function formatFrequency( frequency ){

  var floatFreq = parseFloat( frequency )
  console.log('🔔 [lib/utilities.js] formatFrequency()')
  console.log(`\t• Our (floating) frequency is: `, floatFreq)

  floatFreq = floatFreq.toFixed(6)
  console.log(`\t• Our (floating) frequency.toFixed(6) is: `, floatFreq)
  floatFreq = parseFloat( floatFreq ) // convert back to float so we can use toString to remove zeros
  floatFreq = floatFreq.toString() // remove trailing zeros
  console.log(`\t• Our (floating) frequency.toString() is: `, floatFreq)

  // floatFreq is now a `string`, so we can check to see if it has a decimal (i.e. `.`)
  if( 'NaN' !== floatFreq && -1 === floatFreq.indexOf('.') )
    floatFreq += '.0'
  console.log(`\t• If floatFreq was an interger, we have just added a '.0' to the end. floatFreq = `, floatFreq )

  if( 'NaN' === floatFreq )
    floatFreq = '0.0'

  return floatFreq
}

export function getSizeOptions( configuredPart ){
  const sizeOptions = {
    aecq200: false,
    vibrationResistant: false
  }

  if( typeof configuredPart.size === 'undefined' )
    return sizeOptions

  // AEC-Q200 option
  if(
    aecq200Options.parts.includes(configuredPart.product_type.value)
    && aecq200Options.sizes.includes(configuredPart.size.value)
    && ! ( 'O' === configuredPart.product_type.value && 'kHz' === configuredPart.frequency_unit.value )
  )
    sizeOptions.aecq200 = true

  // `Vibration Resistant` option for C3VR family
  if(
    'C' === configuredPart.product_type.value
    && '3' === configuredPart.size.value
  )
    sizeOptions.vibrationResistant = true

  return sizeOptions
}