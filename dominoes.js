

function getParameterDefinitions() {
  return [
    { name: 'family', type: 'int', initial: 1, caption: "All dominos generated will contain this number" },
    { name: 'count', type: 'int', initial: 1, caption: "Will generate 0-N of the family" },
    { name: 'rounded', type: 'choice', caption: 'Round the corners?',
      values: [0, 1], captions: ["No thanks", "Yes please"], initial: 1 }
  ];
}

function main(params) {

  function Domino() {

    return union(
        DominoBody(),
        Dots(DotLayout(1) ),
        Dots(DotLayout(2) ).translate([-48, 0, 0])
    );
  }

  function DotLayout(dotCount) {

    var topLeft      = function() { return [36,11,0]; };
    var topCenter    = function() { return [36,0,0]; };
    var topRight     = function() { return [36,-11,0]; };
    var centerLeft   = function() { return [24,11,0]; };
    var center       = function() { return [24,0,0]; };
    var centerRight  = function() { return [24,-11,0]; };
    var bottomLeft   = function() { return [12,11,0]; };
    var bottomCenter = function() { return [12,0,0]; };
    var bottomRight  = function() { return [12,-11,0]; };

    var dots = [
      // 0
      [],

      // 1
      [center],

      // 2
      [bottomLeft, topRight],

      // 3
      [bottomLeft, center, topRight],

      // 4
      [topLeft, topRight, bottomLeft, bottomRight],

      // 5
      [topLeft, topRight, center, bottomLeft, bottomRight],

      // 6
      [topLeft, topRight, centerLeft, centerRight, bottomLeft, bottomRight],

      // 7
      [topLeft, topRight, centerLeft, center, centerRight, bottomLeft, bottomRight],

      // 8
      [topLeft, topCenter, topRight, centerLeft, centerRight, bottomLeft, bottomCenter, bottomRight],

      // 9
      [topLeft, topCenter, topRight, centerLeft, center, centerRight, bottomLeft, bottomCenter, bottomRight]
    ];

    return dots[dotCount];
  }

  function Dots(dotLayout) {

    return dotLayout.reduce(
      function(prev, curr, idx, arr) {
        return union(prev, Dot(curr) );
      },
      Dot(dotLayout[0])
    );
  }

  function Dot(position) {

    return CreeperHead().translate(position() ).translate([0,0,5]);
  }


  function CreeperHead() {

    function Noggin() {
      return CSG.cube({
        radius: [5,5,3.5],
        roundradius: 1,
        resolution: 16
      }).setColor(0,0.5,0);
    }

    function Eye() {
      return CSG.cube({radius: 1}).setColor(0,0,0);
    }

    function Mouth() {
      return union(
          CSG.cube({radius: [1.5,1,1]}).setColor(0,0,0),          
          CSG.cube({radius: [1.5,0.5,1]}).
            setColor(0,0,0).
            translate([-1,1.5,0]),
          CSG.cube({radius: [1.5,0.5,1]}).
            setColor(0,0,0).
            translate([-1,-1.5,0])
      );
    }

    return union(
      Noggin(), 
      Eye().translate([2,2,3]), 
      Eye().translate([2,-2,3]), 
      Mouth().translate([-1,0,3])
    );
  }




  function DominoBody() {

    return CSG.roundedCube({
      center: [0, 0, 0],
      radius: [48,21,5],
      roundradius: 1,
      resolution: 16
    });
  }

  return Domino();
  
}

