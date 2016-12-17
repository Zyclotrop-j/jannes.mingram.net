import hg from 'mercury';
import _ from 'lodash';
import vcf from 'vcf';
import summeryText from '../../../website data/summery';
const h = hg.h;

const parseCV = _.memoize(d => vcf.fromJSON(d));

export default function(state, channel) {
    const name = (state.contactInfo.length && parseCV(state.contactInfo).data.fn._data) || '... loading ...';
    const photo = state.contactInfo.length && parseCV(state.contactInfo).data.photo._data;
    
    return h(`div.summery.row${state.flipcard ? '.flipped': ''}`, [
        h('div.col-xs'),
        h(`div.col-xs-6.show-hide.as-cards${state.flipcard ? '.flip': ''}`, {
            'ev-click': hg.send(channel.flipcard, 'auto'),
        }, [
            h('div.me.row.hide', [
                h('div.name.col-xs-8', [
                    h('h2.signature', name),
                    h('p.lead', { innerHTML: summeryText.short.replace(/\n/g, '<br />') })
                ]),
                h('div.picture.col-xs-4', photo ? [
                    h('img.img-circle.pull-xs-right.img-fluid', {
                        attributes: {
                            'width': '200px',
                            'height': '200px',
                        },
                        src: photo,
                        alt: `Me, ${name}`
                    })
                ] : []),
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