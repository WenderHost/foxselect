import React, { Component } from 'react';

import PartSelector from './components/PartSelector';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import sampleCart from './sample-cart';
import logo from './logo.svg';

// Server Communication
import axios from 'axios';
import { API_ROOT, API_ENV } from './api-config';

class App extends Component {
  constructor(){
    super();

    this.validateUser = this.validateUser.bind(this);
    this.loadPart = this.loadPart.bind(this);
    this.loadSampleCart = this.loadSampleCart.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
    this.setCurrentView = this.setCurrentView.bind(this);
    this.setPartNumber = this.setPartNumber.bind(this);
    this.isPartConfigured = this.isPartConfigured.bind(this);
    this.resetConfiguredPart = this.resetConfiguredPart.bind(this);
    this.updateCart = this.updateCart.bind(this);
    this.updateConfiguredPart = this.updateConfiguredPart.bind(this);
    this.updateOptions = this.updateOptions.bind(this);

    // initial state
    this.state = {
      cart: {},
      currentView: 'PartSelector',
      configuredPart: {
        product_type: {value: '_', label: ''},
        frequency: {value: '0.0', label: ''},
        frequency_unit: {value: 'MHz', label: 'frequency_unit'},
        package_type: {value: 'SMD', label: 'package_type'},
        package_option: {value: 'BS', label: 'package_option'},
        size: {value: '_', label: ''},
        stability: {value: '_', label: ''},
        load: {value: '_', label: ''},
        optemp: {value: '_', label: ''},
        number: {value: '_________', label: '_________'}
      },
      partOptions: {
        frequency: [
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
        ],
        size: [],
        stability: [],
        load: [],
        optemp: []
      },
      aecq200: {
        parts: ['C','K','O'],
        sizes: ['1','2','3','4','5','6','7','122','12A','122,12A','12A,122','13A','135','13L','13A,135,13L','135,13A,13L','13A,13L,135','13L,13A,135','135,13L,13A','13L,135,13A']
      },
      availableParts: 'n/a'
    };
  }

  /**
   * Logs out a user from the app
   */
  logoutUser(){
    localStorage.removeItem('userData');
    this.setCurrentView('Checkout');
  }

  /**
   * Validates a user
   *
   * @param      {string}  username  The username
   * @param      {string}  password  The password
   */
  validateUser(username,password){
    const { wpvars } = window;

    if( typeof wpvars !== 'undefined' ){
      console.log('wpvars.root = ' + wpvars.root );
    } else {
      console.log('wpvars is `undefined`.');
    }
    let request = `${wpvars.root}${wpvars.authroute}`
    console.log('request = ' + request )
    axios.post(request,{
        username: username,
        password: password
      })
      .then(response => {
        console.log('Saving userData to `localStorage`...');
        localStorage.setItem('userData', JSON.stringify( response.data ) );
        this.setCurrentView('Checkout');
      })
      .catch(error => console.log(error))
  }

  /**
   * Loads a part into the PartSelector.
   *
   * @param      {string}   id    The Cart part item ID
   * @return     {null}
   */
  loadPart = (id) => {
    let cart = this.state.cart;
    let part = JSON.parse(JSON.stringify(cart[id])); // deep clone the `part` obj, Object.assign() doesn't clone all the way down if properties are objects themselves
    part.cart_id = id; // Add `cart_id` so we can check in PartSelector if configuredPart === cart[cart_id] (i.e. both vars reference the same object)
    this.setState({configuredPart: part, currentView: 'PartSelector'});
    this.updateOptions( null, part );
  }

  /**
   * Loads sample data into the shopping cart
   */
  loadSampleCart = () => {
    this.setState({ cart: sampleCart, currentView: 'ShoppingCart' });
  }

