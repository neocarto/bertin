import { simple } from "./simple.js";
import { split } from "../helpers/split.js";
import { dotsinpolygons } from "../helpers/dotsinpolygons.js";
import * as d3array from "d3-array";
const d3 = Object.assign({}, d3array);

export function dotdensity(
  selection,
  projection,
  options = {},
  clipid,
  width,
  height
) {
  let nbdots =
    options.nbdots ??
    d3.sum(options.geojson.features.map((d) => +d.properties[options.values])) /
      1000;

  options.dotvalue = options.dotvalue ?? nbdots;
  options.symbol_size = options.symbol_size ?? 8;
  options.fill = options.fill ?? "#cc190c";
  options.leg_text = options.leg_text ?? `= ${options.dotvalue}`;
  options.leg_type = options.symbol ? options.symbol : "circle";

  let splited = split(options.geojson);

  splited.features.forEach((d, i) => {
    d.properties.__value = +d.properties[options.values] * d.__share;
    d.__test = +d.properties[options.values] * d.__share;
  });

  const dots = dotsinpolygons(splited, "__value", options.dotvalue);

  options.geojson = JSON.parse(JSON.stringify(dots));

  simple(selection, projection, options, clipid, width, height);
}
