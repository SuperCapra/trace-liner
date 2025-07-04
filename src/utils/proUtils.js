const utilsFuctions = {
    normalizeCoordinates(coordinates, width, height, resolution, tickness) {
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
        let zoomFactor = Math.min(width / gapX, height / gapY)
        let lengthCoordinates = coordinates.length
        let ratioForResolution = Math.round(lengthCoordinates / 250)
        let resolutionPercentage = lengthCoordinates / 100
        let resolutionUsing = (resolution * resolutionPercentage ) / ratioForResolution
        for(let i = 0; i < lengthCoordinates; i++) {
            let coordinate = coordinates[i]
            if(i % Math.floor(lengthCoordinates / resolutionUsing) === 0 || i === 0 || i === lengthCoordinates - 1) {
                let aX = (coordinate[0] - mapCenterX) * zoomFactor + width / 2
                let aY =  - (coordinate[1]  - mapCenterY) * zoomFactor + height / 2
                normalizedCoordinates.push([aX, aY])
            }
        }
                console.log('normalizedCoordinates:', normalizedCoordinates)
        let minXTransformed = Math.min(...normalizedCoordinates.map(x => x[0]))
        console.log('minXTransformed',minXTransformed)
        for(let i = 0; i < normalizedCoordinates.length; i++) {
            normalizedCoordinates[i] = [normalizedCoordinates[i][0] - minXTransformed + (tickness / 2),normalizedCoordinates[i][1]]
        }
        console.log('normalizedCoordinates:', normalizedCoordinates)
        return normalizedCoordinates
    },

    normalizeAltitude(altitudeArray, width, height, resolution, tickness) {
        if(!altitudeArray || (altitudeArray && !altitudeArray.length)) return undefined
        let normalizedAltitude = []
        let minY = Math.min(...altitudeArray, 0)
        let maxY = Math.max(...altitudeArray)
        let minX = 0
        let maxX = altitudeArray.length
        let gapAltitude = maxY - minY
        let zoomFactorX = ((width - tickness) / maxX)
        let zoomFactorY = ((height - tickness) / gapAltitude)
        let ratioForResolution = Math.round(maxX / 250)
        let resolutionPercentage = maxX / 100
        let resolutionUsing = (resolution * resolutionPercentage) / ratioForResolution
        for(let i = 0; i < maxX; i++) {
            if(i % Math.floor(maxX / resolutionUsing) === 0 || i === 0 || i === maxX - 1) {
                let aX = (i * zoomFactorX) + (tickness / 2)
                let aY = height - (altitudeArray[i] * zoomFactorY) - (tickness / 2)
                normalizedAltitude.push([aX,aY])
            }
        }
        return normalizedAltitude
    },

    getRoutePath(coordinates, width, height, thickness) {
        let result = {
            pathData: undefined,
            widthRoute: undefined,
            heightRoute: undefined
        }
        let minX = Math.min(...coordinates.map(x => x[0]))
        let minY = Math.min(...coordinates.map(x => x[1]))
        let maxX = Math.max(...coordinates.map(x => x[0]))
        let maxY = Math.max(...coordinates.map(x => x[1]))
        if(!coordinates || (coordinates && !coordinates.length)) return undefined
        console.log('getRoutePath, coordinates:', coordinates)
        let pathData = 'M ' + coordinates[0][0] + ',' + coordinates[0][1]
        for (let i = 1; i < coordinates.length; i++) pathData += 'L ' + coordinates[i][0] + ',' + coordinates[i][1]
        result.pathData = pathData
        result.widthRoute = maxX - minX + thickness
        result.heightRoute = height + (thickness / 2)
        return result
    },

    getAltitudePath(altritudeStream, height, padding, notNormalizedAltitudeStream, tickness, underBorder) {
        let result = {
            pathData: undefined,
            heightAltitude: undefined,
        }
        if(!altritudeStream || (altritudeStream && !altritudeStream.length)) return undefined;
        let maxY = Math.max(...altritudeStream.map(x => x[1]))
        let realMaxY = Math.max(...notNormalizedAltitudeStream.map(x => x[1]))
        let realMinY = Math.min(...notNormalizedAltitudeStream.map(x => x[1]))
        let gapRealY = realMaxY - realMinY
        let totalPadding = maxY * (1 + (underBorder ? padding : 0) / 100)
        let pathData = 'M ' + altritudeStream[0][0] + ',' + altritudeStream[0][1]

        for (let i = 1; i < altritudeStream.length; i++) 
            pathData += 'L ' + altritudeStream[i][0] + ',' + altritudeStream[i][1]

        if(underBorder) {
            pathData += 'L ' + altritudeStream[altritudeStream.length - 1][0] + ',' + altritudeStream[altritudeStream.length - 1][1]
            pathData += 'L ' + altritudeStream[altritudeStream.length - 1][0] + ',' + (totalPadding - tickness)
            pathData += 'L ' + altritudeStream[0][0] + ',' + (totalPadding - tickness)
            pathData += 'L ' + altritudeStream[0][0] + ',' + altritudeStream[0][1]
            pathData += ' Z';
        }
        result.pathData = pathData
        result.heightAltitude = totalPadding + (underBorder ? 0 : tickness)
        return result;
    }
}

export default utilsFuctions;