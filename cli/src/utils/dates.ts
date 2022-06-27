const ms_per_minute = 60000;
module.exports = (date: { getTime: () => number; getTimezoneOffset: () => number; }) => {  
    return new Date(date.getTime() - (date.getTimezoneOffset() * ms_per_minute ))
                        .toISOString()
                        .split("T")[0];
}