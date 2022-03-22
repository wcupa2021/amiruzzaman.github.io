$(function() {
	var canvasSize = document.querySelector('canvas');
	fitToContainer(canvasSize);
	var canvas;
	var ctx;
	var x = 75;
	var y = 50;
	var x1 =130;
	var y1 = 160;
	var WIDTH = canvasSize.offsetWidth-10;
	var HEIGHT = canvasSize.offsetHeight-17;
	var dragok = false;
	
	var xPosition0 = WIDTH/5;
	
	//To create number Line
	var starti=0;
	var endi=20;
	var interval = 65;

	let pointerValue =0, mean, median, mode, range;
	
	//To manage numbers inpute by the user related 
	const arrayNum = [];
	const countOccurrences = (arr, el) => arr.reduce((arr, n) => (n === el ? arr + 1 : arr), 0);
	function fitToContainer(canvasSize){
		canvasSize.style.width='100%';
		canvasSize.style.height='100%';
		canvasSize.width  = canvasSize.offsetWidth;
		canvasSize.height = canvasSize.offsetHeight;
	  }

	function rect(x,y,w,h) {
		ctx.beginPath();
		ctx.rect(x,y,w,h);
		ctx.closePath();
		ctx.fill();
	}

	function clear() {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
	}

	const resetButton = document.querySelector("#rstBtn");
	const calculateButton = document.querySelector("#calcBtn");
	const selectedValueField = document.querySelector("#selectedVals");

	const showHint = document.querySelector("#showHint");
	const showAnswer = document.querySelector("#showAnswer");

	resetButton.addEventListener('click', () => {
		arrayNum.length= 0;
		document.querySelector("#selectedVals").innerHTML = "No number selected";
		document.querySelector("#sortedVals").innerHTML = "No number selected";
		if(document.querySelectorAll('input[name="calc"]:checked').length >0)
			document.querySelector('input[name="calc"]:checked').checked = false;
		const feedbackSectionDivs = document.querySelectorAll(".feedback");
		feedbackSectionDivs.forEach(el => el.removeAttribute("style"));
		showHint.value = "Show Hint";
		document.querySelector(".mean-def").style.display = "none";
		document.querySelector(".mode-def").style.display = "none";
		document.querySelector(".range-def").style.display = "none";
		document.querySelector(".median-def").style.display = "none";
		showAnswer.style.display ="none";
		showAnswer.value = "Show Answer";
		document.querySelector(".finalAnswer").style.display ="none";
	});
	calculateButton.addEventListener('click', () => {
		let arr = arrayNum.map(e => (e-140)/65);
		let checkNumberSelected = checkNumberSelection(arr);
		let calcTypeSelected = calculationTypeSelected();
		if(checkNumberSelected && calcTypeSelected) {
			calcType = document.querySelectorAll('input[name="calc"]:checked')[0].value;
			calculateFinalAnswer(arr, calcType);
			showAnswer.style.display ="inline-block";
		}
	});

	showHint.addEventListener('click', () => {
		if(showHint.value === "Show Hint"){
			showHint.value = "Hide Hint";
			if(document.querySelectorAll('input[name="calc"]:checked').length >0) {
				calcType = document.querySelectorAll('input[name="calc"]:checked')[0].value;
				if(calcType === 'mean') {
					document.querySelector(".mean-def").style.display = "block";
				}
				else if(calcType === 'median') {
					document.querySelector(".median-def").style.display = "block";
				}				
				else if(calcType === 'mode') {
					document.querySelector(".mode-def").style.display = "block";
				}
				else {
					document.querySelector(".range-def").style.display = "block";
				}				
			} 
			else {
				document.querySelector(".mean-def").style.display = "block";
				document.querySelector(".mode-def").style.display = "block";
				document.querySelector(".range-def").style.display = "block";
				document.querySelector(".median-def").style.display = "block";
			}
		} else {
			showHint.value = "Show Hint";
			document.querySelector(".mean-def").style.display = "none";
			document.querySelector(".mode-def").style.display = "none";
			document.querySelector(".range-def").style.display = "none";
			document.querySelector(".median-def").style.display = "none";
		}
	});

	showAnswer.addEventListener('click', () => {
		if(showAnswer.value === "Show Answer"){
			showAnswer.value = "Hide Answer";
			if(document.querySelectorAll('input[name="calc"]:checked').length >0) {
				calcType = document.querySelectorAll('input[name="calc"]:checked')[0].value;
				if(calcType === 'mean') {
					document.querySelector(".finalAnswer").innerHTML ="";
					document.querySelector(".finalAnswer").innerHTML +=("<div>Mean = "+finalAnswer+"</div>");
					document.querySelector(".finalAnswer").style.display = "block";					
				}
				else if(calcType === 'median') {
					document.querySelector(".finalAnswer").innerHTML ="";
					document.querySelector(".finalAnswer").innerHTML +=("<div>Median = "+finalAnswer+"</div>");
					document.querySelector(".finalAnswer").style.display = "block";					
				}				
				else if(calcType === 'mode') {
					document.querySelector(".finalAnswer").innerHTML ="";
					document.querySelector(".finalAnswer").innerHTML+=("<div>Mode = "+finalAnswer+"</div>");
					document.querySelector(".finalAnswer").style.display = "block";					
				}
				else {
					document.querySelector(".finalAnswer").innerHTML ="";
					document.querySelector(".finalAnswer").innerHTML +=("<div>Range = "+finalAnswer+"</div>");
					document.querySelector(".finalAnswer").style.display = "block";					
				}		
			}
		}else {
			showAnswer.value = "Show Answer";
			document.querySelector(".finalAnswer").style.display ="none";
		}
	});
	selectedValueField.addEventListener('input' , updateValue);

	function updateValue () {
		let newArr = transformNumberArrayFromInput(selectedValueField.innerHTML);
		selectedValueField.innerHTML = selectedValueField.innerHTML.replace(/(&nbsp;)+$/, '');
		console.log(selectedValueField.innerHTML);
		
		arrayNum.length =0;
		newArr.forEach(el => {
			arrayNum.push(el*65 + 140);
		});
		console.log("arrayNum =" +arrayNum);
		sortArray(arrayNum);		
	}

	function transformNumberArrayFromInput(field) {
		let updatedArray = field.replace(/,&nbsp;/g, '');
		updatedArray = updatedArray.replace(/(,$)/g, "")
		let split = updatedArray.split(', ');
		split = updatedArray.split(',');
		return split;
	}

	function checkNumberSelection (arr) {
		if(arr.length === 0) {
			document.querySelector('.numberSelected').classList.add("errorMsg");
			return false;
		} 
		else {
			document.querySelector('.numberSelected').classList.remove("errorMsg");
			return true;
		}
	} 
	function calculationTypeSelected () {	
		if(document.querySelectorAll('input[name="calc"]:checked').length >0) {
			document.querySelector('.calcTypes').classList.remove("errorMsg");
			return true;
		}
		else {
			document.querySelector('.calcTypes').classList.add("errorMsg");
			return false;
		}
	} 
	
	function calculateFinalAnswer(arr, calcType) {
		switch(calcType) {
			case 'mean':
				calculateMean(arr);
				break;
			case 'median':
				calculateMedian(arr);
				break;
			case 'mode':
				calculateMode(arr);
				break;
			case 'range':
				calculateRange(arr);
				break;
			default :
				break;
		}
	}
	//Calculate Mean for all the numbers selected
	function calculateMean(arr) {
		let sum =0;
		arr.forEach(el => sum = sum +el);
		mean = sum /arr.length;
		finalAnswer = mean.toFixed(1);
		// calculateNormalDistributionRange(mean);
	}
	//Calculate Median for all the numbers selected
	function calculateMedian(arr) {
		const arrSorted = arr.sort(function (a, b) {  return a - b;  });
		if(arrSorted.length % 2 !== 0) {
			median = arrSorted[Math.floor(arrSorted.length/2)]
		}
		if(arrSorted.length % 2 === 0) {
			median = (arrSorted[Math.floor(arrSorted.length/2)] + arrSorted[Math.floor(arrSorted.length/2) -1])/ 2;
		}
		finalAnswer = median.toFixed(1);
	}
	//Calculate Mode for all the numbers selected
	function calculateMode(arr) {
        let freqMap = new Map();
        for (let i=0;i<arr.length;i++) {
            if (freqMap.has(arr[i])) {
                freqMap.set(arr[i], freqMap.get(arr[i]) + 1);
            }
            else {
                freqMap.set(arr[i], 1);
            }
        }
		mode = [...freqMap.entries()].reduce((a, e ) => e[1] > a[1] ? e : a)
		if(mode[1] === 1) {
			console.log('No mode for the numbers entered');
		}
		else {
			mode = mode[0];
		}
		finalAnswer = mode.toFixed(1);
	}
	//Calculate Range for all the numbers selected
	function calculateRange(arr) {
		const arrSorted = arr.sort(function (a, b) {  return a - b;  });
		range = arrSorted[arrSorted.length -1] - arrSorted[0];
		finalAnswer = range.toFixed(1);
	}

	function calculateNormalDistributionRange(finalAnswer) {
		let oneSD , twoSD, threeSD;
		oneSD =  0.341 * finalAnswer;
		twoSD =  0.477 * finalAnswer;
		threeSD = 0.498 * finalAnswer;
		if(pointerValue == finalAnswer) {
			changeFeedbackStyles();
			const note = document.querySelector("#correctGuess");
			note.style.cssText += 'color:#FFF;border:2px solid #228C22; background-color:#228C22';
		}
		if(pointerValue < finalAnswer) {
			if(pointerValue >= finalAnswer - oneSD) {
				changeFeedbackStyles();
				const note = document.querySelector("#sd-1-left");
				note.style.cssText += 'color:#FFF;border:2px solid #228C22; background-color:#87A96B';
			}
			else {
				changeFeedbackStyles();
				const note = document.querySelector("#sd-2-left");
				note.style.cssText += 'color:#FFF;border:2px solid #00915F; background-color:#ACE1AF';
			}
		}
		if(pointerValue > finalAnswer) {
			if(pointerValue > finalAnswer && pointerValue <= Number(finalAnswer) + Number(oneSD)) {
				changeFeedbackStyles();
				const note = document.querySelector("#sd-1-right");
				note.style.cssText += 'color:#FFF;border:2px solid #228C22; background-color:#FF7F50';
			}
			else if(pointerValue > Number(finalAnswer) + Number(oneSD) && pointerValue <= Number(finalAnswer) + Number(twoSD)) {
				changeFeedbackStyles();
				const note = document.querySelector("#sd-2-right");
				note.style.cssText += 'color:#FFF;border:2px solid #00915F; background-color:#EE204D';
			}
		}
		
	}

	changeFeedbackStyles = () => {
		document.querySelectorAll(".feedback").forEach (el => 
			el.style.cssText += 'color:#000;border:2px solid #000; background-color: transparent'
		);
	}

	function init() {
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");
		return setInterval(draw, 10);
	}

	function draw() {
		clear();
		ctx.fillStyle = "#FFF";
		rect(0,0,WIDTH,HEIGHT);
		createNumberLine();
		createUserValueArrow();
		drawCircles();
	}
    function drawCircles() {
		const uniqueValues = Array.from(new Set(arrayNum));
		for (const val of uniqueValues) {
		  const n = countOccurrences(arrayNum, val);
		  for (let i = 0; i < n; i++) {
			ctx.beginPath();
			ctx.arc(val-10,(HEIGHT/1.5-17)-(i*30),15,0,2*Math.PI);
			ctx.fillText((val-140)/65, val-14, (HEIGHT/1.5-17)-(i*30));
			ctx.stroke();
		  }
		}
	}

	function createNumberLine() {
		if(document.querySelector("#selectedVals").innerHTML === "") {
			document.querySelector("#selectedVals").innerHTML = "No number selected";
		}
		if(document.querySelector("#sortedVals").innerHTML === "") {
			document.querySelector("#sortedVals").innerHTML = "No number selected";
		}
		with(ctx) {
			beginPath();
			lineWidth = 3;
			strokeStyle = '#7cb9e8';
			//Draw the number line
			moveTo(WIDTH/20, HEIGHT/1.5);
			lineTo(6.8*WIDTH/7, HEIGHT/1.5);
			stroke();  

			//Draw arrow left side - down part
			moveTo(WIDTH/20, HEIGHT/1.5);
			lineTo(WIDTH/20+10, HEIGHT/1.5+10);
			stroke();

			//Draw arrow left side - up part
			moveTo(WIDTH/20, HEIGHT/1.5);
			lineTo(WIDTH/20+10, HEIGHT/1.5-10);
			stroke();

			//Draw arrow right side - down part
			moveTo(6.8*WIDTH/7, HEIGHT/1.5);
			lineTo(6.8*WIDTH/7-10, HEIGHT/1.5+10);
			stroke();

			//Draw arrow right side - up part
			moveTo(6.8*WIDTH/7, HEIGHT/1.5);
			lineTo(6.8*WIDTH/7-10, HEIGHT/1.5-10);
			stroke();

			//For loop for drawing number line with scale 
			for(var i = starti;i <= endi; i++) {
				beginPath();
				strokeStyle = '#4682b4';
				lineWidth = 3;
				moveTo(WIDTH/12+ i * interval, HEIGHT/1.5 - 10);
				lineTo(WIDTH/12 + i * interval, HEIGHT/1.5 + 10);
				fillStyle = '#4682b4';
				fillText(i, (WIDTH/12 + i * interval )- 5, HEIGHT/1.5 + 25);
				if(!i) {
					strokeStyle = '#000';
				}
				fill();
				stroke();
			}
		}
	}
	function createUserValueArrow() {
		with(ctx) {
			fill();
				
			strokeStyle = '#000';
			lineWidth = 3;
			
			moveTo(x1, y1);
			lineTo(x1, y1+85);
			stroke();
			
			// draw the left end of the arrow for the vertical line
			moveTo(x1, y1 +85);
			lineTo(x1+10, y1+96);
			stroke();
			// draw the bottom end of the arrow for the vertical line
			moveTo(x1+10, y1+95.5);
			lineTo(x1-10, y1+95.5);
			stroke();
			// draw the right end of the arrow for the vertical line
			moveTo(x1-10, y1+95.5);
			lineTo(x1, y1 +85);
			stroke();
			
			strokeStyle = '#4682b4';
		}
	}

	function myMove(e){
		if (dragok){
			
			x = e.pageX - canvas.offsetLeft;
			y = e.pageY - canvas.offsetTop;
			x1= e.pageX - canvas.offsetLeft;
			//y1 = e.pageY - canvas.offsetTop;
			pointerValue = ((x1-140)/65 + 0.15).toFixed(1) ;
			calculateNormalDistributionRange(finalAnswer);
		}
	}

	function myDown(e){
		if(e.pageX < x1 + 15 + canvas.offsetLeft && e.pageX > x1 - 15 +
			canvas.offsetLeft && e.pageY < y1 + 45 +canvas.offsetTop &&
			e.pageY > y1 -45 + canvas.offsetTop) {
				x1 = e.pageX - canvas.offsetLeft;
				//y1 = e.pageY - canvas.offsetTop;
				dragok = true;
				canvas.onmousemove = myMove;
		}
		if(!dragok) {
			getPosition(e);
		}
	}
	
	function getPosition(e) {
		const x = e.clientX-e.clientX%interval+10;
		arrayNum.push(x);
		displaySelectedValues(arrayNum);
		sortArray(arrayNum);
	}

	function myUp(){
		dragok = false;
		canvas.onmousemove = null;
	}
	function displaySelectedValues (displaySelectedValues) {
		document.querySelector("#selectedVals").innerHTML =arrayNum.map(e => (e-140)/65).join(", ");
	}
	function sortArray(arr) {
		const arrN = [...arr].sort();
		const sortedArray = arrN.sort(function (a, b) {  return a - b;  });
		document.getElementById("sortedVals").innerHTML = sortedArray.map(e => (e-140)/65).join(", ");
	}

	init();
	canvas.onmousedown = myDown;
	canvas.onmouseup = myUp;
});
