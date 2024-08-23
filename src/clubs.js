import {ReactComponent as LogoMuraExtendedSVG} from './logoMuraExtended.svg';
import {ReactComponent as LogoNamaSVG} from './logoNama.svg'
import {ReactComponent as LogoMuraSVG} from './logoMura.svg'

const returnImageLogoNama = (classes, styles) => {
    return (<div id="canvasLogo" className={classes}>
            <LogoNamaSVG className="logo-club-svg" style={styles}/>
        </div>)
}
const returnHomepageLogoMura = (vocabulary, language) => {
    return (<div className="homepage-logo-width">
        <div className="margin-x">
        <p className="p-or p-login-or-size">{vocabulary[language].HOMEPAGE_PER}</p>
        </div>
        <LogoMuraExtendedSVG/>
    </div>)
}
const returnImageLogoMura = (classes, styles) => {
    return (<div id="canvasLogo" className={classes}>
        <LogoMuraSVG className="logo-club-svg" style={styles}/>
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
    }
]

export default clubs