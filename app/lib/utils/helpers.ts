const numberWithCommas = (x:any) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function convertTo12HourTime(time24: string) {
  // Splitting the time string into hours and minutes
  var timeParts = time24.split(':');
  var hours = parseInt(timeParts[0]);
  var minutes:any = parseInt(timeParts[1]);

  // Determining AM or PM
  var period = hours >= 12 ? 'PM' : 'AM';

  // Converting hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be converted to 12

  // Formatting minutes (adding leading zero if necessary)
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Returning the formatted 12-hour time string
  return hours + ':' + minutes + ' ' + period;
}

export { numberWithCommas,convertTo12HourTime };
