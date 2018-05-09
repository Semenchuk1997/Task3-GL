class Calendar {
    constructor(id) {
        this.elem = document.getElementById(id);
        this.date = new Date();
        this.year = this.date.getFullYear();
        this.mon = this.date.getMonth();
        this.d = new Date(this.year, this.mon);
        this.prevMon = null; // previous month
        this.keeper = {};
    }

    build() {

        /**
         * provide able to switch between months
         */

        if (arguments[0] === 'left') {
            this.mon = this.mon - 1;
            if (this.mon < 0) {
                this.year = this.year - 1;
                this.mon = 11;
            }
            this.d = new Date(this.year, this.mon);
        } else if (arguments[0] === 'right') {
            this.mon = this.mon + 1;
            if (this.mon > 11) {
                this.year = this.year + 1;
                this.mon = 0;
            }
            this.d = new Date(this.year, this.mon);
        }

        /**
         * start table
         */

        let table = '<table><tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>';

        /**
         * makes unavailable dates of another months in the stast of the calendar
         */
        for (let i = 0; i < this.getDay(this.d); i++) {
            this.prevMon = new Date(this.year, this.mon, -this.getDay(this.d) + 1 + i);
            table += '<td class="muted unavailable">' + this.prevMon.getDate() + '</td>';
        }

        /**
         * <td> with actual dates
         * */
        while (this.d.getMonth() == this.mon) {

            if (this.d.getDate() === this.date.getDate() && this.d.getMonth() === this.date.getMonth()) {
                table += '<td class="today">' + this.d.getDate() + '<br>' + 'today' + '</td>';
            } else if (this.d.getDate() === this.date.getDate()) {
                table += '<td class="today">' + this.d.getDate() + '</td>';
            } else {
                table += '<td>' + this.d.getDate() + '</td>';
            }

            if (this.getDay(this.d) % 7 == 6) { // sunday, last day of week - newline
                table += '</tr><tr>';
            }

            this.d.setDate(this.d.getDate() + 1);
        }

        /**
         * makes unavailable dates of another months in the end of the calendar
         */

        if (this.getDay(this.d) != 0) {
            for (let i = this.getDay(this.d); i < 7; i++) {
                table += '<td class="muted unavailable">' + this.d.getDate() + '</td>';
                this.d.setDate(this.d.getDate() + 1);
            }
        }

        /**
         *  close the table
         */
        table += '</tr></table>';


        /**
         * Build DOM
         */

        let nav = document.createElement('div');
        let cal = document.createElement('div');

        let mons = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        nav.classList.add('nav');
        nav.innerHTML = '<button class="btn btn-left">left</button><span class="current">' + mons[this.mon] + ', ' + this.year + '</span><button class="btn btn-right">Right</button>';
        cal.innerHTML = table;
        this.elem.appendChild(nav);
        this.elem.appendChild(cal);

        /**
         * Keep selected box
         */

        if (this.year == this.keeper.year && this.mon == this.keeper.mon) {
            let td = document.getElementsByTagName('td'),
                length = td.length;

            for (let i = 0; i < length; i++) {

                if (!td[i].classList.contains('unavailable') && td[i].innerHTML.match(/\d+/)[0] == this.keeper.date) {
                    td[i].style.background = 'blue';
                }
            }
        }

        //*****Events block ********************/

        let that = this;

        /**
         * selecting box
         */

        cal.firstChild.addEventListener('mousedown', (event) => {
            let target = event.target;
            that.selectBox(target);
        }, false);

        document.getElementsByClassName('btn-left')[0].addEventListener('click', () => {
            that.handleSlide('left');
        }, false);

        document.getElementsByClassName('btn-right')[0].addEventListener('click', () => {
            that.handleSlide('right');
        }, false);
    }


    /**
     * get day number from 0 (monday) to 6 (sunday)
     * @param {Date} date
     */
    getDay(date) {
        let day = date.getDay();

        if (day == 0) {
            day = 7;
        }

        return day - 1;
    }

    /**
     *
     * @param {HTMLElement} target
     */
    selectBox(target) {

        let td = document.getElementsByTagName('td'),
            length = td.length;

        for (let i = 0; i < length; i++) {
            td[i].style.background = 'none';
        }

        document.getElementsByClassName('today')[0].style.background = '#ccc';

        if (!target.classList.contains('unavailable') && target.tagName !== 'TH') {
            target.style.background = 'blue';
            this.keeper = {
                'year': this.year,
                'mon': this.mon,
                'date': target.innerHTML.match(/\d+/)[0] // get only number from innerHTML
            };
        }
    }

    /**
     * rm all inside root element and call function that build calendar again
     * @param {string} side
     */
    handleSlide(side) {
        while (this.elem.firstChild) {
            this.elem.removeChild(this.elem.firstChild);
        }

        this.build(side);
    }
}

const calendar = new Calendar('root');

calendar.build();