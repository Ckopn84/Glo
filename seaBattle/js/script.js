'use strict';

const record = document.getElementById('record'),
	shot = document.getElementById('shot'),
	hit = document.getElementById('hit'),
	dead = document.getElementById('dead'),
	enemy = document.getElementById('enemy'),
	again = document.getElementById('again');

const play = {
	record: 0,
	shot: 0,
	hit: 0,
	dead: 0,
	set updateData(data) {
		this[data]++;
		this.render();
	},
	render() {
		record.textContent = this.record;
		shot.textContent = this.shot;
		hit.textContent = this.hit;
		dead.textContent = this.dead;
	}
};

const show = {
	hit() {},
	miss(elem) {
		this.changeClass(elem, 'miss');
	},
	dead() {},
	changeClass(elem, value) {
		elem.className = value;
	}
};

const fire = () => {
	const target = event.target;
	if (target.tagName === 'TD') {
		show.miss(target);
		play.updateData = 'shot';
	}
};

const init = () => {
	enemy.addEventListener('click', fire);
};

init();
