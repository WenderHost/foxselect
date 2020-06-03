import React, { Component, Suspense } from 'react'

// Google Analytics
import ReactGA from 'react-ga'

// Alerts
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'

// Components
import { sampleCart, aecq200Options, defaultConfiguredPart, frequencyOptions } from './components/data/data'
import logo from './logo.svg'

// Server Communication
import WP from './components/WordPressAPI'
import axios from 'axios'
import { API_ROOT, API_ENV, HOSTNAME } from './api-config'

// Initialize Google Analytics
const GAtestMode = ( -1 < process.env.REACT_APP_WPAPI_EP.indexOf('.local') )? true : false
const GAoptions = {}

if( GAtestMode )
  GAoptions.testMode = GAtestMode
//if( GAtestMode )
//  GAoptions.debug = GAtestMode


ReactGA.initialize('UA-5411671-3', GAoptions)

// Lazy load the following components for performance
const Login = React.lazy(() => import('./components/Login'))
const PartSelector = React.lazy(() => import('./components/PartSelector'))
const ShoppingCart = React.lazy(() => import('./components/ShoppingCart'))
const Checkout = React.lazy(() => import('./components/Checkout'))

class App extends Component {
  constructor(){
    super()

    // initial state
    this.state = {
      cart: {},
      currentView: '',
      configuredPart: defaultConfiguredPart,
      checkExternalConfiguredPart: true,
      partOptions: {
        frequency: frequencyOptions,
        size: [],
        stability: [],
        load: [],
        optemp: []
      },
      loadingPartOptions: false,
      availableParts: 'n/a',
      user: null,
      rfq: {
        project_name: '',
        project_description: '',
        shipping_address: {
          company: '',
          contact: '',
          street: '',
          city: '',
          state: '',
          zip: ''
        },
        prototype_date: new Date(),
        production_date: new Date(),
        distys: []
      }
    };
  }

  /**
   * Called after this component has been rendered for the first time
   */
  componentDidMount(){
    this.hydrateStateWithLocalStorage();

    // Event listening for:
    //
    // - Saving cart to localStorage
    // - Saving RFQ to localStorage
    // - Saving currentView to localStorage
    //
    // Saving the above to localStorage allows us to
    // persist the app's state across refreshing or
    // leaving the app.
    window.addEventListener(
      'beforeunload',
      this.saveStateToLocalStoreage.bind(this)
    )

    this.updateFirstPartOption()
  }

  componentWillUnmount(){
    window.removeEventListener(
      'beforeunload',
      this.saveStateToLocalStoreage.bind(this)
    )

    // Saves if component has a chance to unmount
    this.saveStateToLocalStoreage()
  }

  /**
   * Saves various parts of our State to local storage.
   */
  saveStateToLocalStoreage(){
    if( this.state.cart )
      localStorage.setItem('foxselect-cart', JSON.stringify( this.state.cart ) )
    if( this.state.rfq )
      localStorage.setItem('foxselect-rfq', JSON.stringify( this.state.rfq ) )
    if( this.state.currentView )
      localStorage.setItem('foxselect-currentview', this.state.currentView );
  }

