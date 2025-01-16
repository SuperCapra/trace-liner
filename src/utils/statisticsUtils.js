const statisticsUtils = {
    getFormattedDateTime(timestamp,returnDay,returnMonth,returnYear) {
        try {
            if(!timestamp) return null
            let year = timestamp.substring(0,4)
            let month = timestamp.substring(5,7)
            let day = timestamp.substring(8,10)
            let hour = timestamp.substring(11,13)
            let min = timestamp.substring(14,16)
            // let sec = timestamp.substring(17,19)
    
            let monthString = ''
            switch (month) {
                case '01':
                    monthString = 'Jan'
                    break
                case '02':
                    monthString = 'Feb'
                    break
                case '03':
                    monthString = 'Mar'
                    break
                case '04':
                    monthString = 'Apr'
                    break
                case '05':
                    monthString = 'May'
                    break
                case '06':
                    monthString = 'Jun'
                    break
                case '07':
                    monthString = 'Jul'
                    break
                case '08':
                    monthString = 'Aug'
                    break
                case '09':
                    monthString = 'Sep'
                    break
                case '10':
                    monthString = 'Oct'
                    break
                case '11':
                    monthString = 'Nov'
                    break
                default:
                    monthString = 'Dic'
            }
            let result = day + '-' + month + '-' + year.substring(2,4)

            if(returnYear) return year
            else if(returnMonth) return monthString + ' ' + year
            else if(returnDay) return day + '-' + month + '-' + year.substring(2,4)
            else return  day + '-' + month + '-' + year.substring(2,4) + ' ' + hour + ':' + min
        } catch (e) {
            return ''
        }
    },
    getFormattedDay(timestamp) {
        return this.getFormattedDateTime(timestamp,true)
    },
    getFormattedMonth(timestamp) {
        return this.getFormattedDateTime(timestamp,false,true)
    },
    getFormattedYear(timestamp) {
        return this.getFormattedDateTime(timestamp,false,false,true)
    }
}

export default statisticsUtils