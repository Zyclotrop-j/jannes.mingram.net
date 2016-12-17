import './styles.scss';
import './docReady/docready';
import './fonts/HeadlandOne-Regular.ttf';
import './fonts/Sintony-Regular.ttf';
import './fonts/HeadlandOne-Regular.ttf';
import './fonts/CantataOne-Regular.ttf';
import './fonts/fontawesome-webfont.eot';
import './fonts/fontawesome-webfont.svg';
import './fonts/fontawesome-webfont.ttf';
import './fonts/fontawesome-webfont.woff';
import './fonts/fontawesome-webfont.woff2';

import 'scrollsnap-polyfill/dist/scrollsnap-polyfill.bundled.js';
import vcf from 'vcf';
import hg from 'mercury';
import _ from 'lodash';

import contactdata from '../../website data/contact.json';
import contents from '../../website data/contents.json';
import skilldata from '../../website data/skills.json';


import cvitem from './widgets/cv-item';
import contact from './widgets/contact';
import main from './modules/main';
import cover from './modules/cover';
import skills from './modules/skills'
import summery from './modules/summery';
import heading from './tags/heading';
import grid from './tags/grid';


var h = hg.h;
const cat2h = {
                "lib": "Libraries and Frameworks",
                "lang": "Programming Langues or Dialects",
                "para": "Programming Paradigms",
                "std": "Standarts or de facto standards",
                "sw": "Software"
            };
var _app = null;

function App() {
    return hg.state({
        value: hg.value(0),
        contactInfo: hg.value([]),
        cv: hg.value([]),
        skills: hg.value([]),
        skillSearchTerm: hg.value(''),
        importancyLevel: hg.value(5),
        time: hg.value(Date.now()),
        contactname: hg.value(''),
        sortCVBy: hg.value('startDate'),
        sortCVDesc: hg.value(true),
        sortSKBy: hg.value('importance'), //level
        sortSKDesc: hg.value(true),
        skillCollapsedState: hg.array([]),
        flipcard: hg.value(false),
        contactDataVisible: hg.value(false),
        contactBorderVisible: hg.value(false),
        summeryIsTight: hg.value(false),
        channels: {
            clicks: incrementCounter,
            setSkillCollapsedState,
            setSkillSearchTermstate,
            setSkillImportancyLevel,
            flipcard,
        }
    });
}

function incrementCounter(state) {
    state.value.set(state.value() + 1);
}

function flipcard(state, data) {
    state.flipcard.set(data === 'auto' ? !state.flipcard() : data);
}

function setName(state, data) {
    state.contactname.set(data);
}

function setSkillImportancyLevel(state, data) {
    state.importancyLevel.set(parseInt(data.level));
}

function setSkillSearchTermstate(state, data) {
    state.skillSearchTerm.set(data.searchterm);
}

function setSkills(state, data) {
    state.skills.set(data);
    state.skillCollapsedState.set(_.range(data.length).map(() => hg.value(false)))
}

function setSkillCollapsedState(state, idx, isOpen) {
    state.skillCollapsedState.get(idx).set(
        isOpen || !state.skillCollapsedState.get(idx)()
    );
}

function setContactInfo(state, data) {
    state.contactInfo.set(data);
    console.log(vcf.fromJSON( data ));
    setName(state, vcf.fromJSON( data ).data.n._data.split(';')[1]);
}
function setCV(state, data) {
    state.cv.set(data);
}

function toogleContactDataVisibility(state, data) {
    state.contactDataVisible.set(data === 'auto' ? !state.contactDataVisible() : data);
}

function toogleContactBorderVisibility(state, data) {
    state.contactBorderVisible.set(data === 'auto' ? !state.contactBorderVisible() : data);
}

function tooglesummeryIsTight(state, data) {
    state.summeryIsTight.set(data === 'auto' ? !state.summeryIsTight() : data);
}

