const vocabulary = {
    en: {
        BUTTON_TITLE: 'Load a GPX',
        BUTTON_BACK: '< BACK',
        BUTTON_ROUTE: 'ROUTE',
        BUTTON_ALTITUDE: 'ALTITUDE',
        BUTTON_GET_SVG: 'GET SVG',
        TEXT_RESOLUTION: 'RESOLUTION',
        TEXT_BOTTOM_PADDING: 'PADDING',
        TEXT_THICKNESS: 'THICKNESS',
        TEXT_MODAL_MOBILE: 'Attention, mobile deviced could not support the export and the utilization of svg files',
        TEXT_FILL: 'FILL',
        TEXT_UNDER_BORDER: 'BORDER'
    },
    it: {
        BUTTON_TITLE: 'Carica un GPX',
        BUTTON_BACK: '< INDIETRO',
        BUTTON_ROUTE: 'ROUTE',
        BUTTON_ALTITUDE: 'ALTITUDE',
        BUTTON_GET_SVG: 'GET SVG',
        TEXT_RESOLUTION: 'RISOLUZIONE',
        TEXT_BOTTOM_PADDING: 'PADDING',
        TEXT_THICKNESS: 'THICKNESS',
        TEXT_MODAL_MOBILE: 'Attenzione, i dispositivi mobile potrebbero non supportare correttamente l\'export e l\'utilizzo dei file svg',
        TEXT_FILL: 'FILL',
        TEXT_UNDER_BORDER: 'BORDER'
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