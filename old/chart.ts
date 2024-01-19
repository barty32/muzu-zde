google.charts.load('current', { 'packages': ['corechart', 'bar'] });

function drawPrijimackyChart() {

	if (!currentSelection.length) return;

	let arr = [['Škola', 'Počet přihlášených uchazečů', 'Počet přijatých uchazečů', 'Počet míst']];
	let ubytko = [['Škola', 'Lůžková kapacita', 'Počet pokojů', 'Počet studentů']];

	for (const sch of currentSelection) {
		const col = [];
		col.push(sch.nazev.slice(0, 20) + '...');
		col.push(sch.obory[0].uspesnost.prihlaseni);
		col.push(sch.obory[0].uspesnost.prijati);
		col.push(sch.obory[0].uspesnost.mista);
		arr.push(col);


		const col2 = [];
		col2.push(sch.nazev.slice(0, 20) + '...');
		col2.push(sch.ubytovani.luzkova_kapacita);
		col2.push(sch.ubytovani.pocet_pokoju);
		col2.push(sch.ubytovani.pocet_studentu);
		ubytko.push(col2);
	}

	var data = google.visualization.arrayToDataTable(arr);
	var data2 = google.visualization.arrayToDataTable(ubytko);

	var options = {
		chart: {
			title: 'Company Performance',
			subtitle: 'Sales, Expenses, and Profit: 2014-2017',
		},
		// bars: 'horizontal',
		// vAxis: { format: 'decimal' },
		hAxis: {
			slantedText: true
		},
		height: 500,
		width: 700,
		colors: ['#1b9e77', '#d95f02', '#7570b3']
	};

	var chart = new google.visualization.ColumnChart(document.getElementById('chart1')!);
	chart.draw(data, options);


	var chart2 = new google.visualization.ColumnChart(document.getElementById('chart2')!);
	chart2.draw(data2, options);
}


function drawTable() {
	if (!currentSelection.length) return;
	
	const table = document.querySelector('#table');
	table.innerHTML = '';

	let headers = '<th>Název školy</th>';
	let types = '<td>Druh školy</td>';
	let zrizovatele = '<td>Zřizovatel</td>';
	let obce = '<td>Obec</td>';
	let weby = '<td>Webové stránky</td>';
	let obory = '<td>Obory</td>';

	for (const sch of currentSelection) {
		headers += `<th>${sch.nazev}</th>`;
		types += `<td>${sch.typ}</td>`;
		zrizovatele += `<td>${sch.zrizovatel}</td>`;
		obce += `<td>${sch.obec}</td>`;
		weby += `<td><a href="${sch.www}">${sch.www}</a></td>`;
		obory += '<td>';
		for (const ob of sch.obory) {
			obory += ob.nazev + ', ';
		}
		obory = obory.slice(0, -2);
		obory += '</td>';
	}

	table.innerHTML += `<tr>${headers}</tr><tr>${types}</tr><tr>${zrizovatele}</tr><tr>${obce}</tr><tr>${weby}</tr><tr>${obory}</tr>`;

	// document.getElementById('charts')?.appendChild(table);
}
