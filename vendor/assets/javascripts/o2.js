!function(provide) {
  'use strict';

  provide('o2-config', {
    FADE_CLASS: 'fade',
    IN_CLASS: 'in'
  });
}(provide);
!function(document, require, provide, $) {
  'use strict';
  
  /*
   * Cross-browser feature detection.
   * Note: while this package accessible before
   * doc ready, the properties themselves
   * will not be. If you need browser-specific 
   * properties, make sure to only check for them
   * after doc ready.
   */

  var _ = require('std::utils'),
      browser = {};

  $(function() {
    var docBody = document.body || document.documentElement,
        docStyle = docBody.style;

    var hasSupport = function(el) {
      var index, length, curr, undef,
          tests = _.args(arguments, 1);
      for(index = 0, length = tests.length; index < length; index++) {
        curr = tests[index];
        if(el[curr.prop] !== undef) return curr.val;
      }
      return null;
    };

    browser.transitionEnd = hasSupport(docStyle,
      { prop: 'WebkitTransition', val: 'webkitTransitionEnd' },
      { prop: 'MozTransition', val: 'transitionend' },
      { prop: 'MsTransition', val: 'MSTransitionEnd' },
      { prop: 'OTransition', val: 'oTransitionEnd' },
      { prop: 'transition', val: 'transitionend' }
    );
  });

  browser.reflow = function($el) {
    $el[0].offsetWidth;
  };
  
  provide('o2-browser', browser);
}(document, require, provide, jQuery);
!function(require, provide, $) {
  'use strict';

  var wait = require('std::wait'),
      _ = require('std::utils'),
      browser = require('o2-browser');

  var transition, addClass, removeClass;

  transition = function($el, isTransitioningIn, inClass, transitionClass, callback) {
    var waiting = false,
        done = function() { _.callback(callback); };

    if($el.hasClass(inClass) !== isTransitioningIn) {
      if(isTransitioningIn) $el.addClass(inClass);
      else $el.removeClass(inClass);

      if(browser.transitionEnd && $el.hasClass(transitionClass)) {
        waiting = true;
        $el.one(browser.transitionEnd, done);
      }
    }

    if(!waiting) {
      done();
    }
  };

  addClass = function($el, inClass, transitionClass, callback) {
    transition($el, true, inClass, transitionClass, callback);
  };

  removeClass = function($el, inClass, transitionClass, callback) {
    transition($el, false, inClass, transitionClass, callback);
  };

  provide('o2-transition', {
    addClass: addClass,
    removeClass: removeClass
  });
}(require, provide, jQuery);
!function(document, $) {
  'use strict';

  var OUT_CLASS = 'out';

  $('html').on('click', '.alert .close', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).closest('.alert').addClass(OUT_CLASS);
  });

}(document, jQuery);
!function($) {
  'use strict';

  $(function() {
    var oldDropdownPlugin,
        OPEN_CLASS = 'open',
        DROPDOWN = '.dropdown-toggle',
        MENU = '.dropdown-menu',
        $body = $('body'),

        Dropdown = function(element) {
          this.$el = $(element);
        };

    Dropdown.prototype = {
      constructor: Dropdown,

      close: function() {
        var $el;

        if (this.isOpen()) {
          $el = this.$el;
          $el.removeClass(OPEN_CLASS);
          $el.trigger('hidden');
        }
      },

      // The instance could keep track of its state in a variable like
      // `_isOpen`, however, as of v0.8 clients were checking state via the
      // existence of the `OPEN_CLASS`. The instance should keep state in its
      // element's className to keep current state assumptions the same.
      //
      // Possible failure example:
      //
      //   $('.dropdown').dropdown('show');
      //   $('.dropdown').removeClass('open');
      //
      //   // If the plugin kept state internally, it would think the dropdown
      //   // was still open although the client has force-closed it.
      //   $('.dropdown').dropdown('isOpen');
      isOpen: function() {
        return this.$el.hasClass(OPEN_CLASS);
      },

      open: function() {
        var $el;

        if (!this.isOpen()) {
          clearMenus();
          $el = this.$el;
          $el.addClass(OPEN_CLASS);
          $el.trigger('shown');
        }
      },

      toggle: function() {
        this[this.isOpen() ? 'close' : 'open']();
      }
    };

    function clearMenus(e) {
      // When this function is called via a click event callback, assume this
      // was because of a click on the document. Thus, suppress it if the
      // "data-dropdown-sticky" attribute is set.
      $(DROPDOWN).parent(e ? '[data-dropdown-sticky!="true"]' : '')
        .dropdown('close');
    }

    function toggle() {
      var dropdown,
          $el = $(this).parent(),
          isOpen = $el.hasClass(OPEN_CLASS);

      dropdown = $el.data('dropdown');
      if (!dropdown) {
        $el.data('dropdown', (dropdown = new Dropdown($el)));
      }

      dropdown.toggle();

      $body[isOpen ? 'on' : 'off']('click.dropdown', MENU, function(e) {
        e.stopPropagation();
      });

      return false;
    }

    oldDropdownPlugin = $.fn.dropdown;

    $.fn.dropdown = function(option) {
      return this.each(function() {
        var $this = $(this),
            dropdown = $this.data('dropdown');

        if (!dropdown) {
          $this.data('dropdown', (dropdown = new Dropdown(this)));
        }

        if (typeof option === 'string') {
          dropdown[option]();
        }
      });
    };

    $.fn.dropdown.Constructor = Dropdown;

    $.fn.dropdown.noConflict = function() {
      $.fn.dropdown = oldDropdownPlugin;
      return this;
    };

    $body.on('click.dropdown', clearMenus);
    $body.on('click.dropdown', DROPDOWN, toggle);
  });
}(jQuery);
/*
 *
 * TODO (@reissbaker): track whether the animations are currently running -- if
 * so, buffer the close() and open() callbacks instead of calling them
 * immediately.
 *
 * This seems unimportant, but blows up some tests that remove the modal from
 * the DOM too quickly.
 */

