const Color = require("color");
const sourceColors = require("../src/styles/config/colors.json");

const customFuncs = {
  common: {
    if: function ifFunc(condition, thenExpression, elseExpression) {
      const conditionValue = evaluateExpression(this, condition);
      if (!!conditionValue) {
        return evaluateExpression(this, thenExpression);
      } else {
        return evaluateExpression(this, elseExpression);
      }
    },
    compose: function composeFunc(functions) {
      return functions.reduce(
        (prevValue, expr) => evaluateExpression(prevValue, expr),
        this
      );
    },
    Color: function ColorFunc(param, model = undefined) {
      return Color(param, model);
    }
  }
};

function findValueOrFunc(name, value, types) {
  if (name in value) {
    return value[name];
  }
  for (const type of types) {
    if (type in customFuncs && name in customFuncs[type]) {
      return customFuncs[type][name];
    }
  }
  throw new Error(`Function '${name}' not found`);
}

function evaluateExpression(value, expression) {
  if (!Array.isArray(expression)) {
    expression = [expression]
  }
  const exprType = expression[0];

  if (typeof exprType === "string") {
    if (typeof value === "object" && value !== null) {
      const name = exprType
      const args = expression.slice(1)
      const valueOrFunc = findValueOrFunc(name, value, ["object", "common"]);
      // console.log(`EVAL: ${value}.${name} = ${valueOrFunc}`)
      if (typeof valueOrFunc === "function") {
        return valueOrFunc.apply(value, args);
      } else {
        return valueOrFunc;
      }
    } else {
      throw new Error(`Value must be an object: ${value}`)
    }
  } else if (exprType === undefined) {
    return value
  } else {
    throw new Error(`Expression type must be a string: ${exprType}`)
  }
}

function generateColorVariations(colors, baseName, baseColor, variations) {
  if (variations.length === 0) {
    const color = baseColor.rgb().string()
    // console.log(`    GEN: ${baseName} = ${color}`)
    colors[baseName] = color
  } else {
    const variationStep = variations[0]
    const nextVariations = variations.slice(1)
    Object.keys(variationStep).forEach((key, index) => {
      const newName = baseName + (key ? '-' + key : '')
      // console.log(`        EVAL[${index}]: ${newName} for '${key}' on ${baseColor}`)
      const newColor = evaluateExpression(baseColor, variationStep[key])
      generateColorVariations(colors, newName, newColor, nextVariations)
    });
  }
}

function genColors() {
  const colors = {};

  // sourceColors.groups
  if (sourceColors.groups) {
    const groups = Array.isArray(sourceColors.groups)
      ? sourceColors.groups
      : [sourceColors.groups];

    for (const group of groups) {
      // console.log(`GROUP: ${group.name}`)
      for (const baseName in group.colors) {
        // console.log(`  VARIATIONS: ${baseName}`)
        if (group.colors.hasOwnProperty(baseName)) {
          const baseColor = Color(group.colors[baseName]);

          generateColorVariations(
            colors,
            baseName,
            baseColor,
            (group.variations || []).map(v => ({ '': [], ...v }))
          )
        }
      }
    }
  }

  return colors;
}

module.exports.colors = genColors();
module.exports.textColors = module.exports.colors;
module.exports.backgroundColors = module.exports.colors;
module.exports.borderColors = module.exports.colors;

console.log("Colors: ", module.exports.colors);
