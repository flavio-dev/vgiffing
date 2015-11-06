$(function () {
	"use strict";

	var $feedback = $('.feedback'),
		$drop = $('.drop'),
		$sendButton = $('.send'),
		jsonListUrls = {};

	// if user is running mozilla then use it's built-in WebSocket
	window.WebSocket = window.WebSocket || window.MozWebSocket;

	// if browser doesn't support WebSocket, just show some notification and exit
	if (!window.WebSocket) {
		$feedback.html($('<p>', { text: 'Sorry, but your browser doesn\'t support WebSockets.'} ));
		return;
	}

	// open connection
	var host = window.location.host,
		protocol = (window.location.protocol === 'https:') ? 'wss:' : 'ws:',
		connection = new WebSocket(''+protocol+host);

	connection.onopen = function () {
		if(window.File && window.FileList && window.FileReader) {
			$drop.get(0).addEventListener('drop', fileDropHandler, false);
			$drop.get(0).addEventListener('dragover', fileDragHover, false);
			$drop.get(0).addEventListener('dragleave', fileDragLeave, false);
		} else {
			$feedback.html($('<p>', { text: 'Sorry, but your browser doesn\'t support File Dropping.' }));
		}

		$sendButton.on('click', function() {
			sendParameters();
		});

		window.open('./visu.html');
	};

	connection.onerror = function (error) {
		$feedback.addClass('error');
		$feedback.html($('<p>', { text: 'Sorry, but there\'s some problem with your connection or the server is down.' }));
	};

	connection.onmessage = function (message) {
		try {
			var json = JSON.parse(message.data);
		} catch (e) {
			return;
		}

		$sendButton.html('Update the visuals');
		$feedback.html($('<p>', { text: 'Set of parameters sent.' } ));
	};


	// internal functions
	function sendParameters() {
		var params = {};

		$feedback.html('');

		params.sessionId = $('#sessionId').val();
		params.bpms = $('#bpms').val();
		params.everyXBeats = $('#beats').val();
		params.order = ($('[name=order]').eq(0).prop('checked') ? $('[name=order]').eq(0).val() : $('[name=order]').eq(1).val());
		params.hidebg = $('#hidebg').prop('checked');
		params.blurbg = $('#blurbg').prop('checked');

		if (!$.isNumeric(params.bpms)) {
			$feedback.append($('<p>', { text: '\'BPMS\' is not a number.' } ));
		}

		if (!$.isNumeric(params.everyXBeats)) {
			$feedback.append($('<p>', { text: '\'every X beats\' is not a number.' } ));
		}

		if (!jsonListUrls.length) {
			jsonListUrls = defaultJson.gifs;
		}

		params.listUrls = jsonListUrls;

		connection.send(JSON.stringify(params));
	}

	function fileDropHandler(e) {
		e.preventDefault();

		var file = e.dataTransfer.files[0];

		if (file.type === 'application/json') {
			var r = new FileReader();
			r.onload = function(e) {
				var contentFile = e.target.result;
				var json = JSON.parse(contentFile);

				if (json.gifs.length) {
					jsonListUrls = gifvTOGif(json.gifs);
					$drop.html($('<p>', { text: 'File correctly uploaded and ready to be sent.' } ));
				} else {
					$drop.html($('<p>', { text: 'Json not well formated.' } ));
				}

			};
			r.readAsText(file);
		} else {
			$drop.html($('<p>', { text: 'File not in the json format.' } ));
		}
		$drop.removeClass('drag');
	}

	function fileDragHover(e) {
		e.preventDefault();
		$drop.addClass('drag');
	}

	function fileDragLeave(e) {
		e.preventDefault();
		$drop.removeClass('drag');
	}

	function gifvTOGif(arrayOfGifs) {
		arrayOfGifs.forEach(function(c, i) {
			if (c.url.slice(-4) === 'GIFV' || c.url.slice(-4) === 'gifv') {
				arrayOfGifs[i].url = c.url.substring(0, c.url.length - 1);
			}
		});

		return arrayOfGifs;
	}

	// default json:
	var defaultJson = {
		"gifs": [
			{"url": "../gifs/1.gif"},
			{"url": "../gifs/1398373244tumblr_n4jvn2pfrW1qa4iv8o2_500.gif"},
			{"url": "../gifs/664b00ba92245769e9ac7a2be328f483.gif"},
			{"url": "../gifs/78bed088653c6b8e3d6390a2cb94f52e.gif"},
			{"url": "../gifs/7fe2baee05b44907b70b22b64c674908.gif"},
			{"url": "../gifs/fdf1cd7d2454971cedd30509e02a4648.gif"},
			{"url": "../gifs/giphy-10.gif"},
			{"url": "../gifs/giphy-11.gif"},
			{"url": "../gifs/giphy-12.gif"},
			{"url": "../gifs/giphy.gif"},
			{"url": "../gifs/giphy-2.gif"},
			{"url": "../gifs/giphy-3.gif"},
			{"url": "../gifs/giphy-4.gif"},
			{"url": "../gifs/giphy-5.gif"},
			{"url": "../gifs/giphy-6.gif"},
			{"url": "../gifs/giphy-7.gif"},
			{"url": "../gifs/giphy-9.gif"},
			{"url": "../gifs/h.gif"},
			{"url": "../gifs/retro-futuristic-gifs-13.gif"},
			{"url": "../gifs/tumblr_lhr8hfpNgR1qzw1qyo1_400.gif"},
			{"url": "../gifs/tumblr_ly8ct4Bv0F1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_lz6ufreG541qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m104u2rjVC1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m15e9kWPL01qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m15ncrXjD31qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m197coBsxI1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m1ij33PgEy1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m1iqeeCDx41qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m1x9hnR7W71qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m22hd1GfRP1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m22xkzpSBo1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m2qmbt51p01qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m2sa58N0j31qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m35uqeEVF31qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m3ar191WAk1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m3d5veDsGG1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m3ej2dwCGM1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m3ggjmJbR31qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m3k3u0unO61rntjkdo1_500.gif"},
			{"url": "../gifs/tumblr_m3ogs6FB0A1qzw1qyo1_r1_500.gif"},
			{"url": "../gifs/tumblr_m3pxneXMmh1qzw1qyo1_r1_500.gif"},
			{"url": "../gifs/tumblr_m3r92bJsAD1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m42kvrp6O01qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m46uw7Z5x61qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m484w0Oldp1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m4hjgjCjUa1qzw1qyo1_r1_500.gif"},
			{"url": "../gifs/tumblr_m4hvedsH7P1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m4k4fk9wqc1qcggq2o1_400.gif"},
			{"url": "../gifs/tumblr_m4yaq9JDnV1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m53wxhQtQo1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m676j4ci521qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m6fxqnZN8U1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m6hnk9zmAt1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m6li0c7mMu1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m6n98gMM6f1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m6p9jx4ljp1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m6qyybDaS11qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m6tao27I2H1r4mh0bo1_500.gif"},
			{"url": "../gifs/tumblr_m746zqgv4l1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m7f4i0y01p1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m7oc3qgfjc1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m8e3kkbc9N1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m8hxx6W9co1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m8wr4xuVmL1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_m910ggbE0H1qgo9ito1_500.gif"},
			{"url": "../gifs/tumblr_ma5kt5VVoZ1qzw1qyo1_r1_500.gif"},
			{"url": "../gifs/tumblr_mai8ucdVbd1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mawv5zbJY61qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mb9x20F16h1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mfeeimzHKC1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mg9ovmrAoO1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mgdczvvGP21qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mgwafqL33c1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mh94l03PX11qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mi7yh5R7TP1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mjlnth4qOt1r34zhyo9_r2_500.gif"},
			{"url": "../gifs/tumblr_mjpuzqHPYU1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mklsubosXK1rsdpaso1_500.gif"},
			{"url": "../gifs/tumblr_mkmgu3bYRa1riqurjo1_400.gif"},
			{"url": "../gifs/tumblr_mldgh3qKiu1rs7doco1_500.gif"},
			{"url": "../gifs/tumblr_mlnzx84Ur21qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mp7z84wlJZ1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mq7a3vfsKu1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mqx27dfwBM1svueg8o1_500.gif"},
			{"url": "../gifs/tumblr_mtowja98Na1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mu3qdp9wZb1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_mxpuifItuW1rnvja7o1_500.gif"},
			{"url": "../gifs/tumblr_myftykWGYk1rnbafjo1_r1_400.gif"},
			{"url": "../gifs/tumblr_n2yen3lSyW1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_n3624htTSd1sb5osho1_r1_500.gif"},
			{"url": "../gifs/tumblr_n3mic8qFcK1s4fz4bo1_500.gif"},
			{"url": "../gifs/tumblr_n3r4ncenOb1rwaymjo1_500.gif"},
			{"url": "../gifs/tumblr_n3ty3173ir1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_n3xh75umrh1rsdpaso1_500.gif"},
			{"url": "../gifs/tumblr_n4ear884371rsdpaso1_500-1.gif"},
			{"url": "../gifs/tumblr_n4njn5aJCE1rwaymjo1_r1_500.gif"},
			{"url": "../gifs/tumblr_n7c5bft8pA1tdhimpo1_1280.gif"},
			{"url": "../gifs/tumblr_n7dq54Dv7l1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_n7lal5MD8U1sk6vtao1_500.gif"},
			{"url": "../gifs/tumblr_n7vuqydE5E1s4fz4bo1_500.gif"},
			{"url": "../gifs/tumblr_n85aner12e1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_n8aq1hN3Ra1r20fq5o1_400.gif"},
			{"url": "../gifs/tumblr_n909aiv9Wc1r2geqjo1_500.gif"},
			{"url": "../gifs/tumblr_nao0z4k3zO1qzw1qyo1_500.gif"},
			{"url": "../gifs/tumblr_nb21zg2LzG1r048glo1_500.gif"},
			{"url": "../gifs/tumblr_nb5c6idt3s1ra4argo1_400.gif"},
			{"url": "../gifs/tumblr_nbeckdqNHb1rj6lpxo1_r2_400.gif"},
			{"url": "../gifs/tumblr_nbl4in13F61slsxfzo1_500.gif"},
			{"url": "../gifs/tumblr_nc15i3crTq1t4tes2o1_r1_400.gif"},
			{"url": "../gifs/tumblr_ne7r81SSlZ1qd7m1so1_500.gif"},
			{"url": "../gifs/tumblr_ni4b5tumus1s32c21o2_500-1.gif"},
			{"url": "../gifs/tumblr_nilvh4eSnY1s4fz4bo1_500.gif"},
			{"url": "../gifs/tumblr_njueq8twt61s4fz4bo1_500.gif"},
			{"url": "../gifs/tumblr_nk1u243JTA1s2hovgo1_400.gif"},
			{"url": "../gifs/tumblr_nl2gtgfq351tdhimpo1_500.gif"},
			{"url": "../gifs/tumblr_nn7q0bjtQJ1tq1bhgo1_500.gif"},
			{"url": "../gifs/tumblr_node1wlm6H1s4fz4bo1_r1_500.gif"},
			{"url": "../gifs/z1.gif"},
			{"url": "../gifs/z2.gif"},
			{"url": "../gifs/z5.gif"},
			{"url": "../gifs/z7.gif"},
			{"url": "../gifs/z8.gif"},
			{"url": "../gifs/z11.gif"},
			{"url": "../gifs/z13.gif"},
			{"url": "../gifs/z14.gif"},
			{"url": "../gifs/z17.gif"},
			{"url": "../gifs/z19.gif"},
			{"url": "../gifs/z22.gif"},
			{"url": "../gifs/z23.gif"}
		]
	};
});