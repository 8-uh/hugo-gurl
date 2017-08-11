+++
date = "2017-08-10T20:44:11-05:00"
title = "Geopositional Deltas Expressed As Meters"
description = "exploring an algorithm to add meters to a lat/lon position"
tags = ["js", "fun", "halp"]
categories = ["experiments","algorithms"]
+++
# Algorithm to achieve 1m of displacement as Degrees of Latitude and Longitude
### North/South Deltas:
This conversion is static no matter where you are on earth

=>
`1Lat = 110.574km`  
`1Lat = 110574m`  
`1m = 0.00000904371732957115 Lat`  
therefore a delta can be calculated by the following algorithm:
```js
const METERS_TO_LATITUDE = 0.00000904371732957115

const latitudeDelta = meters => meters * METERS_TO_LATITUDE
```

### East/West Deltas  
This is not as straight forward. Degrees of Longitude (Lon) have to be calculated based on positioning on Earth. For example: 1Lon at the earth's equator is much further a distance than 1Lon at either of the poles. This means we have to take into account the Latitude position to calculate 1Lon

The shortened algorithm looks like:
`1Lon = 111.320km * cos(Lat)`  

First, we'll convert it to meters:  
`1Lon = 111320m * cos(Lat)`  

Latitude is expressed in degrees, however we'll need to convert it first to radians.

The standard algorithm to convert to radians is:  
`radians = degrees * π/180`

which gives us:  
`1Lon = 111320m * cos(Lat*π/180)`

However, we need to solve for meters:  
`111320m  = cos(Lat * π/180)`  
`1m = cos(Lat * π/180) / 111320`  

Which means, the following should be the correct algorithm:

```js
const {PI, cos} = Math

// degrees to radians
const d2r = d => d * PI / 180

const longitudeDelta = (meters, lat) => meters * (cos(d2r(lat)) / 11320)
```

If this is true, we can also create some extra helper methods:

```js
// all functions return a [LonLat] pair... keeping with the mathematical
// convention of supplying the `x` value first

const calculateDeltas = ( [ dx, dy ], lat) => (
  [ longitudeDelta(dx, lat), latitudeDelta(dy) ]
)

const translateGeoPoint = ([ lon, lat ], [ dx, dy ]) => {
  const deltas = calculateDeltas(lat, [ dx, dy ])
  return [ lon + deltas[0], lat + deltas[1] ]
}
```

I believe this is correct... if not, I'll update this doc with further findings.
