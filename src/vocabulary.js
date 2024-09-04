const vocabulary = {
    en: {
        MONTH_1: 'January',
        MONTH_2: 'February',
        MONTH_3: 'March',
        MONTH_4: 'April',
        MONTH_5: 'May',
        MONTH_6: 'June',
        MONTH_7: 'July',
        MONTH_8: 'August',
        MONTH_9: 'September',
        MONTH_10: 'October',
        MONTH_11: 'November',
        MONTH_12: 'December',
        HOMEPAGE_SHARE_BY: 'SHARE YOUR RIDE BY',
        HOMEPAGE_LOGIN_STRAVA: 'LOGIN TO STRAVA',
        HOMEPAGE_OR: 'OR',
        HOMEPAGE_LOAD: 'LOAD A GPX',
        HOMEPAGE_PER: 'X',
        HOMEPAGE_BACK: 'BACK',
        HOMEPAGE_SELECT_ACTIVITY: 'SELECT AN ACTIVITY',
        HOMEPAGE_BEFORE_START: 'BEFORE YOU CAN START YOU HAVE TO LOAD SOME ACTIVITIES',
        BUTTON_TITLE: 'TITLE',
        BUTTON_DATE: 'DATE',
        BUTTON_DISTANCE: 'DISTANCE',
        BUTTON_DURATION: 'DURATION',
        BUTTON_ELEVATION: 'ELEVATION',
        BUTTON_AVERAGE: 'AVERAGE',
        BUTTON_POWER: 'POWER',
        BUTTON_COORDINATES: 'COORDINATES',
        IMAGE_DISTANCE: 'Distance',
        IMAGE_DURATION: 'Duration',
        IMAGE_ELEVATION: 'Elevation',
        IMAGE_AVERAGE: 'Average',
        IMAGE_POWER: 'Power',
        IMAGE_COORDINATES: 'Coordinates',
    },
    it: {
        MONTH_1: 'Gennaio',
        MONTH_2: 'Febbraio',
        MONTH_3: 'Marzo',
        MONTH_4: 'Aprile',
        MONTH_5: 'Maggio',
        MONTH_6: 'Giugno',
        MONTH_7: 'Luglio',
        MONTH_8: 'Agosto',
        MONTH_9: 'Settembre',
        MONTH_10: 'Ottobre',
        MONTH_11: 'Novembre',
        MONTH_12: 'Dicembre',
        HOMEPAGE_SHARE_BY: 'CONDIVIDI LA TUA ATTIVITÀ TRAMITE',
        HOMEPAGE_LOGIN_STRAVA: 'LOGIN A STRAVA',
        HOMEPAGE_OR: 'O',
        HOMEPAGE_LOAD: 'CARICA UN GPX',
        HOMEPAGE_PER: 'X',
        HOMEPAGE_BACK: 'INDIETRO',
        HOMEPAGE_SELECT_ACTIVITY: 'SELEZIONA UN\'ATTIVITÀ',
        HOMEPAGE_BEFORE_START: 'PRIMA DI INIZIARE DEVI CARICARE ALMENO UN\'ATTIVITÀ SU STRAVA',
        BUTTON_TITLE: 'TITOLO',
        BUTTON_DATE: 'DATA',
        BUTTON_DISTANCE: 'DISTANZA',
        BUTTON_DURATION: 'DURATA',
        BUTTON_ELEVATION: 'DISLIVELLO',
        BUTTON_AVERAGE: 'MEDIA',
        BUTTON_POWER: 'POTENZA',
        BUTTON_COORDINATES: 'COORDINATE',
        IMAGE_DISTANCE: 'Distanza',
        IMAGE_DURATION: 'Durata',
        IMAGE_ELEVATION: 'Dislivello',
        IMAGE_AVERAGE: 'Media',
        IMAGE_POWER: 'Potenza',
        IMAGE_COORDINATES: 'Coordinate',
    }
}

const languages = ['en','it']

const languagesRules = {
    'en' : {
        dayFirst: false
    },
    'it' : {
        dayFirst: true
    }
}

export {vocabulary, languages, languagesRules}