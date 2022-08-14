# postcss-fluid-length

PostCSS plugin that creates fluidly interpolated length values. You can read about the fluid typography in the great articles at [Smashing Magazine](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/) and [CSS Tricks](https://css-tricks.com/snippets/css/fluid-typography/). This approach can be used not only for font sizes, but also for any CSS dimensional properties. But the fluid method requires complex calculations, and this plugin helps to avoid them.

## fluid(…) CSS function

This plugin introduces a new `fluid()` function that allows you to simply enumerate breakpoints and values, like this:

```css
font-size: fluid(16px / 400px, 20px / 800px);
```

This means: I want to have a font size of 16px for screen widths up to 400px, 20px for widths 800px and wider, and a _linear transition_ in between. So at 600px wide, the font size would be 18px.

This line will be transformed to the:

```css
font-size: 20px;
font-size: clamp(16px, 16px + (100vw - 400px) / 100, 20px);
```

The first line is a fallback for older browsers, and the second line does all the fluid magic.

You can define more breakpoints, for example:

```css
font-size: fluid(16px / 400px, 20px / 600px, 24px / 1200px);
```

You can use any static (not v\*) length units for breakpoint values/sizes, but all units must be the same for all pairs.

The full syntax of the fluid function is:

```
fluid( x1 / y1, x2 / y2... [, by 100vw] [, fallback x3] )
```

The optional parameters are:

- _by 100vw_ is the dynamic size (in v\* units) that should be mapped to the breakpoint sizes. It is 100wv by default.
- _fallback x3_ is the fallback value. By default, the maximum of the breakpoint values is used, but it can be overridden in the plugin options.

## Plugin usage

Use this plugin in the same way as the other PostCSS plugins:

```js
postcss([require("postcss-fluid-length")(options)]);
```

The optional _options_ object has the following optional fields:

- _byValue_ the default _by_ parameter, defaults to "100vw" if not set;
- _fallbackBy_ the default fallback method, can be "max-value", "min-value" and "none" (omit fallback), defaults to "max-value" if not set;
- _useMinMax_ use min() and max() functions instead of clamp() ([for old Safari](https://caniuse.com/css-math-functions)), defaults to _false_ if not set.

## Limitations

There are some limitations, some of them (marked 🤔) will probably be fixed in the future, and some (🙅) probably not.

- 🤔 All units must be the same in all breakpoints;
- 🤔 You can not use CSS variables in breakpoints;
- 🙅 You can not use calculations inside the function;
- 🙅 You can not use the _fluid()_ function inside of other calculation, the _fluid()_ call must be solo in the CSS rule.
