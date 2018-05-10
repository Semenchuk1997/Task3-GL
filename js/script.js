class Calendar {
    constructor(id) {
        this.elem = document.getElementById(id);
        this.date = new Date();
        this.year = this.date.getFullYear();
        this.mon = this.date.getMonth();
        this.d = new Date(this.year, this.mon);
        this.prevMon = null; // previous month
        this.keeper = {};
        this.historyArr = [];
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

        let wrap = document.createElement('div');
        wrap.className = 'сalWrapper';
        this.elem.appendChild(wrap);

        let nav = document.createElement('div');
        let cal = document.createElement('div');
        let run = document.createElement('button');

        let mons = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        nav.className = 'nav';
        nav.innerHTML = '<button class="btn left">left</button><span class="current">' + mons[this.mon] + ', ' + this.year + '</span><button class="btn right">right</button>';
        cal.innerHTML = table;
        run.className = 'run';
        run.innerHTML = 'run';

        wrap.appendChild(nav);
        wrap.appendChild(cal);
        wrap.appendChild(run);

        /**
         * Keep selected box
         */

        if (this.year == this.keeper.year && this.mon == this.keeper.mon) {

            let td = document.getElementsByTagName('td'), //******************************************************* */
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
        cal.firstChild.addEventListener('mousedown', (event) => { //mousedown
            let target = event.target;
            that.pushToHistory(event.target);
            that.selectBox(target);
        }, false);

        let left = document.getElementsByClassName('left'),
            right = document.getElementsByClassName('right');


        left[left.length - 1].addEventListener('mousedown', (event) => {
            let target = event.target;
            that.pushToHistory(event.target);
            that.handleSlide('left');
        }, false);

        right[right.length - 1].addEventListener('mousedown', (event) => {
            let target = event.target;
            that.pushToHistory(event.target);
            that.handleSlide('right');
        }, false);


        /**
         * run movie
         */
        let i = 0,
            time = null,
            attr = null;

        // run.addEventListener('click', () => {
        //     if (i >= this.historyArr.length) {
        //         clearTimeout(time);
        //     } else {
        //         clearTimeout(time);
        //         //history.back();
        //         this.showHistory(i++);
        //         time = setTimeout(() => {
        //             run.click();
        //         }, 1000);
        //     }
        // }, false);

        run.addEventListener('click', () => {
            this.elem.lastChild.hidden = true;
            this.elem.firstChild.hidden = false;

            time = setInterval(() => {
                if (i >= this.historyArr.length) {
                    clearInterval(time);
                } else {
                    attr = '[data-id="' + this.historyArr[i++] + '"]';
                    // document.querySelector(attr).click();
                    if (document.querySelector(attr).tagName == 'TD') {
                        document.querySelector(attr).addEventListener('click', (event) => {
                            that.selectBox(event.target);
                        });
                        document.querySelector(attr).click();
                    } else if (document.querySelector(attr).tagName == 'BUTTON') {
                        let side = document.querySelector(attr).className;
                        document.querySelector(attr).addEventListener('click', (event) => {
                            that.runHandleSlide(event.target, side);
                        });
                        document.querySelector(attr).click();
                    }
                }
            }, 1000);
        });
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

        let td = document.getElementsByTagName('td'), //************************************************************** */
            length = td.length;

        for (let i = 0; i < length; i++) {
            td[i].style.background = 'none';
        }

        let today = document.querySelectorAll('.today');

        today[today.length - 1].style.background = '#ccc';

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
        this.elem.lastChild.hidden = true;
        this.build(side);
    }

    runHandleSlide(target, side) {
        side = side.substring(4);
        let wraps = this.elem.children,
            i = 0;

        while (wraps[i] != target) {
            if (side === 'right') {
                wraps[i + 1].hidden = false;
                wraps[i].hidden = true;
            } else if (side === 'left') {
                wraps[i - 1] = false;
                wraps[i].hidden = true;
            }
            ++i;
        }
    }

    pushToHistory(target) {
        target.setAttribute('data-id', Date.now());
        let id = target.getAttribute('data-id');
        //history.pushState({ id }, null, `./selected=${id}`);
        this.historyArr.push(id);
    }

    showHistory(i) {
        let id = this.historyArr[i];
        let attr = '[data-id="' + id + '"]';
        let elem = document.querySelector(attr);
        this.selectBox(elem);
    }
}

const calendar = new Calendar('root');

calendar.build();