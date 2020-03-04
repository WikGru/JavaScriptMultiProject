document.getElementById('start').addEventListener('click', clickedStart);
document.getElementById('stop').addEventListener('click', clickedStop);
document.getElementById('pause').addEventListener('click', clickedPause);
var iterlabel = document.getElementById('iteration');
var learningratelabel = document.getElementById('learningrate');
var neighborhoodlabel = document.getElementById('neighborhood');
var canvas = document.getElementById('canvas');
var smallcanvas = document.getElementById('smallcanvas');

var interval = null;
var stopped = false;
var nodes = [];
var gridSize = 100;

var learningrate = 1;
var currentLearningRate = 0;

var neighborhoodRange = gridSize / 2;
var currentNeighborhoodRange = 0;

var maxIteration = 1000;
var activeIteration = 0;

iterlabel.textContent = 'Iteration: ' + activeIteration;
learningratelabel.textContent = 'Learning rate: ' + currentLearningRate;
neighborhoodlabel.textContent = 'Neighborhood range: ' + currentNeighborhoodRange;

function clickedStart() {
	if (stopped) {
		stopped = false;
		currentLearningRate = learningrate;
		currentNeighborhoodRange = neighborhoodRange;
		neighborhoodRange = gridSize / 2;
		activeIteration = 0;
		nodes = [];
		fillGrid();
		drawNodes();
	}
	if (interval == null) interval = setInterval(startLearning, 10);
}

function clickedStop() {
	console.log('stop');
	if (interval != null) {
		clearInterval(interval);
		interval = null;
	}
	stopped = true;
}

function clickedPause() {
	console.log('pause');
	if (interval != null) {
		clearInterval(interval);
		interval = null;
	}
}

function fillGrid() {
	console.log('Started creating Nodes...');
	for (var i = 0; i < gridSize; i++) {
		var row = [];
		for (var j = 0; j < gridSize; j++) {
			row[j] = new Node(i, j, canvas.width / gridSize);
		}
		nodes[i] = row;
	}
	console.log('Finished creating Nodes...');
}

function drawNodes() {
	nodes.forEach((row) => {
		row.forEach((node) => {
			node.draw();
		});
	});
}

function getWinner(r, g, b) {
	var winnerNode = null;
	var bestSimilarity = 999;
	nodes.forEach((row) => {
		row.forEach((node) => {
			var similarity = node.getSimilarity(r, g, b);
			if (similarity < bestSimilarity) {
				winnerNode = node;
				bestSimilarity = similarity;
			}
		});
	});
	return winnerNode;
}

function feedNodes(winner, r, g, b) {
	nodes.forEach((row) => {
		row.forEach((node) => {
			var distance = node.getDistance(winner);
			if (distance < currentNeighborhoodRange) {
				node.adaptWeights(currentNeighborhoodRange, distance, currentLearningRate, r, g, b);
			}
		});
	});
}

function fillPreview(r, g, b) {
	var ctx = smallcanvas.getContext('2d');
	ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
	ctx.fillRect(0, 0, 100, 800);
}

function getLearningRateForIteration(iter, maxIter) {
	if (iter == 0) return learningrate;
	else return getLearningRateForIteration(0, maxIter) / (1 + iter / maxIter * 20);
}

function getNeighborhoodRangeForIteration(iter, maxIter) {
	if (iter == 0) return neighborhoodRange;
	else return getNeighborhoodRangeForIteration(0, maxIter) / (1 + iter / maxIter*4);
}

function startLearning() {
	iterlabel.textContent = 'Iteration: ' + activeIteration;
	learningratelabel.textContent = 'Learning rate: ' + Math.round((currentLearningRate + Number.EPSILON) * 100) / 100;
	neighborhoodlabel.textContent =
		'Neighborhood range: ' + Math.round((currentNeighborhoodRange + Number.EPSILON) * 100) / 100;

	var r = Math.floor(Math.random() * 255);
	var g = Math.floor(Math.random() * 255);
	var b = Math.floor(Math.random() * 255);

	fillPreview(r, g, b);
	feedNodes(getWinner(r, g, b), r, g, b);
	drawNodes();

	currentNeighborhoodRange = getNeighborhoodRangeForIteration(activeIteration, maxIteration);
	currentLearningRate = getLearningRateForIteration(activeIteration, maxIteration);

	// console.log(learningRate);
	if (++activeIteration > maxIteration) clickedPause();
}

fillGrid();
drawNodes();

// console.log(nodes[1]);
