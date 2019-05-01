export const aecq200Options = {
  parts: ['C','K','O'],
  sizes: ['1','2','3','4','5','6','7','122','12A','122,12A','12A,122','13A','135','13L','13A,135,13L','135,13A,13L','13A,13L,135','13L,13A,135','135,13L,13A','13L,135,13A']
}

export const companyTypeOptions = [
  { value: 'Oem', label: 'Oem' },
  { value: 'Cem', label: 'Cem' },
  { value: 'Distributor', label: 'Distributor' },
  { value: 'Rep', label: 'Rep' }
]

export const defaultConfiguredPart = {
  product_type: {value: '_', label: ''},
  frequency: {value: '0.0', label: ''},
  frequency_unit: {value: 'mhz', label: 'MHz'}, // label: frequency_unit -- changed to MHz
  package_type: {value: 'smd', label: 'SMD'},
  package_option: {value: '_', label: ''}, // {value: 'BS', label: 'package_option'},
  size: {value: '_', label: ''},
  stability: {value: '_', label: ''},
  load: {value: '_', label: ''},
  optemp: {value: '_', label: ''},
  number: {value: '_________', label: '_________'}
}

export const frequencyOptions = [
  { value: '3.2', label: '3.2' },
  { value: '3.579', label: '3.579' },
  { value: '3.579545', label: '3.579545' },
  { value: '3.6', label: '3.6' },
  { value: '3.6864', label: '3.6864' },
  { value: '4', label: '4' },
  { value: '6', label: '6' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
  { value: '9.6', label: '9.6' },
  { value: '9.8', label: '9.8' },
  { value: '10', label: '10'},
  { value: '12', label: '12'},
  { value: '14', label: '14'},
  { value: '14.7456', label: '14.7456'},
  { value: '16', label: '16'},
  { value: '20', label: '20'},
  { value: '23.9', label: '23.9'},
  { value: '26', label: '26'},
  { value: '30', label: '30'},
  { value: '98.304', label: '98.304'}
]

export const loadOptions = [
  { value: 'B', label: '6 pF' },
  { value: 'C', label: '4 pF' },
  { value: 'D', label: '8 pF' },
  { value: 'E', label: '10 pF' },
  { value: 'G', label: '12 pF' },
  { value: 'H', label: '12.5 pF' },
  { value: 'J', label: '15 pF' },
  { value: 'K', label: '16 pF' },
  { value: 'L', label: '18 pF' },
  { value: 'M', label: '20 pF' },
  { value: 'N', label: '22 pF' },
  { value: 'P', label: '27 pF' },
  { value: 'Q', label: '30 pF' },
  { value: 'R', label: '32 pF' },
  { value: 'S', label: '33 pF' },
  { value: 'T', label: '50 pF' },
  { value: 'U', label: '13 pF' },
  { value: 'V', label: '7 pF' },
  { value: 'W', label: '9 pF' },
  { value: 'X', label: '14 pF' },
  { value: 'Y', label: '19 pF' }
]

export const productTypeOptions = [
  { value: 'C', label: 'Crystal' },
  { value: 'O', label: 'Oscillator' },
  { value: 'T', label: 'TCXO/VC-TCXO' },
  { value: 'Y', label: 'VCXO' },
  { value: 'S', label: 'SSO' },
]


export const sampleCart = {
  "part-1522960847005": {
    "product_type": {
      "value": "C",
      "label": "Crystal"
    },
    "frequency": {
      "value": "30.0",
      "label": "30"
    },
    "frequency_unit": {
      "value": "MHz",
      "label": "MHz"
    },
    "package_type": {
      "value": "SMD",
      "label": "SMD"
    },
    "package_option": {
      "value": "BS",
      "label": ""
    },
    "size": {
      "value": "0",
      "label": "1.6x1.2 mm"
    },
    "stability": {
      "value": "B",
      "label": "50.0 ppm"
    },
    "load": {
      "value": "E",
      "label": "10 pF"
    },
    "optemp": {
      "value": "M",
      "label": "-40 To +85 C"
    },
    "number": {
      "value": "FC0BSBBEM-30.0",
      "label": "FC0BSBBEM-30.0"
    },
    "tolerance": {
      "value": "B",
      "label": "50.0 ppm"
    },
    "options": {
      "quote": true,
      "sample": true,
      "sampleNo": "20"
    }
  },
  "part-1522960864261": {
    "product_type": {
      "value": "C",
      "label": "Crystal"
    },
    "frequency": {
      "value": "45.0",
      "label": "45",
      "className": "Select-create-option-placeholder"
    },
    "frequency_unit": {
      "value": "MHz",
      "label": "MHz"
    },
    "package_type": {
      "value": "SMD",
      "label": "SMD"
    },
    "package_option": {
      "value": "BA",
      "label": "BA"
    },
    "size": {
      "value": "3",
      "label": "3.2x2.5 mm"
    },
    "stability": {
      "value": "D",
      "label": "25.0 ppm"
    },
    "load": {
      "value": "E",
      "label": "10 pF"
    },
    "optemp": {
      "value": "M",
      "label": "-40 To +85 C"
    },
    "number": {
      "value": "FC3BADDEM-45.0",
      "label": "FC3BADDEM-45.0"
    },
    "tolerance": {
      "value": "D",
      "label": "25.0 ppm"
    },
    "options": {
      "quote": true
    }
  },
  "part-1522960883611": {
    "product_type": {
      "value": "C",
      "label": "Crystal"
    },
    "frequency": {
      "value": "90.0",
      "label": "90",
      "className": "Select-create-option-placeholder"
    },
    "frequency_unit": {
      "value": "MHz",
      "label": "MHz"
    },
    "package_type": {
      "value": "SMD",
      "label": "SMD"
    },
    "package_option": {
      "value": "BA",
      "label": "BA"
    },
    "size": {
      "value": "5",
      "label": "5.0x3.2 mm"
    },
    "stability": {
      "value": "C",
      "label": "30.0 ppm"
    },
    "load": {
      "value": "G",
      "label": "12 pF"
    },
    "optemp": {
      "value": "P",
      "label": "-40 To +105 C"
    },
    "number": {
      "value": "FC5BACCGP-90.0",
      "label": "FC5BACCGP-90.0"
    },
    "tolerance": {
      "value": "C",
      "label": "30.0 ppm"
    }
  }
}

export const stateOptions = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
]