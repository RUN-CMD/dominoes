
function getParameterDefinitions() {
  return [
    { name: 'family', type: 'int', initial: 4, caption: "*family* (all dominos generated will contain this number)" },
    { name: 'from', type: 'int', initial: 5, caption: "*from* (will generate 0-N of the family)" },
    { name: 'upto', type: 'int', initial: 6, caption: "*upto* (will generate 0-N of the family)" },
    { name: 'render', type: 'choice', caption: 'Render Selection', values: ['all', 'body', 'dots'], captions: ["All", "Bodys", "Dots"], initial: 'all' }
  ];
}

function validate(params) {
  if (params.family < 0 || params.family > 9) throw new Error("Family must be 0-9");
  if (params.from < 0 || params.from > 9)     throw new Error("From must be 0-9");
  if (params.upto < 0 || params.upto > 9)     throw new Error("Upto must be 0-9");
}

function main(params) {

  validate(params);

  function Domino(topNumber, bottomNumber) {

    return difference(
        DominoBody(),
        Dots(CreeperHead, DotLayout(topNumber) ),
        Dots(CreeperHead, DotLayout(bottomNumber) ).mirroredX()
    );
  }

  function DominoStrategy(topNumber, bottomNumber) {

    return Domino(topNumber, bottomNumber);
  }

  function DominoBodyStrategy(topNumber, bottomNumber) {

    return difference(
        DominoBody(),
        Dots(Noggin, DotLayout(topNumber) ),
        Dots(Noggin, DotLayout(bottomNumber) ).mirroredX()
    );
  }

  function DominoDotsStrategy(topNumber, bottomNumber) {

    return difference(
        DominoBody(),
        Dots(DotLayout(topNumber) ),
        Dots(DotLayout(bottomNumber) ).mirroredX()
    );
  }

  function DotLayout(dotCount) {

    var topLeft      = function() { return [18, 5.5, 0]; };
    var topCenter    = function() { return [18, 0, 0]; };
    var topRight     = function() { return [18, -5.5, 0]; };
    var centerLeft   = function() { return [12, 5.5, 0]; };
    var center       = function() { return [12, 0, 0]; };
    var centerRight  = function() { return [12, -5.5, 0]; };
    var bottomLeft   = function() { return [6, 5.5, 0]; };
    var bottomCenter = function() { return [6, 0, 0]; };
    var bottomRight  = function() { return [6, -5.5, 0]; };

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

  function Dots(model, dotLayout) {

    if (dotLayout.length == 0) {
      // TODO find an openjscad null object that is compatible with union()
      return CSG.cube({ radius: 0.0001 });
    }

    return dotLayout.reduce(
      function(prev, curr, idx, arr) {
        return union(prev, Dot(model, curr) );
      },
      Dot(model, dotLayout[0])
    );
  }

  function Dot(model, position) {

    return model().translate(position() ).translate([0, 0, 2.5]);
  }

  function CreeperHead() {

    function Noggin() {
      return CSG.cube({
        radius: [2.5, 2.5, 1.75],
        roundradius: 1,
        resolution: 16
      }).setColor(0,0.5,0);
    }

    function Eye() {
      return CSG.cube({radius: [0.5, 0.5, 2.5]}).setColor(0,0,0);
    }

    function Mouth() {
      return union(
          CSG.cube({radius: [0.75, 0.5, 2.5]}).setColor(0,0,0),          
          CSG.cube({radius: [0.75, 0.25, 2.5]}).
            setColor(0,0,0).
            translate([-0.5, 0.75, 0]),
          CSG.cube({radius: [0.75, 0.25, 2.5]}).
            setColor(0,0,0).
            translate([-0.5, -0.75, 0])
      );
    }

    return difference(
      Noggin(), 
      Eye().translate([1, 1, 0]),
      Eye().translate([1, -1, 0]),
      Mouth().translate([-0.5, 0, 0])
    );
  }

  function DominoBody() {

    return CSG.roundedCube({
      center: [0, 0, 0],
      radius: [24, 10.5, 2.5],
      roundradius: 1,
      resolution: 16
    });
  }

  function DominoSet(family, from, upto) {

    if (upto > from) {
      return union(
        Domino(family, upto).translate(
          [
            -1 * Math.floor(upto / 5) * 60,
            -1 * (upto % 5) * 25,
            0
          ]
        ),
        DominoSet(family, upto - 1, from)
      );
    } else {
      return Domino(family, from);
    }
  }

  function dominoTypeFromRenderType(render) {

    switch(render) {
      case 'body': return DominoBodyStrategy;
      case 'dots': return DominoDotsStrategy;
      else return DominoStrategy;
    }
  }

  return DominoSet(
    params.family,
    params.from,
    params.upto,
    dominoTypeFromRenderType(params.render)
  );
}
