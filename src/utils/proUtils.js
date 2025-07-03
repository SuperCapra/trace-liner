const utilsFuctions = {
    normalizeCoordinates(coordinates, width, height) {
        if(!coordinates || (coordinates && !coordinates.length)) return undefined
        let normalizedCoordinates = []
        let minX = Math.min(...coordinates.map(x => x[0]))
        let minY = Math.min(...coordinates.map(x => x[1]))
        let maxX = Math.max(...coordinates.map(x => x[0]))
        let maxY = Math.max(...coordinates.map(x => x[1]))
        console.log('Math.min X:', minX)
        console.log('Math.min Y:', minY)
        console.log('Math.max X:', maxX)
        console.log('Math.max Y:', maxY)
        let gapX = maxX - minX
        let gapY = maxY - minY
        let mapCenterX = (maxX + minX) / 2
        let mapCenterY = (maxY + minY) / 2
        let zoomFactor = Math.min(width / gapX, height / gapY) * 0.95
        for(let coordinate of coordinates) {
            let aX = (coordinate[0] - mapCenterX) * zoomFactor + width / 2
            let aY =  - (coordinate[1] - mapCenterY) * zoomFactor + height / 2
            normalizedCoordinates.push([aX, aY])
        }
        return normalizedCoordinates
    },

    normalizeAltitude(altitudeArray, width, height) {
        if(!altitudeArray || (altitudeArray && !altitudeArray.length)) return undefined
        let normalizedAltitude = []
        let minY = Math.min(...altitudeArray, 0)
        let maxY = Math.max(...altitudeArray)
        let minX = 0
        let maxX = altitudeArray.length
        let gapAltitude = maxY - minY
        let zoomFactorX = (width / maxX) * 0.95
        let zoomFactorY = (height / gapAltitude) * 0.8
        for(let i = 0; i < altitudeArray.length; i++) {
            let aX = i * zoomFactorX
            let aY = height - (altitudeArray[i] * zoomFactorY)
            normalizedAltitude.push([aX,aY])
        }
        return normalizedAltitude
    },

    getRoutePath(coordinates) {
        if(!coordinates || (coordinates && !coordinates.length)) return undefined

        let pathData = 'M ' + coordinates[0][0] + ',' + coordinates[0][1]
        for (let i = 1; i < coordinates.length; i++) pathData += 'L ' + coordinates[i][0] + ',' + coordinates[i][1]

        return pathData
    },

    getAltitudePath(altritudeStream, height) {
        if(!altritudeStream || (altritudeStream && !altritudeStream.length)) return undefined;

        let pathData = 'M ' + altritudeStream[0][0] + ',' + altritudeStream[0][1]
        let numberOfPoints = altritudeStream.length

        for (let i = 1; i < altritudeStream.length; i++) 
            if(i % Math.floor(numberOfPoints/100) === 0) 
                pathData += 'L ' + altritudeStream[i][0] + ',' + altritudeStream[i][1]

        pathData += 'L ' + altritudeStream[altritudeStream.length - 1][0] + ',' + altritudeStream[altritudeStream.length - 1][1]
        pathData += 'L ' + altritudeStream[altritudeStream.length - 1][0] + ',' + height
        pathData += 'L ' + altritudeStream[0][0] + ',' + height
        pathData += 'L ' + altritudeStream[0][0] + ',' + altritudeStream[0][1]

        return pathData;
    }
}

export default utilsFuctions;