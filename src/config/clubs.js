import {ReactComponent as LogoHomepageMuraSVG} from '../assets/images/logoMuraExtended.svg';
import {ReactComponent as LogoImageNamaSVG} from '../assets/images/logoNama.svg'
import {ReactComponent as LogoImageMuraSVG} from '../assets/images/logoMura.svg'
import {ReactComponent as LogoImageSEM} from '../assets/images/logoSEM.svg'
import {ReactComponent as LogoHomepageImageSEM} from '../assets/images/logoSEMExtended.svg'
import {ReactComponent as LogoImagePH} from '../assets/images/logoPH.svg'
import brandingPalette from './brandingPalette';

const styleLogoSem = {
    fill: brandingPalette.primary,
    // height: '20vh'
}

const styleLogoPH = {
    fill: brandingPalette.primary,
    // height: '20vh'
}

const styleLogoNama = {
    fill: brandingPalette.primary,
    // maxHeight: '15vh',
    // width: '20vh'
}

const returnImageLogoNama = (classes, styles) => {
    return (<div id="canvasLogo" className={classes}>
            <LogoImageNamaSVG className="logo-club-svg" style={styles}/>
        </div>)
}
const returnHomepageLogoNama = (vocabulary, language) => {
    return (<div className="homepage-logo-width">
        <div className="margin-x">
        <p className="p-or p-login-or-size">{vocabulary[language].HOMEPAGE_PER}</p>
        </div>
        <div className="center-logo-homepage">
            <LogoImageNamaSVG style={styleLogoNama}/>
        </div>
    </div>)
}
const returnImageLogoMura = (classes, styles) => {
    return (<div id="canvasLogo" className={classes}>
        <LogoImageMuraSVG className="logo-club-svg" style={styles}/>
    </div>)
}
const returnHomepageLogoMura = (vocabulary, language) => {
    return (<div className="homepage-logo-width">
        <div className="margin-x">
        <p className="p-or p-login-or-size">{vocabulary[language].HOMEPAGE_PER}</p>
        </div>
        <div className="center-logo-homepage">
            <LogoHomepageMuraSVG/>
        </div>
    </div>)
}
const returnImageLogoSem = (classes, styles) => {
    return (<div id="canvasLogo" className={classes}>
        <LogoImageSEM className="logo-club-svg" style={styles}/>
    </div>)
}
const returnHomepageLogoSem = (vocabulary, language) => {
    return (<div className="homepage-logo-width">
        <div className="margin-x">
        <p className="p-or p-login-or-size">{vocabulary[language].HOMEPAGE_PER}</p>
        </div>
        <div className="center-logo-homepage">
            <LogoHomepageImageSEM style={styleLogoSem}/>
        </div>
    </div>)
}
const returnImageLogoPH = (classes, styles) => {
    return (<div id="canvasLogo" className={classes}>
        <LogoImagePH className="logo-club-svg" style={styles}/>
    </div>)
}
const returnHomepageLogoPH = (vocabulary, language) => {
    return (<div className="homepage-logo-width">
        <div className="margin-x">
        <p className="p-or p-login-or-size">{vocabulary[language].HOMEPAGE_PER}</p>
        </div>
        <div className="center-logo-homepage">
            <LogoImagePH style={styleLogoPH}/>
        </div>
    </div>)
}

const clubs = [{
        name: 'nama-crew',
        urlKey: '/nama-crew',
        hasHomepageLogo: true,
        homepageLogo: returnHomepageLogoNama,
        hasImageLogo: true,
        imageLogo: returnImageLogoNama,
    },{
        name: 'mura-sunset-ride',
        urlKey: '/mura-sunset-ride',
        hasHomepageLogo: true,
        homepageLogo: returnHomepageLogoMura,
        hasImageLogo: true,
        imageLogo: returnImageLogoMura,
    },{
        name: 'settimana-europea-mobilita',
        urlKey: '/sem',
        hasHomepageLogo: true,
        homepageLogo: returnHomepageLogoSem,
        hasImageLogo: true,
        imageLogo: returnImageLogoSem,
        language: 'it',
    },{
        name: 'ph',
        urlKey: '/ph',
        hasHomepageLogo: true,
        homepageLogo: returnHomepageLogoPH,
        hasImageLogo: true,
        imageLogo: returnImageLogoPH,
    }
]

export default clubs