const isInitCB = _.once(() => {
   const scrollContainer = document.querySelector('body > div');
    scrollContainer.addEventListener("scroll", (e) =>
        toogleContactDataVisibility(_app, document.querySelector(".sticky-head-reveal").getBoundingClientRect().top < 0)
    );

    scrollContainer.addEventListener("scroll", (e) =>
        toogleContactBorderVisibility(_app, document.querySelector(".summery ").getBoundingClientRect().top > document.querySelector(".sticky-head").getBoundingClientRect().bottom)
    );

    scrollContainer.addEventListener("scroll", (e) =>
        tooglesummeryIsTight(_app, document.querySelector(".main-wrapper ").getBoundingClientRect().top < (window.innerHeight / 4))
    ); 
});

window.setInterval(() => _app.time.set(Date.now()), 500);
window.setTimeout(() => setContactInfo(_app, contactdata), 1000);
window.setTimeout(() => setCV(_app, contents), 2000);
window.setTimeout(() => setSkills(_app, skilldata), 1000);

App.render = function render(state) {
    
    const search = function(skill, term, importancyLevel) {
        if ((10 - importancyLevel) >= skill.importance) return false;
        if (!term) return true;
        return cat2h[skill.cat].indexOf(term) > -1 ||
        skill.name.indexOf(term) > -1 ||
        skill.description.indexOf(term) > -1;
    };
    
    let cv = [];
    if (!!state.cv) {
        const cats = [...new Set(state.cv.map(i => i.cat))];
        cv = cats.map(i => h('div.row.cv-section', [
            grid.col(heading.h3(i)),
            ...state.cv.filter(j => j.cat === i).sort((a, b) => state.sortCVDesc === (a[state.sortCVBy] < b[state.sortCVBy])).map(j => grid.col(cvitem(j, state.channels)))
        ]))
    }
    let skillz = [];
    let languages = [];
    if (!!state.skills) {
        const cats = [...new Set(state.skills.map(i => i.cat))];
        skillz = cats.filter(i => i !== 'hum').map(i => h('div.row', [
            grid.col(heading.h3(cat2h[i])),
            ..._.orderBy(state.skills.map((i, idx) => _.merge({}, i, {key: idx})).filter(j => j.cat === i).filter(i => search(i, state.skillSearchTerm, state.importancyLevel)), [state.sortSKBy], [state.sortSKDesc ? 'desc': 'asc'])
                .map(j => grid.col(skills(j, state.channels, state.skillCollapsedState[j.key]), {xs: 12, md: 6}))
        ]));
        languages = [h('div.row', [
            grid.col(heading.h3('Languages')),
            ..._.orderBy(state.skills.map((i, idx) => _.merge({}, i, {key: idx})).filter(j => j.cat === 'hum'), [state.sortSKBy], [state.sortSKDesc ? 'desc': 'asc'])
                .map(j => grid.col(skills(j, state.channels, state.skillCollapsedState[j.key]), {xs: 12, md: 6}))
        ])];
    }
    const contactInfo = (state.contactInfo.length > 0) ? vcf.fromJSON( state.contactInfo ) : undefined;
    return h('div#scrollContainer', [
        h(`div.container-fluid.sticky-head${state.contactDataVisible ? "" : ".hidden"}${state.contactBorderVisible ? "" : ".border"}`, contact(contactInfo)),
        cover(state, state.channels),
        h('hr.sticky-head-reveal.snapTo'),
        h(`div.main-wrapper${state.summeryIsTight ? '' : '.tight'}`, main([
            summery(state, state.channels),
            h('section.snapTo', [
                heading.h2('CV', ['visible-print-block']),
                ...cv,
            ]),
            h('section.snapTo', [
                heading.h2('Languages', ['visible-print-block']),
                ...languages
            ]),
            h('input', {
                'name': 'searchterm',
                'ev-keyup': hg.sendValue(state.channels.setSkillSearchTermstate),
            }),
            h('input', {
                'name': 'level',
                type: 'range',
                min: 1, max: 10, value: state.importancyLevel,
                'ev-change': hg.sendValue(state.channels.setSkillImportancyLevel),
            }),
            h('div', `Level: ${state.importancyLevel}`),
            h('section', [
                heading.h2('Skills', ['visible-print-block']),
                ...skillz
            ]),
        ])),
        h('hr.sticky-head-reveal.snapTo'),
    ]);
};

_app = App();

docReady(() => {
    hg.app(window.document.body, _app, App.render);
    isInitCB();
});
