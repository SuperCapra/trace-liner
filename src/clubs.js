import {ReactComponent as LogHomepageMuraSVG} from './images/logoMuraExtended.svg';
import {ReactComponent as LogoImageNamaSVG} from './images/logoNama.svg'
import {ReactComponent as LogoImageMuraSVG} from './images/logoMura.svg'
import {ReactComponent as LogoImageSEM} from './images/logoSEM.svg'
import brandingPalette from './brandingPalette';

const styleLogoSem = {
    fill: brandingPalette.primary,
    height: '15vh'
}

const returnImageLogoNama = (classes, styles) => {
    return (<div id="canvasLogo" className={classes}>
            <LogoImageNamaSVG className="logo-club-svg" style={styles}/>
        </div>)
}
const returnHomepageLogoMura = (vocabulary, language) => {
    return (<div className="homepage-logo-width">
        <div className="margin-x">
        <p className="p-or p-login-or-size">{vocabulary[language].HOMEPAGE_PER}</p>
        </div>
        <LogHomepageMuraSVG/>
    </div>)
}
const returnHomepageLogoSem = (vocabulary, language) => {
    return (<div className="homepage-logo-width">
        <div className="margin-x">
        <p className="p-or p-login-or-size">{vocabulary[language].HOMEPAGE_PER}</p>
        </div>
        <LogoImageSEM style={styleLogoSem}/>
    </div>)
}
const returnImageLogoMura = (classes, styles) => {
    return (<div id="canvasLogo" className={classes}>
        <LogoImageMuraSVG className="logo-club-svg" style={styles}/>
    </div>)
}
const returnImageLogoSem = (classes, styles) => {
    return (<div id="canvasLogo" className={classes}>
        <LogoImageSEM className="logo-club-svg" style={styles}/>
    </div>)
}

const clubs = [{
        name: 'nama-crew',
        urlKey: '/nama-crew',
        hasHomepageLogo: false,
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
    },{
        name: 'dev-admin',
        urlKey: '/dev-admin',
        hasHomepageLogo: false,
        hasImageLogo: false,
    }
]

export default clubs