  /**
   * Sets the current view.
   *
   * @param      {string}  view    A string defining the current view
   */
  setCurrentView(view){
    let viewObj = {currentView: view};

    switch(view){

      case 'PartSelector':
        this.resetConfiguredPart();
        break;

      case 'UpdateCartPart':
        const { cart, configuredPart } = this.state;
        const cart_id = configuredPart.cart_id;
        delete configuredPart.cart_id;
        console.log('configuredPart after deleting cart_id:');
        console.log(configuredPart);
        cart[cart_id] = configuredPart;
        viewObj = {cart: cart, currentView: 'ShoppingCart'};
        break;

      default:
        // nothing

    }
    this.setState(viewObj);
  }

  /**
   * Generates a Fox Part number from configuredPart
   *
   * @param      {object}  configuredPart  The configured part
   */
  setPartNumber(){
    let { configuredPart } = {...this.state};

    if( '_' === configuredPart.product_type.value){
      configuredPart.number = {value: '_________', label: '_________'};
      return;
    }

    let product_family = {value: '', label: ''};
    if( -1 < configuredPart.size.value.indexOf(',') ){
      let label = '_'

      switch(configuredPart.product_type.value){
        case 'K':
          label = '___'
          break;

        default:
          console.log('[NOTE] `Size` contains a comma. Setting size.label to default: `_`.')
      }
      product_family.label = 'F' + configuredPart.product_type.value + label
      product_family.value = 'F' + configuredPart.product_type.value + '[' + configuredPart.size.value + ']'
    } else {
      product_family.label = 'F' + configuredPart.product_type.value + configuredPart.size.value
      product_family.value = 'F' + configuredPart.product_type.value + configuredPart.size.value
    }

    configuredPart.number = {value: product_family.value, label: product_family.label}

    let partNumberProperties = [];
    switch(configuredPart.product_type.value){
      case 'C':
        partNumberProperties = ['package_option','tolerance','stability','load','optemp'];
        break;

      case 'K':
        partNumberProperties = ['tolerance','stability','optemp'];
        break;

      case 'O':
        partNumberProperties = ['output','voltage','stability','optemp'];
        break;

      case 'S':
        partNumberProperties = ['enable_type','voltage','spread','optemp'];
        break;

      case 'T':
        partNumberProperties = ['output','pin_1','voltage','stability','optemp'];
        break;

      case 'Y':
        partNumberProperties = ['output','voltage','stability','optemp'];
        break;

      default:
        console.log('[WARNING] No Part Number pattern specified for product_type `' + configuredPart.product_type.value + '`');
    }
    for (var i = 0; i < partNumberProperties.length; i++) {
      let property = partNumberProperties[i];
      if( configuredPart.hasOwnProperty(property)
          && '' !== configuredPart[property]
          /*&& ! configuredPart[property].value.indexOf(',')*/
          /*&& ( typeof configuredPart[property].display === 'undefined' || configuredPart[property].display === true )*/
      ){
        if( -1 < configuredPart[property].value.indexOf(',') ){
          console.log('We found a comma in: `' + configuredPart[property].value + '`')
          configuredPart.number.value += '[' + configuredPart[property].value + ']'
          configuredPart.number.label += '_' // TODO: Set this to the corresponding # of underscorces
        } else {
          configuredPart.number.value += configuredPart[property].value;
          configuredPart.number.label += configuredPart[property].value;
        }
      } else {
        let value = '';
        switch(property){
          case 'package_option':
            value = ( 'Pin-Thru' === configuredPart.package_type.value )? '' : '__';
            break;
          case 'output':
            value = ('T' === configuredPart.product_type.value)? '_' : '__';
            break;
          default:
            value = '_';
        }
        configuredPart.number.value += value;
        configuredPart.number.label += value;
      }
    }
    configuredPart.number.value += '-' + configuredPart.frequency.value;
    configuredPart.number.label += configuredPart.frequency.value;
    this.setState({configuredPart: {number: configuredPart.number}});
  }

