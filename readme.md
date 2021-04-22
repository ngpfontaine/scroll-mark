# Scroll Mark

### Problem
Often, it's easy to lose your place on a webpage when scrolling - especially text-heavy pages without obtrusive anchors. Generally you relocate your position quickly, but it's an unnecessary annoyance. Smooth-scrolling homogenizes everything while moving, often resulting in eye flickering/strain. Non smooth-scrolling prevents this, but makes large jumps which can throw off focus.

### Solution
Animate a visual anchor to help positional tracking

### How
- The webpage body will automatically use the scroll mark if it's tall enough to overflow-y
- Or add `.scroll-mark` class to elements you want to use it

### Setup
- Import `scroll-mark.css` and 'scroll-mark.js` to your project
- Reference in your html
- Will automatically act on `<body>` if necessary
- Add `.scroll-mark` to a non html/body elements if desired
- Modify variables and styles if needed

### Options
`scroll-mark.js`
- `scrollm.config.delay
Time between scroll events. Under will be 1 continuous event. Over will end first, and start fresh
- `scrollm.config.offset`
Beginning height for scroll mark. Adjust if you want it higher/lower (relative to scroll direction)

### TODO
- Console notification if class added to the wrong element
` Console notification if not automatically acting on `<body>`
- BUG: flicks to wrong side when switching scroll target
- Test with different styling cases
