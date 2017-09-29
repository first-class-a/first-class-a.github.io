"use strict";
angular.module("website.core.humanize_duration", []), angular.module("website.core.settings", ["ng"]), angular.module("website.core.dependency", ["website.core.settings"]), angular.module("website", ["core.library.jsonrpc", "website.core", "website.widgets", "website.plugins", "website.moto_link", "moto.validation"]).config(["$compileProvider", "$httpProvider", function (e, t) {
    e.debugInfoEnabled(!1), t.useApplyAsync(!0)
}]).run(["jsonrpc", function (e) {
    window.websiteConfig && window.websiteConfig.apiUrl ? e.setBasePath(websiteConfig.apiUrl) : e.setBasePath("/api.php")
}]), angular.module("website.widgets", ["website.widgets.templates", "website.widget.contact_form", "website.widget.mail_chimp", "website.widget.auth_form", "website.widget.slider", "website.widget.grid_gallery", "website.widget.carousel", "website.widget.disqus", "website.widget.facebook_page_plugin", "website.widget.twitter", "website.widget.pinterest", "website.widget.menu", "website.widget.audio_player", "website.widget.video_player", "website.widget.social_buttons", "website.widget.map", "website.widget.countdown", "website.widget.accordion"]);
try {
    angular.module("website.plugins")
} catch (e) {
    angular.module("website.plugins", [])
}
try {
    angular.module("website.widgets.templates")
} catch (e) {
    angular.module("website.widgets.templates", [])
}
angular.module("website.core", ["website.core.settings", "website.core.dependency", "website.core.humanize_duration"]), angular.module("website.core").config(["motoWebsiteSettingsServiceProvider", function (e) {
    window.websiteConfig && angular.isObject(window.websiteConfig) && e.set(window.websiteConfig)
}]), $("body").hasClass("moto-preview") || $(document).ready(function () {
    function e() {
        (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) < 1040 || $(window).stellar("destroy").stellar({
            horizontalScrolling: !1,
            verticalScrolling: !0,
            responsive: !0
        })
    }

    e(), $(document).on("lazybeforeunveil", ".lazyload", function (t) {
        $(t.target).one("load", e)
    }), (new WOW).init(), window.websiteConfig.lazy_loading && !window.websiteConfig.lazy_loading.enabled && (window.lazySizesConfig.preloadAfterLoad = !0)
}), angular.module("moto.validation", []), angular.module("website").directive("motoBackToTopButton", ["$window", function (e) {
    var t = window.websiteConfig && window.websiteConfig.back_to_top_button || {};
    return t.enabled = !!t.enabled, t.topOffset = parseInt(t.topOffset) || 300, t.animationTime = parseInt(t.animationTime) || 500, t.cssVisibleClass = "moto-back-to-top-button_visible", {
        restrict: "EA",
        template: '<a ng-click="toTop($event)" class="moto-back-to-top-button-link"><span class="moto-back-to-top-button-icon"></span></a></div>',
        controller: ["$scope", "$element", function (i, n) {
            var o = angular.element(e), a = null, r = null;
            i.toTop = function () {
                try {
                    $("body,html").animate({scrollTop: 0}, t.animationTime)
                } catch (e) {
                }
            }, t.enabled && o.scroll(function () {
                try {
                    (r = o.scrollTop() > t.topOffset) !== a && ((a = r) ? n.addClass(t.cssVisibleClass) : n.removeClass(t.cssVisibleClass))
                } catch (e) {
                }
            })
        }]
    }
}]), angular.module("website.core.dependency").directive("motoDependencyRequire", ["motoDependencyService", function (e) {
    return {
        restrict: "A", link: function (t, i, n) {
            var o = n.motoDependencyRequire, a = o;
            try {
                a = t.$eval(a), angular.isUndefined(a) && (a = o)
            } catch (e) {
                a = o
            }
            angular.isFunction(a) && (a = a()), e.require(a)
        }
    }
}]), angular.module("website.core.dependency").provider("motoDependencyService", ["motoWebsiteSettingsServiceProvider", function (e) {
    function t(e) {
        var t = [];
        for (var i in e) e[i].length > 0 && t.push(i + "=" + e[i]);
        return t.join("&")
    }

    function i() {
        return l
    }

    function n() {
        return d
    }

    function o(e) {
        if (!angular.isArray(e)) {
            try {
                if (!c[e]) return !1;
                var t = c[e], n = t.scriptId || "connector_" + e, a = document.getElementById(n);
                if (a) return;
                (a = document.createElement("script")).id = n, a.src = t.getUrl(), a.type = "text/javascript", t.preInject(a), i().appendChild(a), t.postInject(a)
            } catch (e) {
                return !1
            }
            return !0
        }
        angular.forEach(e, function (e) {
            o(e)
        })
    }

    function a(e) {
        return c[e]
    }

    var r = null, s = {}, l = angular.element("head").get(0), d = angular.element("body").get(0), c = {};
    c = {
        disqus: {
            name: "disqus",
            urlTemplate: "//{{shortname}}.disqus.com/embed.js",
            params: {},
            setParams: function (e) {
                for (var t in e) e.hasOwnProperty(t) && this.setParam(t, e[t]);
                return this
            },
            getParams: function () {
                return this.params
            },
            setParam: function (e, t) {
                return this.params[e] = t, "" != t && (window["disqus_" + e] = t), this
            },
            getParam: function (e, t) {
                return angular.isUndefined(this.params[e]) ? angular.isUndefined(window["disqus_" + e]) ? t : window["disqus_" + e] : this.params[e]
            },
            getUrl: function () {
                return this.urlTemplate.replace(/\{\{shortname\}\}/gi, this.getParam("shortname"))
            },
            preInject: angular.noop,
            postInject: angular.noop,
            require: function () {
                return s.require(this.name), this
            }
        },
        facebook: {
            name: "facebook",
            scriptId: "facebook-jssdk",
            urlTemplate: "//connect.facebook.net/{{language}}/sdk.js#{{params}}",
            language: "en_US",
            getLanguage: function () {
                return this.language
            },
            setLanguage: function (e) {
                return this.language = e
            },
            getUrl: function () {
                return this.urlTemplate.replace(/\{\{language\}\}/gi, this.getLanguage()).replace(/\{\{params\}\}/gi, t(this.getParams()))
            },
            params: {version: "v2.8", xfbml: "1", appId: ""},
            setParams: function (e) {
                for (var t in e) e.hasOwnProperty(t) && this.setParam(t, e[t]);
                return this
            },
            getParams: function () {
                return this.params
            },
            setParam: function (e, t) {
                return this.params[e] = t, this
            },
            getParam: function (e, t) {
                return angular.isUndefined(this.params[e]) ? t : this.params[e]
            },
            preInject: function (e) {
                var t = document.getElementById("fb-root");
                t || ((t = document.createElement("div")).id = "fb-root", n().appendChild(t))
            },
            postInject: angular.noop,
            require: function () {
                return s.require(this.name), this
            }
        },
        twitter: {
            name: "twitter",
            scriptId: "twitter-wjs",
            url: "//platform.twitter.com/widgets.js",
            getUrl: function () {
                return this.url
            },
            params: {},
            setParams: function (e) {
                for (var t in e) e.hasOwnProperty(t) && this.setParam(t, e[t]);
                return this
            },
            getParams: function () {
                return this.params
            },
            setParam: function (e, t) {
                return this.params[e] = t, this
            },
            getParam: function (e, t) {
                return angular.isUndefined(this.params[e]) ? t : this.params[e]
            },
            preInject: angular.noop,
            postInject: angular.noop,
            require: function () {
                return s.require(this.name), this
            }
        },
        pinterest: {
            name: "pinterest", scriptUrl: "//assets.pinterest.com/js/pinit.js", getUrl: function () {
                return this.scriptUrl
            }, preInject: angular.noop, postInject: angular.noop, require: function () {
                return s.require(this.name), this
            }
        },
        linkedin: {
            name: "linkedin", scriptUrl: "//platform.linkedin.com/in.js", getUrl: function () {
                return this.scriptUrl
            }, preInject: function (t) {
                var i = e.get("preferredLocale", "en_US"), n = t.innerText;
                window._DependencyServiceOnLinkedInLoad = function () {
                    r && r.$emit("motoDependencyService.linkedin.loaded"), window._DependencyServiceOnLinkedInLoad = function () {
                    }
                }, n += " onLoad: _DependencyServiceOnLinkedInLoad\n", i && (n += " lang: " + i), t.textContent = n
            }, postInject: angular.noop, require: function () {
                return s.require(this.name), this
            }
        },
        google_plus: {
            name: "google_plus", scriptUrl: "https://apis.google.com/js/platform.js", getUrl: function () {
                return this.scriptUrl
            }, preInject: function (t) {
                var i = window.___gcfg || {};
                i.lang = i.lang || e.get("preferredLocale", "en_US"), window.___gcfg = i
            }, postInject: angular.noop, require: function () {
                return s.require(this.name), this
            }
        }
    }, this.require = o, s.require = o, this.get = a, s.get = a, this.$get = ["$rootScope", function (e) {
        return r = e, s
    }]
}]), angular.module("website.core.humanize_duration").filter("humanizeDuration", ["motoHumanizeDuration", function (e) {
    return function (t, i, n) {
        return e.humanize(t, i, n)
    }
}]), angular.module("website.core.humanize_duration").provider("motoHumanizeDuration", [function () {
    var e = this, t = {y: 315576e5, mo: 26298e5, w: 6048e5, d: 864e5, h: 36e5, m: 6e4, s: 1e3, ms: 1}, i = {
        years: "y",
        months: "mo",
        weeks: "w",
        days: "d",
        hours: "h",
        minutes: "m",
        seconds: "s",
        milliseconds: "ms"
    };
    this.humanize = function (e, n, o) {
        var a;
        return (!o || humanizeDuration.getSupportedLanguages().indexOf(o) < 0) && (o = "en"), i[n] && (n = i[n]), (a = humanizeDuration(e * t[n], {
            spacer: ">",
            language: o,
            units: [n],
            round: !0
        })).substr(a.indexOf(">") + ">".length)
    }, this.$get = [function () {
        return e
    }]
}]), angular.module("website.core.settings").provider("motoWebsiteSettingsService", [function (e) {
    var t = this, i = {};
    this.get = function (t, n) {
        return t === e ? i : i[t] !== e ? i[t] : n || null
    }, this.set = function (e, n) {
        if (!angular.isObject(e)) return i[e] = n, t;
        for (var o in e) e.hasOwnProperty(o) && t.set(o, e[o])
    }, this.$get = [function () {
        return t
    }]
}]), angular.module("website.moto_link", []).run(function () {
    var e, t = angular.element('[data-action="lightbox"].moto-link.moto-widget-image-link'), i = $("body");
    for (e = 0; e < t.length; e++) $(t[e]).magnificPopup({
        type: "image",
        tClose: "",
        tLoading: "",
        zoom: {enabled: !0, duration: 400, easing: "ease-in-out"}
    });
    i.magnificPopup({
        delegate: '.moto-link[data-action=lightbox]:not(".moto-widget-image-link")',
        type: "image"
    }), i.on("click", ".moto-link[data-action=lightbox]", function (e) {
        e.preventDefault()
    })
}), angular.module("website").directive("motoSticky", ["$window", "$timeout", function (e, t) {
    function i() {
        return window.motoDebug || !1
    }

    function n(e) {
        if ("static" === e.options.mode) return !0;
        var t, i = e.isAttached || e.options.hidden ? e.$pseudoElement : e.$element,
            n = i.get(0).getBoundingClientRect(), o = !1, a = e.options.offset, r = parseInt(i.css("marginTop")) || 0;
        return "smallHeight" === e.options.mode ? (t = Math.max(document.documentElement.clientHeight, window.innerHeight || 0), n.top + i.outerHeight() < t) : ("top" === e.options.direction && (o = n.top - r <= a), o)
    }

    function o(e) {
        var t = 0;
        try {
            e.$pseudoElement.show(), v || e.$element.innerWidth(e.$pseudoElement.innerWidth()), e.options.hidden || e.$pseudoElement.height(e.$element.outerHeight(!0)), v && (e.$pseudoElement.hide(), e.$element.removeClass(h.attachedClass).removeClass(h.attachedClass + "_" + e.options.direction).css("width", "").css("marginTop", ""), t = e.$element.innerWidth(), e.$pseudoElement.show(), e.$element.innerWidth(t), e.$pseudoElement.innerWidth(t), e.$element.addClass(h.attachedClass).addClass(h.attachedClass + "_" + e.options.direction))
        } catch (e) {
            i() && console.info("motoSticky : ERROR on syncPseudoElement", e)
        }
    }

    function a(e) {
        return e.isAttached || (e.$element.show().addClass(h.attachedClass).addClass(h.attachedClass + "_" + e.options.direction), e.isAttached = !0), o(e), !0
    }

    function r(e) {
        if (e.$pseudoElement.width(e.$element.innerWidth()), !e.isAttached) return !0;
        e.$element.css("width", ""), e.isAttached = !1, e.$element.removeClass(h.attachedClass).removeClass(h.attachedClass + "_" + e.options.direction), e.options.hidden ? (e.$pseudoElement.height(0), e.$element.hide()) : e.$pseudoElement.hide()
    }

    function s(e) {
        try {
            n(e) ? a(e) : r(e)
        } catch (e) {
            i() && console.info("motoSticky : ERROR on checkObject", e)
        }
    }

    function l(e) {
        try {
            if (e || (g && t.cancel(g), g = t(l, h.interval)), !b || f.length < 1) return;
            b = !1;
            for (var n = 0, o = f.length; n < o; n++) s(f[n]);
            v = !1
        } catch (e) {
            i() && console.info("motoSticky : ERROR on checkObjects", e)
        }
    }

    function d(e) {
        e.$pseudoElement || (e.$pseudoElement = angular.element('<div class="' + h.pseudoElementClass + '"></div>'), e.$pseudoElement.insertAfter(e.$element), e.options.hidden ? e.$pseudoElement.height(0) : (e.$pseudoElement.hide(), e.$pseudoElement.height(e.$element.outerHeight(!0)), e.$pseudoElement.width(e.$element.innerWidth())))
    }

    function c(e) {
        e.$element.find(".lazyload").each(function (t, i) {
            $(i).one("load", function () {
                s(e)
            })
        })
    }

    function u(e, t, n) {
        try {
            if (t.parent().closest("." + h.bootstrappedClass).length > 0) return i() && console.log("motoSticky : DETECTED PARENTS");
            var o = e.$eval(n.motoSticky),
                a = {$scope: e, $element: t, $attrs: n, options: angular.extend({}, w, o), isAttached: !1};
            c(a), d(a), s(a), f.push(a)
        } catch (e) {
            i() && console.info("motoSticky : ERROR on addObject", e)
        }
    }

    function m(e) {
        "resize" === e.type && (v = !0), b = !0
    }

    var g, p = angular.element(e), h = {
        interval: 32,
        attachedClass: "moto-sticky__attached",
        bootstrappedClass: "moto-sticky__bootstrapped",
        pseudoElementClass: "moto-sticky-pseudo-element"
    }, w = {hidden: !1, offset: 0, mode: "dynamic", direction: "top"}, f = [], b = !0, v = !0;
    return l(), p.scroll(m).resize(m), {
        restrict: "A", compile: function (e) {
            return e.addClass(h.bootstrappedClass), u
        }
    }
}]), angular.module("moto.validation").directive("motoClearValidationOnChange", function () {
    return {
        restrict: "A", require: "?ngModel", link: function (e, t, i, n) {
            var o, a, r;
            !(o = e.$eval(i.motoClearValidationOnChange)) && i.motoClearValidationOnChange && (o = i.motoClearValidationOnChange), o && !angular.isArray(o) && (o = [o]), n.$parsers.push(function (e) {
                for (a = 0, r = o.length; a < r; a++) n.$setValidity(o[a], !0);
                return e
            })
        }
    }
}), angular.module("website.widget.accordion", ["ngSanitize", "ui.bootstrap", "ngAnimate", "website.widgets.templates"]), angular.module("website.widget.audio_player", ["website.core"]).directive("motoWidgetAudioPlayer", ["$rootScope", function (e) {
    return {
        restrict: "AC", link: function (t, i) {
            var n, o, a = i.find(".moto-media-player-container").data("buttons");
            n = i.find("audio"), o = i.find("source"), n.mediaelementplayer({
                setDimensions: !1,
                alwaysShowControls: !0,
                motoTrackName: o.data("track-name") || "",
                loop: n.data("loop"),
                timeAndDurationSeparator: "<span>/</span>",
                startVolume: 1,
                playText: "",
                pauseText: "",
                stopText: "",
                features: ["playpause", a.stop ? "stop" : "", "progress", "current", "duration", "mototrackname", "volume", a.loop ? "motoloop" : "", "motoskin"],
                plugins: [],
                duration: o.data("track-length")
            }), !e.isAnyAutoPlayStarted && n.data("autoplay") && (e.isAnyAutoPlayStarted = !0, n[0].player.play())
        }
    }
}]), angular.module("website.widget.auth_form", ["core.library.jsonrpc"]).service("widget.AuthForm.Service", ["jsonrpc", function (e) {
    var t = e.newService("AuthService");
    this.loginToPageByPassword = t.createMethod("loginToPageByPassword")
}]).directive("motoWidgetAuthForm", ["widget.AuthForm.Service", "$window", function (e, t) {
    return {
        restrict: "C", scope: !0, link: function (i, n, o) {
            i.request = {password: "", pageId: o.destinationPageId}, i.submit = function () {
                i.request.pageId && (i.authForm.password.$setTouched(), i.authForm.$valid && e.loginToPageByPassword(i.request).then(function () {
                    t.location.reload()
                }, function (e) {
                    e && "403" == e.code ? i.authForm.password.$setValidity("passwordInvalid", !1) : i.authForm.password.$setValidity("couldNotSend", !1)
                }))
            }
        }
    }
}]), angular.module("website.widget.carousel", []).directive("motoCarouselOptions", function () {
    return {
        restrict: "A", priority: 450, link: function (e, t, i) {
            var n = e.$eval(i.motoCarouselOptions);
            t.bxSlider(function (e) {
                return 1 == e.itemsCount && (e.showPaginationDots = !1), {
                    mode: "horizontal",
                    auto: e.slideshowEnabled,
                    pause: 1e3 * e.slideshowDelay,
                    controls: e.showNextPrev,
                    pager: e.showPaginationDots,
                    slideWidth: e.slideWidth,
                    minSlides: e.minSlides,
                    maxSlides: e.maxSlides,
                    moveSlides: e.moveSlides,
                    slideMargin: e.margins,
                    stopAutoOnClick: !0,
                    shrinkItems: !0,
                    onSliderLoad: function () {
                        t.closest(".moto-widget-carousel").removeClass("moto-widget-carousel-loader")
                    }
                }
            }(n))
        }
    }
}), angular.module("website.widget.contact_form", ["core.library.jsonrpc", "ngFileUpload"]).service("widget.ContactForm.Service", ["jsonrpc", function (e) {
    var t = e.newService("Widget.ContactForm");
    this.sendMessage = t.createMethod("sendMessage"), this.getApiPath = e.getBasePath
}]).controller("widget.ContactForm.Controller", ["$scope", "$element", "widget.ContactForm.Service", "Upload", function (e, t, i, n) {
    function o() {
        e.emailError = !0, e.sending = !1
    }

    function a(t) {
        if (t.error) return o(t.error);
        e.emailSent = !0, e.triedToSend = !1, e.sending = !1
    }

    var r, s, l = t.find("input, textarea"),
        d = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
    if (e.message = {}, e.placeholder = {}, e.hash = "", e.attachments = [], e.attachment = {}, l.length) for (var c = 0, u = l.length; c < u; c++) (s = (r = angular.element(l[c])).attr("name")) && (e.message[s] = e.message[s] || "", e.placeholder[s] = r.attr("placeholder") || s);
    e.validateEmailOnBlur = function () {
        e.contactForm.email.$pristine = !1, "" != e.contactForm.email.$viewValue ? d.test(e.contactForm.email.$viewValue) ? (e.contactForm.email.emailInvalid = !1, e.contactForm.email.$setValidity("pattern", !0)) : (e.contactForm.email.emailInvalid = !0, e.contactForm.email.$setValidity("pattern", !1)) : e.contactForm.email.emailInvalid = !1
    }, e.validateRequiredOnBlur = function (t) {
        e.contactForm[t].$pristine = !1, "" == e.contactForm[t].$viewValue ? (e.contactForm[t].$invalid = !0, e.contactForm.$valid = !1) : e.contactForm[t].$invalid = !1
    }, e.validate = function (t) {
        "email" == t && e.validateEmailOnBlur(), e.validateRequiredOnBlur(t)
    }, e.errors = [], e.emailSent = !1, e.triedToSend = !1, e.submit = function () {
        e.sending || (e.emailSent = !1, e.triedToSend = !0, e.errors = [], e.sending = !0, e.emailError = !1, "object" == typeof e.contactForm.$error.required ? (e.contactForm.$error.required.forEach(function (e) {
            e.$dirty = !0, e.$pristine = !1, e.$setTouched()
        }), e.contactForm.$valid = !1) : e.contactForm.$valid = !0, e.validate("email"), e.contactForm && e.contactForm.$valid && !e.contactForm.emailInvalid ? e.attachment.name ? (e.message._attachments = e.attachment.name ? 1 : 0, n.upload({
            method: "POST",
            url: i.getApiPath(),
            file: e.attachment,
            data: {
                jsonrpc: "2.0",
                id: 1,
                method: "Widget.ContactForm.sendMessage",
                params: {message: e.message, placeholder: e.placeholder, hash: e.hash}
            },
            headers: {"X-Requested-With": "XMLHttpRequest"}
        }).success(a).error(o)) : i.sendMessage({
            message: e.message,
            placeholder: e.placeholder,
            hash: e.hash
        }).success(a).error(o) : e.sending = !1)
    }
}]), angular.module("website.widget.countdown", ["timer", "website.core.humanize_duration"]).directive("motoWidgetCountdown", ["$window", function (e) {
    function t(e, t) {
        var i, n, o, a, r, s, l, d, c;
        return (d = new Date).setTime(e), l = d.getMilliseconds(), s = d.getSeconds(), r = d.getMinutes(), a = d.getHours(), o = d.getDate(), n = d.getMonth(), i = d.getFullYear(), (c = new Date).setUTCFullYear(i), c.setUTCDate(1), c.setUTCMonth(n || 0), c.setUTCDate(o || 1), c.setUTCHours(a || 0), c.setUTCMinutes((r || 0) - (Math.abs(t) < 30 ? 60 * t : t)), c.setUTCSeconds(s || 0), c.setUTCMilliseconds(l || 0), c.getTime()
    }

    return {
        restrict: "C", scope: !0, compile: function (i, n) {
            function o() {
                "hide" === n.onExpiry ? i.slideUp() : "redirect" === n.onExpiry && n.redirectUrl && (e.location.href = n.redirectUrl)
            }

            var a, r, s, l = i.children("timer"), d = i.find(".countdown-item-amount"), c = parseFloat(n.time),
                u = (new Date).getTime();
            for (s = 0; s < d.length; s++) r = (a = angular.element(d[s])).attr("data-ng-bind"), 0 === s && l.attr("max-time-unit", "'" + r.slice(0, -1) + "'"), ["hours", "minutes", "seconds"].indexOf(r) >= 0 && a.attr("data-ng-bind", r[0] + r);
            return {
                pre: function (e) {
                    "event" === n.type ? e.countdownTime = (t(c, parseFloat(n.timezone)) - u) / 1e3 : e.countdownTime = c / 1e3, (!e.countdownTime || isNaN(e.countdownTime) || e.countdownTime < 0) && (e.countdownTime = 0), n.onExpiry && "stop" !== n.onExpiry && e.$on("timer-stopped", o)
                }
            }
        }
    }
}]), angular.module("website.widget.disqus", ["website.core"]).directive("motoWidgetDisqus", ["motoDependencyService", function (e) {
    var t = !1;
    return {
        restrict: "AC", link: function (i, n, o) {
            var a;
            try {
                if (t) return n.remove();
                t = !0, a = o.params || {}, angular.isString(a) && (a = angular.fromJson(a)), a.url = o.url, window.disqus_config = function () {
                    this.language = a.language
                }, a.use_identifier ? delete a.url : delete a.identifier, delete a.use_identifier, a && a.shortname && "" != a.shortname && e.get("disqus").setParams(a).require()
            } catch (e) {
            }
        }
    }
}]), angular.module("website.widget.facebook_page_plugin", ["website.core"]).config(["motoWebsiteSettingsServiceProvider", "motoDependencyServiceProvider", function (e, t) {
    try {
        t.get("facebook").setLanguage(e.get("preferredLocale", "en_US"))
    } catch (e) {
    }
}]).directive("motoWidgetFacebookPagePlugin", ["motoDependencyService", function (e) {
    return {
        restrict: "AC", link: function () {
            try {
                e.require("facebook")
            } catch (e) {
            }
        }
    }
}]), angular.module("website.widget.grid_gallery", []).directive("motoGridGalleryOptions", function () {
    return {
        restrict: "A", priority: 450, link: function (e, t, i) {
            var n = e.$eval(i.motoGridGalleryOptions);
            t.justifiedGallery({
                rowHeight: n.rowHeight,
                fixedHeight: n.fixedHeight,
                margins: n.margins,
                lastRow: n.lastRow,
                captions: n.showCaptions,
                cssAnimation: !0
            }), n.enableLightbox && t.magnificPopup({
                delegate: "a",
                type: "image",
                tClose: "",
                tLoading: "",
                gallery: {enabled: !0, preload: [5, 10], tPrev: "", tNext: "", tCounter: "%curr% / %total%"},
                image: {
                    titleSrc: function (e) {
                        return angular.element(".caption", e.el.context).html() || ""
                    }
                },
                zoom: {enabled: !0, duration: 400, easing: "ease-in-out"}
            })
        }
    }
}), angular.module("website.widget.mail_chimp", ["core.library.jsonrpc"]).service("website.widget.MailChimpService", ["jsonrpc", function (e) {
    var t = e.newService("Widget.MailChimp");
    this.subscribe = t.createMethod("subscribe")
}]).controller("widget.MailChimp.Controller", ["$scope", "$element", "website.widget.MailChimpService", function (e, t, i) {
    function n() {
        e.emailSent = !0, e.triedToSend = !1, e.sending = !1
    }

    function o(t) {
        e.emailError = !0, e.sending = !1, t.data && t.data.errors && t.data.errors.detail && (e.isSubscribed = t.data.errors.detail.match(/is already a list member/g))
    }

    var a, r, s = t.find("input"),
        l = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/, d = s.length;
    if (e.listId = "", e.message = {}, e.emailSent = !1, e.triedToSend = !1, e.emailError = !1, e.isSubscribed = !1, d) for (r = 0; r < d; r++) (a = angular.element(s[r]).attr("name")) && (e.message[a] = e.message[a] || "");
    e.validateEmailOnBlur = function () {
        e.subscribeForm.email.$pristine = !1, "" != e.subscribeForm.email.$viewValue ? l.test(e.subscribeForm.email.$viewValue) ? (e.subscribeForm.email.emailInvalid = !1, e.subscribeForm.email.$setValidity("pattern", !0)) : (e.subscribeForm.email.emailInvalid = !0, e.subscribeForm.email.$setValidity("pattern", !1)) : e.subscribeForm.email.emailInvalid = !1
    }, e.validateRequiredOnBlur = function (t) {
        e.subscribeForm[t].$pristine = !1, "" == e.subscribeForm[t].$viewValue ? (e.subscribeForm[t].$invalid = !0, e.subscribeForm.$valid = !1) : e.subscribeForm[t].$invalid = !1
    }, e.validate = function (t) {
        "email" == t ? (e.validateEmailOnBlur(), e.validateRequiredOnBlur(t)) : e.validateRequiredOnBlur(t)
    }, e.submit = function () {
        e.sending || (e.emailSent = !1, e.triedToSend = !0, e.sending = !0, e.emailError = !1, e.isSubscribed = !1, "object" == typeof e.subscribeForm.$error.required ? (e.subscribeForm.$error.required.forEach(function (e) {
            e.$dirty = !0, e.$pristine = !1, e.$setTouched()
        }), e.subscribeForm.$valid = !1) : e.subscribeForm.$valid = !0, e.validate("email"), e.subscribeForm && e.subscribeForm.$valid && !e.subscribeForm.emailInvalid ? (e.message.list_id = e.listId || "", i.subscribe({request: e.message}).success(n).error(o)) : e.sending = !1)
    }
}]), angular.module("website.widget.map", []).directive("motoWidgetMap", function () {
    return {
        restrict: "C", priority: 450, link: function (e, t) {
            var i = t.find(".moto-widget-map-frame");
            t.on("click", function () {
                i.addClass("moto-widget-map-frame_active")
            }), t.on("mouseleave", function () {
                i.removeClass("moto-widget-map-frame_active")
            })
        }
    }
}), angular.module("website.widget.menu", []).directive("motoWidgetMenu", function () {
    return {
        restrict: "C", priority: 450, link: function (e, t) {
            var i = t.find(".moto-widget-menu-toggle-btn"), n = t.find(".moto-widget-menu-item-has-submenu"),
                o = n.find(".moto-widget-menu-sublist"), a = t.find(".moto-widget-menu-link-arrow");
            i.on("click", function (e) {
                e.preventDefault(), t.toggleClass("moto-widget-menu-mobile-open"), t.hasClass("moto-widget-menu-mobile-open") && a.is(":visible") && o.hide()
            }), n.length && i.is(":visible") && a.on("click", function (e) {
                e.preventDefault(), $(this).closest(".moto-widget-menu-item-has-submenu").toggleClass("moto-widget-menu-item-has-submenu_opened").find("> .moto-widget-menu-sublist").toggle()
            })
        }
    }
}), angular.module("website.widget.pinterest", ["website.core"]).directive("motoWidgetPinterest", ["motoDependencyService", function (e) {
    return {
        restrict: "AC", link: function () {
            try {
                e.get("pinterest").require()
            } catch (e) {
            }
        }
    }
}]), angular.module("website.widget.slider", []).directive("motoSliderOptions", function () {
    return {
        restrict: "A", priority: 450, link: function (e, t, i) {
            var n = e.$eval(i.motoSliderOptions);
            t.bxSlider(function (e) {
                return 1 == e.itemsCount && (e.showPaginationDots = !1), {
                    mode: e.slideshowAnimationType,
                    auto: e.slideshowEnabled,
                    pause: 1e3 * e.slideshowDelay,
                    controls: e.showNextPrev,
                    pager: e.showPaginationDots,
                    captions: e.showSlideCaptions,
                    stopAutoOnClick: !0,
                    onSliderLoad: function () {
                        t.closest(".moto-widget-slider").removeClass("moto-widget-slider-loader")
                    }
                }
            }(n))
        }
    }
}), angular.module("website.widget.social_buttons", ["website.core"]).directive("motoWidgetSocialButtons", ["$rootScope", function (e) {
    return {
        restrict: "AC", link: function (t, i) {
            function n() {
                var e, t;
                try {
                    (e = i.find('li.social-button[data-name="linkedIn_share"]')).length && (e = angular.element(e.get(0)), t = angular.element(e.html().replace("<span", "<script").replace("</span>", "<\/script>")), e.get(0).parentNode.replaceChild(t.get(0), e.get(0)), IN.parse())
                } catch (e) {
                }
            }

            window.IN && angular.isFunction(window.IN.parse) ? n() : e.$on("motoDependencyService.linkedin.loaded", n)
        }
    }
}]), angular.module("website.widget.twitter", ["website.core", "website.widget.twitter.time_line"]), angular.module("website.widget.twitter.time_line", ["ng"]).directive("motoWidgetTwitterTimeLine", ["motoDependencyService", function (e) {
    return {
        restrict: "AC", link: function () {
            try {
                e.require("twitter")
            } catch (e) {
            }
        }
    }
}]), angular.module("website.widget.video_player", ["website.core"]).directive("motoWidgetVideoPlayer", ["$rootScope", function (e) {
    return {
        restrict: "AC", link: function (t, i) {
            var n;
            (n = i.find("video")).on("loadeddata", function () {
                i.removeClass("moto-media-player_not-loaded").addClass("moto-media-player_loaded"), n[0].player.options.alwaysShowControls = !1
            }), n.mediaelementplayer({
                motoTrackName: n.data("title") || "",
                timeAndDurationSeparator: "<span>/</span>",
                startVolume: 1,
                playText: "",
                pauseText: "",
                alwaysShowControls: !0,
                stopText: "",
                fullscreenText: "",
                videoVolume: "horizontal",
                features: ["playpause", "progress", "current", "duration", "mototrackname", "volume", "fullscreen", "motoskin"],
                plugins: [],
                duration: n.data("duration")
            }), !e.isAnyAutoPlayStarted && n.data("autoplay") && (e.isAnyAutoPlayStarted = !0, n[0].player.play())
        }
    }
}]), angular.module("website.widgets.templates", ["@websiteWidgets/accordion/templates/accordion-item.ng.html", "@websiteWidgets/accordion/templates/accordion.ng.html"]), angular.module("@websiteWidgets/accordion/templates/accordion-item.ng.html", []).run(["$templateCache", function (e) {
    e.put("@websiteWidgets/accordion/templates/accordion-item.ng.html", '<div ng-click="toggleOpen()" uib-accordion-transclude="heading" id="{{::headingId}}" aria-selected="{{isOpen}}" ng-keypress="toggleOpen($event)">\n    <div uib-accordion-header class="moto-widget-accordion__header" data-toggle="moto-widget-accordion__content-wrapper" aria-expanded="{{isOpen}}" aria-controls="{{::panelId}}" tabindex="0"></div>\n</div>\n<div id="{{::panelId}}" class="moto-widget-accordion__content-wrapper" uib-collapse="!isOpen" aria-labelledby="{{::headingId}}" aria-hidden="{{!isOpen}}">\n    <div class="moto-widget-accordion__content" ng-transclude></div>\n</div>')
}]), angular.module("@websiteWidgets/accordion/templates/accordion.ng.html", []).run(["$templateCache", function (e) {
    e.put("@websiteWidgets/accordion/templates/accordion.ng.html", '<div class="moto-widget-accordion__wrapper" ng-transclude></div>')
}]);