  /**
   * Determines if a part is configured.
   *
   * @param      {object}   configuredPart  The part to check
   * @return     {boolean}  True if part configured, False otherwise.
   */
  isPartConfigured(configuredPart){
    let isConfigured = true;
    const { availableParts } = this.state;
    if( 0 === availableParts )
      isConfigured = false;

    if( typeof configuredPart.product_type === 'undefined' ||  0 === configuredPart.product_type.value.length || '_' === configuredPart.product_type.value )
      isConfigured = false;

    if( typeof configuredPart.frequency === 'undefined' || 0 === configuredPart.frequency.value.length || '_' === configuredPart.frequency.value || '0.0' === configuredPart.frequency.value )
      isConfigured = false;

    if( typeof configuredPart.size === 'undefined' || 0 === configuredPart.size.value.length || '_' === configuredPart.size.value.substring(0,1) )
      isConfigured = false;

    if( typeof configuredPart.optemp === 'undefined' || 0 === configuredPart.optemp.value.length || '_' === configuredPart.optemp.value )
      isConfigured = false;

    if( typeof configuredPart.product_type !== 'undefined' ){
      switch(configuredPart.product_type.value){
        case 'C':
          if( typeof configuredPart.tolerance === 'undefined' || 0 === configuredPart.tolerance.value.length || '_' === configuredPart.tolerance.value )
            isConfigured = false;

          if( typeof configuredPart.load === 'undefined' || 0 === configuredPart.load.value.length || '_' === configuredPart.load.value )
            isConfigured = false;

          if( typeof configuredPart.stability === 'undefined' || 0 === configuredPart.stability.value.length || '_' === configuredPart.stability.value )
            isConfigured = false;
          break;

        case 'K':
          if( typeof configuredPart.tolerance === 'undefined' || 0 === configuredPart.tolerance.value.length || '_' === configuredPart.tolerance.value )
            isConfigured = false;
          if( typeof configuredPart.stability === 'undefined' || 0 === configuredPart.stability.value.length || '_' === configuredPart.stability.value )
            isConfigured = false;
          break

        case 'O':
        case 'Y':
          if( typeof configuredPart.output === 'undefined' || 0 === configuredPart.output.value.length || 0 <= configuredPart.output.value.indexOf('_') )
            isConfigured = false;

          if( typeof configuredPart.voltage === 'undefined' || 0 === configuredPart.voltage.value.length || '_' === configuredPart.voltage.value )
            isConfigured = false;

          if( typeof configuredPart.stability === 'undefined' || 0 === configuredPart.stability.value.length || '_' === configuredPart.stability.value )
            isConfigured = false;
          break;

        case 'S':
          if( typeof configuredPart.enable_type === 'undefined' || 0 === configuredPart.enable_type.value.length || '_' === configuredPart.enable_type.value )
            isConfigured = false;
          if( typeof configuredPart.voltage === 'undefined' || 0 === configuredPart.voltage.value.length || '_' === configuredPart.voltage.value )
            isConfigured = false;
          if( typeof configuredPart.spread === 'undefined' || 0 === configuredPart.spread.value.length || '_' === configuredPart.spread.value )
            isConfigured = false;
          break;

        case 'T':
            if( typeof configuredPart.output === 'undefined' || 0 === configuredPart.output.value.length || '__' === configuredPart.output.value )
            isConfigured = false;

          if( typeof configuredPart.voltage === 'undefined' || 0 === configuredPart.voltage.value.length || '_' === configuredPart.voltage.value )
            isConfigured = false;

          if( typeof configuredPart.pin_1 === 'undefined' || 0 === configuredPart.pin_1.value.length || '_' === configuredPart.pin_1.value )
            isConfigured = false;
          break

        default:
          // nothing
      }
    }

    return isConfigured;
  }

