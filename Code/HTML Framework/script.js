Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/3d-scatter.csv', function(err, rows){
function unpack(rows, key) {
	return rows.map(function(row)
	{ return row[key]; });}

var trace2 = {
	x:unpack(rows, 'x2'), y: unpack(rows, 'y2'), z: unpack(rows, 'z2'),
	mode: 'markers',
	marker: {
		color: 'rgb(127, 127, 127)',
		size: 12,
		symbol: 'circle',
		line: {
		color: 'rgb(204, 204, 204)',
		width: 1},
		opacity: 0.8},
	type: 'scatter3d'};

var data = [trace2];
var layout = {
	scene: {
		camera: {
		center: {
			x: 1, y: 1, z: 1}, 
		eye: { 
			x: 0, y: 0, z: 0}, 
		up: {
			x: 0, y: 0, z: 1}
    },}
};
Plotly.newPlot('myDiv', data, layout);
});

var cam = [
  [-0.9366528526449551, -0.08706279934008708, 0.3392661235713566],
  [-0.9415962012290469, -0.11545461142306523, 0.31633341039507135],
  [-0.9467858309201388, -0.15199502252456587, 0.2837148277701039],
  [-0.940474251399248, -0.14099210593319664, 0.30924004999279553],
  [-0.9374630596929623, -0.13417730128288058, 0.3211844696300754],
  [-0.9437305854237906, -0.13971412059249713, 0.2997541436623278],
  [-0.9407662080153154, -0.1313170592422523, 0.3125936208697345],
  [-0.9442567818967962, -0.12917081915066808, 0.3028102199758981],
  [-0.9415935172856652, -0.12819304593363537, 0.3113971598776495],
  [-0.9425211258895646, -0.12283537274787273, 0.31074973604777045],
  [-0.9410657628144425, -0.12493472807988386, 0.3143032672087215]
];

function zoom() {
	for(i = 0; i < cam.length; i++){
		  Plotly.animate('myDiv', {
			layout: {
			  scene: {
				camera: {
				center: {
					x: cam[i][0], y: cam[i][1], z: cam[i][2]}, 
				eye: { 
					x: 0, y: 0, z: 0}, 
				up: {
					x: 0, y: 0, z: 1}
			},}
			}
		  })
	}
}