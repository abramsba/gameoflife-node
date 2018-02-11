
var _ = require('underscore');
var colors = require('colors');

var bits = Math.pow(2,32) - 1; // 2147483647;
console.log(bits);
var grid = [];
var checks = [];
for( var i = 1; i < bits; i *= 2 ) {
  grid.push( Math.floor( Math.random() * bits ) );
  checks.push(i);
}
grid[4] = 0;
grid[5] = 0;
grid[6] = 0;
/*
 * Checks the row above and below the current row
 * g = grid
 * i = index of row
 */
function aliveAbove( g, i ) {
  return g[i-1]>0;
}
function aliveBelow( g, i ) {
  return g[i+1]>0;
}

/*
 * Quick output of the board
 * g = grid
 * c = check array
 */
function printBoard( g, chk ) {
  _.each( g, function(r,i) {
    var output = i+"\t";
    _.each( chk, function(c) {
      output += (r&c)>0?rc()('@'):' ';
    });
    console.log(output);
  });
}

function rc() {
  var c = Math.floor( Math.random() * ( 5 - 1 ) + 1 );
  if ( c == 1 ) return colors.red;
  else if ( c == 2 ) return colors.blue;
  else if ( c == 3 ) return colors.green;
  else if ( c == 4 ) return colors.yellow;
  else if ( c == 5 ) return colors.purple;
  return colors.white;
}

/*
 * Check the current row and return a new row with the next board
 * g = grid
 * r = row index
 */
function checkRow( g, ri ) {
  var above_status = aliveAbove( g, ri );
  var below_status = aliveBelow( g, ri );
  var curr_status  = g[ri]>0;
  var alives = [];
  var new_row = 0;
  // If nothing around it is alive, return 0;
  if ( above_status > 0 || below_status > 0 || curr_status > 0 ) {
    // Check the positions
    for( var i = 1; i < bits; i *= 2 ) {
      var alive_or_dead = (g[ri]&i)>0;
      var ac = 0;
      if ( above_status == true ) {
        (g[ri-1] & (i/2))>0?ac++:false;
        (g[ri-1] & (i/1))>0?ac++:false;
        (g[ri-1] & (i*2))>0?ac++:false;
      }
      if ( curr_status == true ) {
        (g[ri]   & (i/2))>0?ac++:false;
        (g[ri]   & (i*2))>0?ac++:false;
      }
      if ( below_status == true ) {
        (g[ri+1] & (i/2))>0?ac++:false;
        (g[ri+1] & (i/1))>0?ac++:false;
        (g[ri+1] & (i*2))>0?ac++:false;
      }
      if ( alive_or_dead == true && ( ac == 2 || ac == 3 ) ) {
        new_row += bits & i;
      }
      else if ( alive_or_dead == false && ac == 3 ) {
        new_row += bits & i;
      }
    }
    return new_row;
  }
  else {
    return 0;
  }
}

/*
 * Check the grid and return a new one
 * g = grid
 */
function iterate( g ) {
  var new_grid = [];
  _.each( g, function(r,i) {
     new_grid.push( checkRow( g, i ) );
  });
  return new_grid;
}

function run() {
  console.log('\033[2J');
  var start = new Date();
  printBoard( grid, checks );
  grid = iterate(grid);
  var finished = new Date();
  console.log( "\tDuration: ",
      (finished.getMilliseconds()-start.getMilliseconds())+"ms" );
  setTimeout( run, 200 );
}
run();

