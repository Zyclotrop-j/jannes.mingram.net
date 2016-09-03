import './styles.scss';
import './docReady/docready';
import './fonts/HeadlandOne-Regular.ttf';
import './fonts/Sintony-Regular.ttf';
import './fonts/HeadlandOne-Regular.ttf';
import './fonts/fontawesome-webfont.eot';
import './fonts/fontawesome-webfont.svg';
import './fonts/fontawesome-webfont.ttf';
import './fonts/fontawesome-webfont.woff';
import './fonts/fontawesome-webfont.woff2';
import contact from '../../website data/contact.json';
import contents from '../../website data/contents.json';
import vcf from 'vcf';
import hg from 'mercury';

import cvitem from './widgets/cv-item';
import vcard from './widgets/contact';
import main from './modules/main';
import heading from './tags/heading';
import grid from './tags/grid';


var h = hg.h;
var _app = null;

function App() {
    return hg.state({
        value: hg.value(0),
        contactInfo: hg.value([]),
        cv: hg.value([]),
        channels: {
            clicks: incrementCounter
        }
    });
}

function incrementCounter(state) {
    state.value.set(state.value() + 1);
}

function setContactInfo(state, data) {
    state.contactInfo.set(data);
}
function setCV(state, data) {
    state.cv.set(data);
}

window.setTimeout(() => setContactInfo(_app, contact), 1000);
window.setTimeout(() => setCV(_app, contents), 2000);

App.render = function render(state) {
    let cv = [];
    if (!!state.cv) {
        const cats = [...new Set(state.cv.map(i => i.cat))];
        cv = cats.map(i => h('div.row', [
            grid.col(heading.h3(i)),
            ...state.cv.filter(j => j.cat === i).map(j => grid.col(cvitem(j, state.channels)))
        ]))
    }
    const contactInfo = (state.contactInfo.length > 0) ? vcf.fromJSON( state.contactInfo ) : undefined;
    return main([
        vcard(contactInfo),
        heading.h2('CV', ['visible-print-block']),
        ...cv,
    ]);
};

_app = App();

docReady(() => {
    hg.app(window.document.body, _app, App.render);
});
