import React, { Component } from 'react';
import Select from 'react-select';

class SelectSize extends Component{

  constructor(){
    super();
    this.state = {
      savedSizeOption: {}
    }
  }

  handleChange = (selectedOption) => {
    console.log('selectedOption = ',selectedOption)
    this.setState(
      {savedSizeOption: selectedOption},
      () => this.props.updateConfiguredPart('size',selectedOption)
    );
  }

  render(){
    const { configuredPart, sizeOptions } = this.props;
    const { savedSizeOption } = this.state;
    const size = configuredPart.size;
    let optionValue = size;

    // When we have no size options, set `value` ===
    // the option value that matches our `configuredPart.size`
    if( 0 === sizeOptions.length )
      optionValue = savedSizeOption;

    let backgroundColor = null
    if( 0 === sizeOptions.length && '_' === size.value ){
      backgroundColor = '#eee'
    } else if( 0 === sizeOptions.length && 0 < size.value.length ){
      backgroundColor = 'salmon'
    } else if( 0 < sizeOptions.length && '_' === size.value ){
      // do nothing
    } else if( 0 < sizeOptions.length && '_' !== size.value && 0 < size.value.length ){
      // typically  here we would set the `optionValue` = our stored configuredPart.size
    }

    const customStyles = {
      control: styles => ({...styles, backgroundColor: backgroundColor})
    }

    /**
     * Set size for multi-variat sizes.
     *
     * Consider the following example:
     *
     * - kHz-Crysal-SMD
     * - Size options: 135,13L,13A
     *
     * Whenever we have our API return sizeOptions[0].value = '135,13L,13A'
     * and our configuredPart.size.value === one of those three options,
     * we must set this SizeSelect to match the returned sizeOptions[0].label
     * while updating this SizeSelect's value to be the selected option of
     * the three possible options.
     */
    if( 1 === sizeOptions.length && sizeOptions[0].value.indexOf(',') && -1 === optionValue.value.indexOf(',') && null !== this.state.savedSizeOption ){
      let label = ( typeof savedSizeOption.label !== 'undefined' )? savedSizeOption.label : optionValue.label
      optionValue = { value: optionValue.value, label: label }
    }

    if( null !== optionValue && typeof optionValue.value !== 'undefined' && 0 <= optionValue.value.indexOf('_') )
      optionValue = ''

    /**
     * 04/11/2019 (06:42) - I'm not sure how the following is working with the
     * `value` attribute commented out. When I uncomment it, I get the following
     * Warning when trying to set Size:
     *
     * Warning: A component is changing an uncontrolled input of type hidden to be
     * controlled. Input elements should not switch from uncontrolled to
     * controlled (or vice versa). Decide between using a controlled or
     * uncontrolled input element for the lifetime of the component.
     *
     * Commenting out `value` removes the above error. Curiously, I don't get an
     * error about `optionValue` not being used, and the size select keeps getting
     * set correctly.
     */

    return(
      <div>
        <label htmlFor="size">Size</label>
        <Select
          name="size"
          /*value={optionValue}*/
          isClearable
          onChange={this.handleChange}
          placeholder="Size..."
          autoBlur={true}
          matchPos="start"
          options={sizeOptions}
          styles={customStyles}
        />
      </div>
    );
  };
}

export default SelectSize;