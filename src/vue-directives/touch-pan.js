import Utils from '../utils'

function getDirection (mod) {
  if (Object.keys(mod).length === 0) {
    return {
      horizontal: true,
      vertical: true
    }
  }

  let dir = {}

  ;['horizontal', 'vertical'].forEach(direction => {
    if (mod[direction]) {
      dir[direction] = true
    }
  })

  return dir
}

function updateClasses (el, dir, scroll) {
  el.classList.add('q-touch')

  if (!scroll) {
    if (dir.horizontal && !dir.vertical) {
      el.classList.add('q-touch-y')
      el.classList.remove('q-touch-x')
    }
    else if (!dir.horizontal && dir.vertical) {
      el.classList.add('q-touch-x')
      el.classList.remove('q-touch-y')
    }
  }
}

function processChanges (evt, ctx, isFinal) {
  let
    direction,
    position = Utils.event.position(evt),
    distX = position.left - ctx.event.x,
    distY = position.top - ctx.event.y,
    absDistX = Math.abs(distX),
    absDistY = Math.abs(distY)

  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    direction = distX < 0 ? 'left' : 'right'
  }
  else if (!ctx.direction.horizontal && ctx.direction.vertical) {
    direction = distY < 0 ? 'up' : 'down'
  }
  else if (absDistX >= absDistY) {
    direction = distX < 0 ? 'left' : 'right'
  }
  else {
    direction = distY < 0 ? 'up' : 'down'
  }

  return {
    evt,
    position,
    direction,
    isFirst: ctx.event.isFirst,
    isFinal: Boolean(isFinal),
    duration: new Date().getTime() - ctx.event.time,
    distance: {
      x: absDistX,
      y: absDistY
    },
    delta: {
      x: position.left - ctx.event.lastX,
      y: position.top - ctx.event.lastY
    }
  }
}

function shouldTrigger (ctx, changes) {
  if (ctx.direction.horizontal && ctx.direction.vertical) {
    return true
  }
  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    return Math.abs(changes.delta.x) > 0
  }
  if (!ctx.direction.horizontal && ctx.direction.vertical) {
    return Math.abs(changes.delta.y) > 0
  }
}

export default {
  bind (el, binding) {
    let ctx = {
      handler: binding.value,
      scroll: binding.modifiers.scroll,
      direction: getDirection(binding.modifiers),

      mouseStart (evt) {
        document.addEventListener('mousemove', ctx.mouseMove)
        document.addEventListener('mouseup', ctx.mouseEnd)
        ctx.start(evt)
      },
      start (evt) {
        let position = Utils.event.position(evt)
        ctx.event = {
          x: position.left,
          y: position.top,
          time: new Date().getTime(),
          detected: false,
          prevent: ctx.direction.horizontal && ctx.direction.vertical,
          isFirst: true,
          lastX: position.left,
          lastY: position.top
        }
      },
      mouseMove (evt) {
        ctx.event.prevent = true
        ctx.move(evt)
      },
      move (evt) {
        if (ctx.event.prevent) {
          if (!ctx.scroll) {
            evt.preventDefault()
          }
          let changes = processChanges(evt, ctx, false)
          if (shouldTrigger(ctx, changes)) {
            ctx.handler(changes)
            ctx.event.lastX = changes.position.left
            ctx.event.lastY = changes.position.top
            ctx.event.isFirst = false
          }
          return
        }
        if (ctx.event.detected) {
          return
        }

        ctx.event.detected = true
        let
          position = Utils.event.position(evt),
          distX = position.left - ctx.event.x,
          distY = position.top - ctx.event.y

        if (ctx.direction.horizontal && !ctx.direction.vertical) {
          if (Math.abs(distX) > Math.abs(distY)) {
            evt.preventDefault()
            ctx.event.prevent = true
          }
        }
        else {
          if (Math.abs(distX) < Math.abs(distY)) {
            evt.preventDefault()
            ctx.event.prevent = true
          }
        }
      },
      mouseEnd (evt) {
        document.removeEventListener('mousemove', ctx.mouseMove)
        document.removeEventListener('mouseup', ctx.mouseEnd)
        ctx.end(evt)
      },
      end (evt) {
        if (!ctx.event.prevent || ctx.event.isFirst) {
          return
        }

        ctx.handler(processChanges(evt, ctx, true))
      }
    }

    Utils.store.add('touchpan', el, ctx)
    updateClasses(el, ctx.direction, ctx.scroll)
    el.addEventListener('touchstart', ctx.start)
    el.addEventListener('mousedown', ctx.mouseStart)
    el.addEventListener('touchmove', ctx.move)
    el.addEventListener('touchend', ctx.end)
  },
  update (el, binding) {
    if (binding.oldValue !== binding.value) {
      Utils.store.get('touchpan', el).handler = binding.value
    }
  },
  unbind (el, binding) {
    let ctx = Utils.store.get('touchpan', el)
    el.removeEventListener('touchstart', ctx.start)
    el.removeEventListener('mousedown', ctx.mouseStart)
    el.removeEventListener('touchmove', ctx.move)
    el.removeEventListener('touchend', ctx.end)
    Utils.store.remove('touchpan', el)
  }
}
