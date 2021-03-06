
function getParameterDefinitions() {
  return [
    { name: 'family', type: 'int', initial: 4, caption: "*family* (all dominos generated will contain this number)" },
    { name: 'upto', type: 'int', initial: 6, caption: "*upto* (will generate 0-N of the family)" }
  ];
}

function validate(params) {
  if (params.family < 0 || params.family > 9) throw new Error("Family must be 0-9");
  if (params.upto < 0 || params.upto > 9)     throw new Error("Upto must be 0-9");
}

function main(params) {

  validate(params);

  function Domino(topNumber, bottomNumber) {

    return union(
        DominoBody(),
        Dots(DotLayout(topNumber) ),
        Dots(DotLayout(bottomNumber) ).mirroredX()
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

    if (dotLayout.length == 0) {
      // TODO find an openjscad null object that is compatible with union()
      return CSG.cube({ radius: 0.0001 });
    }

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

  function DominoSet(family, upto) {

    if (upto > 0) {
      return union(
        Domino(family, upto).translate(
          [
            -1 * Math.floor(upto / 5) * 120,
            -1 * (upto % 5) * 50,
            0
          ]
        ),
        DominoSet(family, upto - 1)
      );
    } else {
      return Domino(family, 0);
    }
  }

  return DominoSet(params.family, params.upto);
}
