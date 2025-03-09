import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import './App.css'
import "leaflet/dist/leaflet.css"
import L from 'leaflet';
import Chatbot from './Chatbot';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


function App() {

  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState([])

  useEffect(function(){
    async function getLocations(){
      setIsLoading(true)
      const res = await fetch(`https://mindhive-be-cbcdbcb3e71d.herokuapp.com/locations`)
      const data = await res.json()
      setLocations(data)
      setIsLoading(false)
    }
    getLocations()
  }, [])

  return (
    <div className="App">
      {/* {isLoading?
        <div>Loading....</div>:
        <ul>
          {locations?.map((location) => (<div key={location.id}>{location.name} {location.address} {location.scrapedLat} {location.scrapedLong}</div>))}
        </ul>
      } */}
      <MapContainer center={[3.1319, 101.6841]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => <SubwayMarker location={location}/>)}
      </MapContainer>
      {isLoading? <h1>LOADING DATA. PLEASE WAIT.</h1>: ""}
      <Chatbot/>
    </div>
  );
}

function SubwayMarker ({location}) {
  let parsedArray = JSON.parse(location.rawExtractionData)
  let cleanedArray = parsedArray.map(item => item.replace(/\\u([\dA-Fa-f]{4})/g, (match, code) => String.fromCharCode(parseInt(code, 16))))

  return(
    <Marker position={[location.scrapedLat, location.scrapedLong]}>
      <Popup>
        <h1>{location.name}</h1>
        <p>{location.address}</p>
        {cleanedArray.map((item) => <p>{item}</p>)}
        <p>Number of intersections: {location.numIntersections}</p>
        {/* <p>{displayData}</p> */}
      </Popup>
      <Circle 
        center={{lat:location.scrapedLat, lng: location.scrapedLong}}
        fillColor="lightblue"
        fillOpacity={0.075}
        color='blue'
        weight={1}
        radius={5000}/>
    </Marker>
  )
}

export default App;