  /**
   * Load the following from the browser's localStorage
   *
   *  - userData
   *  - FOXSelect Cart
   *  - FOXSelect RFQ
   *  - currentView
   */
  hydrateStateWithLocalStorage = () => {
    let user = null
    let cart = null
    let rfq = null
    let currentView = ''

    if( localStorage.hasOwnProperty('foxselect-userdata') )
      user = localStorage.getItem('foxselect-userdata')
    try{
      user = JSON.parse( user )
    } catch(e) {
      console.log('[App.js] Unable to JSON.parse localStorage `foxselect-userdata`.');
    }

    if( localStorage.hasOwnProperty('foxselect-cart') )
      cart = localStorage.getItem('foxselect-cart')
    try{
      cart = JSON.parse( cart )
    } catch(e){
      console.log('[App.js] Unable to JSON.parse localStorage `foxselect-cart`.')
    }

    if( localStorage.hasOwnProperty('foxselect-rfq') )
      rfq = localStorage.getItem('foxselect-rfq')
    try{
      rfq = JSON.parse( rfq )
    } catch(e){
      console.log('[App.js] Unable to JSON.parse localStorage `foxselect-rfq`.')
    }

    if( localStorage.hasOwnProperty('foxselect-currentview') )
      currentView = localStorage.getItem('foxselect-currentview')

    // In WordPressAPI.js::validateUser(), we set
    // localStorage.foxselect-currentview === `loggedin` before
    // reloading the page. Therefore, when the page loads with
    // `loggedin` saved as the currentView, we know to immediately
    // set the currentView to `Checkout` to complete the flow of
    // "User logs in and then the app loads the Checkout screen".
    if( 'loggedin' === currentView ){
      currentView = 'Checkout'
      localStorage.setItem('foxselect-currentview', '')
    }

    if( null !== user || null !== cart || '' !== currentView )
      this.setState({user: user, cart: cart, currentView: currentView, rfq: rfq })
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
  setCurrentView = ( view, removeConfiguredPartCartId = true, clearPart = false ) => {
    let viewObj = {currentView: view}
    const { user } = this.state

    switch(view){

      case 'Checkout':
        view = ( typeof user !== 'undefined' && null !== user )? 'Checkout' : 'Login'
        viewObj = {currentView: view}
        break

      case 'PartSelector':
      case 'ShoppingCart':
        if( removeConfiguredPartCartId ){
          console.log('🔔 [App.js]->setCurrentView() We are removing the Cart ID.')
          const { configuredPart } = this.state
          delete configuredPart.cart_id
        }
        if( clearPart ){
          // clear the part in response to the "Clear" button next to the part number
          console.log('🔔 [App.js]->setCurrentView() Clearing the part...')
          this.resetConfiguredPart(null)
        }
        break

      case 'UpdateCartPart':
        console.log('🔔 [App.js]->setCurrentView() We are removing the Cart ID.')
        const { cart, configuredPart } = this.state
        const cart_id = configuredPart.cart_id
        delete configuredPart.cart_id;
        console.log(`configuredPart after deleting cart_id:`, configuredPart)
        cart[cart_id] = configuredPart;
        viewObj = {cart: cart, currentView: 'ShoppingCart'};
        console.log('🔔 [App.js]->setCurrentView() Clearing the part...')
        this.resetConfiguredPart(null)
        break

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
  setPartNumber = ( returnPartNo = false ) => {
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
        partNumberProperties = ['tolerance','stability','load','optemp'];
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
          //console.log('We found a comma in: `' + configuredPart[property].value + '`')
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
            value = ( 'pin-thru' === configuredPart.package_type.value.toLowerCase() )? '' : '__';
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
    let frequency = ''
    // '32.768' === configuredPart.frequency.value &&
    if( 'khz' === configuredPart.frequency_unit.value ){
      frequency = parseFloat( configuredPart.frequency.value )
      frequency = frequency/1000
    } else {
      frequency = configuredPart.frequency.value
    }

    configuredPart.number.label += frequency
    if( returnPartNo ){
      return {value: configuredPart.number.value, label: configuredPart.number.label }
    } else {
      this.setState({configuredPart: {number: configuredPart.number}});
    }
  }

  /**
   * Determines if a part is configured.
   *
   * @param      {object}   configuredPart  The part to check
   * @return     {boolean}  True if part configured, False otherwise.
   */
  isPartConfigured = (configuredPart) => {
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
        case 'K':
          if( typeof configuredPart.tolerance === 'undefined' || 0 === configuredPart.tolerance.value.length || '_' === configuredPart.tolerance.value )
            isConfigured = false;

          if( typeof configuredPart.load === 'undefined' || 0 === configuredPart.load.value.length || '_' === configuredPart.load.value )
            isConfigured = false;

          if( typeof configuredPart.stability === 'undefined' || 0 === configuredPart.stability.value.length || '_' === configuredPart.stability.value )
            isConfigured = false;
          break;

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
  updateCart = (action, id = null, option = '', value = '') => {
    let cart = { ...this.state.cart };
    switch(action){
      case 'add':
        let savedPart = {...this.state.configuredPart };
        // 2. Add to the cart
        const timestamp = Date.now();
        cart[`part-${timestamp}`] = savedPart;

        localStorage.setItem('foxselect-cart', JSON.stringify( cart ) )
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

      case 'empty':
        console.log('Emptying shopping cart. cart = ', cart)
        for( var key in cart ){
          if( cart.hasOwnProperty(key) )
            delete cart[key]
        }
        const newRFQ = {
          project_name: '',
          project_description: '',
          shipping_address: {
            company: '',
            contact: '',
            street: '',
            city: '',
            state: '',
            zip: ''
          },
          prototype_date: new Date(),
          production_date: new Date(),
          distys: []
        }
        this.setState({cart:cart,rfq: newRFQ})
        break

      case 'update':
        let part = cart[id];
        if(typeof part.options === 'undefined')
          part.options = {};
        part.options[option] = value;
        //console.log('updateCart: value = ' + value);
        cart[id] = part;
        localStorage.setItem('foxselect-cart', JSON.stringify( cart ) )
        this.setState({cart});
        break;

      default:
        console.log('updateCart: No action defined for `' + action + '`.')
    }
  }

  /**
   * Called via `componentDidMount()`. Updates our initial part options when we are configuring via an external window.configuredPart
   */
  updateFirstPartOption = () => {
    if( ! window.configuredPart )
      return

    console.log('🔔 [App.js]->updateFirstPartOption window.configuredPart is set.')
    console.log( window.configuredPart )

    if( window.configuredPart.hasOwnProperty('product_type') ){
      console.log(`\t• window.configuredPart.product_type = ${window.configuredPart.product_type.label} (${window.configuredPart.product_type.value})` )

      // EXCEPTION TO THE RULE:
      // Switching the `product_type` from `C` to `K`
      // is handled when we switch the `frequency_type` from `mhz` to `khz`.
      // So we switch `K` to `C` here to let our logic take of this later.
      if( 'K' === window.configuredPart.product_type.value )
        window.configuredPart.product_type.value = 'C'

      this.updateConfiguredPart( 'product_type', window.configuredPart.product_type )
    }
  }

  /**
   * Updates configuredPart via global window.configuredPart
   */
  updateConfiguredPartViaGlobalVar = () => {
    if( window.configuredPart ){
      let propsToUpdate = []
      for( var property in window.configuredPart ){
        if(
          typeof this.state.configuredPart !== 'undefined'
          && typeof this.state.configuredPart[property] !== 'undefined'
          && this.state.configuredPart[property].value !== window.configuredPart[property].value
        ){
          propsToUpdate.push(property)
        }
      }
      console.log('🔔 [App.js]->updateConfiguredPartViaGlobalVar We need to update these properties: ')
      console.log(propsToUpdate)

      // Works for:
      // Doesn't work for: C3BS (parts with AEC-Q200 option)
      /*
      if( typeof window.configuredPart.package_option !== 'undefined' ){ // && -1 < propsToUpdate.indexOf('package_option')
        console.log('`package_option` is set. We need to remove `package_option` and set `size` = size + package_option.')
        window.configuredPart.size.value = window.configuredPart.size.value + window.configuredPart.package_option.value
        delete window.configuredPart.package_option
        var index = propsToUpdate.indexOf('package_option')
        propsToUpdate.splice(index,1)
        console.log('We need to update these properties: ', propsToUpdate)
      }
      /**/


      // Order of precedence for updating part options:
      if( -1 < propsToUpdate.indexOf('frequency_unit') ){
        this.updateConfiguredPart( 'frequency_unit', window.configuredPart['frequency_unit'] )
        return
      } else if( -1 < propsToUpdate.indexOf('package_type') ){
        this.updateConfiguredPart( 'package_type', window.configuredPart['package_type'] )
        return
      } else if( -1 < propsToUpdate.indexOf('size') ){
        this.updateConfiguredPart( 'size', window.configuredPart['size'] )
        return
      } else if( -1 < propsToUpdate.indexOf('package_option') ){
        this.updateConfiguredPart( 'package_option', window.configuredPart['package_option'] )
        return
      } else if( -1 < propsToUpdate.indexOf('output') ){
        this.updateConfiguredPart( 'output', window.configuredPart['output'] )
        return
      } else if( -1 < propsToUpdate.indexOf('enable_type') ){
        this.updateConfiguredPart( 'enable_type', window.configuredPart['enable_type'] )
        return
      } else if( -1 < propsToUpdate.indexOf('voltage') ){
        this.updateConfiguredPart( 'voltage', window.configuredPart['voltage'] )
        return
      } else if( -1 < propsToUpdate.indexOf('pin_1') ){
        this.updateConfiguredPart( 'pin_1', window.configuredPart['pin_1'] )
        return
      } else if( 0 === propsToUpdate.length ){
        this.setState({checkExternalConfiguredPart: false})
      }
    }
  }

  /**
   * Updates the `configuredPart`
   *
   * @param      {str}    attribute  The configuredPart attribute
   * @param      {obj}    option     The attribute object: {value: '', label: ''}
   * @param      {bool}   delay       If `true`, don't update state
   */
  updateConfiguredPart = ( attribute, option, delay = false ) => {
    console.log("🔔 [App.js]->updateConfiguredPart(attribute,option,delay)")
    console.log(`\t• attribute: `, attribute)
    console.log(`\t• option: `, option)
    console.log(`\t• delay: `, delay)

    const { configuredPart } = this.state
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
      this.resetConfiguredPart({product_type: option}); //configuredPart,option.value
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

      if( 'pin-thru' === option.value.toLowerCase() ){
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
      switch( configuredPart.product_type.value ){
        case 'C':
          console.log("🔔🚨 [App.js]->updateConfiguredPart() We're switching from MHz to kHz. We need to:\n\t• Set `product_type` = K\n\t• Set frequency to 32.768 kHz\n\t• Set size to 3 chars");
          this.resetConfiguredPart({
            product_type: {value: 'K', label: 'Crystal'},
            frequency: {value: '32.768', label: '32.768'},
            frequency_unit: {value: 'khz', label: 'KHz'},
            size: {value: '___', label: ''}
          })
          return

        case 'K':
          console.log('🔔🚨 [App.js]->updateConfiguredPart() Toggling from kHz to MHz.')
          this.resetConfiguredPart({product_type: {value: 'C', label: 'Crystal'}})
          return

        default:
          console.log('🔔🚨 [App.js]->updateConfiguredPart() No reset written for `' +  configuredPart.product_type.label + '` when toggling MHz/kHz.');
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
      if( '_' === option.value && 'O' === configuredPart.product_type.value ){
        console.log('voltage is `null`. Also reseting output. configuredPart.output', configuredPart.output)
        configuredPart.output = { value: '__', label: configuredPart.output.label }
      }

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
          } else if( '4' === option.value ){
            configuredPart.package_option = {value: 'SD', label: 'SD'}
          } else if( '8' === option.value ){
            // Crystal MHz SMD 10.0x4.5mm == `AQ` package_option
            configuredPart.package_option = {value: 'AQ', label: 'AQ'}
          } else if( '9' === option.value ) {
            configuredPart.package_option = {value: 'SD', label: 'SD'}
          } else if( 0 < option.value.length && aecq200Options.sizes.includes(option.value) && configuredPart.package_option.value === 'BA' ){
            // do nothing
          } else if( 0 < option.value.length && ! aecq200Options.sizes.includes(option.value) ){
            configuredPart.package_option.value = ( '_' !== option.value )? 'BS' : '__'
          } else {
            configuredPart.package_option.value = ( '_' !== option.value )? 'BS' : '__'
          }
          break;

        case 'K':
          if( -1 < option.value.indexOf(',') ){
            console.log(`🔔 Size value has a comma:\n\t• size = ${option.value}\n\t• updateConfiguredPart() setting Size to default:`)
            // The first two chars of the size will determine the default (i.e. 12 or 13):
            const currentSize = option.value.substring(0,2)
            switch(currentSize){
              case '12':
                switch(option.value){
                  case '122,12A':
                    configuredPart.size = {value: '122', label: '2.0x1.2 mm'}
                    break

                  case '121,124':
                  case '124,121':
                    configuredPart.size = {value: '121', label: '1.2x1.0 mm'}
                    configuredPart.package_option = {label: '', value: '121'}
                    break

                  default:
                    //nothing
                }

                break

              case '13':
                configuredPart.size = {value: '135', label: '3.2x1.5 mm'}
                break

              default:
                // nothing
            }
          } else if( '124' === option.value || '121' === option.value ){
            configuredPart.size = {value: option.value, label: '1.2x1.0 mm'}
            configuredPart.package_option = {label: '', value: option.value}
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
      const partNumber = this.setPartNumber( true ) // configuredPart
      configuredPart.number = partNumber
      this.setState({configuredPart: configuredPart, currentView: 'PartSelector'},() => {
        this.updateOptions( originalConfiguredPart, configuredPart )
      })
    }
  }

  /**
   * Updates this.state.partOptions with data returned from the REST API
   *
   * @param      {object}  originalConfiguredPart  The original configured part
   * @param      {object}  configuredPart          The configured part
   */
  updateOptions = ( originalConfiguredPart, configuredPart ) => {
    if( typeof configuredPart.number === 'undefined' || typeof configuredPart.number.value === 'undefined' || '_________' === configuredPart.number.value || '_' === configuredPart.product_type.value )
      return

    console.log(`☎️ [App.js]->updateOptions(${configuredPart.number.value}) calling API...`)

    if( 'salesforce' === API_ENV ){
      const { dataService } = this.props;
      dataService.setPartNumber( configuredPart.number.label )
    }

    this.setState({loadingPartOptions: true})

    let axiosUrl = `${API_ROOT}${configuredPart.number.value}/${configuredPart.package_type.value}/${configuredPart.frequency_unit.value}`
    axios
      .get(axiosUrl)
      .then(response => {

        const { partOptions, configuredPart } = this.state;
        const { availableParts } = response.data;
        console.log(`⏰ [App.js]->updateOptions returned:`)
        console.log(response.data)

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
          if( (typeof response.data.partOptions[option] !== 'undefined' || true === forceUpdate) && 0 < response.data.availableParts ){
            partOptions[option] = response.data.partOptions[option]

            /**
             * "SETTING" A PART ATTRIBUTE FROM THE API
             *
             * When we have a part attribute with a `hold`
             * (e.g. output = { value: [HS,HL,HB], label: 'HCMOS'}) and the API
             * returns one option for that attribute, we can resolve the `hold` by
             * selecting the option returned by the API since our part configuration
             * has now limited the returned API values.
             *
             * Conditions for updating configuredPart[${option}] w/ return option:
             *
             * • 1 === partOptions[option].length // API returned only 1 option
             * • -1 === partOptions[option][0].value.indexOf(',') // does not have comma
             * • -1 < configuredPart[option].value.indexOf(',') // configuredPart has a comma
             */
            if(
              typeof partOptions[option] !== 'undefined'
              && typeof partOptions[option] === 'object'
              && typeof partOptions[option][0].value !== 'undefined'
              && typeof partOptions[option][0].value === 'string'
              && typeof configuredPart[option] === 'object'
              && 1 === partOptions[option].length
              && -1 === partOptions[option][0].value.indexOf(',')
              && -1 < configuredPart[option].value.indexOf(',')
            ){
              console.log(`🔔 [App.js]->updateOptions(): UPDATING '${option}'...`)
              console.log(`Our API has "selected" the '${option}' as '${partOptions[option][0].value}' from '${configuredPart[option].value}' b/c the following conditions have been met:`)
              console.log(`\t• API has returned only one option (partOptions[${option}].length = ${partOptions[option].length}).`)
              console.log(`\t• Returned API '${option}' does not have a comma ('${option}' = ${partOptions[option][0].value}).`)
              console.log(`\t• Our configuredPart.${option}.value has a comma (configuredPart.${option}.value = ${configuredPart[option].value}).`)
              configuredPart[option].value = partOptions[option][0].value
              console.log(`\t• New part no. is now:`, this.setPartNumber(true) ) // Don't comment out this console.log as we're actually setting the PartNumber here.
            }

          }
        }

        // If window.configuredPart, we should compare our configuredPart with
        // window.configuredPart, and keep updating configuredPart one option at a
        // time until we match window.configuredPart
        if( window.configuredPart && this.state.checkExternalConfiguredPart ){
          console.log('🔔 [App.js] updateOptions('+axiosUrl+') Axios request returned and window.configuredPart is set.')
          this.setState(
            {partOptions: partOptions, availableParts: availableParts, loadingPartOptions: false},
            () => this.updateConfiguredPartViaGlobalVar()
          )
        } else {
          console.log(`🔔 [App.js]->updateOptions() should be setting availableParts to ${availableParts}.`)
          this.setState({partOptions: partOptions, availableParts: availableParts, configuredPart: configuredPart, loadingPartOptions: false})
        }

      })
      .catch(error => console.log(error))
  }

  updateRFQ = ( rfq ) => {
    this.setState({rfq: rfq})
  }

  /**
   * Resets ${configuredPart} with `_` for all properties
   *
   * @param      {object}  partOptions  The options we want to set on the reset part
   */
  resetConfiguredPart = ( partOptions = {} ) => { // configuredPart, new_product_type
    if ( null === partOptions )
      partOptions = {product_type: {value: '_', label: ''}}

    const resetPart = {}
    const partAttributes = ['product_type','frequency','frequency_unit','package_type','package_option','size','stability','load','optemp','number']
    for (var i = partAttributes.length - 1; i >= 0; i--) {
      let attribute = partAttributes[i]
      switch( attribute ){
        case 'frequency':
          resetPart[attribute] = ( typeof partOptions[attribute] !== 'undefined' )? partOptions[attribute] : {value: '0.0', label: ''}
          break

        case 'frequency_unit':
          resetPart[attribute] = ( typeof partOptions[attribute] !== 'undefined' )? partOptions[attribute] : {value: 'mhz', label: 'MHz'}
          break

        case 'package_type':
          resetPart[attribute] = ( typeof partOptions[attribute] !== 'undefined' )? partOptions[attribute] : {value: 'smd', label: 'SMD'}
          break

        case 'package_option':
          resetPart[attribute] = ( typeof partOptions[attribute] !== 'undefined' )? partOptions[attribute] : {value: 'BS', label: ''}
          break

        case 'number':
          if( typeof partOptions[attribute] !== 'undefined' ){
            resetPart[attribute] = partOptions[attribute]
          } else if( typeof partOptions.product_type !== 'undefined' ){
            resetPart[attribute] = {value: 'F' + partOptions.product_type.value + '_______-0.0', label: 'F' + partOptions.product_type.value + '_______0.0'}
          } else {
            resetPart[attribute] = {value: 'F________-0.0', label: 'F________0.0'}
          }
          break

        default:
          resetPart[attribute] = ( typeof partOptions[attribute] !== 'undefined' )? partOptions[attribute] : {value: '_', label: ''}
      }
    }


    /*
    const resetPart = {
      product_type: product_type,
      frequency: {value: '0.0', label: ''},
      frequency_unit: {value: 'mhz', label: 'MHz'},
      package_type: {value: 'smd', label: 'SMD'},
      package_option: {value: 'BS', label: ''},
      size: {value: '_', label: ''},
      stability: {value: '_', label: ''},
      load: {value: '_', label: ''},
      optemp: {value: '_', label: ''},
      number: {value: 'F' + product_type.value + '_______-0.0', label: 'F' + product_type.value + '_______0.0'}
    }
    /**/
    const productType = ( typeof partOptions.product_type !== 'undefined' )? partOptions.product_type : {value: '_', label: ''}

    switch(productType.value){
      case 'C':
        delete resetPart.voltage;
        delete resetPart.output;
        resetPart.tolerance = {value: '_', label: ''};
        resetPart.package_option = {value: '__', label: ''};
      break;

      case 'O':
        delete resetPart.tolerance
        delete resetPart.package_option
        delete resetPart.load
        resetPart.voltage = {value: '_', label: ''}
        resetPart.output = {value: '__', label: ''}
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

    console.log('🔔 [App.js]->resetConfiguredPart()')
    console.log(`\t• productType = `, productType)
    console.log(`\t• partOptions = `, partOptions )
    console.log(`• resetPart = `, resetPart )

    this.setState(
      {configuredPart: resetPart, availableParts: 'n/a'},
      () => {
        this.updateOptions( resetPart, resetPart )
      }
    )
  }

  handleLogOut = () => {
    const logout = WP.logoutUser()
    if( logout )
      this.hydrateStateWithLocalStorage()
  }

  render() {
    const { configuredPart, partOptions, cart, user, loadingPartOptions } = this.state
    const availableParts = ( loadingPartOptions )? '...' : this.state.availableParts
    let { currentView } = this.state
    const editing = cart.hasOwnProperty(configuredPart.cart_id)
    const testLink = API_ROOT + configuredPart.number.value + '/' + configuredPart.package_type.value + '/' + configuredPart.frequency_unit.value
    var cartKeys = Object.keys(cart)
    var partsInCart = cartKeys.length

    let thisView = '';

    if( typeof currentView !== 'undefined' && 'Checkout' === currentView && user === null )
      currentView = 'Login'

    const page = window.location.pathname + 'foxselect/' + currentView
    if('PartSelector' !== currentView && '' !== currentView ){
      console.log(`🔔 [App.js]->render Sending this pageview to GA: `, page)
      ReactGA.pageview(page)
    }

    switch( currentView ){
      case 'Checkout':
        thisView = <Suspense fallback={<div className="alert alert-info text-center">Loading...</div>}>
          <Checkout
            cart={cart}
            partsInCart={partsInCart}
            loadPart={this.loadPart}
            updateCart={this.updateCart}
            user={user}
            rfq={this.state.rfq}
            updateRFQ={this.updateRFQ}
            setCurrentView={this.setCurrentView}
          />
        </Suspense>
        break;

      case 'Login':
        thisView = <Suspense fallback={<div className="alert alert-info text-center">Loading...</div>}>
          <Login hydrateStateWithLocalStorage={this.hydrateStateWithLocalStorage} />
        </Suspense>

        break;

      case 'ShoppingCart':
        thisView = <Suspense fallback={<div className="alert alert-info text-center">Loading...</div>}>
          <ShoppingCart
            cart={cart}
            setCurrentView={this.setCurrentView}
            partsInCart={partsInCart}
            loadPart={this.loadPart}
            updateCart={this.updateCart}
          />
        </Suspense>
        break;

      default:
        thisView = <Suspense fallback={<div className="alert alert-info text-center">Loading...</div>}>
          <PartSelector
            addPart={this.addPart}
            cart={cart}
            configuredPart={configuredPart}
            currentView={currentView}
            editing={editing}
            isPartConfigured={this.isPartConfigured}
            loadingPartOptions={loadingPartOptions}
            partOptions={partOptions}
            ReactGA={ReactGA}
            setCurrentView={this.setCurrentView}
            updateCart={this.updateCart}
            updateConfiguredPart={this.updateConfiguredPart}
            updateOptions={this.updateOptions}
          />
        </Suspense>
    }

    let buttonText = 'Return to Cart'
    if(
      typeof configuredPart.cart_id !== 'undefined'
      && typeof cart[configuredPart.cart_id] !== 'undefined'
      && configuredPart.number.value !== cart[configuredPart.cart_id].number.value
    )
      buttonText = 'Update Part'

    let buttonClass = ( this.isPartConfigured(configuredPart) )? 'btn-primary' : 'btn-secondary'
    buttonClass = buttonClass + ' btn btn-sm'

    //const disableClear = ( ('_' || 'F') === configuredPart.number.value.substring(0,1) ) ? 'disabled' : false ;
    //console.log('disableClear =', disableClear, 'configuredPart.number.value.substring(0,1) =', configuredPart.number.value.substring(0,1));

    return (
      <div className="container">
        { ( 'web' === API_ENV ) &&
        <div>
          { ( -1 < process.env.REACT_APP_WPAPI_EP.indexOf('.local') || -1 < HOSTNAME.indexOf('.local') ) &&
          <div className="row no-gutters justify-content-center"><div className="col-12 meta-foxselect " style={{textAlign: 'center'}}><code><a href={testLink} target="_blank" rel="noopener noreferrer">View API</a></code></div></div> }
          <div className="row no-gutters">
            <div className="col-md-3">
              <h1 className="title">
                <a href="#part-selector" onClick={(e) => {e.preventDefault(); this.setCurrentView('PartSelector')}}><img src={logo} alt="FOXSelect™" /></a>
              </h1>
            </div>
            <div className="col-md-9 nav-foxselect">
                <span>
                  <button disabled={'PartSelector' === currentView} type="button" className="btn btn-primary btn-sm" onClick={() => this.setCurrentView('PartSelector')}>Part Selector</button>
                </span>
                <span>
                  <button disabled={editing || ('ShoppingCart' === currentView)} type="button" className="btn btn-primary btn-sm" name="shoppingcart" onClick={() => this.setCurrentView('ShoppingCart')}>Your Cart ({partsInCart} parts)</button>
                </span>
                <span>
                  <button disabled={editing || ('Checkout' === currentView)} type="button" className="btn btn-primary btn-sm" name="checkout" onClick={() => this.setCurrentView('Checkout')}>Checkout</button>
                </span>

                {/* { 0 === Object.keys(cart).length && cart.constructor === Object &&
                  <span>
                    <br/>
                    <button style={{marginTop: '4px'}} className="btn btn-secondary btn-sm" name="load-samples" type="button" onClick={this.loadSampleCart}>Load Sample Parts</button>
                  </span>
                } */}
            </div>
          </div>
          <div className="row meta-foxselect no-gutters">
            <div className="col">
              Configured Part: <code><a href="#part-selector" onClick={(e) => {e.preventDefault(); this.setCurrentView('PartSelector')}} target="_blank" rel="noopener noreferrer">{configuredPart.number.label}</a></code>
              <button disabled={('_' || 'F') === configuredPart.number.value.substring(0,1)} className="btn btn-sm btn-secondary" onClick={(e) => {e.preventDefault(); this.setCurrentView('PartSelector',true,true);}}>Clear</button>
            </div>
            <div className="col-md-auto">Available Parts: <code>{availableParts}</code></div>
            <div className="col text-md-right">
              { typeof user !== 'undefined' && user !== null &&
              <span>User: <em>{user.user_display_name}</em> <a className="btn btn-sm btn-secondary" role="button" href="#logout" onClick={(e) => {e.preventDefault(); this.handleLogOut();}}>Log Out</a></span> }
              { ( typeof user === 'undefined' || user === null )  &&
              <a className="btn btn-sm btn-secondary" role="button" href="#logout" onClick={(e) => {e.preventDefault(); this.setCurrentView('Login');}}>Log In</a> }
            </div>
          </div>
        </div> } {/* ( 'web' === API_ENV ) */}
        { editing &&
          'PartSelector' === currentView &&
          <div className="alert alert-warning">
            <div className="row">
              <div className="col-10" style={{alignSelf: 'center'}}><strong>NOTE:</strong> <em>You are editing a part in your Cart.</em> If you wish to configure a new part, <a href="/select-a-new-part/" onClick={(e) => {e.preventDefault();this.setCurrentView('PartSelector')}}>click here</a>.</div>
              <div className="col-2 text-right">
                <button type="button" className={buttonClass} disabled={! this.isPartConfigured(configuredPart) } onClick={(e) => {e.preventDefault(); let nextView = ('Update Part' === buttonText)? 'UpdateCartPart' : 'ShoppingCart';this.setCurrentView(nextView,true,true)}}>{buttonText}</button>
              </div>
            </div>
          </div> }
        {thisView}
        <Alert stack={{limit: 3}} />
      </div>
    );
  }
}

export default App;