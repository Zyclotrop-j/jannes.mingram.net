import hg from 'mercury';;
import grid from '../tags/grid';
import srOnly from '../tags/srOnly';
import _ from 'lodash';

const h = hg.h;

function star(level) {
    return h(`i.fa.fa-${{
        '0': 'star-o',
        '0.5': 'star-half-o',
        '1': 'star'
    }[level]}`, {
        'aria-hidden': 'true'
    });
}

export default function(skill, channels, isOpen) {
    return h('article.skill', {
            'ev-click': hg.send(channels.setSkillCollapsedState, skill.key),
            attributes: {
                'data-importance': `${skill.importance}`,
                'data-level': `${skill.level}`
            }
        },
        grid.row([
                grid.col(h('h4.name.collapsed', skill.name), {xs: 12, md: 8}),
                grid.col(h('div.stars', [
                    _.range(5).map(i => 
                        star(`${_.clamp(Math.floor(skill.level - (i * 2)), 0, 2)/2}`) 
                    )
                    
                ]), {xs: 12, md: 4}),
                grid.col(h(`div.description.collapse${isOpen ? '.in' : ''}`, skill.description)),
            ])
    );
};