!function(document, require, provide, $) {
  'use strict';

  var _ = require('std::utils'),
      Queue = require('std::async-queue'),
      wait = require('std::wait'),
      browser = require('o2-browser'),
      config = require('o2-config'),
      trans = require('o2-transition');

  var modalController, setOpen, transitionIn,
      transitionOut, transition, initContainer,
      waitTransition,
      $backdrop = $('<div class="modal-backdrop fade"></div>');

  /*
   * Modal controller function.
   * --------------------------
   */

  modalController = function(val) {
    var guts = modalController._internal,
        _container;

    if (!val) return modalController;

    if (typeof val === 'string') val = $.trim(val);

    val = $(val);
    if(guts.$current && guts.$current.is(val)) return modalController;

    guts.$current = val;

    initContainer($backdrop);
    _container = initContainer(val);

    if(_container.data('modal-sticky')){
      $backdrop.addClass('modal-sticky');
    }
    else {
      $backdrop.removeClass('modal-sticky');
    }

    if(_container.hasClass('modal-theatre')){
      $backdrop.addClass('modal-theatre');
    }
    else {
      $backdrop.removeClass('modal-theatre');
    }

    return modalController;
  };

  modalController._internal = {
    isOpen: false,
    $current: null,
    q: new Queue()
  };
  modalController.open = function(callback) {
    return setOpen(true, callback);
  };
  modalController.close = function(callback) {
    return setOpen(false, callback);
  };
  modalController.toggle = function(callback) {
    return setOpen(!modalController._internal.isOpen, callback);
  };
  modalController.current = function() {
    return this._internal.$current;
  };
  modalController.isOpen = function() {
    return this._internal.isOpen;
  };

  setOpen = function(val, callback) {
    var guts = modalController._internal,
        $current = guts.$current;

    var cb = function() {
      _.callback(callback);

      if ($current) {
        $current.trigger(val ? 'modalOpen' : 'modalClose');
      }
    };

    if(guts.isOpen !== val) {
      guts.q.enqueue(function(done) {
        var $body = $('body'),
            fin = function() {
              done();
              cb();
              $current.trigger('modalTransitionEnd', val);
              // don't scroll body when modal is open
              $body.toggleClass('modal-open');
            };
        $current.trigger('modalTransitionStart', val);
        if(val) {
          transition(val, $backdrop, $current, fin);
        }
        else {
          transition(val, $current, $backdrop, fin);
        }
      });
      guts.isOpen = val;
    } else {
      cb();
    }
    return modalController;
  };

  /*
   * Transition helper functions.
   * ----------------------------
   *
   * Call these to fade elements in and out.
   */

  // transition a single element in
  transitionIn = function($el, done) {
    $el.show();
    browser.reflow($el);
    trans.addClass($el, config.IN_CLASS, config.FADE_CLASS, done);
  };

  // transition a single element out
  transitionOut = function($el, done) {
    var end = function() { $el.hide(); done(); };
    trans.removeClass($el, config.IN_CLASS, config.FADE_CLASS, end);
  };

  waitTransition = function(transitionFn, $el, waiting) {
    return wait(waiting, function(done) {
      transitionFn($el, done);
    });
  };

  /*
   * transition multiple elements in or out.
   *
   * takes a boolean `in` parameter, an array or arg list of elements, and an
   * optional callback.
   *
   * transitions the elements in or out, and then calls the callback when the
   * transition completes.
   */

  transition = function(isIn, $firstEl, $secondEl, callback) {
    var waiting,
        transitionFn = isIn ? transitionIn : transitionOut;

    waiting = waitTransition(transitionFn, $firstEl, []);
    waiting = waitTransition(transitionFn, $secondEl, waiting);

    wait(waiting, function(done) {
      _.callback(callback);
      done();
    });
  };

  initContainer = function($container) {
    $container.detach();
    if(!modalController.isOpen()) {
      $container.removeClass(config.IN_CLASS);
      $container.css('display', 'none');
    } else if(!$container.hasClass(config.IN_CLASS)) {
      $container.css('display', 'none');
      browser.reflow($container);
      $container.addClass(config.IN_CLASS);
      $container.css('display', 'block');
    }
    $('body').append($container);

    return $container;
  };

  // set up close handlers
  $(function() {
    $(document).on('click', '.modal .close, .modal [data-modal-close="true"], .modal-backdrop:not(.modal-sticky)', function(e) {
      e.preventDefault();
      modalController.close();
    });

    $(document).on('click', 'a[rel="modal"]', function (e) {
      e.preventDefault();
      modalController($(this).attr('href')).open();
    });
  });

  /*
   * Export.
   */

  provide('o2-modal', modalController);
}(document, require, provide, jQuery);
!function(global, $) {
  'use strict';

  var ACTIVE_CLASS = 'active',
      ACTIVE_SELECTOR = '.' + ACTIVE_CLASS,
      NAV_SELECTOR = '.nav',
      NAV_TABS_SELECTOR = '.nav-tabs',
      PILL_SELECTOR = '.nav-pills',
      CHILD_ANCHOR_SELECTOR = ' > li > a',
      TAB_ANCHOR_SELECTOR = NAV_TABS_SELECTOR + CHILD_ANCHOR_SELECTOR,
      PILL_ANCHOR_SELECTOR = PILL_SELECTOR + CHILD_ANCHOR_SELECTOR,
      NAV_CONTENT_SELECTOR = '.tab-content',
      stealActive;

  stealActive = function($thief, $victim) {
    $victim.removeClass(ACTIVE_CLASS);
    $thief.addClass(ACTIVE_CLASS);
  };

  $(function() {
    var selector;

    $('body').on('click', TAB_ANCHOR_SELECTOR + ', ' + PILL_ANCHOR_SELECTOR, function(e) {
      var $this = $(this),
          $navTab = $this.closest(NAV_SELECTOR),
          $parent = $this.parent(),
          $active = $navTab.children(ACTIVE_SELECTOR),
          $associatedTab = $($this.attr('href')),
          $associatedTabContainer = $associatedTab.closest(NAV_CONTENT_SELECTOR),
          $activeTab = $associatedTabContainer.children(ACTIVE_SELECTOR);

      e.preventDefault();

      if(!$parent.hasClass(ACTIVE_CLASS)) {
        stealActive($parent, $active);
        stealActive($associatedTab, $activeTab);
      }
    });

    if(global.location.hash){
      // if there's a hash, try to click it
      selector = TAB_ANCHOR_SELECTOR + "[href='" + encodeURI(global.location.hash) + "']" + "," +
                 PILL_ANCHOR_SELECTOR + "[href='" + encodeURI(global.location.hash) + "']";

      $(selector).click();
    }
  });
}(window, jQuery);

