import utils from "./utils"
const apiUtils = {
    getUrlHost() {
        let href = window.location.href
        let pathname = window.location.pathname + '?'
        return href.substring(0,href.indexOf(pathname))
    },
    // GMT datetime formatted to "yyyy-MM-ddTHH:mm:ss.SSSZ"
    getTimestampGMT() {
        const now = new Date();

        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
        const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');
    
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    },
    // Local datetime formatted to "yyyy-MM-ddTHH:mm:ss.SSS+00:00"
    getTimestampLocal() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    },
    getTimezoneOffset() {
        const now = new Date();
        const offsetMinutes = now.getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
        const offsetRemainingMinutes = Math.abs(offsetMinutes) % 60;
        const sign = offsetMinutes <= 0 ? "+" : "-";
        
        return `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetRemainingMinutes).padStart(2, '0')}`
    },
    getTimezoneName() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
    getModifiedFields() {
        return {
            lastmodified_at: this.getTimestampGMT(),
            lastmodified_at_local: this.getTimestampLocal(),
            lastmodified_timezone_offset: this.getTimezoneOffset(),
            lastmodified_timezone_name: this.getTimezoneName()
        }
    },
    getCreatedFields() {
        let result = {
            created_at: this.getTimestampGMT(),
            created_at_local: this.getTimestampLocal(),
            created_timezone_offset: this.getTimezoneOffset(),
            created_timezone_name: this.getTimezoneName(),
        }
        return result
    },
    getTimestampFields() {
        let result = {
            timestamp: this.getTimestampGMT(),
            timestamp_local: this.getTimestampLocal(),
            timezone_offset: this.getTimezoneOffset(),
            timezone_name: this.getTimezoneName(),
        }
        return result
    },
    getVisitBody() {
        let result = {
            user_id : null,
            activity_id : null,
            export_id : null,
            has_strava_login : false,
            has_loaded_gpx : false,
            has_selected_activity : false,
            has_exported : false,
            type_export : null,
            is_mobile : utils.isMobile(),
        }
        result = {...result,...this.getTimestampFields()}
        return result
    },
    getUserBodyStrava(athleteData,creating,updating) {
        let result = {
            strava_id : athleteData.id,
            name : utils.getName(athleteData.firstname,athleteData.lastname),
            firstname : athleteData.firstname,
            lastname : athleteData.lastname,
            city : athleteData.city,
            country : athleteData.country,
            state : athleteData.state,
            sex : athleteData.sex,
            username : athleteData.username,
            token : null,
            has_strava : true,
        }
        if(creating) result = {...result, ...this.getCreatedFields()}
        if(updating) result = {...result, ...this.getModifiedFields()}
        return result
    },
    getUserBodyNoStrava() {
        let result = {
            name : 'GPX loader'
        }
        result = {...result,...this.getCreatedFields(),...this.getModifiedFields()}
        return result
    },
    getActivityBody(activityData,creating,updating,userId) {
        let result = {
            user_id : userId,
            strava_id : activityData.id,
            average_heartrate : activityData.average_heartrate,
            average_speed : activityData.average_speed,
            average_temp : activityData.average_temp,
            average_watts : activityData.average_watts,
            device_watts : activityData.device_watts,
            display_hide_heartrate_option : activityData.display_hide_heartrate_option,
            distance : activityData.distance,
            elapsed_time : Math.round(activityData.elapsed_time),
            elev_high : activityData.elev_high,
            elev_low : activityData.elev_low,
            end_lat : activityData.end_latlng && activityData.end_latlng.length ? activityData.end_latlng[0] : undefined,
            end_lng : activityData.end_latlng && activityData.end_latlng.length ? activityData.end_latlng[1] : undefined,
            external_id : activityData.external_id,
            has_heartrate : activityData.has_heartrate,
            heartrate_opt_out : activityData.heartrate_opt_out,
            kilojoules : activityData.kilojoules,
            location_city : activityData.location_city,
            location_country : activityData.location_country,
            location_state : activityData.location_state,
            max_heartrate : activityData.max_heartrate,
            max_speed : activityData.max_speed,
            moving_time : Math.round(activityData.moving_time),
            name : activityData.name,
            sport_type : activityData.sport_type,
            start_date : activityData.start_date,
            start_date_local : activityData.start_date_local,
            start_lat : activityData.start_latlng && activityData.start_latlng.length ? activityData.start_latlng[0] : undefined,
            start_lng : activityData.start_latlng && activityData.start_latlng.length ? activityData.start_latlng[1] : undefined,
            summary_map : activityData.map && activityData.map.summary_map ? activityData.map.summary_map : undefined,
            total_elevation_gain : Math.round(activityData.total_elevation_gain),
        }
        if(creating) result = {...result, ...this.getCreatedFields()}
        if(updating) result = {...result, ...this.getModifiedFields()}
        return result
    },
    getExportBody(exportData,activityId,userId) {
        let result = {
            user_id : userId,
            activity_id : activityId,
            color : exportData.color,
            filter : exportData.filter,
            resolution : exportData.resolution,
            image : exportData.image,
            mode : exportData.mode,
            size : exportData.size,
            unit : exportData.unit,
            type : exportData.exportType,
            show_average : exportData.showaverage,
            show_coordinates : exportData.showcoordinates,
            show_date : exportData.showdate,
            show_distance : exportData.showdistance,
            show_duration : exportData.showduration,
            show_elevation : exportData.showelevation,
            show_power : exportData.showpower,
            show_name : exportData.showname,
        }
        return {...result, ...this.getTimestampFields()}
    },
    getErrorLogsBody(visitId,message,info,component,f,t) {
        let result = {
            visit_id : visitId,
            message : message,
            info: info,
            component : component,
            function : f,
            type : t,
            is_error : true,
        }
        return {...result, ...this.getTimestampFields()}
    }
}

export default apiUtils