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

import vcf from 'vcf';
import hg from 'mercury';
import _ from 'lodash';
import smoothscroll from 'smoothscroll';

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
        filterVisible: hg.value(false),
        windowSize: hg.value('md'),
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

function toogleFilterVisibility(state, data) {
    state.filterVisible.set(data === 'auto' ? !state.filterVisible() : data);
}

function tooglesummeryIsTight(state, data) {
    state.summeryIsTight.set(data === 'auto' ? !state.summeryIsTight() : data);
}

function setWindowSize(state, data) {
    const tmp = Object.entries({
        xs: 0,
        sm: 544,
        md: 768,
        lg: 992,
        xl: 1200,
    }).filter(i => (i[1] <= data[0]));
    
    state.windowSize.set(tmp[tmp.length-1][0]);
}

let snapToGrid = true;
const isInitCB = _.once(() => {
   const scrollContainer = document.querySelector('body > div');
   let prevScroll = scrollContainer.scrollTop;
   
    scrollContainer.addEventListener("scroll", (e) =>
        toogleContactDataVisibility(_app, document.querySelector(".sticky-head-reveal").getBoundingClientRect().top <= 0)
    );

    scrollContainer.addEventListener("scroll", (e) =>
        toogleContactBorderVisibility(_app, document.querySelector(".summery ").getBoundingClientRect().top >= document.querySelector(".sticky-head").getBoundingClientRect().bottom)
    );
    
    scrollContainer.addEventListener("scroll", (e) =>
        toogleFilterVisibility(_app, 
            document.querySelector(".filterMenuOn ").getBoundingClientRect().top <= 0 &&
            document.querySelector(".filterMenuOff ").getBoundingClientRect().top > 0
        )
    );

    scrollContainer.addEventListener("scroll", (e) =>
        tooglesummeryIsTight(_app, document.querySelector(".main-wrapper ").getBoundingClientRect().top <= (window.innerHeight / 4))
    );
    
    scrollContainer.addEventListener("scroll", _.debounce((e) => {
            const targets = [...document.querySelectorAll(".snapTo")].map(i => (_.assign({ element: i }, _.pick(i.getBoundingClientRect(), ['top', 'bottom']))));
            const newScroll = scrollContainer.scrollTop;
            const isDown = newScroll > prevScroll;
            prevScroll = newScroll + 0;
            const closestElement = _.minBy(targets.filter(i => (isDown ? i.top >= -100 : i.top <= 100)), q => Math.abs(q.top));
            if (snapToGrid) {
                scrollContainer.scrollTop  = (scrollContainer.scrollTop + closestElement.top);
            }
            
    }, 200));
    
    window.addEventListener("resize", _.debounce((e) =>
        setWindowSize(_app, [window.innerWidth, window.innerHeight])
    ), 100);
    setWindowSize(_app, [window.innerWidth, window.innerHeight]);
    
   
});

window.setInterval(() => _app.time.set(Date.now()), 500);
window.setTimeout(() => setContactInfo(_app, contactdata), 1000);
window.setTimeout(() => setCV(_app, contents), 2000);
window.setTimeout(() => setSkills(_app, skilldata), 1000);

