import {vocabulary, languages, languagesRules} from "../config/vocabulary"
import logUtils from "./logUtils.js"

const utilsFunction = {
    getJsonDate(dateUnparsed, removeZero) {
        let result = {}
        let resForLanguage = {
            year: undefined,
            month: undefined,
            monthText: undefined,
            day: undefined,
            hours: undefined,
            minutes: undefined,
            seconds: undefined,

        }
        resForLanguage.year = removeZero ? String(Number(dateUnparsed.substring(0,4))) : dateUnparsed.substring(0,4)
        resForLanguage.month = removeZero ? String(Number(dateUnparsed.substring(5,7))) : dateUnparsed.substring(5,7)
        resForLanguage.day = removeZero ? String(Number(dateUnparsed.substring(8,10))) : dateUnparsed.substring(8,10)
        resForLanguage.hours = removeZero ? String(Number(dateUnparsed.substring(11,13))) : dateUnparsed.substring(11,13)
        resForLanguage.minutes = removeZero ? String(Number(dateUnparsed.substring(14,16))) : dateUnparsed.substring(14,16)
        resForLanguage.seconds = removeZero ? String(Number(dateUnparsed.substring(17,19))) : dateUnparsed.substring(17,19)

        for(let language of languages) {
            result[language] = {...resForLanguage}
            result[language]['monthText'] = vocabulary[language]['MONTH_' + Number(resForLanguage.month)]
        }
        return result
    },

    getBeautyCoordinates(coordinates) {
        if(!coordinates[0] || !coordinates[1]) return undefined
        let result = {
            coordinates: coordinates,
            beautyCoordinates: [],
            beautyCoordinatesTextTime: undefined,
            beautyCoordinatesTextDecimal: undefined,
            latDeg: undefined,
            latMin: undefined,
            latSec: undefined,
            longDeg: undefined,
            longMin: undefined,
            longSec: undefined,
        }
        let latCoord = coordinates[0]
        let longCoord = coordinates[1]
        let tempLat = Math.floor(latCoord * 100)
        let tempLong = Math.floor(longCoord * 100)

        result.latDeg = (latCoord > 0) ? Math.abs(Math.floor(latCoord)) : Math.abs(Math.ceil(latCoord))
        result.longDeg = (latCoord > 0) ? Math.abs(Math.floor(longCoord)) : Math.abs(Math.ceil(longCoord))

        let latPolarDirection = result.latDeg + (latCoord > 0) ? 'N' : 'S'
        let longPolarDirection = result.longDeg + (longCoord > 0) ? 'E' : 'W'

        let tempLatSec = (Math.abs((tempLat) - (result.latDeg * 100))) * 36
        let tempLongSec = (Math.abs((tempLong) - (result.longDeg * 100))) * 36
        
        result.latSec = Math.floor(tempLatSec % 60)
        result.longSec = Math.floor(tempLongSec % 60)

        result.latMin = Math.floor((tempLatSec - result.latSec) / 60)
        result.longMin = Math.floor((tempLongSec - result.longSec) / 60)

        result.beautyCoordinates.push(result.latDeg + '°' + result.latMin + '\'' + latPolarDirection)
        // result.beautyCoordinates.push(result.latDeg + '°' + result.latMin + '\'' + result.latSec + '\'\'' + latPolarDirection)
        result.beautyCoordinates.push(result.longDeg + '°' + result.longMin + '\'' + longPolarDirection)
        // result.beautyCoordinates.push(result.longDeg + '°' + result.longMin + '\'' + result.longSec + '\'\'' + longPolarDirection)
        
        result.beautyCoordinatesTextTime = result.beautyCoordinates[0] + ' | ' + result.beautyCoordinates[1]
        result.beautyCoordinatesTextDecimal = Math.abs(result.coordinates[0]).toFixed(5) + '°' + latPolarDirection + ' | ' + Math.abs(result.coordinates[1]).toFixed(5) + '°' + longPolarDirection

        logUtils.loggerText('GetBeautyCoordinates result: ', result)

        return result
    },

    getBeautyDate(dateUnparsed) {
        let parsedDateByLanguages = this.getJsonDate(dateUnparsed, true)
        let result = {}
        for(let language of languages) {
            result[language] = (parsedDateByLanguages && parsedDateByLanguages[language] && parsedDateByLanguages[language].monthText && parsedDateByLanguages[language].day) ? (languagesRules[language].dayFirst ? (parsedDateByLanguages[language].day + ' ' + parsedDateByLanguages[language].monthText) : (parsedDateByLanguages[language].monthText + ' ' + parsedDateByLanguages[language].day)) : undefined
        }
        return result
    },

    getBeautyCalories(calories) {
        if(!calories) return undefined
        return new Intl.NumberFormat('en-US').format(calories) + ' Cal'
    },

    getBeautyDatetime(dateUnparsed) {
        let parsedDateZeroByLanguages = this.getJsonDate(dateUnparsed, false)
        let parsedDateByLanguages = this.getJsonDate(dateUnparsed, true)
        let result = {}
        for(let language of languages) {
            result[language] = (parsedDateByLanguages && parsedDateByLanguages[language] && parsedDateZeroByLanguages && parsedDateZeroByLanguages[language] && parsedDateZeroByLanguages[language] && parsedDateByLanguages[language].monthText && parsedDateByLanguages[language].day && parsedDateByLanguages[language].hours && parsedDateZeroByLanguages[language].minutes) ? ((languagesRules[language].dayFirst ? (parsedDateByLanguages[language].day + ' ' + parsedDateByLanguages[language].monthText) : (parsedDateByLanguages[language].monthText + ' ' + parsedDateByLanguages[language].day)) + ', ' + parsedDateZeroByLanguages[language].hours + ':' + parsedDateZeroByLanguages[language].minutes) : undefined
        }
        return result
    },

    getJsonDuration(durationInSec) {
        let parsedDuration = {
            years: undefined,
            months: undefined,
            days: undefined,
            hours: undefined,
            minutes: undefined,
            seconds: undefined,
        }
        parsedDuration.years = Math.floor(durationInSec / 31536000)
        parsedDuration.months = Math.floor(durationInSec / 2592000)
        parsedDuration.days = Math.floor(durationInSec / 86400)
        parsedDuration.hours = Math.floor(durationInSec / 3600)
        parsedDuration.minutes = Math.floor((durationInSec - (parsedDuration.hours * 3600)) / 60)
        parsedDuration.seconds = durationInSec - (parsedDuration.hours * 3600) - (parsedDuration.minutes * 60)

        logUtils.loggerText('GetJsonDuration result: ', parsedDuration)

        return parsedDuration
    },

    getBeautyDuration(durationInSec) {
        let parsedDuration = this.getJsonDuration(durationInSec)
        let result = (parsedDuration 
            && parsedDuration.hours !== undefined 
            && parsedDuration.minutes !== undefined) ? (parsedDuration.hours + 'h ' + parsedDuration.minutes + 'm') : undefined
        if(parsedDuration.days && result) result = parsedDuration.days + ' d ' + result
        if(parsedDuration.months && result) result = parsedDuration.months + ' M ' + result
        if(parsedDuration.years && result) result = parsedDuration.years + ' Y ' + result
        return result
        // return parsedDuration.hours + 'h ' + parsedDuration.minutes + 'm ' + parsedDuration.seconds + 's'
    },

    getBeautyMovingTime(durationInSec) {
        let parsedDuration = this.getJsonDuration(durationInSec)
        // console.log('parsedDuration:', parsedDuration)
        let result = (parsedDuration 
            && parsedDuration.hours !== undefined 
            && parsedDuration.minutes !== undefined
            && parsedDuration.seconds !== undefined) ? (parsedDuration.hours + ':' + String(parsedDuration.minutes).padStart(2,"0") + ':' + String(parsedDuration.seconds).padStart(2,"0")) : undefined
        if(parsedDuration.days && result) result = parsedDuration.days + ' d ' + result
        if(parsedDuration.months && result) result = parsedDuration.months + ' M ' + result
        if(parsedDuration.years && result) result = parsedDuration.years + ' Y ' + result
        return result
        // return parsedDuration.hours + 'h ' + parsedDuration.minutes + 'm ' + parsedDuration.seconds + 's'
    },

    labelize(value) {
        return value.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toLowerCase() }).trim()
    },

    polylineDecode(str, precision) {
        let index = 0
        let lat = 0
        let lng = 0
        let coordinates = []
        let latitude_change
        let longitude_change
        let factor = Math.pow(10, precision || 5)
        
        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < str.length) {
            // Reset shift, result, and byte
            let byte;
            let shift = 0;
            let tempResult = 0;
            do {
                byte = str.charCodeAt(index++) - 63;
                tempResult |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
        
            latitude_change = ((tempResult & 1) ? ~(tempResult >> 1) : (tempResult >> 1));
        
            shift = tempResult = 0;
        
            do {
                byte = str.charCodeAt(index++) - 63;
                tempResult |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);
        
            longitude_change = ((tempResult & 1) ? ~(tempResult >> 1) : (tempResult >> 1));
        
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
    },

    removeEmoji(text) {
        return text.replace(/[\u{1F600}-\u{1F64F}]/gu, '')  // Emoticons
            .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')  // Symbols & Pictographs
            .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')  // Transport & Map Symbols
            .replace(/[\u{1F700}-\u{1F77F}]/gu, '')  // Alchemical Symbols
            .replace(/[\u{1F780}-\u{1F7FF}]/gu, '')  // Geometric Shapes Extended
            .replace(/[\u{1F800}-\u{1F8FF}]/gu, '')  // Supplemental Arrows-C
            .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')  // Supplemental Symbols and Pictographs
            .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')  // Chess Symbols
            .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')  // Symbols and Pictographs Extended-A
            .replace(/[\u{2600}-\u{26FF}]/gu, '')    // Miscellaneous Symbols
            .replace(/[\u{2700}-\u{27BF}]/gu, '')    // Dingbats
            .replace(/[\u{FE00}-\u{FE0F}]/gu, '')    // Variation Selectors
            .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, '')
            .trim(); //
    },

    getAverageSpeedMetric(distance, duration, mantissa) {
        return (!distance || !duration) ? 0 : Number(((distance / duration) * 3.6).toFixed(mantissa ? mantissa : 0))
    },

    getAverageSpeedImperial(distance, duration, mantissa) {
        return (!distance || !duration) ? 0 : Number((((distance / duration) * 3.6) * 0.621371).toFixed(mantissa ? mantissa : 0))
    },

    getPaceMetric(distance, duration) {
        let km = distance / 1000
        let durationMinutes = (duration / 60) / km
        let durationSeconds = ((durationMinutes - Math.floor(durationMinutes)) * 60).toFixed(0)
        durationSeconds = durationSeconds.length > 1 ? durationSeconds : ('0' + durationSeconds)
        return (!distance || !duration) ? 0 : Math.floor(durationMinutes) + ':' + durationSeconds
    },

    getPaceImperial(distance, duration) {
        let mi = (distance / 1000) * 0.621371
        let durationMinutes = (duration / 60) / mi
        let durationSeconds = ((durationMinutes - Math.floor(durationMinutes)) * 60).toFixed(0)
        durationSeconds = durationSeconds.length > 1 ? durationSeconds : ('0' + durationSeconds)
        return (!distance || !duration) ? 0 : Math.floor(durationMinutes) + ':' + durationSeconds
    },

    getSubTitle(element, unitOfMeasure) {
        let result = {}
        for(let language of languages) {
            result[language] = ''
            if(element.beautyDatetimeLanguages[language]) result[language] += element.beautyDatetimeLanguages[language]
            if(element.sportType) result[language] += (result[language].length ? ' | ' : '') + element.sportType 
            if(element[unitOfMeasure].beautyDistance) result[language] += (result[language].length ? ' | ' : '') + element[unitOfMeasure].beautyDistance 
            if(element.beautyDuration) result[language] += (result[language].length ? ' | ' : '') + element.beautyDuration
        }
        return result
    },

    elevate2(x,y) {
        return (x - y) * (x - y)
    },

    returnGradient(x,y) {
        let cos = Math.sqrt((x ** 2) - (y ** 2))
        return Number((y/cos).toFixed(4))
    },
    
    quadraticFunction(a,b) {
        return this.elevate2(a[0],b[0]) + this.elevate2(a[1],b[1])
    },

    getDistance(a,b) {
        return Math.sqrt(this.elevate2(a[0],b[0]) + this.elevate2(a[1],b[1]))
    },

    getOufCircle(cd,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart) {
        return this.quadraticFunction(cd,endCoordinates) > (dimentionCircleFinish * dimentionCircleFinish) && this.quadraticFunction(cd,startCoordinates) > (dimentionCircleStart * dimentionCircleStart)
    },

    comingOutsideMinus(cd,cdMinus,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart) {
        return this.getOufCircle(cd,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart) && !this.getOufCircle(cdMinus,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart)
    },

    comingInsideMinus(cd,cdMinus,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart) {
        return !this.getOufCircle(cd,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart) && this.getOufCircle(cdMinus,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart)
    },

    comingOutsidePlus(cd,cdPlus,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart) {
        return !this.getOufCircle(cd,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart) && this.getOufCircle(cdPlus,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart)
    },

    comingInsidePlus(cd,cdPlus,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart) {
        return this.getOufCircle(cd,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart) && !this.getOufCircle(cdPlus,endCoordinates,dimentionCircleFinish,startCoordinates,dimentionCircleStart)
    },

    getHalf(a,b) {
        return [(a[0]+b[0])/2,(a[1]+b[1])/2]
    },

    returnDatetimeStringified(dateTimeJs) {
        let y = dateTimeJs.getFullYear()
        let m = (String(dateTimeJs.getMonth() + 1)).padStart(2,'0')
        let d = String(dateTimeJs.getDate()).padStart(2,'0')
        let result = y + '-' + m + '-' + d
        logUtils.logger(result)
        return result
    },

    isMobile() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ]
        try {
            return navigator.userAgentData.mobile
        } catch (error) {
            if(String(error).includes('navigator')) return toMatch.some((toMatchItem) => {
                return navigator.userAgent.match(toMatchItem)
            })
        }
        return false
    },

    isInstagramAndroid() {
        const isInstagramInAppBrowser = /Instagram/.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);
        return isInstagramInAppBrowser && isAndroid
    },
    isInstagram() {
        const isInstagramInAppBrowser = /Instagram/.test(navigator.userAgent);
        return isInstagramInAppBrowser
    },

    getTitleExtension(text, extension) {
        return text + '.' + extension
    },

    getTitle(text) {
        text = this.removeEmoji(text).trim().replaceAll(' ', '_').toLowerCase()
        return (text && text.length) ? text : 'image'
    },

    getName(firstName, lastName) {
        return firstName && lastName ? firstName + ' ' + lastName : firstName ? firstName : lastName ? lastName : 'name'
    },

    getVisitId(u) {
        const match = u.match(/visitId-(\w+)/)
        return match ? match[1] : undefined
    },

    isRunLogic(t) {
        let variants = [
            'run',
            'walk',
            'trailrun'
        ]
        if(!t || (t && !t.length)) return false
        else return variants.includes(t.toLowerCase())
    },

    computeElevationGain(elevationStream) {
        if(!elevationStream || !elevationStream.length) return undefined
        let elevationGain = 0
        for(let i = 1; i < elevationStream.length; i++) {
            if(elevationStream[i] > elevationStream[i-1] && elevationStream[i] - elevationStream[i-1] < 0.7) {
                elevationGain += (elevationStream[i] - elevationStream[i-1])
            }
        }
        return Number(elevationGain.toFixed(0))
    },   

    computeDuration(durationStream) {
        if(!durationStream || !durationStream.length) return undefined
        let startRawTime = durationStream[0].time
        let endRawTime = durationStream[durationStream.length - 1].time
        console.log('startRawTime: ', startRawTime?.substring(0,10))
        console.log('endRawTime: ', endRawTime?.substring(0,10))
        let result = {
            movingTime: 0,
            movingTimeStructured: {
                hours: 0,
                minutes: 0,
                seconds: 0,
            },
            elapsedTime: 0,
            elapsedTimeStructured: {
                hours: 0,
                minutes: 0,
                seconds: 0,
            },
            startDate: startRawTime?.substring(0,10),
            startLocalDate: undefined,
            startDateTime: startRawTime,
            startLocalDateTime: undefined,
            startLocalDateTimeStructured: {
                year: startRawTime ? new Date(startRawTime).getFullYear() : undefined,
                month: startRawTime ? new Date(startRawTime).getMonth() + 1 : undefined,
                day: startRawTime ? new Date(startRawTime).getDate() : undefined,
                hours: startRawTime ? new Date(startRawTime).getHours() : undefined,
                minutes: startRawTime ? new Date(startRawTime).getMinutes() : undefined,
                seconds: startRawTime ? new Date(startRawTime).getSeconds() : undefined,
            },
            endDate: endRawTime?.substring(0,10),
            endLocalDate: undefined,
            endDateTime: endRawTime,
            endLocalDateTime: undefined,
            endLocalDateTimeStructured: {
                year: endRawTime ? new Date(endRawTime).getFullYear() : undefined,
                month: endRawTime ? new Date(endRawTime).getMonth() + 1 : undefined,
                day: endRawTime ? new Date(endRawTime).getDate() : undefined,
                hours: endRawTime ? new Date(endRawTime).getHours() : undefined,
                minutes: endRawTime ? new Date(endRawTime).getMinutes() : undefined,
                seconds: endRawTime ? new Date(endRawTime).getSeconds() : undefined,
            },
        }
        result.startLocalDate = this.getDateStringifiedFromStructured(result.startLocalDateTimeStructured)
        result.startLocalDateTime = this.getDatetimeStringifiedFromStructured(result.startLocalDateTimeStructured)
        result.endLocalDate = this.getDateStringifiedFromStructured(result.endLocalDateTimeStructured)
        result.endLocalDateTime = this.getDatetimeStringifiedFromStructured(result.endLocalDateTimeStructured)
        result.elapsedTime = Math.max(durationStream.length - 1, 1)
        let startMovingTime = this.getSecondsFrom1900(result.startLocalDateTimeStructured)
        let endMovingTime = this.getSecondsFrom1900(result.endLocalDateTimeStructured)
        result.movingTime = endMovingTime - startMovingTime
        result.movingTimeStructured.hours = Math.floor(result.movingTime / 3600)
        result.movingTimeStructured.minutes = Math.floor((result.movingTime - (result.movingTimeStructured.hours * 3600)) / 60)
        result.movingTimeStructured.seconds = result.movingTime - (result.movingTimeStructured.hours * 3600) - (result.movingTimeStructured.minutes * 60)
        result.elapsedTimeStructured.hours = Math.floor(result.elapsedTime / 3600)
        result.elapsedTimeStructured.minutes = Math.floor((result.elapsedTime - (result.elapsedTimeStructured.hours * 3600)) / 60)
        result.elapsedTimeStructured.seconds = result.elapsedTime - (result.elapsedTimeStructured.hours * 3600) - (result.elapsedTimeStructured.minutes * 60)
        console.log('computeDuration result: ', result)
        return result
    },

    getSecondsFrom1900(dateTimeStructured) {
        let result
        let yearsFrom1900 = dateTimeStructured.year - 1900
        let leapYears = Math.floor(yearsFrom1900 / 4) - Math.floor(dateTimeStructured.year / 100) + Math.floor(dateTimeStructured.year / 400) + 15
        console.log('leapYears: ', leapYears)
        let yearMinus1900inSeconds = (((dateTimeStructured.year - 1900) * 365) + leapYears) * 24 * 60 * 60
        let monthInSeconds = 0
        for(let i = 1; i < dateTimeStructured.month; i++) {
            if(i === 2) monthInSeconds += (28 + ((dateTimeStructured.year % 4 === 0 && dateTimeStructured.year % 100 !== 0) || (dateTimeStructured.year % 400 === 0) ? 1 : 0)) * 24 * 60 * 60
            else if([1,3,5,7,8,10,12].includes(i)) monthInSeconds += 31 * 24 * 60 * 60
            else monthInSeconds += 30 * 24 * 60 * 60
        }
        let dayInSeconds = (dateTimeStructured.day - 1) * 24 * 60 * 60
        let hoursInSeconds = dateTimeStructured.hours * 60 * 60
        let minutesInSeconds = dateTimeStructured.minutes * 60
        let seconds = dateTimeStructured.seconds
        result = yearMinus1900inSeconds + monthInSeconds + dayInSeconds + hoursInSeconds + minutesInSeconds + seconds
        
        return result
    },

    getDatetimeStringifiedFromStructured(dateTimeStructured) {
        let h = String(dateTimeStructured.hours).padStart(2,'0')
        let min = String(dateTimeStructured.minutes).padStart(2,'0')
        let s = String(dateTimeStructured.seconds).padStart(2,'0')
        let result = this.getDateStringifiedFromStructured(dateTimeStructured) + 'T' + h + ':' + min + ':' + s
        return result
    },
    getDateStringifiedFromStructured(dateTimeStructured) {
        let y = dateTimeStructured.year
        let m = (String(dateTimeStructured.month)).padStart(2,'0')
        let d = String(dateTimeStructured.day).padStart(2,'0')
        let result = y + '-' + m + '-' + d
        return result
    },
    haversineDistance(p1, p2) {
        const R = 6371000;

        const toRad = (deg) => deg * Math.PI / 180;

        const lat1 = toRad(p1[1]);
        const lon1 = toRad(p1[0]);
        const lat2 = toRad(p2[1]);
        const lon2 = toRad(p2[0]);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.asin(Math.sqrt(a));

        return R * c;
    },
    getTotalDistance(points) {
        let dist = 0;

        for (let i = 1; i < points.length; i++) {
            dist += this.haversineDistance(points[i - 1], points[i]);
        }

        return Number(dist.toFixed(0));
    }
}

export default utilsFunction