/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
  'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
  'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  constructor(props) {
    super(props)
    this.state = {
      mapRegion: null,
      lastLat: null,
      lastLong: null,
      coords: [],
      coordsDraw: [],
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
      this.onRegionChange(region, region.latitude, region.longitude);
      this.getDirections(region.latitude + ',' + region.longitude, "Quận 8");

    });


    // find your origin and destination point coordinates and pass it to our method.
    // I am using Bursa,TR -> Istanbul,TR for this example

    // this.getDirections("10.851056 , 106.772012", "10.733519 , 106.656411")

    // if (this.state.mapRegion != null) {
    // this.getDirections(this.state.lastLat + ',' + this.state.lastLong, "Quận 8");
    this.getDirections("Cần Giuộc", "Quận 8");
    // }

  }


  onRegionChange(region, lastLat, lastLong) {
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


  onMapPress(e) {
    console.log(e.nativeEvent.coordinate.longitude);
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
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`)
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
      this.setState({ coordsDraw: coords })
      return coords

    } catch (error) {
      alert(error)
      return error
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={styles.map}
          showsUserLocation={true}
          followUserLocation={true}
          showsMyLocationButton={true}
          onRegionChange={this.onRegionChange.bind(this)}
          onPress={this.onMapPress.bind(this)}
          region={this.state.mapRegion}>
          <MapView.Polyline
            coordinates={this.state.coordsDraw}
            strokeWidth={8}
            strokeColor="red" />
          <MapView.Marker
            coordinate={{
              latitude: (this.state.lastLat + 0.00050) || -36.82339,
              longitude: (this.state.lastLong + 0.00050) || -73.03569,
            }}>
            <View>
              <Text style={{ color: '#000' }}>
                {this.state.lastLong} / {this.state.lastLat}
              </Text>
            </View>
          </MapView.Marker>
        </MapView >
      </View >
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});