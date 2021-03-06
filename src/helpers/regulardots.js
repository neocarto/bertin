import { union } from "geotoolbox";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { range, rollup, ascending } from "d3-array";
import { geoProject } from "d3-geo-projection";
const d3 = Object.assign({}, { geoProject, range, rollup, ascending });

//geoProject;

export function regulardots(geojson, projection, width, height, step, values) {
  // Regular grid
  let y = d3.range(0 + step / 2, height, step).reverse();
  let x = d3.range(0 + step / 2, width, step);
  let grid = x.map((x, i) => y.map((y) => [x, y])).flat();

  // planar projection
  const polys = d3.geoProject(geojson, projection);

  const merge = union(polys).features[0].geometry;

  let grid2 = [];
  grid.forEach((d, i) => {
    if (booleanPointInPolygon(d, merge)) {
      grid2.push(d);
    }
  });

  //  Test in wich poly are points
  let grid3 = [];
  polys.features.forEach((poly, idpoly) => {
    grid2.forEach((d, i) => {
      if (booleanPointInPolygon(d, poly)) {
        grid3.push([idpoly, poly.properties[values], d]);
      }
    });
  });

  //return grid3;

  //dot values
  const count = d3.rollup(
    grid3,
    (v) => v.length,
    (d) => d[0]
  );

  // Output

  const propbyid = new Map(geojson.features.map((d, i) => [i, d.properties]));

  let output = [];
  grid3.forEach((d) => {
    output.push({
      type: "Feature",
      properties: Object.assign(propbyid.get(d[0]), {
        ___value: +d[1] / count.get(d[0]),
        ___count: count.get(d[0]),
      }),
      geometry: { type: "Point", coordinates: d[2] },
    });
  });

  return {
    type: "FeatureCollection",
    features: output.sort((a, b) =>
      d3.ascending(a.properties.dot_value, b.properties.dot_value)
    ),
  };
}
