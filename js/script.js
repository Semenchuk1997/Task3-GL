class Calendar {
    constructor(id) {
        this.elem = document.getElementById(id);
        this.date = new Date();
        this.year = this.date.getFullYear();
        this.mon = this.date.getMonth();
        this.d = new Date(this.year, this.mon);
        this.prevMon = null; // previous month

    }

    build() {

        let table = '<table><tr><th>MO</th><th>TU</th><th>WE</th><th>TH</th><th>FR</th><th>SA</th><th>SU</th></tr><tr>';

        // spaces for the first row
        // from Monday till the first day of the month
        // * * * 1  2  3  4
        for (let i = 0; i < this.getDay(this.d); i++) {
            this.prevMon = new Date(this.year, this.mon, -this.getDay(this.d) + 1 + i);
            table += '<td class="muted unavailable">' + this.prevMon.getDate() + '</td>';
        }

        // <td> with actual dates
        while (this.d.getMonth() == this.mon) {

            if (this.d.getDate() === this.date.getDate()) {
                table += '<td class="today">' + this.d.getDate() + '<br>' + 'today' + '</td>'
            } else {
                table += '<td>' + this.d.getDate() + '</td>';
            }

            if (this.getDay(this.d) % 7 == 6) { // sunday, last day of week - newline
                table += '</tr><tr>';
            }

            this.d.setDate(this.d.getDate() + 1);
        }

        // add spaces after last days of month for the last row
        // 29 30 31 * * * *
        if (this.getDay(this.d) != 0) {
            for (let i = this.getDay(this.d); i < 7; i++) {
                table += '<td class="muted unavailable">' + this.d.getDate() + '</td>';
                this.d.setDate(this.d.getDate() + 1);
            }
        }

        // close the table
        table += '</tr></table>';


        //build block ********************************************************************

        let nav = document.createElement('div');
        let cal = document.createElement('div');

        let mons = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        nav.classList.add('nav');
        nav.innerHTML = '<button class="btn btn-left">left</button><span class="current">' + mons[this.mon] + ', ' + this.year + '</span><button class="btn btn-right">Right</button>';
        cal.innerHTML = table;
        this.elem.appendChild(nav);
        this.elem.appendChild(cal);

        cal.firstChild.addEventListener('mousedown', function(event) {
            let target = event.target;

            let td = document.querySelectorAll('td');

            for (let i = 0; i < td.length; i++) {
                td[i].style.background = 'none';
            }
            document.getElementsByClassName('today')[0].style.background = 'red';

            if (!target.classList.contains('unavailable')) {
                target.style.background = 'blue';
            }
        }, false);

        // document.getElementsByClassName('btn-left')[0].addEventListener('click', function() {
        //     calendar.build('left');
        // }, false);

        // document.getElementsByClassName('btn-right')[0].addEventListener('click', function() {
        //     calendar.build('right');
        // }, false);
    }

    getDay(date) { // get day number from 0 (monday) to 6 (sunday)
        let day = date.getDay();

        if (day == 0) {
            day = 7;
        }

        return day - 1;
    }
}

const calendar = new Calendar('root');

calendar.build();

// const table = document.getElementsByTagName('table')[0];

// table.addEventListener('mousedown', function(event) {
//     let target = event.target;

//     let td = document.querySelectorAll('td');

//     for (let i = 0; i < td.length; i++) {
//         td[i].style.background = 'none';
//     }
//     document.getElementsByClassName('today')[0].style.background = 'red';

//     if (!target.classList.contains('unavailable')) {
//         target.style.background = 'blue';
//     }
// }, false)