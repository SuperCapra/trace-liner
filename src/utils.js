export default {
    getJsonDate(dateUnparsed, removeZero) {
        let res = {
            year: undefined,
            month: undefined,
            monthText: undefined,
            day: undefined,
            hours: undefined,
            minutes: undefined,
            seconds: undefined
        }
        res.year = removeZero ? String(Number(dateUnparsed.substring(0,4))) : dateUnparsed.substring(0,4)
        res.month = removeZero ? String(Number(dateUnparsed.substring(5,7))) : dateUnparsed.substring(5,7)
        res.day = removeZero ? String(Number(dateUnparsed.substring(8,10))) : dateUnparsed.substring(8,10)
        res.hours = removeZero ? String(Number(dateUnparsed.substring(11,13))) : dateUnparsed.substring(11,13)
        res.minutes = removeZero ? String(Number(dateUnparsed.substring(14,16))) : dateUnparsed.substring(14,16)
        res.seconds = removeZero ? String(Number(dateUnparsed.substring(17,19))) : dateUnparsed.substring(17,19)
        if(Number(res.month) === 1) {
            res.monthText = 'Jan'
        } else if(Number(res.month) === 2) {
            res.monthText = 'Feb'
        } else if(Number(res.month) === 3) {
            res.monthText = 'Mar'
        } else if(Number(res.month) === 4) {
            res.monthText = 'Apr'
        } else if(Number(res.month) === 5) {
            res.monthText = 'May'
        } else if(Number(res.month) === 6) {
            res.monthText = 'Jun'
        } else if(Number(res.month) === 7) {
            res.monthText = 'Jul'
        } else if(Number(res.month) === 8) {
            res.monthText = 'Aug'
        } else if(Number(res.month) === 9) {
            res.monthText = 'Sep'
        } else if(Number(res.month) === 10) {
            res.monthText = 'Oct'
        } else if(Number(res.month) === 11) {
            res.monthText = 'Nov'
        } else if(Number(res.month) === 12) {
            res.monthText = 'Dic'
        }
        return res
    },

    getBeautyDate(dateUnparsed) {
        let parsedDate = this.getJsonDate(dateUnparsed, true)
        return parsedDate.monthText + ' ' + parsedDate.day
    },

    getBeautyDatetime(dateUnparsed) {
        let parsedDate = this.getJsonDate(dateUnparsed, true)
        return parsedDate.monthText + ' ' + parsedDate.day + ', ' + parsedDate.hours + ':' + parsedDate.minutes + ':' + parsedDate.seconds
    },

    getJsonDuration(durationInSec) {
        let parsedDuration = {
            hours: undefined,
            minutes: undefined,
            seconds: undefined,
        }
        parsedDuration.hours = Math.floor(durationInSec / 3600)
        parsedDuration.minutes = Math.floor((durationInSec - (parsedDuration.hours * 3600)) / 60)
        parsedDuration.seconds = durationInSec - (parsedDuration.hours * 3600) - (parsedDuration.minutes * 60)
        return parsedDuration
    },

    getBeautyDuration(durationInSec) {
        let parsedDuration = this.getJsonDuration(durationInSec)
        return parsedDuration.hours + 'h ' + parsedDuration.minutes + 'm ' + parsedDuration.seconds + 's'
    },

    labelize(value) {
        return value.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toLowerCase() })
    },

    polylineDecode(str, precision) {
        let index = 0
        let lat = 0
        let lng = 0
        let coordinates = []
        let shift = 0
        let result = 0
        let byte = null
        let latitude_change
        let longitude_change
        let factor = Math.pow(10, precision || 5)
        
        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {
            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;
            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
        
            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
        
            shift = result = 0;
        
            do {
                byte = str.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
        
            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
        
            lat += latitude_change;
            lng += longitude_change;
        
            coordinates.push([lat / factor, lng / factor]);
        }
        return coordinates;
    },
      
    flipped(coords) {
        let flipped = [];
        for (var i = 0; i < coords.length; i++) {
            flipped.push(coords[i].slice().reverse());
        }
        return flipped;
    },

    polylineToGeoJSON(str, precision) {
        let coords = this.polylineDecode(str, precision);
        return this.flipped(coords)
    } 
}