var scrollm = {

	config: {
    // Time between scroll events. < is 1 continuous scroll, > will end first & start new
  	delay: 350,
    // Default bar starting height
    offset: 50,
    // RAF cap
    maxRate: 1000 / 30,
  },

	store: {
  	timeout: undefined,
    topStart: 0,
    topUpdate: 0,
    active: false,
    direction: "down",
    ticking: false,
    yOffset: 0,
    yTop: 0,
    xLeft: 0,
    timeThen: 0,
  },
  
 	setup: (targets) => {
    // Wrap targets specified
    for (let wrap of targets) {
      wrap.setAttribute("data-scroll-top", wrap.scrollTop)
    }
    // HTML/BODY, even if no class
    let html = document.documentElement
    if (html.scrollHeight > html.clientHeight) {
      html.setAttribute("data-scroll-top", html.scrollTop)
    }
    // Scroll event
  	document.addEventListener("scroll", scrollm.ticker, true)
  },
  
  start: (target) => {

  	scrollm.store.active = true
    scrollm.store.topStart = target.getAttribute("data-scroll-top")

    let bars = target.getElementsByClassName("scroll-bar")
    let bar = bars[bars.length-1]
    if (bar === undefined) {
      scrollm.createBar(target)
      bars = target.getElementsByClassName("scroll-bar")
      bar = bars[bars.length-1]
    }
    // Reset bars, in case we started scrolling on another container before the other was complete
    for (let bar of bars) {
      bar.classList.remove("active")
    }

    // Calc & store bar positioning, from scroll container
    let bodyRect = document.body.getBoundingClientRect()
    let mTop = parseFloat(window.getComputedStyle(target, null).getPropertyValue("margin-top"))
    
    let targetRect, barWidth, xLeft, yTop, yOffset
    // Scrolling body, via html
    if (target === document.documentElement) {
      targetRect = document.body.getBoundingClientRect()
      barWidth = document.documentElement.clientWidth
      let htmlMarginTop = parseFloat(window.getComputedStyle(document.documentElement, null).getPropertyValue("margin-top"))
      xLeft = targetRect.left - bodyRect.left
      yOffset = targetRect.top - bodyRect.top + mTop - htmlMarginTop
      // TODO: This probably needs more calculation, for unique cases
      yTop = window.innerHeight
    }
    // Scrolling other container
    else {
      targetRect = target.getBoundingClientRect()
      barWidth = target.getBoundingClientRect().width
      xLeft = targetRect.left
      yOffset = targetRect.top - bodyRect.top + mTop - document.documentElement.scrollTop
      yTop = targetRect.top - bodyRect.top + targetRect.height - document.documentElement.scrollTop
    }
    
    // TODO: yOffset not being calculated when scroll used on <body>, via <html>
    scrollm.store.yOffset = yOffset
    scrollm.store.yTop = yTop
    scrollm.store.xLeft = xLeft

    // Set bar values
    bar.style.left = xLeft + "px"
    bar.style.width = barWidth + "px"

  },
  
  end: (target) => {
  	scrollm.store.active = false
    let bars = target.getElementsByClassName("scroll-bar")
    let bar = bars[bars.length-1]
    bar.classList.remove("active")
    let st = target.scrollTop
    target.setAttribute("data-scroll-top", st)
    scrollm.store.topStart = st
  },
  
  ticker: (e) => {
    let target = e.target !== undefined ? e.target : e.scrollingElement
    // Only if RAF not running
  	if (!scrollm.store.ticking) {
      let delta = Date.now() - scrollm.store.timeThen
      // Cap
      if (delta > scrollm.config.maxRate) {
        scrollm.store.timeThen = Date.now() - (delta % scrollm.config.maxRate)
        window.requestAnimationFrame(() => {
          scrollm.update(target)
          scrollm.store.ticking = false
        })
        scrollm.store.ticking = true
      }
    }
  },
  
  update: (target) => {
    
    // If scrolling body, set active to <html>
    target = target.activeElement !== undefined ? target.documentElement : target
  
 		// First
    // NOTE: This is happening after first scroll tick, so scrollTop is kinda wrong
  	if (!scrollm.store.active) {
      scrollm.store.active = false
      scrollm.start(target)
    }
  
  	// Values
    let scrollTopNow = target.scrollTop
    // let distance = scrollm.store.topUpdate - scrollm.store.topStart
    let distance = scrollTopNow - scrollm.store.topStart
    let barHeight = Math.abs(distance)
    barHeight += scrollm.config.offset
    let bars = target.getElementsByClassName("scroll-bar")
    let bar = bars[bars.length-1]

    // Direction
    let direction
    // Can be equal sometimes, when still scrolling
    if (scrollTopNow === scrollm.store.topUpdate) {
    	direction = scrollm.store.direction
    } else {
    	direction = scrollTopNow > scrollm.store.topUpdate ? "down" : "up"
    }

    // Change direction
    if (direction !== scrollm.store.direction) {
    	scrollm.store.topStart = target.scrollTop
      target.setAttribute("data-scroll-top", scrollm.store.topStart)
    	scrollm.start(target)
      distance = scrollTopNow - scrollm.store.topStart
      barHeight = Math.abs(distance) + scrollm.config.offset
      bar.style.marginTop = "0"
    }
    scrollm.store.direction = direction
    
    // Bar - scrolling within height of container
    if (barHeight <= target.offsetHeight) {
    	bar.style.height = barHeight + "px"
    	bar.classList.add("active")
      if (direction === "down") {
        bar.style.top = scrollm.store.yTop + "px"
        bar.style.marginTop = "-" + barHeight + "px"
      } else {
        bar.style.top = scrollm.store.yOffset + "px"
      }
    }
    // Bar - scrolled past height of container
    else {
      bar.classList.remove("active")
      bar.style.height = target.offsetHeight + "px"
      if (direction === "down") {
      	bar.style.marginTop = "-" + target.offsetHeight + "px"
      } else {
      	bar.style.marginTop = 0
      }
    }
    
    // When complete
  	clearTimeout(scrollm.store.timeout)
    ;((target) => { scrollm.store.timeout = setTimeout(() =>
    	scrollm.end(target),
      scrollm.config.delay)
    })(target)
    
    // Update value
    scrollm.store.topUpdate = target.scrollTop
  
  },
  
  createBar: (target) => {
    target = target.activeElement !== undefined ? target.activeElement : target
 		let bar = document.createElement("div")
		bar.classList.add("scroll-bar")
    target.appendChild(bar)
    // scrollm.store.bar = document.getElementsByClassName("scroll-bar")[0]
  }
  
}

scrollm.setup(document.getElementsByClassName("scroll-mark"))