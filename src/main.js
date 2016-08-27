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
        })
    ]);
};
docReady(() => {
    hg.app(window.document.body, App(), App.render);
});
