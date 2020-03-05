'use strict';

const record = document.getElementById('record'),
	shot = document.getElementById('shot'),
	hit = document.getElementById('hit'),
	dead = document.getElementById('dead'),
	enemy = document.getElementById('enemy'),
	again = document.getElementById('again'),
	header = document.querySelector('.header');

const game = {
	ships: [
		{
			location: ['26', '36', '46', '56'],
			hit: ['', '', '', '']
		},
		{
			location: ['11', '12', '13'],
			hit: ['', '', '']
		},
		{
			location: ['69', '79'],
			hit: ['', '']
		},
		{
			location: ['32'],
			hit: ['']
		}
	],
	shipCount: 4
};

const play = {
	record: localStorage.getItem('seaBattleRecord') || 0,
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
	hit(elem) {
		this.changeClass(elem, 'hit');
	},
	miss(elem) {
		this.changeClass(elem, 'miss');
	},
	dead(elem) {
		this.changeClass(elem, 'dead');
	},
	changeClass(elem, value) {
		elem.className = value;
	}
};

const fire = () => {
	const target = event.target;
	if (target.tagName === 'TD' && target.classList.length === 0 && game.shipCount > 0) {
		show.miss(target);
		play.updateData = 'shot';

		game.ships.forEach(item => {
			const index = item.location.indexOf(target.id);

			if (index >= 0) {
				show.hit(target);
				play.updateData = 'hit';
				item.hit[index] = 'x';

				const life = item.hit.indexOf('');

				if (life < 0) {
					play.updateData = 'dead';
					item.location.forEach(cell => show.dead(document.getElementById(cell)));
					game.shipCount--;

					if (game.shipCount < 1) {
						header.textContent = 'Игра окончена!';
						header.style.color = 'red';

						if (play.shot < play.record || play.record === 0) {
							localStorage.setItem('seaBattleRecord', play.shot);
							play.record = play.shot;
							play.render();
						}
					}
				}
			}
		});
	}
};

const init = () => {
	enemy.addEventListener('click', fire);
	play.render();
	again.addEventListener('click', () => {
		location.reload();
	});
};

init();
