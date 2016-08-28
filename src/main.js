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
import vcf from 'vcf';
import hg from 'mercury';


var h = hg.h;

function App() {
    return hg.state({
        value: hg.value(0),
        channels: {
            clicks: incrementCounter
        }
    });
}

function incrementCounter(state) {
    state.value.set(state.value() + 1);
}

App.render = function render(state) {
    return h('div.counter', [
        'The state ', h('code', 'clickCount'),
        ' has value: ' + state.value + '.', h('input.button', {
            type: 'button',
            value: 'Click me!',
            'ev-click': hg.send(state.channels.clicks)
        }),
        h('br'),
        'my vCard:',
        h('div', [
            vcf.fromJSON( contact ).toString( '4.0' ),
            h('br'),
            JSON.stringify(contact)
        ])
    ]);
};
docReady(() => {
    hg.app(window.document.body, App(), App.render);
});
