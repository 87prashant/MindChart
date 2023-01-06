// returns date in GMT+5:30
function date() {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset();
    
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    hours = (hours - (timezoneOffset / 60)) % 24;
    minutes = (minutes - timezoneOffset) % 60;
    seconds = (seconds - timezoneOffset) % 60;
    
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    
    return date
}

module.exports = date