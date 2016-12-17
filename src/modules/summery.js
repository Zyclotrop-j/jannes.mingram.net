import hg from 'mercury';
import lodash from 'lodash';
import summeryText from '../../../website data/summery';
const h = hg.h;

export default function(state, channel) {
    return h(`div.summery.row${state.flipcard ? '.flipped': ''}`, [
        h('div.col-xs'),
        h(`div.col-xs-6.show-hide.as-cards${state.flipcard ? '.flip': ''}`, {
            'ev-click': hg.send(channel.flipcard, 'auto'),
        }, [
            h('div.me.row.hide', [
                h('div.name.col-xs-8', [
                    h('h2.signature', 'Jannes Mingram'),
                    h('p.lead', { innerHTML: summeryText.short.replace(/\n/g, '<br />') })
                ]),
                h('div.picture.col-xs-4', [
                    h('img.img-circle.pull-xs-right.img-fluid', {
                        attributes: {
                            'width': '200px',
                            'height': '200px',
                        },
                        src: 'https://lh3.googleusercontent.com/-ASLHoAGoOd8/VQy_KslEVsI/AAAAAAACraA/NDgax-Jp5I8/s0-U-I/professional_highres.jpg',
                        alt: 'Me, Jannes Mingram'
                    })
                ]),
                h('button.sr-only-not-focus.btn.btn-primary', {
                    'type': 'button',
                    'ev-click': hg.send(channel.flipcard, 'auto'),
                }, 'Toogle card')
            ]),
            h('div.me.row.show', [
                h('div.name.col-xs-12', [
                    h('p', { innerHTML: summeryText.long.replace(/\n/g, '<br />') })
                 ]),
                 h('button.sr-only-not-focus.btn.btn-primary', {
                    'type': 'button',
                    'ev-click': hg.send(channel.flipcard, 'auto'),
                }, 'Toogle card')
            ])
        ]),
    h('div.col-xs')
    ]);
};