  /**
   * Updates the shopping cart
   *
   * @param      {string}  action  The action (add|delete)
   * @param      {string}  id      The Id of the part in the cart
   */
  updateCart(action, id, option = '', value = ''){
    let cart = { ...this.state.cart };
    switch(action){
      case 'add':
        let savedPart = {...this.state.configuredPart };
        // 2. Add to the cart
        const timestamp = Date.now();
        cart[`part-${timestamp}`] = savedPart;

        // set state
        this.setState(
          {cart, currentView: 'ShoppingCart'},
          () => this.resetConfiguredPart()
        )
        break;

      case 'delete':
        if( window.confirm('You wish to remove this item (' + cart[id].number.value + ') from your cart?') ){
          if( cart.hasOwnProperty(id) ){
            delete cart[id];
            this.setState({cart})
          }
        }
        break;

      case 'update':
        let part = cart[id];
        if(typeof part.options === 'undefined')
          part.options = {};
        part.options[option] = value;
        //console.log('updateCart: value = ' + value);
        cart[id] = part;
        this.setState({cart});
        break;

      default:
        console.log('updateCart: No action defined for `' + action + '`.')
    }
  }

  /**
   * Updates the `configuredPart`
   *
   * @param      {str}    attribute  The configuredPart attribute
   * @param      {obj}    option     The attribute object: {value: '', label: ''}
   * @param      {bool}   delay       If `true`, don't update state
   */
  updateConfiguredPart( attribute, option, delay = false ){
    console.log('[updateConfiguredPart] delay = ' + delay + '; updating `'+attribute+'` to :',option)

    const { configuredPart, aecq200 } = this.state
    const originalConfiguredPart = configuredPart
    const currentValue = (typeof configuredPart[attribute] !== 'undefined')? configuredPart[attribute].value : ''

    // Account for option = `null`
    if( ! option ){
      option = {value: '', label: ''};
    }
    // Ensure `option` is [object]
    if ( typeof option !== 'object' ){
      option = {value: option, label: option};
    }

    if( '' === option.value )
      option.value = '_';

    // `product_type` has changed, reset the configuredPart
    if( 'product_type' === attribute && option.value !== currentValue ){
      //this.setPartNumber();
      this.resetConfiguredPart(option); //configuredPart,option.value
      return;
    }

    // if `package_type` has changed, reset AdditionalOptions
    if( 'package_type' === attribute && option.value !== currentValue ){
      const resetOptions = {
        size: {value: '___', label: ''},
        stability: {value: '_', label: ''},
        optemp: {value: '_', label: ''},
        tolerance: {value: '_', label: ''},
        package_option: {value: '', label: ''}
      };
      if( 'C' === configuredPart.product_type.value )
        resetOptions.load = {value: '_', label: ''}

      if( 'Pin-Thru' === option.value ){
        resetOptions.size = {value: '___', label: ''};
        resetOptions.package_option = {value: '', label: 'package_option'};
      } else {
        resetOptions.size.label = '';
        resetOptions.size.value = ( 'K' === configuredPart.product_type.value )? '___' : '_';
        resetOptions.package_option = {value: '__', label: 'package_option'};
      }
      Object.keys(resetOptions).map(function(key,index){
        configuredPart[key] = resetOptions[key];
        return null;
      })
    }

    // if `frequency_unit` has changed, reset AdditionalOptions
    if( 'frequency_unit' === attribute && option.value !== currentValue ){
      switch(configuredPart.product_type.value){
        case 'C':
          console.log("[RESETING:Crystal] We're switching from MHz to kHz. We need to:\n - Set `product_type` = K\n - Set frequency to 32.768 kHz\n - Set size to 3 chars\n - Delete `load` from configuredPart");
          configuredPart.product_type.value = 'K'
          configuredPart.frequency = {value: '32.768', label: '32.768'}
          configuredPart.size = {value: '___', label: ''}
          delete configuredPart.load
          break;

        case 'K':
          console.log('[RESETTING:Crystal] Toggling from kHz to MHz.');
          configuredPart.product_type.value = 'C'
          configuredPart.frequency = {value: '0.0', label: ''}
          configuredPart.load = {value: '_', label: ''}
          break;

        case 'O':
          console.log('No reset written for Oscillators when toggling MHz/kHz.');
          break;

        default:
          console.log('No reset written for `' +  configuredPart.product_type.label + '` when toggling MHz/kHz.');
      }
    }

    // Set frequency to a number
    if( 'frequency' === attribute && 0 < option.value.length ){
      if( 0 === option.value.indexOf('.') ){
        option.value = '0' + option.value;
      } else if( 0 < option.value.indexOf('.') ){
        // nothing; We found a decimal in value. Value is fixed already.
      } else if( '_' === option.value ){
        // No frequency, (We may one to RESET the part here:)
        option.value = '0.0';
      } else {
        option.value = parseInt(option.value,10).toFixed(1);
      }
    }

    // Oscillators: When Voltage is `null`, reset Output when size >= 3
    /*
    if( 'voltage' === attribute && '_' === option.value ){
      if( 3 <= configuredPart.size.value ){
        console.log("[RESETING:Output] Conditions:\n - 3 <= configuredPart.size.value")
        configuredPart.output = {value: '__', label: ''}
      }
    }
    /**/
    // Voltage rules
    if( 'voltage' === attribute ){
      switch( configuredPart.size.value ){
        case '3':
        case '5':
        case '7':
          if( 'K' === option.value || 'M' === option.value )
            configuredPart.output = {value: 'HS', label: 'HCMOS'}
          break

        default:
          // nothing
      }
    }

    // Oscillators: When Output is `null`, reset Voltage && '_' === option.value.substring(0,1)
    if( 'output' === attribute && '_' === option.value.substring(0,1) ){
      console.log("[RESETTING:Voltage] Conditions:\n - Output is empty.");
      configuredPart.voltage = {value: '_', label: ''}
    }

    // Don't update if value hasn't changed
    if( option.value === currentValue )
      return;

    // Update the value of our part attribute
    configuredPart[attribute] = option;

    // Size Rules
    if( 'size' === attribute ){
      switch(configuredPart.product_type.value){
        case 'C':
          if( 'Pin-Thru' === configuredPart.package_type.value ){
            if( '_' === option.value )
              option.value = '___'
          } else if( 3 === option.value.length ){ // no package_option when size is 3 chars
            configuredPart.package_option.value = ''
          } else if( 0 < option.value.length && aecq200.sizes.includes(option.value) && configuredPart.package_option.value === 'BA' ){
            // do nothing
          } else if( 0 < option.value.length && ! aecq200.sizes.includes(option.value) ){
            configuredPart.package_option.value = ( '_' !== option.value )? 'BS' : '__'
          } else {
            configuredPart.package_option.value = ( '_' !== option.value )? 'BS' : '__'
          }
          break;

        case 'K':
          if( -1 < option.value.indexOf(',') ){
            console.log('Size value has a comma. updateConfiguredPart() setting Size to default:')
            // The first two chars of the size will determine the default (i.e. 12 or 13):
            const currentSize = option.value.substring(0,2)
            switch(currentSize){
              case '12':
                configuredPart.size = {value: '122', label: '2.0x1.2 mm'}
                break

              case '13':
                configuredPart.size = {value: '135', label: '3.2x1.5 mm'}
                break

              default:
                // nothing
            }
          } else if( 3 > option.value.length && '_' === option.value.substring(0,1) ){
            // Default size value for kHz-Crystal-SMD is three underscores
            option.value = '___'
          }
          break

        default:
          // When we are changing the `size`, reset the package_option to the default: `BS`
          console.log('No size rules for product_type = `' + configuredPart.product_type.value + '`');
      }
    }

    if( ! delay ){
      this.setPartNumber(); // configuredPart
      this.setState({configuredPart: configuredPart});
      this.updateOptions( originalConfiguredPart, configuredPart );
    }
  }

