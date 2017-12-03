import React, { Component, TouchableOpacity, Image } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View , Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
// import GeoFencing from 'react-native-geo-fencing';
import SlideMenu from 'react-native-side-menu';

import Menu from './src/Menu.js';
const image = require('./assets/menu.png');
// import Dimensions from 'Dimensions';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


let key = 0;
export default class App extends Component<{}> {
  constructor(props) {
    super(props)

    // this.toggle = this.toggle.bind(this);

    this.state = {
      mapRegion: null,
      lastLat: null,
      lastLong: null,
      coords: [],
      polylines: [],
      endpoint: null,
      isOpen: false,
      selectedItem: 'About',
      size : (700 / Dimensions.get('window').width) * Dimensions.get('window').width,
    }
  }

  componentDidMount() {

    this.watchID = navigator.geolocation.watchPosition((position) => {
      // Create the object to update this.state.mapRegion through the onRegionChange function
      let region = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.00922 * 1.5,
        longitudeDelta: 0.00421 * 1.5
      }
      // let resp =  fetch(`https://roads.googleapis.com/v1/nearestRoads?points=${region.latitude},${region.longitude}&key=AIzaSyDyieGBtfNQRksI67lRIMCO2wsJj__kK3Y`);
      // let respJson =  resp.json();
      // region = rerespJson.snappedPoints.location;
      // console.log(region);
      this.setState({ mapRegion: region });
      // this.onRegionChange(region, region.latitude, region.longitude);
      this.getDirections(region.latitude + ',' + region.longitude, "Bến xe Quận 8");

      let point = {
        lat: 10.734101,
        lng: 106.656181,
      }

      // GeoFencing.containsLocation(point, this.state.coordsDraw)
      //   .then(() => alert('point is within polygon'))
      //   .catch(() => alert('point is NOT within polygon'));

    });


    // find your origin and destination point coordinates and pass it to our method.
    // I am using Bursa,TR -> Istanbul,TR for this example

    // this.getDirections("10.851056 , 106.772012", "10.733519 , 106.656411")

    // if (this.state.mapRegion != null) {
    // this.getDirections(this.state.lastLat + ',' + this.state.lastLong, "Quận 8");
    // this.getDirections("Cần Giuộc", "Quận 8");
    // }

  }


  onRegionChange = (region, lastLat, lastLong) => {
    this.setState({
      mapRegion: region,
      // If there are no new values set use the the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong
    });
  }


  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }


  onMapPress = (e) => {
    // console.log(e.nativeEvent.coordinate.longitude);
    let region = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      latitudeDelta: 0.00922 * 1.5,
      longitudeDelta: 0.00421 * 1.5
    }
    this.onRegionChange(region, region.latitude, region.longitude);
  }

  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&alternatives=true`);
      let respJson = await resp.json();
      // const count = Object.keys(respJson).length;
      // console.log(respJson);
      var coordstemp = [];

      // for (let i = 0; i < count; i++) {
      //   // console.log(i);
      //   let points = Polyline.decode(respJson.routes[i].overview_polyline.points);
      //   // console.log(points);
      //   let coordinates = points.map((point, index) => {
      //     return {
      //       latitude: point[0],
      //       longitude: point[1]
      //     }
      //   })
      //   console.log(coordinates);
      //   // this.setState({ key: 1 });
      //   coordstemp.push(coordinates);
      // }


      var points = (respJson.routes.map((value) => (
        (value.overview_polyline.points)
      )));
      var pointsdecode = points.map((value) => Polyline.decode(value));
      // console.log(pointsdecode);
      const count = Object.keys(pointsdecode).length;
      for (let i = 0; i < count; i++) {
        let coordinates = pointsdecode[i].map((point) => {
          return {
            latitude: point[0],
            longitude: point[1]
          }
        });

        if (i == 0) {
          console.log(coordinates);

          let key = Object.keys(coordinates);
          let lastpoint = coordinates[key.length - 1];
          let lastPointMarker = (
            <MapView.Marker
              coordinate={lastpoint} />);
          this.setState({ endpoint: lastPointMarker });
          console.log(this.state.endpoint);

          this.setState({ key: key++ });
          let polyLine = (
            <MapView.Polyline
              key={this.state.key}
              coordinates={coordinates}
              strokeWidth={5}
              strokeColor="#00B3FD" />
          );


          // console.log(coordinates);
          coordstemp.push(polyLine);
        }
        else {
          this.setState({ key: key++ });
          let polyLine = (
            <MapView.Polyline
              key={this.state.key}
              coordinates={coordinates}
              strokeWidth={5}
              strokeColor="#AFAFAF" />
          );
          // console.log(coordinates);
          coordstemp.push(polyLine);
        }
      }
      this.setState({ polylines: coordstemp.reverse() })
      // console.log(this.state.polylines);
    } catch (error) {
      alert(error)
      return error
    }
  }

  // toggle() {
  //   this.setState({
  //     isOpen: !this.state.isOpen,
  //   });
  // }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onMenuItemSelected = item =>
    this.setState({
      isOpen: false,
      selectedItem: item,
    });

  render() {
    console.log(this.width);
    const menu = <Menu onItemSelected={this.onMenuItemSelected}
      // isOpen={this.state.isOpen}
      // onChange={isOpen => this.updateMenuState(isOpen)} />;
      openMenuOffset={this.state.size} />
    // console.log(this.state.isOpen);
    if(this.state.selectedItem === 'Contacts')
    {
      // alert(2222);
    }
    return (
      <SlideMenu menu={menu}>
        <View style={{ flex: 1 }}>
          <MapView
            style={styles.map}
            showsUserLocation={true}
            followUserLocation={true}
            showsMyLocationButton={true}
            onRegionChange={this.onRegionChange}
            onPress={this.onMapPress}
            region={this.state.mapRegion}>

            {this.state.polylines}

            {this.state.endpoint}
          </MapView >
        </View >

      </SlideMenu>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    position: 'absolute',
    top: 20,
    padding: 10,
  }
});