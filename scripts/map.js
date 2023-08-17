
const placeSearch = document.getElementById("place-search")
const mapZoom = document.getElementById("map-zoom")
const origin = document.getElementById("origin-search")
const destinaiton = document.getElementById("destination-search")

var zoomData = mapZoom.value

var latitude;
var longitude;
var searchPlace = null;
var originPlace = null;
var destinationPlace = null;

window.onload = function () {
  if (!navigator.geolocation) {
    throw "위치 정보가 지원되지 않습니다."
  }
  else {
    navigator.geolocation.getCurrentPosition(current)
  }

  function current({ coords }) {
    latitude = coords.latitude;
    longitude = coords.longitude;

    $('#map-container').children('iframe').css('display', 'none')
    var placeSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSy0-Tgufv85nQOYW-69Xw44&q=${latitude},${longitude}&zoom=${zoomData}`
    $('.map').attr('src', placeSrc)
    $('.default').css('display', 'block')
  }
}

$('#place-searchButton').click(() => {
  searchPlace = placeSearch.value;
  $('#mapType').val('normalMap')
  var placeSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSy0-Tgufv85nQOYW-69Xw44&q=${searchPlace}&zoom=${zoomData}`
  $('.map').attr('src', placeSrc)
})

$('#map-zoom').change(() => {
  $('#zoom-value').html("확대 범위 (" + $('#map-zoom').val() + ")")
  if ($('#mapType').val() == 'default' || $('#mapType').val() == 'normalMap') {
    if (searchPlace != null) {
      var placeSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSy0-Tgufv85nQOYW-69Xw44&q=${searchPlace}&zoom=${$('#map-zoom').val()}`
    }
    else if (searchPlace == null) {
      var placeSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSy0-Tgufv85nQOYW-69Xw44&q=${latitude},${longitude}&zoom=${$('#map-zoom').val()}`
    }
  }
  else if ($('#mapType').val() == 'viewMap') {
    var placeSrc = `https://www.google.com/maps/embed/v1/view?key=AIzaSy0-Tgufv85nQOYW-69Xw44&center=${latitude},${longitude}&zoom=${$('#map-zoom').val()}&maptype=satellite`
  }
  else if ($('#mapType').val() == 'directionMap') {
    var placeSrc = `https://www.google.com/maps/embed/v1/directions?key=AIzaSy0-Tgufv85nQOYW-69Xw44&origin=${originPlace}&destination=${destinationPlace}&zoom=${$('#map-zoom').val()}&mode=transit`
  }
  $('.map').attr('src', placeSrc)
})

$('#currentButton').click(() => {
  searchPlace = null
  originPlace = null
  destinationPlace = null
  $('#place-search').val('')
  $('#mapType').val('default')
  var placeSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSy0-Tgufv85nQOYW-69Xw44&q=${latitude},${longitude}&zoom=${zoomData}`
  $('.map').attr('src', placeSrc)
})

$('#currentButton2').click(() => {
  searchPlace = null
  originPlace = null
  destinationPlace = null
  $('#place-search').val('')
  $('#mapType').val('default')
  var placeSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSy0-Tgufv85nQOYW-69Xw44&q=${latitude},${longitude}&zoom=${zoomData}`
  $('.map').attr('src', placeSrc)
  $('#origin-destination-container').css('display', 'none')
  $('#pathButton-container').css('display', 'none')
  $('#place-search').css('display', 'block')
  $('#button-container').css('display', 'block')
})

$('#path-searchButton').click(() => {
  originPlace = origin.value
  destinationPlace = destinaiton.value
  console.log(originPlace)
  console.log(destinationPlace)
  var placeSrc = `https://www.google.com/maps/embed/v1/directions?key=AIzaSy0-Tgufv85nQOYW-69Xw44&origin=${originPlace}&destination=${destinationPlace}&zoom=${zoomData}&mode=transit`
  $('.map').attr('src', placeSrc)
})






$('#mapType').change(() => {
  if ($('#mapType').val() == 'default' || $('#mapType').val() == 'normalMap') {
    $('#map-container').children('iframe').css('display', 'none')
    var placeSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSy0-Tgufv85nQOYW-69Xw44&q=${latitude},${longitude}&zoom=${zoomData}`
    $('.map').attr('src', placeSrc)
    $('.default').css('display', 'block')
    $('#origin-destination-container').css('display', 'none')
    $('#pathButton-container').css('display', 'none')
    $('#place-search').css('display', 'block')
    $('#button-containerr').css('display', 'block')
  }
  else if ($('#mapType').val() == 'viewMap') {
    $('#map-container').children('iframe').css('display', 'none')
    var placeSrc = `https://www.google.com/maps/embed/v1/view?key=AIzaSy0-Tgufv85nQOYW-69Xw44&center=${latitude},${longitude}&zoom=${zoomData}&maptype=satellite`
    $('.map').attr('src', placeSrc)
    $('.viewMap').css('display', 'block')
    $('#origin-destination-container').css('display', 'none')
    $('#pathButton-container').css('display', 'none')
    $('#place-search').css('display', 'block')
    $('#button-container').css('display', 'block')
  }
  else if ($('#mapType').val() == 'directionMap') {
    $('#map-container').children('iframe').css('display', 'none')
    var placeSrc = `https://www.google.com/maps/embed/v1/directions?key=AIzaSy0-Tgufv85nQOYW-69Xw44&origin=${latitude},${longitude}&destination=${latitude},${longitude}&zoom=${zoomData}`
    $('.map').attr('src', placeSrc)
    $('.directionMap').css('display', 'block')
    $('#origin-destination-container').css('display', 'block')
    $('#pathButton-container').css('display', 'block')
    $('#place-search').css('display', 'none')
    $('#button-container').css('display', 'none')
  }
})