  /**
   * Updates this.state.partOptions with data returned from the REST API
   *
   * @param      {object}  originalConfiguredPart  The original configured part
   * @param      {object}  configuredPart          The configured part
   */
  updateOptions( originalConfiguredPart, configuredPart ){
    if( typeof configuredPart.number.value === 'undefined' || '_________' === configuredPart.number.value || '_' === configuredPart.product_type.value )
      return

    console.log('updateOptions('+configuredPart.number.value+')')

    if( 'salesforce' === API_ENV ){
      const { dataService } = this.props;
      dataService.setPartNumber( configuredPart.number.label )
    }

    axios
      .get(`${API_ROOT}${configuredPart.number.value}/${configuredPart.package_type.value}/${configuredPart.frequency_unit.value}`)
      .then(response => {
        //console.log('Axios request returned...');
        //console.log(response.data);

        const { partOptions } = this.state;
        const { availableParts } = response.data;

        var forceUpdate = false;
        if( null === originalConfiguredPart ){
          forceUpdate = true;
        } else {
          if( originalConfiguredPart.frequency.value !== configuredPart.frequency.value || '0.0' === configuredPart.frequency.value )
            forceUpdate = true;

          if( originalConfiguredPart.size.value !== configuredPart.size.value )
            forceUpdate = true;
        }

        const allowedOptions = ['size','tolerance','stability','voltage','output','load','optemp','pin_1','enable_type','spread'];
        for (var i = allowedOptions.length - 1; i >= 0; i--) {
          var option = allowedOptions[i];
          if( typeof response.data.partOptions[option] !== 'undefined' || true === forceUpdate )
            partOptions[option] = response.data.partOptions[option];
        }

        this.setState({partOptions: partOptions, availableParts: availableParts});
      })
      .catch(error => console.log(error))
  }

