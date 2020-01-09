import React, { Component } from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";


class MyMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: {
        lat: 59.305,
        lng: 18.09
      },
      zoom: 9,
      TL: null,
      key: 0
    };
  }
  componentWillMount() {

  }
  componentDidUpdate(prevProps, prevState) {

  }
  componentDidMount() {
  }
  getGeoJson(arr) {
    if (arr.LocationList.StopLocation) {
      return {
        type: "FeatureCollection",
        features: arr.LocationList.StopLocation.map(loc =>
          this.getGeoJsonFeature(loc)
        )
      };
    }
    return null;
  }
  getGeoJsonFeature(inJson) {
    let outGeoJson = {};
    outGeoJson["type"] = "Feature";
    outGeoJson["properties"] = inJson;
    outGeoJson["geometry"] = {
      type: "Point",
      coordinates: [Number(inJson["lon"]), Number(inJson["lat"])]
    };
    return outGeoJson;
  }

  componentWillUnmount() {
    this.setState({});
  }
  getStyle(feature, layer) {
    return {
      color: "#006400",
      weight: 5,
      opacity: 0.65
    };
  }

  onEachFeaturePoint(feature, layer) {
    const popupContent = `<h3>${feature.properties.dist} meter</h3>
    <strong>Beskrivning: </strong>${feature.properties.name}`;
    layer.bindPopup(popupContent);
//     dist:
// "78"
// id:
// "300101337"
// idx:
// "1"
// lat:
// "59.316283"
// lon:
// "18.061522"
// name:
// "Wollmar Yxkullsg (på T.mansg) (Stockholm)"
  }

  pointToLayer(feature, latlng) {
    var markerParams = {
      radius: 4,
      fillColor: "orange",
      color: "#fff",
      weight: 1,
      opacity: 0.5,
      fillOpacity: 0.8
    };
    return L.circleMarker(latlng, markerParams);
  }
  onMapClick = e => {

    let lat = e.latlng.lat;
    let lng = e.latlng.lng;
    let url = "http://api.sl.se/api2/nearbystops.json?key=341e477a7fb843f6a5557dd02210eec9&originCoordLat=" + lat + "&originCoordLong="+ lng +"&maxresults=200&radius=2000";


    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(proxyurl + url)
      .then(response => response.json())
      .then(data =>
        this.setState(prevState => ({
          TL: this.getGeoJson(data),
          key: e.latlng.lng
        }))
      );

  };
  render() {
    const { TL } = this.state;
    const position = [this.state.location.lat, this.state.location.lng];
    return (
      <div className="App">
        <Map
          id="map"
          center={position}
          zoom={this.state.zoom}
          onclick={this.onMapClick}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            url="http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          />
          <GeoJSON
            key={`marker-${this.state.key}`}
            data={TL}
            style={this.getStyle}
            pointToLayer={this.pointToLayer.bind(this)}
            onEachFeature={this.onEachFeaturePoint.bind(this)}
          />
        </Map>
      </div>
    );
  }
}

export default MyMap;
