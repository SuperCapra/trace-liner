const vocabulary = {
    en: {
        BUTTON_TITLE: 'Load a GPX',
        BUTTON_BACK: '< BACK',
        BUTTON_ROUTE: 'ROUTE',
        BUTTON_ALTITUDE: 'ALTITUDE',
        BUTTON_GET_SVG: 'GET SVG',
    },
    it: {
        BUTTON_TITLE: 'Carica un GPX',
        BUTTON_BACK: '< INDIETRO',
        BUTTON_ROUTE: 'ROUTE',
        BUTTON_ALTITUDE: 'ALTITUDE',
        BUTTON_GET_SVG: 'GET SVG',
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