  /**
   * Resets ${configuredPart} with `_` for all properties
   *
   * @param      {object}  configuredPart   The configured part
   * @param      {object}  product_type The `product_type` we're switching to
   */
  resetConfiguredPart(product_type){ // configuredPart, new_product_type
    if(typeof product_type === 'undefined')
      product_type = {value: '_', label: ''}

    const resetPart = {
      product_type: product_type,
      frequency: {value: '0.0', label: ''},
      frequency_unit: {value: 'MHz', label: 'MHz'},
      package_type: {value: 'SMD', label: 'SMD'},
      package_option: {value: 'BS', label: ''},
      size: {value: '_', label: ''},
      stability: {value: '_', label: ''},
      load: {value: '_', label: ''},
      optemp: {value: '_', label: ''},
      number: {value: 'F' + product_type.value + '_______-0.0', label: 'F' + product_type.value + '_______0.0'}
    }

    switch(product_type.value){
      case 'C':
        delete resetPart.voltage;
        delete resetPart.output;
        resetPart.tolerance = {value: '_', label: ''};
        resetPart.package_option = {value: '__', label: ''};
      break;

      case 'O':
        delete resetPart.tolerance;
        delete resetPart.package_option;
        delete resetPart.load;
        resetPart.voltage = {value: '_', label: ''};
        resetPart.output = {value: '__', label: ''};
      break;

      case 'S':
        resetPart.enable_type = {value: '_', label: ''};
        resetPart.voltage = {value: '_', label: ''};
        resetPart.spread = {value: '_', label: ''};
        break;

      case 'T':
        delete resetPart.load;
        resetPart.voltage = {value: '_', label: ''};
        resetPart.output = {value: '_', label: ''};
        resetPart.pin_1 = {value: '_', label: ''};
        break;

      case 'Y':
        delete resetPart.load;
        resetPart.voltage = {value: '_', label: ''};
        resetPart.output = {value: '_', label: ''};
        break;

      default:
    }

    this.setState(
      {configuredPart: resetPart, availableParts: 'n/a'},
      () => this.updateOptions( resetPart, resetPart )
    );
  }