!function(document, require, provide, $) {
  'use strict';

  var _ = require('std::utils'),
      Queue = require('std::async-queue'),
      transition = require('o2-transition'),
      config = require('o2-config');

  var TOOLTIP_TEXT_ATTR = 'title',
      TOOLTIP_TEMP_TEXT_ATTR = 'data-original-title',
      TOOLTIP_TEMPLATE = '<div class="tooltip fade"></div>',
      TOOLTIP_STICKY_DELAY = 333;

  var swapAttrs = function($el, dest, src) {
    $el.attr(dest, $el.attr(src));
    $el.removeAttr(src);
  };

  var Tooltip = function(text, x, y) {
    var $tip;

    // by default, set tooltip appears above the el
    this._position = "top";

    if (typeof(text) === 'string') {
      $tip = this._$tooltip = $(TOOLTIP_TEMPLATE);
      $tip.html(text);
      this._fromDom = false;
    } else if (text instanceof $) {
      // remove the tooltip el from the DOM
      $tip = this._$tooltip = text.detach();
      this._fromDom = true;
    } else {
      // Something weird happened.
      throw new Error("Instantiating Tooltip with bad arguments.");
    }

    // this extends the tooltip API to take an object as an arg, rather than individual args
    if(typeof(x) === 'object'){
      this._sticky = x.sticky;
      y = x.y;
      this._position = x.position || this._position;
      x = x.x;
    }

    if(!x) x = 0;
    if(!y) y = 0;

    this._q = new Queue();
    this._inserted = false;

    insert(this);
    this._height = $tip.outerHeight();
    this._width = $tip.outerWidth();

    this.x(x);
    this.y(y);

    // We have to do this again in case the tooltip is near edge of screen and wraps.
    // Don't want the tooltip to cover a button.
    this._height = $tip.outerHeight();

    switch(this._position){
      case "bottom":
        this.x(this.x() - (this._width / 2));
        break;
      case "left":
        this.x(this.x() - this._width);
        break;
      case "right":
        break;
      default:
        this.y(this.y() - this._height);
        this.x(this.x() - (this._width / 2));
        break;
    }

    if (this._sticky) {

      $tip.on('mouseenter.tooltip', $.proxy(function() {
        if(this._timeout) {
          clearTimeout(this._timeout);
          this._timeout = undefined;
        }
      }, this));

      $tip.on('mouseleave.tooltip', $.proxy(function() {
        if(!this._timeout) {
          this.fadeOut();
        }
      }, this));

    }

  };

  Tooltip.prototype.fadeIn = function(callback) {
    var ref = this;
    var $tip = ref._$tooltip;
    var caretClassNamePrefix = $tip.hasClass('tooltip-panel-light') ?
      'light-' :
      'dark-';

    switch (ref._position) {
      case "bottom":
        $tip.addClass(caretClassNamePrefix + 'caret-top-middle')
          .css('display', 'block');
        break;
      case "left":
        $tip.addClass(caretClassNamePrefix + 'caret-right-top')
          .css('display', 'block');
        break;
      case "right":
        $tip.addClass(caretClassNamePrefix + 'caret-left-top')
          .css('display', 'block');
        break;
      default:
        $tip.addClass(caretClassNamePrefix + 'caret-bottom-middle')
          .css('display', 'block');
        break;
    }

    if(!ref._inserted) insert(ref);
    ref._q.enqueue(function(done) {
      if(!ref._fromDom) ref._$tooltip.show();
      transition.addClass($tip, config.IN_CLASS, config.FADE_CLASS, function() {
        done();
        _.callback(callback);
      });
    });

    return ref;
  };

  Tooltip.prototype.fadeOut = function(callback) {
    var ref = this;
    var $tip = ref._$tooltip;

    var doFadeOut = function() {
      ref._q.enqueue(function(done) {
        transition.removeClass($tip, config.IN_CLASS, config.FADE_CLASS, function() {
          if(ref._fromDom){
            $tip.off('mouseenter.tooltip mouseleave.tooltip');
            $tip.hide();
          } else {
            $tip.remove();
          }

          done();
          _.callback(callback);
        });
      });
    };

    if (ref._sticky && !ref._timeout) {
      ref._timeout = setTimeout(doFadeOut, TOOLTIP_STICKY_DELAY);
    } else if (!ref._sticky) {
      doFadeOut();
    }

    return ref;
  };

  Tooltip.prototype.remove = function() {
    this._$tooltip.remove();
    this._inserted = false;
  };

  Tooltip.prototype.x = function(val) {
    var $tip = this._$tooltip;
    if(!val) return this._x;

    $tip.css('left', val);
    this._x = val;
  };

  Tooltip.prototype.y = function(val) {
    var $tip = this._$tooltip;
    if(!val) return this._y;

    $tip.css('top', val);
    this._y = val;
  };

  Tooltip.prototype.height = function(val) {
    var $tip = this._$tooltip;
    if(!val) return this._height;

    $tip.css('height', val);
    this._height = val;
  };

  Tooltip.prototype.width = function(val) {
    var $tip = this._$tooltip;
    if(!val) return this._width;

    $tip.css('width', val);
    this._width = val;
  };

  var insert = function(tooltip) {
    $('body').append(tooltip._$tooltip);
    tooltip._inserted = true;
  };

  $(function() {
    $(document).on('mouseenter', '[rel="tooltip"], [data-tooltip-el]', function(e){
      var $this = $(this);

      var tooltip = tooltipCreator.call(this, e);
      tooltip.fadeIn();

      $this.on('mouseleave', function() {
        tooltip.fadeOut();
        swapAttrs($this, TOOLTIP_TEXT_ATTR, TOOLTIP_TEMP_TEXT_ATTR);
        $this.off('mouseleave');
      });
    });

    var tooltipCreator = function(e){
      e.preventDefault();

      // figure out el positioning
      // base this on the data-tooltip-position attribute
      var $this = $(this),
          offset = $this.offset(),
          position = $this.data('tooltip-position'),
          sticky = !!$this.data('tooltip-sticky'),
          x, y;

      // figure out where to place the pointer
      switch(position) {
        case "bottom":
          x = offset.left + ($this.outerWidth() / 2);
          y = offset.top + $this.outerHeight();
          break;
        case "left":
          x = offset.left;
          y = offset.top + ($this.outerHeight() / 2);
          break;
        case "right":
          x = offset.left + $this.outerWidth();
          y = offset.top + ($this.outerHeight() / 2);
          break;
        default:
          x = offset.left + ($this.outerWidth() / 2);
          y = offset.top;
          break;
      }


      var tooltipEl = $this.data('tooltip-el');

      var text = tooltipEl ? $(tooltipEl) : $this.attr('title') || $this.data('title');
      var tooltip = new Tooltip(text, {x: x, y: y, position: position, sticky: sticky});

      if (!text) {
        tooltip.remove();
        return tooltip;
      }

      swapAttrs($this, TOOLTIP_TEMP_TEXT_ATTR, TOOLTIP_TEXT_ATTR);

      return tooltip;
    };
  });

  provide('o2-tooltip', Tooltip);
}(document, require, provide, jQuery);
!function(document, require, provide, $) {
 "use strict";

 var COLLAPSIBLE_PANEL_OPEN_CLASS = "collapse-open",
     COLLAPSIBLE_PANEL_CLASS = "collapse",
     COLLAPSIBLE_ICON_SELECTOR = ".icon-collapsible, [data-collapsible-role=icon]",
     COLLAPSIBLE_ICON_OPEN = "icon-caret-down",
     COLLAPSIBLE_ICON_CLOSED = "icon-caret-right";

  var CollapsiblePanel = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.collapse.defaults, options);
    this.target = $("[href=#"+this.$element.attr("id")+"],[data-target="+this.$element.attr("id")+"]");
    this.options.toggle && this.toggle();
  };

  CollapsiblePanel.prototype = {

    constructor: CollapsiblePanel,

    dimension: function () {
      return this.$element.data('collapse-direction') || 'height';
    },

    show: function () {
      var dimension, scroll, actives, hasData;

      if (this.transitioning) return;

      dimension = this.dimension();
      scroll = $.camelCase(['scroll', dimension].join('-'));

      if(this.$element.data('collapsible-group')) {
        actives =  $('.' + COLLAPSIBLE_PANEL_OPEN_CLASS + '[data-collapsible-group=' + this.$element.data('collapsible-group') + ']');
      }

      if (actives && actives.length) {
        hasData = actives.data('collapse');

        if (hasData && hasData.transitioning) return;

        actives.collapse('hide');
        hasData || actives.data('collapse', null);
      }

      var icon = this.target.find(COLLAPSIBLE_ICON_SELECTOR);

      if(icon){
        icon.addClass(COLLAPSIBLE_ICON_OPEN);
        icon.removeClass(COLLAPSIBLE_ICON_CLOSED);
      }

      this.$element[dimension](0);
      this.transition('addClass', $.Event('show'), 'shown');
      $.support.transition && this.$element[dimension](this.$element[0][scroll]);
    },

    hide: function () {
      var dimension;
      if (this.transitioning) return;
      dimension = this.dimension();
      this.reset(this.$element[dimension]());
      this.transition('removeClass', $.Event('hide'), 'hidden');
      this.$element[dimension](0);

      var icon = this.target.find(COLLAPSIBLE_ICON_SELECTOR);

      if(icon){
        icon.removeClass(COLLAPSIBLE_ICON_OPEN);
        icon.addClass(COLLAPSIBLE_ICON_CLOSED);
      }
    },

    reset: function (size) {
      var dimension = this.dimension();

      this.$element.removeClass('collapse')[dimension](size || 'auto')[0].offsetWidth;

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse');

      return this;
    },

    transition: function (method, startEvent, completeEvent) {
      var that = this,
          complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent);

      if (startEvent.isDefaultPrevented()) return;

      this.transitioning = 1;

      this.$element[method](COLLAPSIBLE_PANEL_OPEN_CLASS);

      $.support.transition && this.$element.hasClass(COLLAPSIBLE_PANEL_CLASS) ?
        this.$element.one($.support.transition.end, complete) :
        complete();
    },

    toggle: function () {
      this[this.$element.hasClass(COLLAPSIBLE_PANEL_OPEN_CLASS) ? 'hide' : 'show']()
    }
  };


  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('collapse'),
          options = typeof option == 'object' && option;

      if (!data) $this.data('collapse', (data = new CollapsiblePanel(this, options)));
      if (typeof option == 'string') data[option]();
    })
  };

  $.fn.collapse.defaults = {
    toggle: true
  };

  $.fn.collapse.Constructor = CollapsiblePanel;

  $(function () {
    $('body').on('click.collapse', '[data-collapsible-role=toggle]', function (e) {
      var $this = $(this),
          href,
          target = $this.attr('data-target')
                    || e.preventDefault()
                    || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''),
          option = $(target).data('collapse') ? 'toggle' : $this.data();

      $this[$(target).hasClass(COLLAPSIBLE_PANEL_OPEN_CLASS) ? 'addClass' : 'removeClass']('collapsed');
      $(target).collapse(option);
    });
  })

  provide('o2-collapsible-panel', CollapsiblePanel);
}(document, require, provide, jQuery);