App.render = function render(state) {
    
    snapToGrid = state.windowSize !== "xs" && state.windowSize !== "sm";
    
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
            h('span.snapTo.off170'),
            grid.col(heading.h3(i, ['u-accent'])),
            ...state.cv.filter(j => j.cat === i).sort((a, b) => state.sortCVDesc === (a[state.sortCVBy] < b[state.sortCVBy])).reduce((p, j, jdx, arr) => p
                .concat((!(jdx % 4) && jdx > 1 && arr.length > (jdx + 1)) ? [h('span.snapTo.off150')] : [])
                .concat([grid.col(cvitem(j, state.channels))]),
            [])
        ]))
    }
    let skillz = [];
    let languages = [];
    let numberOfSkills = 0;
    if (!!state.skills) {
        const cats = [...new Set(state.skills.map(i => i.cat))];
        const filteredCats = cats.filter(i => i !== 'hum');
        numberOfSkills = state.skills.filter(j => filteredCats.some(q => q === j.cat)).filter(i => search(i, state.skillSearchTerm, state.importancyLevel)).length;
        skillz = [
                h('div.row',(grid.col(heading.h2('Skills', ['u-accent']), {xs: 12}))),
            ].concat(filteredCats.map((i, idx) => h('div.row', [
            (idx > 0) ? h('span.snapTo.off140') : '',
            grid.col(heading.h3(cat2h[i], ['u-accent', 'thin']), {xs: 12}),
            ...(() => {
                const tmp = _.orderBy(state.skills.map((i, idx) => _.merge({}, i, {key: idx})).filter(j => j.cat === i).filter(i => search(i, state.skillSearchTerm, state.importancyLevel)), [state.sortSKBy], [state.sortSKDesc ? 'desc': 'asc'])
                .map(j => grid.col(skills(j, state.channels, state.skillCollapsedState[j.key]), {xs: 12, md: 6}));
                return tmp;
            })()
        ])));
        languages = [heading.h2('Languages', ['u-accent']),, h('div.row', [
            ..._.orderBy(state.skills.map((i, idx) => _.merge({}, i, {key: idx})).filter(j => j.cat === 'hum'), [state.sortSKBy], [state.sortSKDesc ? 'desc': 'asc'])
                .map(j => grid.col(skills(j, state.channels, state.skillCollapsedState[j.key]), {xs: 12, md: 6}))
        ])];
    }
    const contactInfo = (state.contactInfo.length > 0) ? vcf.fromJSON( state.contactInfo ) : undefined;
    const searchSkillsId = 'searchSkills';
    const filterSkillsId = 'filterSkills';
    const skillSectionId = 'skillSectionId';
    return h('div#scrollContainer', [
        h(`div.container-fluid.sticky-head${state.contactDataVisible ? "" : ".hidden"}${state.contactBorderVisible ? "" : ".border"}`, contact(contactInfo, state)),
        h('span.snapTo'),
        cover(state, state.channels),
        h('span.sticky-head-reveal.snapTo'),
        h(`div.main-wrapper${state.summeryIsTight ? '' : '.tight'}`, main([
            summery(state, state.channels),
            h('section', [
                heading.h2('CV', ['visible-print-block']),
                ...cv,
            ]),
            h('span.snapTo.off130'),
            h('section.languages.item', [
                ...languages
            ]),
            h(`menu.navbar.navbar-light.bg-faded.container.bottom${state.filterVisible ? '' : '.hidden'}`, {
                type: 'toolbar'
            }, h('span.row', [
                    h('label.sr-only', {
                        'htmlFor': searchSkillsId,
                    }, 'Filter the list of skills using a search term'),
                    h('span.col-xs-4', h('input.form-control', {
                        'name': 'searchterm',
                        'id': searchSkillsId,
                        'placeholder': 'Search Skills',
                        'aria-controls': skillSectionId,
                        'ev-keyup': hg.sendValue(state.channels.setSkillSearchTermstate),
                    })),
                    h('span.col-xs-2'),
                    h('label.sr-only', {
                        'htmlFor': filterSkillsId,
                    }, 'Filter less known items from the list of skills (1) or display the entire range (10)'),
                    h('span.col-xs-6', h('span.row', [
                        
                        h('input.form-control.col-xs-6', {
                            'name': 'level',
                            id: filterSkillsId,
                            type: 'range',
                            'aria-controls': skillSectionId,
                            min: 1, max: 10, value: state.importancyLevel,
                            'ev-change': hg.sendValue(state.channels.setSkillImportancyLevel),
                        }),
                        h('span.col-xs-6.align-center', {
                            'aria-live': 'polite',
                            role: 'status'
                        }, [
                            h('span', `Filter: ${({
                                1: '1 (Most common)',
                                2: '2',
                                3: '3 (Very commonly known)',
                                4: '4',
                                5: '5 (Commonly known)',
                                6: '6',
                                7: '7',
                                8: '8 (Less commonly known)',
                                9: '9',
                                10: '10 (All)',
                            })[state.importancyLevel]}`),
                            h('span.sr-only', `Displaing ${numberOfSkills} Skills`)
                        ]),
                    ])),
                    
            ])),
            h('span.snapTo.off130.filterMenuOn'),
            h(`section.skills.item#${skillSectionId}`, [
                ...skillz
            ]),
            h('span.snapTo.off130.filterMenuOff'),
            h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),
            h('span.snapTo'),h('div', 'T1'),
            h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),
            h('span.snapTo'),h('div', 'T2'),
            h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),
            h('span.snapTo'),h('div', 'T3'),
            h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),
            h('span.snapTo'),h('div', 'T4'),
            h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),h('br'),
        ])),
    ]);
};

_app = App();

docReady(() => {
    hg.app(window.document.body, _app, App.render);
    isInitCB();
});