  render() {
    const { aecq200, configuredPart, partOptions, availableParts, cart, currentView } = this.state;
    const editing = cart.hasOwnProperty(configuredPart.cart_id);
    const testLink = API_ROOT + configuredPart.number.value + '/' + configuredPart.package_type.value + '/' + configuredPart.frequency_unit.value;
    var cartKeys = Object.keys(cart);
    var partsInCart = cartKeys.length;

    const userData = JSON.parse( localStorage.getItem('userData') );

    let thisView = '';
    // Originally a prop of PartSelector below:
    // resetConfiguredPart={this.resetConfiguredPart}
    switch( currentView ){
      case 'Checkout':
        thisView = <Checkout
          validateUser={this.validateUser}
          logoutUser={this.logoutUser}
        />
        break;

      case 'ShoppingCart':
        thisView = <ShoppingCart
          cart={cart}
          setCurrentView={this.setCurrentView}
          partsInCart={partsInCart}
          loadPart={this.loadPart}
          updateCart={this.updateCart}
        />
        break;

      default:
        thisView = <PartSelector
          addPart={this.addPart}
          cart={cart}
          configuredPart={configuredPart}
          aecq200={aecq200}
          editing={editing}
          isPartConfigured={this.isPartConfigured}
          partOptions={partOptions}
          updateConfiguredPart={this.updateConfiguredPart}
          updateCart={this.updateCart}
          updateOptions={this.updateOptions}
          setCurrentView={this.setCurrentView}
        />
    }

    let buttonText = 'Return to Quote';
    if( typeof configuredPart.cart_id !== 'undefined' && configuredPart.number.value !== cart[configuredPart.cart_id].number.value )
      buttonText = 'Update Part'

    let buttonClass = ( this.isPartConfigured(configuredPart) )? 'btn-primary' : 'btn-secondary'
    buttonClass = buttonClass + ' btn btn-sm'

    return (
      <div className="container">
        { ( 'web' === API_ENV ) &&
        <div className="row no-gutters">
          <div className="col-md-3">
            <h1 className="title">
              <img src={logo} alt="FOXSelect™" />
              { typeof userData !== 'undefined' && null !== userData &&
              <small style={{fontSize: '14px', display: 'block'}}>User: <em>{userData.user_display_name}</em></small> }
            </h1>
          </div>
          <div className="col-md-2" style={{textAlign: 'right'}}>
            { 'PartSelector' === currentView &&
              <p>Configured Part:&nbsp;<br />Available Parts:&nbsp;</p>
            }
          </div>
          <div className="col-md-2">
            { 'PartSelector' === currentView &&
            <p>{ ( configuredPart.number.value )? <code><a href={testLink} target="_blank" style={{color: '#666'}}>{configuredPart.number.label}</a></code> : null }<br/><code>{availableParts}</code></p>
            }
          </div>
          <div className="col-md-5 text-right">
            { 'ShoppingCart' !== currentView &&
            <p>Parts in Cart: <code>{partsInCart}</code> <button disabled={editing} type="button" className="btn btn-primary btn-sm" name="checkout" onClick={() => this.setCurrentView('ShoppingCart')}>View RFQ</button>
              { 0 === Object.keys(cart).length && cart.constructor === Object &&
                <span>
                  <br/>
                  <button style={{marginTop: '4px'}} className="btn btn-secondary btn-sm" name="load-samples" type="button" onClick={this.loadSampleCart}>Load Sample Parts</button>
                </span>
              }
            </p> }
          </div>
        </div> }
        <hr style={{marginTop: '0'}} />
        { editing &&
          'PartSelector' === currentView &&
          <div className="alert alert-warning">
            <div className="row">
              <div className="col-10" style={{alignSelf: 'center'}}><strong>NOTE:</strong> <em>You are editing a part in your RFQ.</em> If you wish to configure a new part, <a href="/select-a-new-part/" onClick={(e) => {e.preventDefault();this.setCurrentView('PartSelector')}}>click here</a>.</div>
              <div className="col-2 text-right">
                <button type="button" className={buttonClass} disabled={! this.isPartConfigured(configuredPart) } onClick={(e) => {e.preventDefault();this.setCurrentView('ShoppingCart')}}>{buttonText}</button>
              </div>
            </div>
          </div> }
        {thisView}
      </div>
    );
  }
}

export default App;