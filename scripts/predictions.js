$(document).ready(function() {
  // FILTERS -
  // filter[stop]=place-sstat,place-north -> only look at predictions for stops at south or north station
  // filter[route_type]=2 -> only looks at predictions for commuter rails
  // filter[stop_sequence]=1 -> only look at predictions for outbound trains (ie trains whose first stop is either north or south station)
  // include=stop,route,schedule -> to get information from the related stops, routes, schedules needed to the board
  let url = 'https://api-v3.mbta.com/predictions?filter[stop]=place-sstat,place-north&filter[route_type]=2&filter[stop_sequence]=1&include=stop,route,schedule';

  let getRoutes = function(response){
    const extraInfo = response['included']
    return extraInfo.reduce(function(filtered, option){
      if (option.type === "route"){
        filtered[option.id] = {
          "directionDesinations": option.attributes.direction_destinations
        }
      }
      return filtered
    }, {})
  }

  let getStops = function(response){
    const extraInfo = response['included']
    return extraInfo.reduce(function(filtered, option){
      if (option.type === "stop"){
        filtered[option.id] = {
          "platformCode": option.attributes.platform_code,
          "station": option.attributes.name
        }
      }
      return filtered
    }, {})
  }

  let getSchedules = function(response){
    const extraInfo = response['included']
    return extraInfo.reduce(function(filtered, option){
      if (option.type === "schedule"){
        filtered[option.id] = {
          "expectedDeparture": option.attributes.departure_time
        }
      }
      return filtered
    }, {})
  }

  let updateSchedule = function(response) {
    const extraInfo = response['included']

    let routes = getRoutes(response);
    let stops = getStops(response);
    let schedules = getSchedules(response);

    let trains = response['data'].map(function(prediction){
      return {
        'id': prediction.id,
        'status': prediction.attributes.status,
        'departureTime': prediction.attributes.departure_time || schedules[prediction.relationships.schedule.data.id].expectedDeparture, // if departure_time on prediction object is None, get the departure time from the schedule
        'origin': stops[prediction.relationships.stop.data.id].station,
        'finalDestination': routes[prediction.relationships.route.data.id].directionDesinations[prediction.attributes.direction_id],
        'platformCode': stops[prediction.relationships.stop.data.id].platformCode || 'TBD',
      }
    })

    // API call does sort the trains, but because some of the departure times come back as None and then I populate them with the times from the schedules, they can get a bit mixed up. This ensures that they are in the desired order
    trains.sort((trainA, trainB) => trainA.departureTime > trainB.departureTime ? 1 : -1)

    let body = $('.schedule-body');
    body.empty()

    $.each(trains, function(index, train){
      var row = $('<tr class="train-schedules"></tr>');
      var time = $('<td>' + train.departureTime.substr(11, 5) + '</td>');
      var origin = $('<td>' + train.origin + '</td>');
      var destination = $('<td>' + train.finalDestination + '</td>');
      var track = $('<td>' + train.platformCode + '</td>');
      var status = $('<td>' + train.status + '</td>');

      row.append(time);
      row.append(origin);
      row.append(destination);
      row.append(track);
      row.append(status);

      body.append(row);
    });
  }

  let failCallback = function(xkr){
    console.log("failure");
    console.log(xhr);
  };

  let alwaysCallBack = function () {
    console.log('This always happens');
  };

  let successCallback = function(response) {
    console.log('success!');
    updateSchedule(response);
  }

  setInterval(function(){
    $.get(url, successCallback)
      .fail(failCallback)
      .always(alwaysCallBack);
  }, 6000); // updates every 6 seconds

  $.get(url, successCallback)
    .fail(failCallback)
    .always(alwaysCallBack);

});
