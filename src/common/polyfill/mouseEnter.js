/** copy from
 * http://git.sankuai.com/projects/RECO/repos/reco-fe-shop-decoration/browse/src/common/polyfill/mouse_polyfill.js?at=refs%2Fheads%2Fstage */
/* eslint-disable */
(function (document) {
  if (('onmouseenter' in document) && 'onmouseleave' in document) return;
  var
    // shortcuts
    ADD_EVENT_LISTENER = 'addEventListener',
    REMOVE_EVENT_LISTENER = 'removeEventListener',
    EVENT_MOUSE_ENTER = 'mouseenter',
    EVENT_MOUSE_LEAVE = 'mouseleave',

    // shortcut for common replacements
    ElementPrototype = HTMLElement.prototype,
    defineProperties = Object.defineProperties,
    defineProperty = Object.defineProperty,
    docEle = document.documentElement,
    typeMap = {
      EVENT_MOUSE_ENTER: 'mouseover',
      EVENT_MOUSE_LEAVE: 'mouseout',
    },

    contains = docEle.contains ? function (parent, node) {
      return parent !== node && parent.contains(node)
    } : function (parent, node) {
      var result = parent !== node
      if (!result) {
        return result
      }
      if (result) {
        while (node && (node = node.parentNode)) {
          if (parent === node) {
            return true
          }
        }
      }
      return false
    },
    emulateEnterOrLeave = function (callback) {
      return function (e) {
        var relatedTarget = e.relatedTarget
        if (relatedTarget !== this && !contains(this, relatedTarget)) {
          callback.apply(this, arguments)
        }
      }
    },
    // these are common DOM overrides
    commonOverride = function (proto, name) {
      var original = proto[name];
      defineProperty(proto, name, {
        configurable: true,
        value: function (type, eventHandler, capture) {
          if (type === EVENT_MOUSE_ENTER || type === EVENT_MOUSE_LEAVE) {
            var simulateType = type === EVENT_MOUSE_ENTER ?
                typeMap['EVENT_MOUSE_ENTER'] : typeMap['EVENT_MOUSE_LEAVE'];
            original.call(
              this,
              simulateType,
              emulateEnterOrLeave(eventHandler),
              capture
            );
            return
          }
          original.call(this, type, eventHandler, capture);
        }
      });
    },
    // DOM Level 0 accessors
    createAccessor = function (type) {
      var ontype = '_on' + type;
      return {
        enumerable: true,
        configurable: true,
        get: function () {
          return this[ontype] || null;
        },
        set: function (callback) {
          if (this[ontype]) {
            this[REMOVE_EVENT_LISTENER](typeMap[type], this[ontype]);
          }
          this[ontype] = callback;
          if (callback) {
            this[ADD_EVENT_LISTENER](type, this[ontype]);
          }
        }
      };
    },
    // the unique handler for all the things
    accessors = {
      onmouseenter: createAccessor(EVENT_MOUSE_ENTER),
      onmouseleave: createAccessor(EVENT_MOUSE_LEAVE),
    };

  commonOverride(document, ADD_EVENT_LISTENER);
  commonOverride(document, REMOVE_EVENT_LISTENER);
  commonOverride(ElementPrototype, ADD_EVENT_LISTENER);
  commonOverride(ElementPrototype, REMOVE_EVENT_LISTENER);

  // make these available as DOM Level 0
  defineProperties(document, accessors);
  defineProperties(ElementPrototype, accessors);

}(document));