var CodeMirror = function () {
    "use strict";
    function e(r, i) {
        function fn(e) {
            if (s.onDragEvent && s.onDragEvent(hn, I(e)))return;
            U(e)
        }

        function cn(e) {
            return e >= 0 && e < Mt.size
        }

        function pn(e) {
            return D(Mt, e)
        }

        function dn(e, t) {
            Jt = !0;
            var n = t - e.height;
            for (var r = e; r; r = r.parent)r.height += n
        }

        function vn(e) {
            var t = {line: 0, ch: 0};
            Dn(t, {line: Mt.size - 1, ch: pn(Mt.size - 1).text.length}, dt(e), t, t), Ut = !0
        }

        function mn(e) {
            var t = [];
            return Mt.iter(0, Mt.size, function (e) {
                t.push(e.text)
            }), t.join(e || "\n")
        }

        function gn(e) {
            Tt.scrollTop != Ft && (Ft = R.scrollTop = Tt.scrollTop, sr([]))
        }

        function yn(e) {
            s.fixedGutter && Z.style.left != R.scrollLeft + "px" && (Z.style.left = R.scrollLeft + "px"), R.scrollTop != Ft && (Ft = R.scrollTop, Tt.scrollTop != Ft && (Tt.scrollTop = Ft), sr([])), s.onScroll && s.onScroll(hn)
        }

        function bn(e) {
            function u(t) {
                g && (R.draggable = !1), It = !1, l(), c(), Math.abs(e.clientX - t.clientX) + Math.abs(e.clientY - t.clientY) < 10 && (q(t), dr(n.line, n.ch, !0), Yn())
            }

            function m(e) {
                if (i == "single") cr(n, e); else if (i == "double") {
                    var t = Er(e);
                    it(e, d) ? cr(t.from, v) : cr(d, t.to)
                } else i == "triple" && (it(e, d) ? cr(v, mr({line: e.line, ch: 0})) : cr(d, mr({line: e.line + 1, ch: 0})))
            }

            function y(e) {
                var t = ti(e, !0);
                if (t && !rt(t, a)) {
                    Dt || Mn(), a = t, m(t), Ut = !1;
                    var n = ir();
                    if (t.line >= n.to || t.line < n.from) f = setTimeout(di(function () {
                        y(e)
                    }), 150)
                }
            }

            function b(e) {
                clearTimeout(f);
                var t = ti(e);
                t && m(t), q(e), Yn(), Ut = !0, w(), l()
            }

            lr(X(e, "shiftKey"));
            for (var t = z(e); t != L; t = t.parentNode)if (t.parentNode == Q && t != Y)return;
            for (var t = z(e); t != L; t = t.parentNode)if (t.parentNode == gt)return s.onGutterClick && s.onGutterClick(hn, ht(gt.childNodes, t) + Gt, e), q(e);
            var n = ti(e);
            switch (W(e)) {
                case 3:
                    h && ni(e);
                    return;
                case 2:
                    n && dr(n.line, n.ch, !0), setTimeout(Yn, 20), q(e);
                    return
            }
            if (!n) {
                z(e) == R && q(e);
                return
            }
            Dt || Mn();
            var r = +(new Date), i = "single";
            if (jt && jt.time > r - 400 && rt(jt.pos, n)) i = "triple", q(e), setTimeout(Yn, 20), Sr(n.line); else if (Bt && Bt.time > r - 400 && rt(Bt.pos, n)) {
                i = "double", jt = {time: r, pos: n}, q(e);
                var o = Er(n);
                cr(o.from, o.to)
            } else Bt = {time: r, pos: n};
            var a = n, f;
            if (s.dragDrop && K && !s.readOnly && !rt(Pt.from, Pt.to) && !it(n, Pt.from) && !it(Pt.to, n) && i == "single") {
                g && (R.draggable = !0);
                var l = V(document, "mouseup", di(u), !0), c = V(R, "drop", di(u), !0);
                It = !0, R.dragDrop && R.dragDrop();
                return
            }
            q(e), i == "single" && dr(n.line, n.ch, !0);
            var d = Pt.from, v = Pt.to, w = V(document, "mousemove", di(function (e) {
                clearTimeout(f), q(e), !p && !W(e) ? b(e) : y(e)
            }), !0), l = V(document, "mouseup", di(b), !0)
        }

        function wn(e) {
            for (var t = z(e); t != L; t = t.parentNode)if (t.parentNode == gt)return q(e);
            q(e)
        }

        function En(e) {
            if (s.onDragEvent && s.onDragEvent(hn, I(e)))return;
            q(e);
            var t = ti(e, !0), n = e.dataTransfer.files;
            if (!t || s.readOnly)return;
            if (n && n.length && window.FileReader && window.File) {
                var r = n.length, i = Array(r), o = 0, u = function (e, n) {
                    var s = new FileReader;
                    s.onload = function () {
                        i[n] = s.result, ++o == r && (t = mr(t), di(function () {
                            var e = Un(i.join(""), t, t);
                            cr(t, e)
                        })())
                    }, s.readAsText(e)
                };
                for (var a = 0; a < r; ++a)u(n[a], a)
            } else {
                if (It && !it(t, Pt.from) && !it(Pt.to, t))return;
                try {
                    var i = e.dataTransfer.getData("Text");
                    i && vi(function () {
                        var e = Pt.from, n = Pt.to;
                        cr(t, t), It && Un("", e, n), zn(i), Yn()
                    })
                } catch (e) {
                }
            }
        }

        function Sn(e) {
            var t = Vn();
            e.dataTransfer.setData("Text", t);
            if (h || y || b) {
                var n = document.createElement("img");
                n.scr = "data:image/gif;base64,R0lGODdhAgACAIAAAAAAAP///ywAAAAAAgACAAACAoRRADs=", e.dataTransfer.setDragImage(n, 0, 0)
            }
        }

        function xn(e, t) {
            if (typeof e == "string") {
                e = u[e];
                if (!e)return !1
            }
            var n = Ht;
            try {
                s.readOnly && (Rt = !0), t && (Ht = null), e(hn)
            } catch (r) {
                if (r != J)throw r;
                return !1
            } finally {
                Ht = n, Rt = !1
            }
            return !0
        }

        function Nn(e) {
            function u() {
                o = !0
            }

            var t = f(s.keyMap), n = t.auto;
            clearTimeout(Tn), n && !c(e) && (Tn = setTimeout(function () {
                f(s.keyMap) == t && (s.keyMap = n.call ? n.call(null, hn) : n)
            }, 50));
            var r = mt[X(e, "keyCode")], i = !1;
            if (r == null || e.altGraphKey)return !1;
            X(e, "altKey") && (r = "Alt-" + r), X(e, "ctrlKey") && (r = "Ctrl-" + r), X(e, "metaKey") && (r = "Cmd-" + r);
            var o = !1;
            return X(e, "shiftKey") ? i = l("Shift-" + r, s.extraKeys, s.keyMap, function (e) {
                    return xn(e, !0)
                }, u) || l(r, s.extraKeys, s.keyMap, function (e) {
                    if (typeof e == "string" && /^go[A-Z]/.test(e))return xn(e)
                }, u) : i = l(r, s.extraKeys, s.keyMap, xn, u), o && (i = !1), i && (q(e), ri(), p && (e.oldKeyCode = e.keyCode, e.keyCode = 0)), i
        }

        function Cn(e, t) {
            var n = l("'" + t + "'", s.extraKeys, s.keyMap, function (e) {
                return xn(e, !0)
            });
            return n && (q(e), ri()), n
        }

        function Ln(e) {
            Dt || Mn(), p && e.keyCode == 27 && (e.returnValue = !1), on && Qn() && (on = !1);
            if (s.onKeyEvent && s.onKeyEvent(hn, I(e)))return;
            var t = X(e, "keyCode");
            lr(t == 16 || X(e, "shiftKey"));
            var r = Nn(e);
            b && (kn = r ? t : null, !r && t == 88 && X(e, n ? "metaKey" : "ctrlKey") && zn(""))
        }

        function An(e) {
            on && Qn();
            if (s.onKeyEvent && s.onKeyEvent(hn, I(e)))return;
            var t = X(e, "keyCode"), n = X(e, "charCode");
            if (b && t == kn) {
                kn = null, q(e);
                return
            }
            if ((b && (!e.which || e.which < 10) || E) && Nn(e))return;
            var r = String.fromCharCode(n == null ? t : n);
            s.electricChars && Ot.electricChars && s.smartIndent && !s.readOnly && Ot.electricChars.indexOf(r) > -1 && setTimeout(di(function () {
                Tr(Pt.to.line, "smart")
            }), 75);
            if (Cn(e, r))return;
            Jn()
        }

        function On(e) {
            if (s.onKeyEvent && s.onKeyEvent(hn, I(e)))return;
            X(e, "keyCode") == 16 && (Ht = null)
        }

        function Mn() {
            if (s.readOnly == "nocursor")return;
            Dt || (s.onFocus && s.onFocus(hn), Dt = !0, R.className.search(/\bCodeMirror-focused\b/) == -1 && (R.className += " CodeMirror-focused"), $t || Gn(!0)), $n(), ri()
        }

        function _n() {
            Dt && (s.onBlur && s.onBlur(hn), Dt = !1, en && di(function () {
                en && (en(), en = null)
            })(), R.className = R.className.replace(" CodeMirror-focused", "")), clearInterval(At), setTimeout(function () {
                Dt || (Ht = null)
            }, 150)
        }

        function Dn(e, t, n, r, i) {
            if (Rt)return;
            if (an) {
                var o = [];
                Mt.iter(e.line, t.line + 1, function (e) {
                    o.push(e.text)
                }), an.addChange(e.line, n.length, o);
                while (an.done.length > s.undoDepth)an.done.shift()
            }
            jn(e, t, n, r, i)
        }

        function Pn(e, t) {
            if (!e.length)return;
            var n = e.pop(), r = [];
            for (var i = n.length - 1; i >= 0; i -= 1) {
                var s = n[i], o = [], u = s.start + s.added;
                Mt.iter(s.start, u, function (e) {
                    o.push(e.text)
                }), r.push({start: s.start, added: s.old.length, old: o});
                var a = {line: s.start + s.old.length - 1, ch: ct(o[o.length - 1], s.old[s.old.length - 1])};
                jn({line: s.start, ch: 0}, {line: u - 1, ch: pn(u - 1).text.length}, s.old, a, a)
            }
            Ut = !0, t.push(r)
        }

        function Hn() {
            Pn(an.done, an.undone)
        }

        function Bn() {
            Pn(an.undone, an.done)
        }

        function jn(e, t, n, r, i) {
            function x(e) {
                return e <= Math.min(t.line, t.line + g) ? e : e + g
            }

            if (Rt)return;
            var o = !1, u = tn.text.length;
            s.lineWrapping || Mt.iter(e.line, t.line + 1, function (e) {
                if (!e.hidden && e.text.length == u)return o = !0, !0
            });
            if (e.line != t.line || n.length > 1) Jt = !0;
            var a = t.line - e.line, f = pn(e.line), l = pn(t.line);
            if (e.ch == 0 && t.ch == 0 && n[n.length - 1] == "") {
                var c = [], h = null;
                e.line ? (h = pn(e.line - 1), h.fixMarkEnds(l)) : l.fixMarkStarts();
                for (var p = 0, d = n.length - 1; p < d; ++p)c.push(A.inheritMarks(n[p], h));
                a && Mt.remove(e.line, a, Kt), c.length && Mt.insert(e.line, c)
            } else if (f == l)if (n.length == 1) f.replace(e.ch, t.ch, n[0]); else {
                l = f.split(t.ch, n[n.length - 1]), f.replace(e.ch, null, n[0]), f.fixMarkEnds(l);
                var c = [];
                for (var p = 1, d = n.length - 1; p < d; ++p)c.push(A.inheritMarks(n[p], f));
                c.push(l), Mt.insert(e.line + 1, c)
            } else if (n.length == 1) f.replace(e.ch, null, n[0]), l.replace(null, t.ch, ""), f.append(l), Mt.remove(e.line + 1, a, Kt); else {
                var c = [];
                f.replace(e.ch, null, n[0]), l.replace(null, t.ch, n[n.length - 1]), f.fixMarkEnds(l);
                for (var p = 1, d = n.length - 1; p < d; ++p)c.push(A.inheritMarks(n[p], f));
                a > 1 && Mt.remove(e.line + 1, a - 1, Kt), Mt.insert(e.line + 1, c)
            }
            if (s.lineWrapping) {
                var v = Math.max(5, R.clientWidth / Yr() - 3);
                Mt.iter(e.line, e.line + n.length, function (e) {
                    if (e.hidden)return;
                    var t = Math.ceil(e.text.length / v) || 1;
                    t != e.height && dn(e, t)
                })
            } else Mt.iter(e.line, e.line + n.length, function (e) {
                var t = e.text;
                !e.hidden && t.length > u && (tn = e, u = t.length, rn = !0, o = !1)
            }), o && (nn = !0);
            var m = [], g = n.length - a - 1;
            for (var p = 0, y = _t.length; p < y; ++p) {
                var b = _t[p];
                b < e.line ? m.push(b) : b > t.line && m.push(b + g)
            }
            var w = e.line + Math.min(n.length, 500);
            ai(e.line, w), m.push(w), _t = m, li(100), Wt.push({from: e.line, to: t.line + 1, diff: g});
            var E = {from: e, to: t, text: n};
            if (Xt) {
                for (var S = Xt; S.next; S = S.next);
                S.next = E
            } else Xt = E;
            hr(mr(r), mr(i), x(Pt.from.line), x(Pt.to.line))
        }

        function Fn() {
            var e = Mt.height * Kr() + 2 * Zr();
            return e - 1 > R.offsetHeight ? e : !1
        }

        function In(e) {
            var t = Fn();
            Tt.style.display = t ? "block" : "none", t ? (Nt.style.height = Q.style.minHeight = t + "px", Tt.style.height = R.clientHeight + "px", e != null && (Tt.scrollTop = R.scrollTop = e)) : Q.style.minHeight = "", Y.style.top = Qt * Kr() + "px"
        }

        function qn() {
            var e = document.createElement("div"), t = document.createElement("div");
            e.className = "CodeMirror-scrollbar", e.style.cssText = "position: absolute; left: -9999px; height: 100px;", t.className = "CodeMirror-scrollbar-inner", t.style.height = "200px", e.appendChild(t), document.body.appendChild(e);
            var n = e.offsetWidth <= 1;
            return document.body.removeChild(e), n
        }

        function Rn() {
            tn = pn(0), rn = !0;
            var e = tn.text.length;
            Mt.iter(1, Mt.size, function (t) {
                var n = t.text;
                !t.hidden && n.length > e && (e = n.length, tn = t)
            }), nn = !1
        }

        function Un(e, t, n) {
            function r(r) {
                if (it(r, t))return r;
                if (!it(n, r))return i;
                var s = r.line + e.length - (n.line - t.line) - 1, o = r.ch;
                return r.line == n.line && (o += e[e.length - 1].length - (n.ch - (n.line == t.line ? t.ch : 0))), {line: s, ch: o}
            }

            t = mr(t), n ? n = mr(n) : n = t, e = dt(e);
            var i;
            return Wn(e, t, n, function (e) {
                return i = e, {from: r(Pt.from), to: r(Pt.to)}
            }), i
        }

        function zn(e, t) {
            Wn(dt(e), Pt.from, Pt.to, function (e) {
                return t == "end" ? {from: e, to: e} : t == "start" ? {from: Pt.from, to: Pt.from} : {from: Pt.from, to: e}
            })
        }

        function Wn(e, t, n, r) {
            var i = e.length == 1 ? e[0].length + t.ch : e[e.length - 1].length, s = r({line: t.line + e.length - 1, ch: i});
            Dn(t, n, e, s.from, s.to)
        }

        function Xn(e, t, n) {
            var r = e.line, i = t.line;
            if (r == i)return pn(r).text.slice(e.ch, t.ch);
            var s = [pn(r).text.slice(e.ch)];
            return Mt.iter(r + 1, i, function (e) {
                s.push(e.text)
            }), s.push(pn(i).text.slice(0, t.ch)), s.join(n || "\n")
        }

        function Vn(e) {
            return Xn(Pt.from, Pt.to, e)
        }

        function $n() {
            if (on)return;
            kt.set(s.pollInterval, function () {
                ci(), Qn(), Dt && $n(), hi()
            })
        }

        function Jn() {
            function t() {
                ci();
                var n = Qn();
                !n && !e ? (e = !0, kt.set(60, t)) : (on = !1, $n()), hi()
            }

            var e = !1;
            on = !0, kt.set(20, t)
        }

        function Qn() {
            if ($t || !Dt || vt(F) || s.readOnly)return !1;
            var e = F.value;
            if (e == Kn)return !1;
            Ht = null;
            var t = 0, n = Math.min(Kn.length, e.length);
            while (t < n && Kn[t] == e[t])++t;
            return t < Kn.length ? Pt.from = {line: Pt.from.line, ch: Pt.from.ch - (Kn.length - t)} : qt && rt(Pt.from, Pt.to) && (Pt.to = {
                    line: Pt.to.line,
                    ch: Math.min(pn(Pt.to.line).text.length, Pt.to.ch + (e.length - t))
                }), zn(e.slice(t), "end"), e.length > 1e3 ? F.value = Kn = "" : Kn = e, !0
        }

        function Gn(e) {
            rt(Pt.from, Pt.to) ? e && (Kn = F.value = "") : (Kn = "", F.value = Vn(), nt(F))
        }

        function Yn() {
            s.readOnly != "nocursor" && F.focus()
        }

        function Zn() {
            var e = wt.getBoundingClientRect();
            if (p && e.top == e.bottom)return;
            var t = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
            (e.top < 0 || e.bottom > t) && er()
        }

        function er() {
            var e = tr();
            nr(e.x, e.y, e.x, e.yBot)
        }

        function tr() {
            var e = zr(Pt.inverted ? Pt.from : Pt.to), t = s.lineWrapping ? Math.min(e.x, yt.offsetWidth) : e.x;
            return {x: t, y: e.y, yBot: e.yBot}
        }

        function nr(e, t, n, r) {
            var i = rr(e, t, n, r);
            i.scrollLeft != null && (R.scrollLeft = i.scrollLeft), i.scrollTop != null && (Tt.scrollTop = R.scrollTop = i.scrollTop)
        }

        function rr(e, t, n, r) {
            var i = ei(), o = Zr();
            t += o, r += o, e += i, n += i;
            var u = R.clientHeight, a = Tt.scrollTop, f = {}, l = Fn() || Infinity, c = t < o + 10, h = r + o > l - 10;
            t < a ? f.scrollTop = c ? 0 : Math.max(0, t) : r > a + u && (f.scrollTop = (h ? l : r) - u);
            var p = R.clientWidth, d = R.scrollLeft, v = s.fixedGutter ? Z.clientWidth : 0, m = e < v + i + 10;
            return e < d + v || m ? (m && (e = 0), f.scrollLeft = Math.max(0, e - 10 - v)) : n > p + d - 3 && (f.scrollLeft = n + 10 - p), f
        }

        function ir(e) {
            var t = Kr(), n = (e != null ? e : Tt.scrollTop) - Zr(), r = Math.max(0, Math.floor(n / t)), i = Math.ceil((n + R.clientHeight) / t);
            return {from: H(Mt, r), to: H(Mt, i)}
        }

        function sr(e, t, n) {
            function d() {
                var e = xt.firstChild, t = !1;
                return Mt.iter(Gt, Yt, function (n) {
                    if (!e)return;
                    if (!n.hidden) {
                        var r = Math.round(e.offsetHeight / c) || 1;
                        n.height != r && (dn(n, r), Jt = t = !0)
                    }
                    e = e.nextSibling
                }), t
            }

            if (!R.clientWidth) {
                Gt = Yt = Qt = 0;
                return
            }
            var r = ir(n);
            if (e !== !0 && e.length == 0 && r.from > Gt && r.to < Yt) {
                In(n);
                return
            }
            var i = Math.max(r.from - 100, 0), o = Math.min(Mt.size, r.to + 100);
            Gt < i && i - Gt < 20 && (i = Gt), Yt > o && Yt - o < 20 && (o = Math.min(Mt.size, Yt));
            var u = e === !0 ? [] : or([{from: Gt, to: Yt, domStart: 0}], e), a = 0;
            for (var f = 0; f < u.length; ++f) {
                var l = u[f];
                l.from < i && (l.domStart += i - l.from, l.from = i), l.to > o && (l.to = o), l.from >= l.to ? u.splice(f--, 1) : a += l.to - l.from
            }
            if (a == o - i && i == Gt && o == Yt) {
                In(n);
                return
            }
            u.sort(function (e, t) {
                return e.domStart - t.domStart
            });
            var c = Kr(), h = Z.style.display;
            xt.style.display = "none", ur(i, o, u), xt.style.display = Z.style.display = "";
            var p = i != Gt || o != Yt || Zt != R.clientHeight + c;
            p && (Zt = R.clientHeight + c), Gt = i, Yt = o, Qt = B(Mt, i);
            if (xt.childNodes.length != Yt - Gt)throw new Error("BAD PATCH! " + JSON.stringify(u) + " size=" + (Yt - Gt) + " nodes=" + xt.childNodes.length);
            if (s.lineWrapping) {
                d();
                var v = Fn(), m = v ? "block" : "none";
                Tt.style.display != m && (Tt.style.display = m, v && (Nt.style.height = v + "px"), d())
            }
            return Z.style.display = h, (p || Jt) && ar() && s.lineWrapping && d() && ar(), In(n), fr(), !t && s.onUpdate && s.onUpdate(hn), !0
        }

        function or(e, t) {
            for (var n = 0, r = t.length || 0; n < r; ++n) {
                var i = t[n], s = [], o = i.diff || 0;
                for (var u = 0, a = e.length; u < a; ++u) {
                    var f = e[u];
                    i.to <= f.from && i.diff ? s.push({
                        from: f.from + o,
                        to: f.to + o,
                        domStart: f.domStart
                    }) : i.to <= f.from || i.from >= f.to ? s.push(f) : (i.from > f.from && s.push({
                        from: f.from,
                        to: i.from,
                        domStart: f.domStart
                    }), i.to < f.to && s.push({from: i.to + o, to: f.to + o, domStart: f.domStart + (i.to - f.from)}))
                }
                e = s
            }
            return e
        }

        function ur(e, t, n) {
            function r(e) {
                var t = e.nextSibling;
                return e.parentNode.removeChild(e), t
            }

            if (!n.length) at(xt); else {
                var i = 0, s = xt.firstChild, o;
                for (var u = 0; u < n.length; ++u) {
                    var a = n[u];
                    while (a.domStart > i)s = r(s), i++;
                    for (var f = 0, l = a.to - a.from; f < l; ++f)s = s.nextSibling, i++
                }
                while (s)s = r(s)
            }
            var c = n.shift(), s = xt.firstChild, f = e;
            Mt.iter(e, t, function (e) {
                c && c.to == f && (c = n.shift());
                if (!c || c.from > f) {
                    if (e.hidden)var t = document.createElement("pre"); else {
                        var t = e.getElement(Lr);
                        e.className && (t.className = e.className);
                        if (e.bgClassName) {
                            var r = ot("div", null, null, "position: relative"),
                                i = ut(r, "pre", "\u00a0", e.bgClassName, "position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: -2");
                            r.appendChild(t), t = r
                        }
                    }
                    xt.insertBefore(t, s)
                } else s = s.nextSibling;
                ++f
            })
        }

        function ar() {
            if (!s.gutter && !s.lineNumbers)return;
            var e = Y.offsetHeight, t = R.clientHeight;
            Z.style.height = (e - t < 2 ? t : e) + "px";
            var n = document.createDocumentFragment(), r = Gt, i;
            Mt.iter(Gt, Math.max(Yt, Gt + 1), function (e) {
                if (e.hidden) ut(n, "pre"); else {
                    var t = e.gutterMarker, o = s.lineNumbers ? s.lineNumberFormatter(r + s.firstLineNumber) : null;
                    t && t.text ? o = t.text.replace("%N%", o != null ? o : "") : o == null && (o = "\u00a0");
                    var u = ut(n, "pre", null, t && t.style);
                    u.innerHTML = o;
                    for (var a = 1; a < e.height; ++a)ut(u, "br"), u.appendChild(document.createTextNode("\u00a0"));
                    t || (i = r)
                }
                ++r
            }), Z.style.display = "none", ft(gt, n);
            if (i != null && s.lineNumbers) {
                var o = gt.childNodes[i - Gt], u = String(Mt.size).length, a = tt(o.firstChild), f = "";
                while (a.length + f.length < u)f += "\u00a0";
                f && o.insertBefore(document.createTextNode(f), o.firstChild)
            }
            Z.style.display = "";
            var l = Math.abs((parseInt(yt.style.marginLeft) || 0) - Z.offsetWidth) > 2;
            return yt.style.marginLeft = Z.offsetWidth + "px", Jt = !1, l
        }

        function fr() {
            var e = rt(Pt.from, Pt.to), t = zr(Pt.from, !0), n = e ? t : zr(Pt.to, !0), r = Pt.inverted ? t : n, i = Kr(), o = et(L), u = et(xt);
            O.style.top = Math.max(0, Math.min(R.offsetHeight, r.y + u.top - o.top)) + "px", O.style.left = Math.max(0, Math.min(R.offsetWidth, r.x + u.left - o.left)) + "px";
            if (e) wt.style.top = r.y + "px", wt.style.left = (s.lineWrapping ? Math.min(r.x, yt.offsetWidth) : r.x) + "px", wt.style.display = "", St.style.display = "none"; else {
                var a = t.y == n.y, f = document.createDocumentFragment(), l = yt.clientWidth || yt.offsetWidth, c = yt.clientHeight || yt.offsetHeight,
                    h = function (e, t, n, r) {
                        var i = m ? "width: " + (n ? l - n - e : l) + "px" : "right: " + n + "px";
                        ut(f, "div", null, "CodeMirror-selected", "position: absolute; left: " + e + "px; top: " + t + "px; " + i + "; height: " + r + "px")
                    };
                if (Pt.from.ch && t.y >= 0) {
                    var p = a ? l - n.x : 0;
                    h(t.x, t.y, p, i)
                }
                var d = Math.max(0, t.y + (Pt.from.ch ? i : 0)), v = Math.min(n.y, c) - d;
                v > .2 * i && h(0, d, 0, v), (!a || !Pt.from.ch) && n.y < c - .5 * i && h(0, n.y, l - n.x, i), ft(St, f), wt.style.display = "none", St.style.display = ""
            }
        }

        function lr(e) {
            e ? Ht = Ht || (Pt.inverted ? Pt.to : Pt.from) : Ht = null
        }

        function cr(e, t) {
            var n = Ht && mr(Ht);
            n && (it(n, e) ? e = n : it(t, n) && (t = n)), hr(e, t), zt = !0
        }

        function hr(e, t, n, r) {
            un = null, n == null && (n = Pt.from.line, r = Pt.to.line);
            if (rt(Pt.from, e) && rt(Pt.to, t))return;
            if (it(t, e)) {
                var i = t;
                t = e, e = i
            }
            if (e.line != n) {
                var o = pr(e, n, Pt.from.ch);
                o ? e = o : Ir(e.line, !1)
            }
            t.line != r && (t = pr(t, r, Pt.to.ch)), rt(e, t) ? Pt.inverted = !1 : rt(e, Pt.to) ? Pt.inverted = !1 : rt(t, Pt.from) && (Pt.inverted = !0);
            if (s.autoClearEmptyLines && rt(Pt.from, Pt.to)) {
                var u = Pt.inverted ? e : t;
                if (u.line != Pt.from.line && Pt.from.line < Mt.size) {
                    var a = pn(Pt.from.line);
                    /^\s+$/.test(a.text) && setTimeout(di(function () {
                        if (a.parent && /^\s+$/.test(a.text)) {
                            var e = P(a);
                            Un("", {line: e, ch: 0}, {line: e, ch: a.text.length})
                        }
                    }, 10))
                }
            }
            Pt.from = e, Pt.to = t, Vt = !0
        }

        function pr(e, t, n) {
            function r(t) {
                var r = e.line + t, i = t == 1 ? Mt.size : -1;
                while (r != i) {
                    var o = pn(r);
                    if (!o.hidden) {
                        var u = e.ch;
                        if (s || u > n || u > o.text.length) u = o.text.length;
                        return {line: r, ch: u}
                    }
                    r += t
                }
            }

            var i = pn(e.line), s = e.ch == i.text.length && e.ch != n;
            return i.hidden ? e.line >= t ? r(1) || r(-1) : r(-1) || r(1) : e
        }

        function dr(e, t, n) {
            var r = mr({line: e, ch: t || 0});
            (n ? cr : hr)(r, r)
        }

        function vr(e) {
            return Math.max(0, Math.min(e, Mt.size - 1))
        }

        function mr(e) {
            if (e.line < 0)return {line: 0, ch: 0};
            if (e.line >= Mt.size)return {line: Mt.size - 1, ch: pn(Mt.size - 1).text.length};
            var t = e.ch, n = pn(e.line).text.length;
            return t == null || t > n ? {line: e.line, ch: n} : t < 0 ? {line: e.line, ch: 0} : e
        }

        function gr(e, t) {
            function o() {
                for (var t = r + e, n = e < 0 ? -1 : Mt.size; t != n; t += e) {
                    var i = pn(t);
                    if (!i.hidden)return r = t, s = i, !0
                }
            }

            function u(t) {
                if (i == (e < 0 ? 0 : s.text.length)) {
                    if (!!t || !o())return !1;
                    i = e < 0 ? s.text.length : 0
                } else i += e;
                return !0
            }

            var n = Pt.inverted ? Pt.from : Pt.to, r = n.line, i = n.ch, s = pn(r);
            if (t == "char") u(); else if (t == "column") u(!0); else if (t == "word") {
                var a = !1;
                for (; ;) {
                    if (e < 0 && !u())break;
                    if (pt(s.text.charAt(i))) a = !0; else if (a) {
                        e < 0 && (e = 1, u());
                        break
                    }
                    if (e > 0 && !u())break
                }
            }
            return {line: r, ch: i}
        }

        function yr(e, t) {
            var n = e < 0 ? Pt.from : Pt.to;
            if (Ht || rt(Pt.from, Pt.to)) n = gr(e, t);
            dr(n.line, n.ch, !0)
        }

        function br(e, t) {
            rt(Pt.from, Pt.to) ? e < 0 ? Un("", gr(e, t), Pt.to) : Un("", Pt.from, gr(e, t)) : Un("", Pt.from, Pt.to), zt = !0
        }

        function wr(e, t) {
            var n = 0, r = zr(Pt.inverted ? Pt.from : Pt.to, !0);
            un != null && (r.x = un), t == "page" ? n = Math.min(R.clientHeight, window.innerHeight || document.documentElement.clientHeight) : t == "line" && (n = Kr());
            var i = Wr(r.x, r.y + n * e + 2);
            t == "page" && (Tt.scrollTop += zr(i, !0).y - r.y), dr(i.line, i.ch, !0), un = r.x
        }

        function Er(e) {
            var t = pn(e.line).text, n = e.ch, r = e.ch, i = pt(t.charAt(n < t.length ? n : n - 1)) ? pt : function (e) {
                return !pt(e)
            };
            while (n > 0 && i(t.charAt(n - 1)))--n;
            while (r < t.length && i(t.charAt(r)))++r;
            return {from: {line: e.line, ch: n}, to: {line: e.line, ch: r}}
        }

        function Sr(e) {
            cr({line: e, ch: 0}, mr({line: e + 1, ch: 0}))
        }

        function xr(e) {
            if (rt(Pt.from, Pt.to))return Tr(Pt.from.line, e);
            var t = Pt.to.line - (Pt.to.ch ? 0 : 1);
            for (var n = Pt.from.line; n <= t; ++n)Tr(n, e)
        }

        function Tr(e, t) {
            t || (t = "add");
            if (t == "smart")if (!Ot.indent) t = "prev"; else var n = ui(e);
            var r = pn(e), i = r.indentation(s.tabSize), o = r.text.match(/^\s*/)[0], u;
            t == "smart" && (u = Ot.indent(n, r.text.slice(o.length), r.text), u == J && (t = "prev")), t == "prev" ? e ? u = pn(e - 1).indentation(s.tabSize) : u = 0 : t == "add" ? u = i + s.indentUnit : t == "subtract" && (u = i - s.indentUnit), u = Math.max(0, u);
            var a = u - i, f = "", l = 0;
            if (s.indentWithTabs)for (var c = Math.floor(u / s.tabSize); c; --c)l += s.tabSize, f += "	";
            while (l < u)++l, f += " ";
            Un(f, {line: e, ch: 0}, {line: e, ch: o.length})
        }

        function Nr() {
            Ot = e.getMode(s, s.mode), Mt.iter(0, Mt.size, function (e) {
                e.stateAfter = null
            }), _t = [0], li()
        }

        function Cr() {
            var e = s.gutter || s.lineNumbers;
            Z.style.display = e ? "" : "none", e ? Jt = !0 : xt.parentNode.style.marginLeft = 0
        }

        function kr(e, t) {
            if (s.lineWrapping) {
                L.className += " CodeMirror-wrap";
                var n = R.clientWidth / Yr() - 3;
                Mt.iter(0, Mt.size, function (e) {
                    if (e.hidden)return;
                    var t = Math.ceil(e.text.length / n) || 1;
                    t != 1 && dn(e, t)
                }), yt.style.minWidth = Et.style.left = ""
            } else L.className = L.className.replace(" CodeMirror-wrap", ""), Rn(), Mt.iter(0, Mt.size, function (e) {
                e.height != 1 && !e.hidden && dn(e, 1)
            });
            Wt.push({from: 0, to: Mt.size})
        }

        function Lr(e) {
            var t = s.tabSize - e % s.tabSize, n = sn[t];
            if (n)return n;
            for (var r = "", i = 0; i < t; ++i)r += " ";
            var o = ot("span", r, "cm-tab");
            return sn[t] = {element: o, width: t}
        }

        function Ar() {
            R.className = R.className.replace(/\s*cm-s-\S+/g, "") + s.theme.replace(/(^|\s)\s*/g, " cm-s-")
        }

        function Or() {
            var e = a[s.keyMap].style;
            L.className = L.className.replace(/\s*cm-keymap-\S+/g, "") + (e ? " cm-keymap-" + e : "")
        }

        function Mr() {
            this.set = []
        }

        function _r(e, t, n) {
            function i(e, t, n, i) {
                pn(e).addMark(new C(t, n, i, r))
            }

            e = mr(e), t = mr(t);
            var r = new Mr;
            if (!it(e, t))return r;
            if (e.line == t.line) i(e.line, e.ch, t.ch, n); else {
                i(e.line, e.ch, null, n);
                for (var s = e.line + 1, o = t.line; s < o; ++s)i(s, null, null, n);
                i(t.line, null, t.ch, n)
            }
            return Wt.push({from: e.line, to: t.line + 1}), r
        }

        function Dr(e) {
            e = mr(e);
            var t = new k(e.ch);
            return pn(e.line).addMark(t), t
        }

        function Pr(e) {
            e = mr(e);
            var t = [], n = pn(e.line).marked;
            if (!n)return t;
            for (var r = 0, i = n.length; r < i; ++r) {
                var s = n[r];
                (s.from == null || s.from <= e.ch) && (s.to == null || s.to >= e.ch) && t.push(s.marker || s)
            }
            return t
        }

        function Hr(e, t, n) {
            return typeof e == "number" && (e = pn(vr(e))), e.gutterMarker = {text: t, style: n}, Jt = !0, e
        }

        function Br(e) {
            typeof e == "number" && (e = pn(vr(e))), e.gutterMarker = null, Jt = !0
        }

        function jr(e, t) {
            var n = e, r = e;
            return typeof e == "number" ? r = pn(vr(e)) : n = P(e), n == null ? null : t(r, n) ? (Wt.push({from: n, to: n + 1}), r) : null
        }

        function Fr(e, t, n) {
            return jr(e, function (e) {
                if (e.className != t || e.bgClassName != n)return e.className = t, e.bgClassName = n, !0
            })
        }

        function Ir(e, t) {
            return jr(e, function (e, n) {
                if (e.hidden != t) {
                    e.hidden = t, s.lineWrapping || (t && e.text.length == tn.text.length ? nn = !0 : !t && e.text.length > tn.text.length && (tn = e, nn = !1)), dn(e, t ? 0 : 1);
                    var r = Pt.from.line, i = Pt.to.line;
                    if (t && (r == n || i == n)) {
                        var o = r == n ? pr({line: r, ch: 0}, r, 0) : Pt.from, u = i == n ? pr({line: i, ch: 0}, i, 0) : Pt.to;
                        if (!u)return;
                        hr(o, u)
                    }
                    return Jt = !0
                }
            })
        }

        function qr(e) {
            if (typeof e == "number") {
                if (!cn(e))return null;
                var t = e;
                e = pn(e);
                if (!e)return null
            } else {
                var t = P(e);
                if (t == null)return null
            }
            var n = e.gutterMarker;
            return {line: t, handle: e, text: e.text, markerText: n && n.text, markerClass: n && n.style, lineClass: e.className, bgClass: e.bgClassName}
        }

        function Rr(e, t) {
            function i(e) {
                return Ur(n, e).left
            }

            if (t <= 0)return 0;
            var n = pn(e), r = n.text, s = 0, o = 0, u = r.length, a, f = Math.min(u, Math.ceil(t / Yr()));
            for (; ;) {
                var l = i(f);
                if (!(l <= t && f < u)) {
                    a = l, u = f;
                    break
                }
                f = Math.min(u, Math.ceil(f * 1.2))
            }
            if (t > a)return u;
            f = Math.floor(u * .8), l = i(f), l < t && (s = f, o = l);
            for (; ;) {
                if (u - s <= 1)return a - t > t - o ? s : u;
                var c = Math.ceil((s + u) / 2), h = i(c);
                h > t ? (u = c, a = h) : (s = c, o = h)
            }
        }

        function Ur(e, t) {
            if (t == 0)return {top: 0, left: 0};
            var n = s.lineWrapping && t < e.text.length && G.test(e.text.slice(t - 1, t + 1)), r = e.getElement(Lr, t, n);
            ft(bt, r);
            var i = r.anchor, o = i.offsetTop, u = i.offsetLeft;
            if (p && o == 0 && u == 0) {
                var a = document.createElement("span");
                lt(a, "x"), i.parentNode.insertBefore(a, i.nextSibling), o = a.offsetTop
            }
            return {top: o, left: u}
        }

        function zr(e, t) {
            var n, r = Kr(), i = r * (B(Mt, e.line) - (t ? Qt : 0));
            if (e.ch == 0) n = 0; else {
                var o = Ur(pn(e.line), e.ch);
                n = o.left, s.lineWrapping && (i += Math.max(0, o.top))
            }
            return {x: n, y: i, yBot: i + r}
        }

        function Wr(e, t) {
            function h(e) {
                var t = Ur(u, e);
                if (f) {
                    var r = Math.round(t.top / n);
                    return c = r != l, Math.max(0, t.left + (r - l) * R.clientWidth)
                }
                return t.left
            }

            if (t < 0)return {line: 0, ch: 0};
            var n = Kr(), r = Yr(), i = Qt + Math.floor(t / n), o = H(Mt, i);
            if (o >= Mt.size)return {line: Mt.size - 1, ch: pn(Mt.size - 1).text.length};
            var u = pn(o), a = u.text, f = s.lineWrapping, l = f ? i - B(Mt, o) : 0;
            if (e <= 0 && l == 0)return {line: o, ch: 0};
            var c = !1, p = 0, d = 0, v = a.length, m, g = Math.min(v, Math.ceil((e + l * R.clientWidth * .9) / r));
            for (; ;) {
                var y = h(g);
                if (!(y <= e && g < v)) {
                    m = y, v = g;
                    break
                }
                g = Math.min(v, Math.ceil(g * 1.2))
            }
            if (e > m)return {line: o, ch: v};
            g = Math.floor(v * .8), y = h(g), y < e && (p = g, d = y);
            for (; ;) {
                if (v - p <= 1)return {line: o, ch: e - d < m - e ? p : v};
                var b = Math.ceil((p + v) / 2), w = h(b);
                w > e ? (v = b, m = w, c && (m += 1e3)) : (p = b, d = w)
            }
        }

        function Xr(e) {
            var t = zr(e, !0), n = et(yt);
            return {x: n.left + t.x, y: n.top + t.y, yBot: n.top + t.yBot}
        }

        function Kr() {
            if (Jr == null) {
                Jr = document.createElement("pre");
                for (var e = 0; e < 49; ++e)Jr.appendChild(document.createTextNode("x")), ut(Jr, "br");
                Jr.appendChild(document.createTextNode("x"))
            }
            var t = xt.clientHeight;
            return t == $r ? Vr : ($r = t, ft(bt, Jr.cloneNode(!0)), Vr = bt.firstChild.offsetHeight / 50 || 1, at(bt), Vr)
        }

        function Yr() {
            if (R.clientWidth == Gr)return Qr;
            Gr = R.clientWidth;
            var e = document.createElement("pre"), t = ut(e, "span", "x");
            return ft(bt, e), Qr = t.offsetWidth || 10
        }

        function Zr() {
            return yt.offsetTop
        }

        function ei() {
            return yt.offsetLeft
        }

        function ti(e, t) {
            var n = et(R, !0), r, i;
            try {
                r = e.clientX, i = e.clientY
            } catch (e) {
                return null
            }
            if (!t && (r - n.left > R.clientWidth || i - n.top > R.clientHeight))return null;
            var s = et(yt, !0);
            return Wr(r - s.left, i - s.top)
        }

        function ni(e) {
            function o() {
                var e = dt(F.value).join("\n");
                e != i && !s.readOnly && di(zn)(e, "end"), O.style.position = "relative", F.style.cssText = r, v && (Tt.scrollTop = n), $t = !1, Gn(!0), $n()
            }

            var t = ti(e), n = Tt.scrollTop;
            if (!t || b)return;
            (rt(Pt.from, Pt.to) || it(t, Pt.from) || !it(t, Pt.to)) && di(dr)(t.line, t.ch);
            var r = F.style.cssText;
            O.style.position = "absolute", F.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) + "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: white; " + "border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);", $t = !0;
            var i = F.value = Vn();
            Yn(), nt(F);
            if (h) {
                U(e);
                var u = V(window, "mouseup", function () {
                    u(), setTimeout(o, 20)
                }, !0)
            } else setTimeout(o, 50)
        }

        function ri() {
            clearInterval(At);
            var e = !0;
            wt.style.visibility = "", At = setInterval(function () {
                wt.style.visibility = (e = !e) ? "" : "hidden"
            }, 650)
        }

        function si(e) {
            function v(e, t, n) {
                if (!e.text)return;
                var r = e.styles, i = o ? 0 : e.text.length - 1, s;
                for (var a = o ? 0 : r.length - 2, f = o ? r.length : -2; a != f; a += 2 * u) {
                    var l = r[a];
                    if (r[a + 1] != h) {
                        i += u * l.length;
                        continue
                    }
                    for (var c = o ? 0 : l.length - 1, v = o ? l.length : -1; c != v; c += u, i += u)if (i >= t && i < n && d.test(s = l.charAt(c))) {
                        var m = ii[s];
                        if (m.charAt(1) == ">" == o) p.push(s); else {
                            if (p.pop() != m.charAt(0))return {pos: i, match: !1};
                            if (!p.length)return {pos: i, match: !0}
                        }
                    }
                }
            }

            var t = Pt.inverted ? Pt.from : Pt.to, n = pn(t.line), r = t.ch - 1, i = r >= 0 && ii[n.text.charAt(r)] || ii[n.text.charAt(++r)];
            if (!i)return;
            var s = i.charAt(0), o = i.charAt(1) == ">", u = o ? 1 : -1, a = n.styles;
            for (var f = r + 1, l = 0, c = a.length; l < c; l += 2)if ((f -= a[l].length) <= 0) {
                var h = a[l + 1];
                break
            }
            var p = [n.text.charAt(r)], d = /[(){}[\]]/;
            for (var l = t.line, c = o ? Math.min(l + 100, Mt.size) : Math.max(-1, l - 100); l != c; l += u) {
                var n = pn(l), m = l == t.line, g = v(n, m && o ? r + 1 : 0, m && !o ? r : n.text.length);
                if (g)break
            }
            g || (g = {pos: null, match: !1});
            var h = g.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket", y = _r({line: t.line, ch: r}, {line: t.line, ch: r + 1}, h),
                b = g.pos != null && _r({line: l, ch: g.pos}, {line: l, ch: g.pos + 1}, h), w = di(function () {
                    y.clear(), b && b.clear()
                });
            e ? setTimeout(w, 800) : en = w
        }

        function oi(e) {
            var t, n;
            for (var r = e, i = e - 40; r > i; --r) {
                if (r == 0)return 0;
                var o = pn(r - 1);
                if (o.stateAfter)return r;
                var u = o.indentation(s.tabSize);
                if (n == null || t > u) n = r - 1, t = u
            }
            return n
        }

        function ui(e) {
            var t = oi(e), n = t && pn(t - 1).stateAfter;
            return n ? n = x(Ot, n) : n = T(Ot), Mt.iter(t, e, function (e) {
                e.highlight(Ot, n, s.tabSize), e.stateAfter = x(Ot, n)
            }), t < e && Wt.push({from: t, to: e}), e < Mt.size && !pn(e).stateAfter && _t.push(e), n
        }

        function ai(e, t) {
            var n = ui(e);
            Mt.iter(e, t, function (e) {
                e.highlight(Ot, n, s.tabSize), e.stateAfter = x(Ot, n)
            })
        }

        function fi() {
            var e = +(new Date) + s.workTime, t = _t.length;
            while (_t.length) {
                if (!pn(Gt).stateAfter)var n = Gt; else var n = _t.pop();
                if (n >= Mt.size)continue;
                var r = oi(n), i = r && pn(r - 1).stateAfter;
                i ? i = x(Ot, i) : i = T(Ot);
                var o = 0, u = Ot.compareStates, a = !1, f = r, l = !1;
                Mt.iter(f, Mt.size, function (t) {
                    var r = t.stateAfter;
                    if (+(new Date) > e)return _t.push(f), li(s.workDelay), a && Wt.push({from: n, to: f + 1}), l = !0;
                    var c = t.highlight(Ot, i, s.tabSize);
                    c && (a = !0), t.stateAfter = x(Ot, i);
                    var h = null;
                    if (u) {
                        var p = r && u(r, i);
                        p != J && (h = !!p)
                    }
                    h == null && (c !== !1 || !r ? o = 0 : ++o > 3 && (!Ot.indent || Ot.indent(r, "") == Ot.indent(i, "")) && (h = !0));
                    if (h)return !0;
                    ++f
                });
                if (l)return;
                a && Wt.push({from: n, to: f + 1})
            }
            t && s.onHighlightComplete && s.onHighlightComplete(hn)
        }

        function li(e) {
            if (!_t.length)return;
            Lt.set(e, di(fi))
        }

        function ci() {
            Ut = zt = Xt = null, Wt = [], Vt = !1, Kt = []
        }

        function hi() {
            nn && Rn();
            if (rn && !s.lineWrapping) {
                var e = Et.offsetWidth, t = Ur(tn, tn.text.length).left;
                Et.style.left = t + "px", yt.style.minWidth = t + e + "px", rn = !1
            }
            var n, r;
            if (Vt) {
                var i = tr();
                n = rr(i.x, i.y, i.x, i.yBot)
            }
            if (Wt.length || n && n.scrollTop != null) r = sr(Wt, !0, n && n.scrollTop);
            r || (Vt && fr(), Jt && ar()), n && er(), Vt && (Zn(), ri()), Dt && !$t && (Ut === !0 || Ut !== !1 && Vt) && Gn(zt), Vt && s.matchBrackets && setTimeout(di(function () {
                en && (en(), en = null), rt(Pt.from, Pt.to) && si(!1)
            }), 20);
            var o = Vt, u = Kt;
            Xt && s.onChange && hn && s.onChange(hn, Xt), o && s.onCursorActivity && s.onCursorActivity(hn);
            for (var a = 0; a < u.length; ++a)u[a](hn);
            r && s.onUpdate && s.onUpdate(hn)
        }

        function di(e) {
            return function () {
                pi++ || ci();
                try {
                    var t = e.apply(this, arguments)
                } finally {
                    --pi || hi()
                }
                return t
            }
        }

        function vi(e) {
            an.startCompound();
            try {
                return e()
            } finally {
                an.endCompound()
            }
        }

        var s = {}, w = e.defaults;
        for (var N in w)w.hasOwnProperty(N) && (s[N] = (i && i.hasOwnProperty(N) ? i : w)[N]);
        var L = document.createElement("div");
        L.className = "CodeMirror" + (s.lineWrapping ? " CodeMirror-wrap" : ""), L.innerHTML = '<div style="overflow: hidden; position: relative; width: 3px; height: 0px;"><textarea style="position: absolute; padding: 0; width: 1px; height: 1em" wrap="off" autocorrect="off" autocapitalize="off"></textarea></div><div class="CodeMirror-scrollbar"><div class="CodeMirror-scrollbar-inner"></div></div><div class="CodeMirror-scroll" tabindex="-1"><div style="position: relative"><div style="position: relative"><div class="CodeMirror-gutter"><div class="CodeMirror-gutter-text"></div></div><div class="CodeMirror-lines"><div style="position: relative; z-index: 0"><div style="position: absolute; width: 100%; height: 0px; overflow: hidden; visibility: hidden;"></div><pre class="CodeMirror-cursor">&#160;</pre><pre class="CodeMirror-cursor" style="visibility: hidden">&#160;</pre><div style="position: relative; z-index: -1"></div><div></div></div></div></div></div></div>', r.appendChild ? r.appendChild(L) : r(L);
        var O = L.firstChild, F = O.firstChild, R = L.lastChild, Q = R.firstChild, Y = Q.firstChild, Z = Y.firstChild, gt = Z.firstChild, yt = Z.nextSibling.firstChild,
            bt = yt.firstChild, wt = bt.nextSibling, Et = wt.nextSibling, St = Et.nextSibling, xt = St.nextSibling, Tt = O.nextSibling, Nt = Tt.firstChild;
        Ar(), Or(), t && (F.style.width = "0px"), g || (R.draggable = !0), yt.style.outline = "none", s.tabindex != null && (F.tabIndex = s.tabindex), s.autofocus && Yn(), !s.gutter && !s.lineNumbers && (Z.style.display = "none"), E && (O.style.height = "1px", O.style.position = "absolute"), S ? Tt.className += qn() ? " cm-sb-overlap" : " cm-sb-nonoverlap" : d && (Tt.className += " cm-sb-ie7");
        try {
            Yr()
        } catch (Ct) {
            throw Ct.message.match(/runtime/i) && (Ct = new Error("A CodeMirror inside a P-style element does not work in Internet Explorer. (innerHTML bug)")), Ct
        }
        var kt = new $, Lt = new $, At, Ot, Mt = new _([new M([new A("")])]), _t, Dt;
        Nr();
        var Pt = {from: {line: 0, ch: 0}, to: {line: 0, ch: 0}, inverted: !1}, Ht, Bt, jt, Ft = 0, It, qt = !1, Rt = !1, Ut, zt, Wt, Xt, Vt, $t, Jt, Kt, Qt = 0, Gt = 0,
            Yt = 0, Zt = 0, en, tn = pn(0), nn = !1, rn = !0, sn = {}, on = !1, un = null;
        di(function () {
            vn(s.value || ""), Ut = !1
        })();
        var an = new j;
        V(R, "mousedown", di(bn)), V(R, "dblclick", di(wn)), V(yt, "selectstart", q), h || V(R, "contextmenu", ni), V(R, "scroll", yn), V(Tt, "scroll", gn), V(Tt, "mousedown", function () {
            Dt && setTimeout(Yn, 0)
        }), V(window, "resize", function () {
            sr(!0)
        }), V(F, "keyup", di(On)), V(F, "input", Jn), V(F, "keydown", di(Ln)), V(F, "keypress", di(An)), V(F, "focus", Mn), V(F, "blur", _n), s.dragDrop && (V(R, "dragstart", Sn), V(R, "dragenter", fn), V(R, "dragover", fn), V(R, "drop", di(En))), V(R, "paste", function () {
            Yn(), Jn()
        }), V(F, "paste", Jn), V(F, "cut", di(function () {
            s.readOnly || zn("")
        })), E && V(Q, "mouseup", function () {
            document.activeElement == F && F.blur(), Yn()
        });
        var ln;
        try {
            ln = document.activeElement == F
        } catch (Ct) {
        }
        ln || s.autofocus ? setTimeout(Mn, 20) : _n();
        var hn = L.CodeMirror = {
            getValue: mn, setValue: di(vn), getSelection: Vn, replaceSelection: di(zn), focus: function () {
                window.focus(), Yn(), Mn(), Jn()
            }, setOption: function (e, t) {
                var n = s[e];
                s[e] = t, e == "mode" || e == "indentUnit" ? Nr() : e == "readOnly" && t == "nocursor" ? (_n(), F.blur()) : e == "readOnly" && !t ? Gn(!0) : e == "theme" ? Ar() : e == "lineWrapping" && n != t ? di(kr)() : e == "tabSize" ? sr(!0) : e == "keyMap" && Or();
                if (e == "lineNumbers" || e == "gutter" || e == "firstLineNumber" || e == "theme" || e == "lineNumberFormatter") Cr(), sr(!0)
            }, getOption: function (e) {
                return s[e]
            }, undo: di(Hn), redo: di(Bn), indentLine: di(function (e, t) {
                typeof t != "string" && (t == null ? t = s.smartIndent ? "smart" : "prev" : t = t ? "add" : "subtract"), cn(e) && Tr(e, t)
            }), indentSelection: di(xr), historySize: function () {
                return {undo: an.done.length, redo: an.undone.length}
            }, clearHistory: function () {
                an = new j
            }, setHistory: function (e) {
                an = new j, an.done = e.done, an.undone = e.undone
            }, getHistory: function () {
                return an.time = 0, {done: an.done.concat([]), undone: an.undone.concat([])}
            }, matchBrackets: di(function () {
                si(!0)
            }), getTokenAt: di(function (e) {
                return e = mr(e), pn(e.line).getTokenAt(Ot, ui(e.line), e.ch)
            }), getStateAfter: function (e) {
                return e = vr(e == null ? Mt.size - 1 : e), ui(e + 1)
            }, cursorCoords: function (e, t) {
                return e == null && (e = Pt.inverted), this.charCoords(e ? Pt.from : Pt.to, t)
            }, charCoords: function (e, t) {
                return e = mr(e), t == "local" ? zr(e, !1) : t == "div" ? zr(e, !0) : Xr(e)
            }, coordsChar: function (e) {
                var t = et(yt);
                return Wr(e.x - t.left, e.y - t.top)
            }, markText: di(_r), setBookmark: Dr, findMarksAt: Pr, setMarker: di(Hr), clearMarker: di(Br), setLineClass: di(Fr), hideLine: di(function (e) {
                return Ir(e, !0)
            }), showLine: di(function (e) {
                return Ir(e, !1)
            }), onDeleteLine: function (e, t) {
                if (typeof e == "number") {
                    if (!cn(e))return null;
                    e = pn(e)
                }
                return (e.handlers || (e.handlers = [])).push(t), e
            }, lineInfo: qr, addWidget: function (e, t, n, r, i) {
                e = zr(mr(e));
                var s = e.yBot, o = e.x;
                t.style.position = "absolute", Q.appendChild(t);
                if (r == "over") s = e.y; else if (r == "near") {
                    var u = Math.max(R.offsetHeight, Mt.height * Kr()), a = Math.max(Q.clientWidth, yt.clientWidth) - ei();
                    e.yBot + t.offsetHeight > u && e.y > t.offsetHeight && (s = e.y - t.offsetHeight), o + t.offsetWidth > a && (o = a - t.offsetWidth)
                }
                t.style.top = s + Zr() + "px", t.style.left = t.style.right = "", i == "right" ? (o = Q.clientWidth - t.offsetWidth, t.style.right = "0px") : (i == "left" ? o = 0 : i == "middle" && (o = (Q.clientWidth - t.offsetWidth) / 2), t.style.left = o + ei() + "px"), n && nr(o, s, o + t.offsetWidth, s + t.offsetHeight)
            }, lineCount: function () {
                return Mt.size
            }, clipPos: mr, getCursor: function (e) {
                return e == null && (e = Pt.inverted), st(e ? Pt.from : Pt.to)
            }, somethingSelected: function () {
                return !rt(Pt.from, Pt.to)
            }, setCursor: di(function (e, t, n) {
                t == null && typeof e.line == "number" ? dr(e.line, e.ch, n) : dr(e, t, n)
            }), setSelection: di(function (e, t, n) {
                (n ? cr : hr)(mr(e), mr(t || e))
            }), getLine: function (e) {
                if (cn(e))return pn(e).text
            }, getLineHandle: function (e) {
                if (cn(e))return pn(e)
            }, setLine: di(function (e, t) {
                cn(e) && Un(t, {line: e, ch: 0}, {line: e, ch: pn(e).text.length})
            }), removeLine: di(function (e) {
                cn(e) && Un("", {line: e, ch: 0}, mr({line: e + 1, ch: 0}))
            }), replaceRange: di(Un), getRange: function (e, t, n) {
                return Xn(mr(e), mr(t), n)
            }, triggerOnKeyDown: di(Ln), execCommand: function (e) {
                return u[e](hn)
            }, moveH: di(yr), deleteH: di(br), moveV: di(wr), toggleOverwrite: function () {
                qt ? (qt = !1, wt.className = wt.className.replace(" CodeMirror-overwrite", "")) : (qt = !0, wt.className += " CodeMirror-overwrite")
            }, posFromIndex: function (e) {
                var t = 0, n;
                return Mt.iter(0, Mt.size, function (r) {
                    var i = r.text.length + 1;
                    if (i > e)return n = e, !0;
                    e -= i, ++t
                }), mr({line: t, ch: n})
            }, indexFromPos: function (e) {
                if (e.line < 0 || e.ch < 0)return 0;
                var t = e.ch;
                return Mt.iter(0, e.line, function (e) {
                    t += e.text.length + 1
                }), t
            }, scrollTo: function (e, t) {
                e != null && (R.scrollLeft = e), t != null && (Tt.scrollTop = R.scrollTop = t), sr([])
            }, getScrollInfo: function () {
                return {x: R.scrollLeft, y: Tt.scrollTop, height: Tt.scrollHeight, width: R.scrollWidth}
            }, setSize: function (e, t) {
                function n(e) {
                    return e = String(e), /^\d+$/.test(e) ? e + "px" : e
                }

                e != null && (L.style.width = n(e)), t != null && (R.style.height = n(t)), hn.refresh()
            }, operation: function (e) {
                return di(e)()
            }, compoundChange: function (e) {
                return vi(e)
            }, refresh: function () {
                sr(!0, null, Ft), Tt.scrollHeight > Ft && (Tt.scrollTop = Ft)
            }, getInputField: function () {
                return F
            }, getWrapperElement: function () {
                return L
            }, getScrollerElement: function () {
                return R
            }, getGutterElement: function () {
                return Z
            }
        }, Tn, kn = null, Kn = "";
        Mr.prototype.clear = di(function () {
            var e = Infinity, t = -Infinity;
            for (var n = 0, r = this.set.length; n < r; ++n) {
                var i = this.set[n], s = i.marked;
                if (!s || !i.parent)continue;
                var o = P(i);
                e = Math.min(e, o), t = Math.max(t, o);
                for (var u = 0; u < s.length; ++u)s[u].marker == this && s.splice(u--, 1)
            }
            e != Infinity && Wt.push({from: e, to: t + 1})
        }), Mr.prototype.find = function () {
            var e, t;
            for (var n = 0, r = this.set.length; n < r; ++n) {
                var i = this.set[n], s = i.marked;
                for (var o = 0; o < s.length; ++o) {
                    var u = s[o];
                    if (u.marker == this)if (u.from != null || u.to != null) {
                        var a = P(i);
                        a != null && (u.from != null && (e = {line: a, ch: u.from}), u.to != null && (t = {line: a, ch: u.to}))
                    }
                }
            }
            return {from: e, to: t}
        };
        var Vr, $r, Jr, Qr, Gr = 0, ii = {"(": ")>", ")": "(<", "[": "]>", "]": "[<", "{": "}>", "}": "{<"}, pi = 0;
        for (var mi in o)o.propertyIsEnumerable(mi) && !hn.propertyIsEnumerable(mi) && (hn[mi] = o[mi]);
        return hn
    }

    function f(e) {
        return typeof e == "string" ? a[e] : e
    }

    function l(e, t, n, r, i) {
        function s(t) {
            t = f(t);
            var n = t[e];
            if (n === !1)return i && i(), !0;
            if (n != null && r(n))return !0;
            if (t.nofallthrough)return i && i(), !0;
            var o = t.fallthrough;
            if (o == null)return !1;
            if (Object.prototype.toString.call(o) != "[object Array]")return s(o);
            for (var u = 0, a = o.length; u < a; ++u)if (s(o[u]))return !0;
            return !1
        }

        return t && s(t) ? !0 : s(n)
    }

    function c(e) {
        var t = mt[X(e, "keyCode")];
        return t == "Ctrl" || t == "Alt" || t == "Shift" || t == "Mod"
    }

    function x(e, t) {
        if (t === !0)return t;
        if (e.copyState)return e.copyState(t);
        var n = {};
        for (var r in t) {
            var i = t[r];
            i instanceof Array && (i = i.concat([])), n[r] = i
        }
        return n
    }

    function T(e, t, n) {
        return e.startState ? e.startState(t, n) : !0
    }

    function N(e, t) {
        this.pos = this.start = 0, this.string = e, this.tabSize = t || 8
    }

    function C(e, t, n, r) {
        this.from = e, this.to = t, this.style = n, this.marker = r
    }

    function k(e) {
        this.from = e, this.to = e, this.line = null
    }

    function A(e, t) {
        this.styles = t || [e, null], this.text = e, this.height = 1
    }

    function O(e, t, n, r) {
        for (var i = 0, s = 0, o = 0; s < t; i += 2) {
            var u = n[i], a = s + u.length;
            o == 0 ? (a > e && r.push(u.slice(e - s, Math.min(u.length, t - s)), n[i + 1]), a >= e && (o = 1)) : o == 1 && (a > t ? r.push(u.slice(0, t - s), n[i + 1]) : r.push(u, n[i + 1])), s = a
        }
    }

    function M(e) {
        this.lines = e, this.parent = null;
        for (var t = 0, n = e.length, r = 0; t < n; ++t)e[t].parent = this, r += e[t].height;
        this.height = r
    }

    function _(e) {
        this.children = e;
        var t = 0, n = 0;
        for (var r = 0, i = e.length; r < i; ++r) {
            var s = e[r];
            t += s.chunkSize(), n += s.height, s.parent = this
        }
        this.size = t, this.height = n, this.parent = null
    }

    function D(e, t) {
        while (!e.lines)for (var n = 0; ; ++n) {
            var r = e.children[n], i = r.chunkSize();
            if (t < i) {
                e = r;
                break
            }
            t -= i
        }
        return e.lines[t]
    }

    function P(e) {
        if (e.parent == null)return null;
        var t = e.parent, n = ht(t.lines, e);
        for (var r = t.parent; r; t = r, r = r.parent)for (var i = 0, s = r.children.length; ; ++i) {
            if (r.children[i] == t)break;
            n += r.children[i].chunkSize()
        }
        return n
    }

    function H(e, t) {
        var n = 0;
        e:do {
            for (var r = 0, i = e.children.length; r < i; ++r) {
                var s = e.children[r], o = s.height;
                if (t < o) {
                    e = s;
                    continue e
                }
                t -= o, n += s.chunkSize()
            }
            return n
        } while (!e.lines);
        for (var r = 0, i = e.lines.length; r < i; ++r) {
            var u = e.lines[r], a = u.height;
            if (t < a)break;
            t -= a
        }
        return n + r
    }

    function B(e, t) {
        var n = 0;
        e:do {
            for (var r = 0, i = e.children.length; r < i; ++r) {
                var s = e.children[r], o = s.chunkSize();
                if (t < o) {
                    e = s;
                    continue e
                }
                t -= o, n += s.height
            }
            return n
        } while (!e.lines);
        for (var r = 0; r < t; ++r)n += e.lines[r].height;
        return n
    }

    function j() {
        this.time = 0, this.done = [], this.undone = [], this.compound = 0, this.closed = !1
    }

    function F() {
        U(this)
    }

    function I(e) {
        return e.stop || (e.stop = F), e
    }

    function q(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1
    }

    function R(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
    }

    function U(e) {
        q(e), R(e)
    }

    function z(e) {
        return e.target || e.srcElement
    }

    function W(e) {
        var t = e.which;
        return t == null && (e.button & 1 ? t = 1 : e.button & 2 ? t = 3 : e.button & 4 && (t = 2)), n && e.ctrlKey && t == 1 && (t = 3), t
    }

    function X(e, t) {
        var n = e.override && e.override.hasOwnProperty(t);
        return n ? e.override[t] : e[t]
    }

    function V(e, t, n, r) {
        if (typeof e.addEventListener == "function") {
            e.addEventListener(t, n, !1);
            if (r)return function () {
                e.removeEventListener(t, n, !1)
            }
        } else {
            var i = function (e) {
                n(e || window.event)
            };
            e.attachEvent("on" + t, i);
            if (r)return function () {
                e.detachEvent("on" + t, i)
            }
        }
    }

    function $() {
        this.id = null
    }

    function Y(e, t, n) {
        t == null && (t = e.search(/[^\s\u00a0]/), t == -1 && (t = e.length));
        for (var r = 0, i = 0; r < t; ++r)e.charAt(r) == "	" ? i += n - i % n : ++i;
        return i
    }

    function Z(e) {
        return e.currentStyle ? e.currentStyle : window.getComputedStyle(e, null)
    }

    function et(e, t) {
        try {
            var n = e.getBoundingClientRect();
            n = {top: n.top, left: n.left}
        } catch (r) {
            n = {top: 0, left: 0}
        }
        if (!t)if (window.pageYOffset == null) {
            var i = document.documentElement || document.body.parentNode;
            i.scrollTop == null && (i = document.body), n.top += i.scrollTop, n.left += i.scrollLeft
        } else n.top += window.pageYOffset, n.left += window.pageXOffset;
        return n
    }

    function tt(e) {
        return e.textContent || e.innerText || e.nodeValue || ""
    }

    function nt(e) {
        t ? (e.selectionStart = 0, e.selectionEnd = e.value.length) : e.select()
    }

    function rt(e, t) {
        return e.line == t.line && e.ch == t.ch
    }

    function it(e, t) {
        return e.line < t.line || e.line == t.line && e.ch < t.ch
    }

    function st(e) {
        return {line: e.line, ch: e.ch}
    }

    function ot(e, t, n, r) {
        var i = document.createElement(e);
        return n && (i.className = n), r && (i.style.cssText = r), t && lt(i, t), i
    }

    function ut(e, t, n, r, i) {
        var s = ot(t, n, r, i);
        return e.appendChild(s), s
    }

    function at(e) {
        return e.innerHTML = "", e
    }

    function ft(e, t) {
        at(e).appendChild(t)
    }

    function lt(e, t) {
        v ? (e.innerHTML = "", e.appendChild(document.createTextNode(t))) : e.textContent = t
    }

    function ct(e, t) {
        if (!t)return 0;
        if (!e)return t.length;
        for (var n = e.length, r = t.length; n >= 0 && r >= 0; --n, --r)if (e.charAt(n) != t.charAt(r))break;
        return r + 1
    }

    function ht(e, t) {
        if (e.indexOf)return e.indexOf(t);
        for (var n = 0, r = e.length; n < r; ++n)if (e[n] == t)return n;
        return -1
    }

    function pt(e) {
        return /\w/.test(e) || e.toUpperCase() != e.toLowerCase()
    }

    e.defaults = {
        value: "",
        mode: null,
        theme: "default",
        indentUnit: 2,
        indentWithTabs: !1,
        smartIndent: !0,
        tabSize: 4,
        keyMap: "default",
        extraKeys: null,
        electricChars: !0,
        autoClearEmptyLines: !1,
        onKeyEvent: null,
        onDragEvent: null,
        lineWrapping: !1,
        lineNumbers: !1,
        gutter: !1,
        fixedGutter: !1,
        firstLineNumber: 1,
        readOnly: !1,
        dragDrop: !0,
        onChange: null,
        onCursorActivity: null,
        onGutterClick: null,
        onHighlightComplete: null,
        onUpdate: null,
        onFocus: null,
        onBlur: null,
        onScroll: null,
        matchBrackets: !1,
        workTime: 100,
        workDelay: 200,
        pollInterval: 100,
        undoDepth: 40,
        tabindex: null,
        autofocus: null,
        lineNumberFormatter: function (e) {
            return e
        }
    };
    var t = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent), n = t || /Mac/.test(navigator.platform), r = /Win/.test(navigator.platform),
        i = e.modes = {}, s = e.mimeModes = {};
    e.defineMode = function (t, n) {
        !e.defaults.mode && t != "null" && (e.defaults.mode = t);
        if (arguments.length > 2) {
            n.dependencies = [];
            for (var r = 2; r < arguments.length; ++r)n.dependencies.push(arguments[r])
        }
        i[t] = n
    }, e.defineMIME = function (e, t) {
        s[e] = t
    }, e.resolveMode = function (t) {
        if (typeof t == "string" && s.hasOwnProperty(t)) t = s[t]; else if (typeof t == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(t))return e.resolveMode("application/xml");
        return typeof t == "string" ? {name: t} : t || {name: "null"}
    }, e.getMode = function (t, n) {
        var n = e.resolveMode(n), r = i[n.name];
        return r ? r(t, n) : e.getMode(t, "text/plain")
    }, e.listModes = function () {
        var e = [];
        for (var t in i)i.propertyIsEnumerable(t) && e.push(t);
        return e
    }, e.listMIMEs = function () {
        var e = [];
        for (var t in s)s.propertyIsEnumerable(t) && e.push({mime: t, mode: s[t]});
        return e
    };
    var o = e.extensions = {};
    e.defineExtension = function (e, t) {
        o[e] = t
    };
    var u = e.commands = {
        selectAll: function (e) {
            e.setSelection({line: 0, ch: 0}, {line: e.lineCount() - 1})
        }, killLine: function (e) {
            var t = e.getCursor(!0), n = e.getCursor(!1), r = !rt(t, n);
            !r && e.getLine(t.line).length == t.ch ? e.replaceRange("", t, {line: t.line + 1, ch: 0}) : e.replaceRange("", t, r ? n : {line: t.line})
        }, deleteLine: function (e) {
            var t = e.getCursor().line;
            e.replaceRange("", {line: t, ch: 0}, {line: t})
        }, undo: function (e) {
            e.undo()
        }, redo: function (e) {
            e.redo()
        }, goDocStart: function (e) {
            e.setCursor(0, 0, !0)
        }, goDocEnd: function (e) {
            e.setSelection({line: e.lineCount() - 1}, null, !0)
        }, goLineStart: function (e) {
            e.setCursor(e.getCursor().line, 0, !0)
        }, goLineStartSmart: function (e) {
            var t = e.getCursor(), n = e.getLine(t.line), r = Math.max(0, n.search(/\S/));
            e.setCursor(t.line, t.ch <= r && t.ch ? 0 : r, !0)
        }, goLineEnd: function (e) {
            e.setSelection({line: e.getCursor().line}, null, !0)
        }, goLineUp: function (e) {
            e.moveV(-1, "line")
        }, goLineDown: function (e) {
            e.moveV(1, "line")
        }, goPageUp: function (e) {
            e.moveV(-1, "page")
        }, goPageDown: function (e) {
            e.moveV(1, "page")
        }, goCharLeft: function (e) {
            e.moveH(-1, "char")
        }, goCharRight: function (e) {
            e.moveH(1, "char")
        }, goColumnLeft: function (e) {
            e.moveH(-1, "column")
        }, goColumnRight: function (e) {
            e.moveH(1, "column")
        }, goWordLeft: function (e) {
            e.moveH(-1, "word")
        }, goWordRight: function (e) {
            e.moveH(1, "word")
        }, delCharLeft: function (e) {
            e.deleteH(-1, "char")
        }, delCharRight: function (e) {
            e.deleteH(1, "char")
        }, delWordLeft: function (e) {
            e.deleteH(-1, "word")
        }, delWordRight: function (e) {
            e.deleteH(1, "word")
        }, indentAuto: function (e) {
            e.indentSelection("smart")
        }, indentMore: function (e) {
            e.indentSelection("add")
        }, indentLess: function (e) {
            e.indentSelection("subtract")
        }, insertTab: function (e) {
            e.replaceSelection("	", "end")
        }, defaultTab: function (e) {
            e.somethingSelected() ? e.indentSelection("add") : e.replaceSelection("	", "end")
        }, transposeChars: function (e) {
            var t = e.getCursor(), n = e.getLine(t.line);
            t.ch > 0 && t.ch < n.length - 1 && e.replaceRange(n.charAt(t.ch) + n.charAt(t.ch - 1), {line: t.line, ch: t.ch - 1}, {line: t.line, ch: t.ch + 1})
        }, newlineAndIndent: function (e) {
            e.replaceSelection("\n", "end"), e.indentLine(e.getCursor().line)
        }, toggleOverwrite: function (e) {
            e.toggleOverwrite()
        }
    }, a = e.keyMap = {};
    a.basic = {
        Left: "goCharLeft",
        Right: "goCharRight",
        Up: "goLineUp",
        Down: "goLineDown",
        End: "goLineEnd",
        Home: "goLineStartSmart",
        PageUp: "goPageUp",
        PageDown: "goPageDown",
        Delete: "delCharRight",
        Backspace: "delCharLeft",
        Tab: "defaultTab",
        "Shift-Tab": "indentAuto",
        Enter: "newlineAndIndent",
        Insert: "toggleOverwrite"
    }, a.pcDefault = {
        "Ctrl-A": "selectAll",
        "Ctrl-D": "deleteLine",
        "Ctrl-Z": "undo",
        "Shift-Ctrl-Z": "redo",
        "Ctrl-Y": "redo",
        "Ctrl-Home": "goDocStart",
        "Alt-Up": "goDocStart",
        "Ctrl-End": "goDocEnd",
        "Ctrl-Down": "goDocEnd",
        "Ctrl-Left": "goWordLeft",
        "Ctrl-Right": "goWordRight",
        "Alt-Left": "goLineStart",
        "Alt-Right": "goLineEnd",
        "Ctrl-Backspace": "delWordLeft",
        "Ctrl-Delete": "delWordRight",
        "Ctrl-S": "save",
        "Ctrl-F": "find",
        "Ctrl-G": "findNext",
        "Shift-Ctrl-G": "findPrev",
        "Shift-Ctrl-F": "replace",
        "Shift-Ctrl-R": "replaceAll",
        "Ctrl-[": "indentLess",
        "Ctrl-]": "indentMore",
        fallthrough: "basic"
    }, a.macDefault = {
        "Cmd-A": "selectAll",
        "Cmd-D": "deleteLine",
        "Cmd-Z": "undo",
        "Shift-Cmd-Z": "redo",
        "Cmd-Y": "redo",
        "Cmd-Up": "goDocStart",
        "Cmd-End": "goDocEnd",
        "Cmd-Down": "goDocEnd",
        "Alt-Left": "goWordLeft",
        "Alt-Right": "goWordRight",
        "Cmd-Left": "goLineStart",
        "Cmd-Right": "goLineEnd",
        "Alt-Backspace": "delWordLeft",
        "Ctrl-Alt-Backspace": "delWordRight",
        "Alt-Delete": "delWordRight",
        "Cmd-S": "save",
        "Cmd-F": "find",
        "Cmd-G": "findNext",
        "Shift-Cmd-G": "findPrev",
        "Cmd-Alt-F": "replace",
        "Shift-Cmd-Alt-F": "replaceAll",
        "Cmd-[": "indentLess",
        "Cmd-]": "indentMore",
        fallthrough: ["basic", "emacsy"]
    }, a["default"] = n ? a.macDefault : a.pcDefault, a.emacsy = {
        "Ctrl-F": "goCharRight",
        "Ctrl-B": "goCharLeft",
        "Ctrl-P": "goLineUp",
        "Ctrl-N": "goLineDown",
        "Alt-F": "goWordRight",
        "Alt-B": "goWordLeft",
        "Ctrl-A": "goLineStart",
        "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageUp",
        "Shift-Ctrl-V": "goPageDown",
        "Ctrl-D": "delCharRight",
        "Ctrl-H": "delCharLeft",
        "Alt-D": "delWordRight",
        "Alt-Backspace": "delWordLeft",
        "Ctrl-K": "killLine",
        "Ctrl-T": "transposeChars"
    }, e.fromTextArea = function (t, n) {
        function r() {
            t.value = o.getValue()
        }

        n || (n = {}), n.value = t.value, !n.tabindex && t.tabindex && (n.tabindex = t.tabindex), n.autofocus == null && t.getAttribute("autofocus") != null && (n.autofocus = !0);
        if (t.form) {
            var i = V(t.form, "submit", r, !0);
            if (typeof t.form.submit == "function") {
                var s = t.form.submit;
                t.form.submit = function u() {
                    r(), t.form.submit = s, t.form.submit(), t.form.submit = u
                }
            }
        }
        t.style.display = "none";
        var o = e(function (e) {
            t.parentNode.insertBefore(e, t.nextSibling)
        }, n);
        return o.save = r, o.getTextArea = function () {
            return t
        }, o.toTextArea = function () {
            r(), t.parentNode.removeChild(o.getWrapperElement()), t.style.display = "", t.form && (i(), typeof t.form.submit == "function" && (t.form.submit = s))
        }, o
    };
    var h = /gecko\/\d{7}/i.test(navigator.userAgent), p = /MSIE \d/.test(navigator.userAgent), d = /MSIE [1-7]\b/.test(navigator.userAgent),
        v = /MSIE [1-8]\b/.test(navigator.userAgent), m = p && document.documentMode == 5, g = /WebKit\//.test(navigator.userAgent), y = /Chrome\//.test(navigator.userAgent),
        b = /Opera\//.test(navigator.userAgent), w = /Apple Computer/.test(navigator.vendor), E = /KHTML\//.test(navigator.userAgent),
        S = /Mac OS X 10\D([7-9]|\d\d)\D/.test(navigator.userAgent);
    e.copyState = x, e.startState = T, N.prototype = {
        eol: function () {
            return this.pos >= this.string.length
        }, sol: function () {
            return this.pos == 0
        }, peek: function () {
            return this.string.charAt(this.pos)
        }, next: function () {
            if (this.pos < this.string.length)return this.string.charAt(this.pos++)
        }, eat: function (e) {
            var t = this.string.charAt(this.pos);
            if (typeof e == "string")var n = t == e; else var n = t && (e.test ? e.test(t) : e(t));
            if (n)return ++this.pos, t
        }, eatWhile: function (e) {
            var t = this.pos;
            while (this.eat(e));
            return this.pos > t
        }, eatSpace: function () {
            var e = this.pos;
            while (/[\s\u00a0]/.test(this.string.charAt(this.pos)))++this.pos;
            return this.pos > e
        }, skipToEnd: function () {
            this.pos = this.string.length
        }, skipTo: function (e) {
            var t = this.string.indexOf(e, this.pos);
            if (t > -1)return this.pos = t, !0
        }, backUp: function (e) {
            this.pos -= e
        }, column: function () {
            return Y(this.string, this.start, this.tabSize)
        }, indentation: function () {
            return Y(this.string, null, this.tabSize)
        }, match: function (e, t, n) {
            if (typeof e != "string") {
                var i = this.string.slice(this.pos).match(e);
                return i && t !== !1 && (this.pos += i[0].length), i
            }
            var r = function (e) {
                return n ? e.toLowerCase() : e
            };
            if (r(this.string).indexOf(r(e), this.pos) == this.pos)return t !== !1 && (this.pos += e.length), !0
        }, current: function () {
            return this.string.slice(this.start, this.pos)
        }
    }, e.StringStream = N, C.prototype = {
        attach: function (e) {
            this.marker.set.push(e)
        }, detach: function (e) {
            var t = ht(this.marker.set, e);
            t > -1 && this.marker.set.splice(t, 1)
        }, split: function (e, t) {
            if (this.to <= e && this.to != null)return null;
            var n = this.from < e || this.from == null ? null : this.from - e + t, r = this.to == null ? null : this.to - e + t;
            return new C(n, r, this.style, this.marker)
        }, dup: function () {
            return new C(null, null, this.style, this.marker)
        }, clipTo: function (e, t, n, r, i) {
            e && r > this.from && (r < this.to || this.to == null) ? this.from = null : this.from != null && this.from >= t && (this.from = Math.max(r, this.from) + i), n && (t < this.to || this.to == null) && (t > this.from || this.from == null) ? this.to = null : this.to != null && this.to > t && (this.to = r < this.to ? this.to + i : t)
        }, isDead: function () {
            return this.from != null && this.to != null && this.from >= this.to
        }, sameSet: function (e) {
            return this.marker == e.marker
        }
    }, k.prototype = {
        attach: function (e) {
            this.line = e
        }, detach: function (e) {
            this.line == e && (this.line = null)
        }, split: function (e, t) {
            if (e < this.from)return this.from = this.to = this.from - e + t, this
        }, isDead: function () {
            return this.from > this.to
        }, clipTo: function (e, t, n, r, i) {
            (e || t < this.from) && (n || r > this.to) ? (this.from = 0, this.to = -1) : this.from > t && (this.from = this.to = Math.max(r, this.from) + i)
        }, sameSet: function (e) {
            return !1
        }, find: function () {
            return !this.line || !this.line.parent ? null : {line: P(this.line), ch: this.from}
        }, clear: function () {
            if (this.line) {
                var e = ht(this.line.marked, this);
                e != -1 && this.line.marked.splice(e, 1), this.line = null
            }
        }
    };
    var L = " ";
    h || p && !d ? L = "&#x200b;" : b && (L = ""), A.inheritMarks = function (e, t) {
        var n = new A(e), r = t && t.marked;
        if (r)for (var i = 0; i < r.length; ++i)if (r[i].to == null && r[i].style) {
            var s = n.marked || (n.marked = []), o = r[i], u = o.dup();
            s.push(u), u.attach(n)
        }
        return n
    }, A.prototype = {
        replace: function (e, t, n) {
            var r = [], i = this.marked, s = t == null ? this.text.length : t;
            O(0, e, this.styles, r), n && r.push(n, null), O(s, this.text.length, this.styles, r), this.styles = r, this.text = this.text.slice(0, e) + n + this.text.slice(s), this.stateAfter = null;
            if (i) {
                var o = n.length - (s - e);
                for (var u = 0; u < i.length; ++u) {
                    var a = i[u];
                    a.clipTo(e == null, e || 0, t == null, s, o), a.isDead() && (a.detach(this), i.splice(u--, 1))
                }
            }
        }, split: function (e, t) {
            var n = [t, null], r = this.marked;
            O(e, this.text.length, this.styles, n);
            var i = new A(t + this.text.slice(e), n);
            if (r)for (var s = 0; s < r.length; ++s) {
                var o = r[s], u = o.split(e, t.length);
                u && (i.marked || (i.marked = []), i.marked.push(u), u.attach(i), u == o && r.splice(s--, 1))
            }
            return i
        }, append: function (e) {
            var t = this.text.length, n = e.marked, r = this.marked;
            this.text += e.text, O(0, e.text.length, e.styles, this.styles);
            if (r)for (var i = 0; i < r.length; ++i)r[i].to == null && (r[i].to = t);
            if (n && n.length) {
                r || (this.marked = r = []);
                e:for (var i = 0; i < n.length; ++i) {
                    var s = n[i];
                    if (!s.from)for (var o = 0; o < r.length; ++o) {
                        var u = r[o];
                        if (u.to == t && u.sameSet(s)) {
                            u.to = s.to == null ? null : s.to + t, u.isDead() && (u.detach(this), n.splice(i--, 1));
                            continue e
                        }
                    }
                    r.push(s), s.attach(this), s.from += t, s.to != null && (s.to += t)
                }
            }
        }, fixMarkEnds: function (e) {
            var t = this.marked, n = e.marked;
            if (!t)return;
            e:for (var r = 0; r < t.length; ++r) {
                var i = t[r], s = i.to == null;
                if (s && n)for (var o = 0; o < n.length; ++o) {
                    var u = n[o];
                    if (!u.sameSet(i) || u.from != null)continue;
                    if (i.from == this.text.length && u.to == 0) {
                        n.splice(o, 1), t.splice(r--, 1);
                        continue e
                    }
                    s = !1;
                    break
                }
                s && (i.to = this.text.length)
            }
        }, fixMarkStarts: function () {
            var e = this.marked;
            if (!e)return;
            for (var t = 0; t < e.length; ++t)e[t].from == null && (e[t].from = 0)
        }, addMark: function (e) {
            e.attach(this), this.marked == null && (this.marked = []), this.marked.push(e), this.marked.sort(function (e, t) {
                return (e.from || 0) - (t.from || 0)
            })
        }, highlight: function (e, t, n) {
            var r = new N(this.text, n), i = this.styles, s = 0, o = !1, u = i[0], a;
            this.text == "" && e.blankLine && e.blankLine(t);
            while (!r.eol()) {
                var f = e.token(r, t), l = this.text.slice(r.start, r.pos);
                r.start = r.pos, s && i[s - 1] == f ? i[s - 2] += l : l && (!o && (i[s + 1] != f || s && i[s - 2] != a) && (o = !0), i[s++] = l, i[s++] = f, a = u, u = i[s]);
                if (r.pos > 5e3) {
                    i[s++] = this.text.slice(r.pos), i[s++] = null;
                    break
                }
            }
            return i.length != s && (i.length = s, o = !0), s && i[s - 2] != a && (o = !0), o || (i.length < 5 && this.text.length < 10 ? null : !1)
        }, getTokenAt: function (e, t, n) {
            var r = this.text, i = new N(r);
            while (i.pos < n && !i.eol()) {
                i.start = i.pos;
                var s = e.token(i, t)
            }
            return {start: i.start, end: i.pos, string: i.current(), className: s || null, state: t}
        }, indentation: function (e) {
            return Y(this.text, null, e)
        }, getElement: function (e, t, n) {
            function u(t, n, o) {
                if (!n)return;
                r && p && n.charAt(0) == " " && (n = "\u00a0" + n.slice(1)), r = !1;
                if (!s.test(n)) {
                    i += n.length;
                    var u = document.createTextNode(n)
                } else {
                    var u = document.createDocumentFragment(), a = 0;
                    for (; ;) {
                        s.lastIndex = a;
                        var f = s.exec(n), l = f ? f.index - a : n.length - a;
                        l && (u.appendChild(document.createTextNode(n.slice(a, a + l))), i += l);
                        if (!f)break;
                        a += l + 1;
                        if (f[0] == "	") {
                            var c = e(i);
                            u.appendChild(c.element.cloneNode(!0)), i += c.width
                        } else {
                            var h = ot("span", "\u2022", "cm-invalidchar");
                            h.title = "\\u" + f[0].charCodeAt(0).toString(16), u.appendChild(h), i += 1
                        }
                    }
                }
                if (o) {
                    var h = document.createElement("span");
                    h.className = o, h.appendChild(u), t.appendChild(h)
                } else t.appendChild(u)
            }

            function m(e) {
                return e ? "cm-" + e.replace(/ +/g, " cm-") : null
            }

            var r = !0, i = 0, s = /[\t\u0000-\u0019\u200b\u2028\u2029\uFEFF]/g, o = document.createElement("pre"), a = u;
            if (t != null) {
                var f = 0, l = document.createElement("span");
                o.anchor = l, a = function (e, r, i) {
                    var s = r.length;
                    if (t >= f && t < f + s) {
                        t > f && (u(e, r.slice(0, t - f), i), n && e.appendChild(document.createElement("wbr"))), e.appendChild(l);
                        var o = t - f;
                        u(l, b ? r.slice(o, o + 1) : r.slice(o), i), b && u(e, r.slice(o + 1), i), t--, f += s
                    } else f += s, u(e, r, i), f == t && f == v ? (lt(l, L), e.appendChild(l)) : f > t + 10 && /\s/.test(r) && (a = function () {
                        })
                }
            }
            var c = this.styles, h = this.text, d = this.marked, v = h.length;
            if (!h && t == null) a(o, " "); else if (!d || !d.length)for (var g = 0, y = 0; y < v; g += 2) {
                var w = c[g], E = c[g + 1], S = w.length;
                y + S > v && (w = w.slice(0, v - y)), y += S, a(o, w, m(E))
            } else {
                var x = 0, g = 0, T = "", E, N = 0, C = d[0].from || 0, k = [], A = 0, O = function () {
                    var e;
                    while (A < d.length && ((e = d[A]).from == x || e.from == null))e.style != null && k.push(e), ++A;
                    C = A < d.length ? d[A].from : Infinity;
                    for (var t = 0; t < k.length; ++t) {
                        var n = k[t].to;
                        n == null && (n = Infinity), n == x ? k.splice(t--, 1) : C = Math.min(n, C)
                    }
                }, M = 0;
                while (x < v) {
                    C == x && O();
                    var _ = Math.min(v, C);
                    for (; ;) {
                        if (T) {
                            var D = x + T.length, P = E;
                            for (var H = 0; H < k.length; ++H)P = (P ? P + " " : "") + k[H].style;
                            a(o, D > _ ? T.slice(0, _ - x) : T, P);
                            if (D >= _) {
                                T = T.slice(_ - x), x = _;
                                break
                            }
                            x = D
                        }
                        T = c[g++], E = m(c[g++])
                    }
                }
            }
            return o
        }, cleanUp: function () {
            this.parent = null;
            if (this.marked)for (var e = 0, t = this.marked.length; e < t; ++e)this.marked[e].detach(this)
        }
    }, M.prototype = {
        chunkSize: function () {
            return this.lines.length
        }, remove: function (e, t, n) {
            for (var r = e, i = e + t; r < i; ++r) {
                var s = this.lines[r];
                this.height -= s.height, s.cleanUp();
                if (s.handlers)for (var o = 0; o < s.handlers.length; ++o)n.push(s.handlers[o])
            }
            this.lines.splice(e, t)
        }, collapse: function (e) {
            e.splice.apply(e, [e.length, 0].concat(this.lines))
        }, insertHeight: function (e, t, n) {
            this.height += n, this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e));
            for (var r = 0, i = t.length; r < i; ++r)t[r].parent = this
        }, iterN: function (e, t, n) {
            for (var r = e + t; e < r; ++e)if (n(this.lines[e]))return !0
        }
    }, _.prototype = {
        chunkSize: function () {
            return this.size
        }, remove: function (e, t, n) {
            this.size -= t;
            for (var r = 0; r < this.children.length; ++r) {
                var i = this.children[r], s = i.chunkSize();
                if (e < s) {
                    var o = Math.min(t, s - e), u = i.height;
                    i.remove(e, o, n), this.height -= u - i.height, s == o && (this.children.splice(r--, 1), i.parent = null);
                    if ((t -= o) == 0)break;
                    e = 0
                } else e -= s
            }
            if (this.size - t < 25) {
                var a = [];
                this.collapse(a), this.children = [new M(a)], this.children[0].parent = this
            }
        }, collapse: function (e) {
            for (var t = 0, n = this.children.length; t < n; ++t)this.children[t].collapse(e)
        }, insert: function (e, t) {
            var n = 0;
            for (var r = 0, i = t.length; r < i; ++r)n += t[r].height;
            this.insertHeight(e, t, n)
        }, insertHeight: function (e, t, n) {
            this.size += t.length, this.height += n;
            for (var r = 0, i = this.children.length; r < i; ++r) {
                var s = this.children[r], o = s.chunkSize();
                if (e <= o) {
                    s.insertHeight(e, t, n);
                    if (s.lines && s.lines.length > 50) {
                        while (s.lines.length > 50) {
                            var u = s.lines.splice(s.lines.length - 25, 25), a = new M(u);
                            s.height -= a.height, this.children.splice(r + 1, 0, a), a.parent = this
                        }
                        this.maybeSpill()
                    }
                    break
                }
                e -= o
            }
        }, maybeSpill: function () {
            if (this.children.length <= 10)return;
            var e = this;
            do {
                var t = e.children.splice(e.children.length - 5, 5), n = new _(t);
                if (!e.parent) {
                    var r = new _(e.children);
                    r.parent = e, e.children = [r, n], e = r
                } else {
                    e.size -= n.size, e.height -= n.height;
                    var i = ht(e.parent.children, e);
                    e.parent.children.splice(i + 1, 0, n)
                }
                n.parent = e.parent
            } while (e.children.length > 10);
            e.parent.maybeSpill()
        }, iter: function (e, t, n) {
            this.iterN(e, t - e, n)
        }, iterN: function (e, t, n) {
            for (var r = 0, i = this.children.length; r < i; ++r) {
                var s = this.children[r], o = s.chunkSize();
                if (e < o) {
                    var u = Math.min(t, o - e);
                    if (s.iterN(e, u, n))return !0;
                    if ((t -= u) == 0)break;
                    e = 0
                } else e -= o
            }
        }
    }, j.prototype = {
        addChange: function (e, t, n) {
            this.undone.length = 0;
            var r = +(new Date), i = this.done[this.done.length - 1], s = i && i[i.length - 1], o = r - this.time;
            if (this.compound && i && !this.closed) i.push({
                start: e,
                added: t,
                old: n
            }); else if (o > 400 || !s || this.closed || s.start > e + n.length || s.start + s.added < e) this.done.push([{
                start: e,
                added: t,
                old: n
            }]), this.closed = !1; else {
                var u = Math.max(0, s.start - e), a = Math.max(0, e + n.length - (s.start + s.added));
                for (var f = u; f > 0; --f)s.old.unshift(n[f - 1]);
                for (var f = a; f > 0; --f)s.old.push(n[n.length - f]);
                u && (s.start = e), s.added += t - (n.length - u - a)
            }
            this.time = r
        }, startCompound: function () {
            this.compound++ || (this.closed = !0)
        }, endCompound: function () {
            --this.compound || (this.closed = !0)
        }
    }, e.e_stop = U, e.e_preventDefault = q, e.e_stopPropagation = R, e.connect = V, $.prototype = {
        set: function (e, t) {
            clearTimeout(this.id), this.id = setTimeout(t, e)
        }
    };
    var J = e.Pass = {
        toString: function () {
            return "CodeMirror.Pass"
        }
    }, K = function () {
        if (v)return !1;
        var e = document.createElement("div");
        return "draggable" in e || "dragDrop" in e
    }(), Q = function () {
        var e = document.createElement("textarea");
        return e.value = "foo\nbar", e.value.indexOf("\r") > -1 ? "\r\n" : "\n"
    }(), G = /^$/;
    h ? G = /$'/ : w ? G = /\-[^ \-?]|\?[^ !'\"\),.\-\/:;\?\]\}]/ : y && (G = /\-[^ \-\.?]|\?[^ \-\.?\]\}:;!'\"\),\/]|[\.!\"#&%\)*+,:;=>\]|\}~][\(\{\[<]|\$'/), e.setTextContent = lt;
    var dt = "\n\nb".split(/\n/).length != 3 ? function (e) {
        var t = 0, n = [], r = e.length;
        while (t <= r) {
            var i = e.indexOf("\n", t);
            i == -1 && (i = e.length);
            var s = e.slice(t, e.charAt(i - 1) == "\r" ? i - 1 : i), o = s.indexOf("\r");
            o != -1 ? (n.push(s.slice(0, o)), t += o + 1) : (n.push(s), t = i + 1)
        }
        return n
    } : function (e) {
        return e.split(/\r\n?|\n/)
    };
    e.splitLines = dt;
    var vt = window.getSelection ? function (e) {
        try {
            return e.selectionStart != e.selectionEnd
        } catch (t) {
            return !1
        }
    } : function (e) {
        try {
            var t = e.ownerDocument.selection.createRange()
        } catch (n) {
        }
        return !t || t.parentElement() != e ? !1 : t.compareEndPoints("StartToEnd", t) != 0
    };
    e.defineMode("null", function () {
        return {
            token: function (e) {
                e.skipToEnd()
            }
        }
    }), e.defineMIME("text/plain", "null");
    var mt = {
        3: "Enter",
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "PrintScrn",
        45: "Insert",
        46: "Delete",
        59: ";",
        91: "Mod",
        92: "Mod",
        93: "Mod",
        109: "-",
        107: "=",
        127: "Delete",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        63276: "PageUp",
        63277: "PageDown",
        63275: "End",
        63273: "Home",
        63234: "Left",
        63232: "Up",
        63235: "Right",
        63233: "Down",
        63302: "Insert",
        63272: "Delete"
    };
    return e.keyNames = mt, function () {
        for (var e = 0; e < 10; e++)mt[e + 48] = String(e);
        for (var e = 65; e <= 90; e++)mt[e] = String.fromCharCode(e);
        for (var e = 1; e <= 12; e++)mt[e + 111] = mt[e + 63235] = "F" + e
    }(), e
}();
CodeMirror.defineMode("clike", function (e, t) {
    function c(e, t) {
        var n = e.next();
        if (u[n]) {
            var a = u[n](e, t);
            if (a !== !1)return a
        }
        if (n == '"' || n == "'")return t.tokenize = h(n), t.tokenize(e, t);
        if (/[\[\]{}\(\),;\:\.]/.test(n))return l = n, null;
        if (/\d/.test(n))return e.eatWhile(/[\w\.]/), "number";
        if (n == "/") {
            if (e.eat("*"))return t.tokenize = p, p(e, t);
            if (e.eat("/"))return e.skipToEnd(), "comment"
        }
        if (f.test(n))return e.eatWhile(f), "operator";
        e.eatWhile(/[\w\$_]/);
        var c = e.current();
        return r.propertyIsEnumerable(c) ? (s.propertyIsEnumerable(c) && (l = "newstatement"), "keyword") : i.propertyIsEnumerable(c) ? (s.propertyIsEnumerable(c) && (l = "newstatement"), "builtin") : o.propertyIsEnumerable(c) ? "atom" : "variable"
    }

    function h(e) {
        return function (t, n) {
            var r = !1, i, s = !1;
            while ((i = t.next()) != null) {
                if (i == e && !r) {
                    s = !0;
                    break
                }
                r = !r && i == "\\"
            }
            if (s || !r && !a) n.tokenize = null;
            return "string"
        }
    }

    function p(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "/" && n) {
                t.tokenize = null;
                break
            }
            n = r == "*"
        }
        return "comment"
    }

    function d(e, t, n, r, i) {
        this.indented = e, this.column = t, this.type = n, this.align = r, this.prev = i
    }

    function v(e, t, n) {
        return e.context = new d(e.indented, t, n, null, e.context)
    }

    function m(e) {
        var t = e.context.type;
        if (t == ")" || t == "]" || t == "}") e.indented = e.context.indented;
        return e.context = e.context.prev
    }

    var n = e.indentUnit, r = t.keywords || {}, i = t.builtin || {}, s = t.blockKeywords || {}, o = t.atoms || {}, u = t.hooks || {}, a = t.multiLineStrings,
        f = /[+\-*&%=<>!?|\/]/, l;
    return {
        startState: function (e) {
            return {tokenize: null, context: new d((e || 0) - n, 0, "top", !1), indented: 0, startOfLine: !0}
        }, token: function (e, t) {
            var n = t.context;
            e.sol() && (n.align == null && (n.align = !1), t.indented = e.indentation(), t.startOfLine = !0);
            if (e.eatSpace())return null;
            l = null;
            var r = (t.tokenize || c)(e, t);
            if (r == "comment" || r == "meta")return r;
            n.align == null && (n.align = !0);
            if (l != ";" && l != ":" || n.type != "statement")if (l == "{") v(t, e.column(), "}"); else if (l == "[") v(t, e.column(), "]"); else if (l == "(") v(t, e.column(), ")"); else if (l == "}") {
                while (n.type == "statement")n = m(t);
                n.type == "}" && (n = m(t));
                while (n.type == "statement")n = m(t)
            } else l == n.type ? m(t) : (n.type == "}" || n.type == "top" || n.type == "statement" && l == "newstatement") && v(t, e.column(), "statement"); else m(t);
            return t.startOfLine = !1, r
        }, indent: function (e, t) {
            if (e.tokenize != c && e.tokenize != null)return 0;
            var r = e.context, i = t && t.charAt(0);
            r.type == "statement" && i == "}" && (r = r.prev);
            var s = i == r.type;
            return r.type == "statement" ? r.indented + (i == "{" ? 0 : n) : r.align ? r.column + (s ? 0 : 1) : r.indented + (s ? 0 : n)
        }, electricChars: "{}"
    }
}), function () {
    function e(e) {
        var t = {}, n = e.split(" ");
        for (var r = 0; r < n.length; ++r)t[n[r]] = !0;
        return t
    }

    function n(e, t) {
        return t.startOfLine ? (e.skipToEnd(), "meta") : !1
    }

    function r(e, t) {
        var n;
        while ((n = e.next()) != null)if (n == '"' && !e.eat('"')) {
            t.tokenize = null;
            break
        }
        return "string"
    }

    function i(e, t) {
        for (var n = 0; n < e.length; ++n)CodeMirror.defineMIME(e[n], t)
    }

    var t = "auto if break int case long char register continue return default short do sizeof double static else struct entry switch extern typedef float union for unsigned goto while enum void const signed volatile";
    i(["text/x-csrc", "text/x-c", "text/x-chdr"], {
        name: "clike",
        keywords: e(t),
        blockKeywords: e("case do else for if switch while struct"),
        atoms: e("null"),
        hooks: {"#": n}
    }), i(["text/x-c++src", "text/x-c++hdr"], {
        name: "clike",
        keywords: e(t + " asm dynamic_cast namespace reinterpret_cast try bool explicit new " + "static_cast typeid catch operator template typename class friend private " + "this using const_cast inline public throw virtual delete mutable protected " + "wchar_t"),
        blockKeywords: e("catch class do else finally for if struct switch try while"),
        atoms: e("true false null"),
        hooks: {"#": n}
    }), CodeMirror.defineMIME("text/x-java", {
        name: "clike",
        keywords: e("abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while"),
        blockKeywords: e("catch class do else finally for if switch try while"),
        atoms: e("true false null"),
        hooks: {
            "@": function (e, t) {
                return e.eatWhile(/[\w\$_]/), "meta"
            }
        }
    }), CodeMirror.defineMIME("text/x-csharp", {
        name: "clike",
        keywords: e("abstract as base break case catch checked class const continue default delegate do else enum event explicit extern finally fixed for foreach goto if implicit in interface internal is lock namespace new operator out override params private protected public readonly ref return sealed sizeof stackalloc static struct switch this throw try typeof unchecked unsafe using virtual void volatile while add alias ascending descending dynamic from get global group into join let orderby partial remove select set value var yield"),
        blockKeywords: e("catch class do else finally for foreach if struct switch try while"),
        builtin: e("Boolean Byte Char DateTime DateTimeOffset Decimal Double Guid Int16 Int32 Int64 Object SByte Single String TimeSpan UInt16 UInt32 UInt64 bool byte char decimal double short int long object sbyte float string ushort uint ulong"),
        atoms: e("true false null"),
        hooks: {
            "@": function (e, t) {
                return e.eat('"') ? (t.tokenize = r, r(e, t)) : (e.eatWhile(/[\w\$_]/), "meta")
            }
        }
    }), CodeMirror.defineMIME("text/x-scala", {
        name: "clike",
        keywords: e("abstract case catch class def do else extends false final finally for forSome if implicit import lazy match new null object override package private protected return sealed super this throw trait try trye type val var while with yield _ : = => <- <: <% >: # @ assert assume require print println printf readLine readBoolean readByte readShort readChar readInt readLong readFloat readDouble AnyVal App Application Array BufferedIterator BigDecimal BigInt Char Console Either Enumeration Equiv Error Exception Fractional Function IndexedSeq Integral Iterable Iterator List Map Numeric Nil NotNull Option Ordered Ordering PartialFunction PartialOrdering Product Proxy Range Responder Seq Serializable Set Specializable Stream StringBuilder StringContext Symbol Throwable Traversable TraversableOnce Tuple Unit Vector :: #:: Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable Compiler Double Exception Float Integer Long Math Number Object Package Pair Process Runtime Runnable SecurityManager Short StackTraceElement StrictMath String StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void"),
        blockKeywords: e("catch class do else finally for forSome if match switch try while"),
        atoms: e("true false null"),
        hooks: {
            "@": function (e, t) {
                return e.eatWhile(/[\w\$_]/), "meta"
            }
        }
    })
}(), CodeMirror.defineMode("clojure", function (e, t) {
    function h(e) {
        var t = {}, n = e.split(" ");
        for (var r = 0; r < n.length; ++r)t[n[r]] = !0;
        return t
    }

    function y(e, t, n) {
        this.indent = e, this.type = t, this.prev = n
    }

    function b(e, t, n) {
        e.indentStack = new y(t, n, e.indentStack)
    }

    function w(e) {
        e.indentStack = e.indentStack.prev
    }

    function E(e, t) {
        if (e === "0" && "x" == t.peek().toLowerCase())return t.eat("x"), t.eatWhile(g.hex), !0;
        if (e == "+" || e == "-") t.eat(g.sign), e = t.next();
        return g.digit.test(e) ? (t.eat(e), t.eatWhile(g.digit), "." == t.peek() && (t.eat("."), t.eatWhile(g.digit)), "e" == t.peek().toLowerCase() && (t.eat(g.exponent), t.eat(g.sign), t.eatWhile(g.digit)), !0) : !1
    }

    var n = "builtin", r = "comment", i = "string", s = "tag", o = "atom", u = "number", a = "bracket", f = "keyword", l = 2, c = 1, p = h("true false nil"),
        d = h("defn defn- def def- defonce defmulti defmethod defmacro defstruct deftype defprotocol defrecord defproject deftest slice defalias defhinted defmacro- defn-memo defnk defnk defonce- defunbound defunbound- defvar defvar- let letfn do case cond condp for loop recur when when-not when-let when-first if if-let if-not . .. -> ->> doto and or dosync doseq dotimes dorun doall load import unimport ns in-ns refer try catch finally throw with-open with-local-vars binding gen-class gen-and-load-class gen-and-save-class handler-case handle"),
        v = h("* *1 *2 *3 *agent* *allow-unresolved-vars* *assert *clojure-version* *command-line-args* *compile-files* *compile-path* *e *err* *file* *flush-on-newline* *in* *macro-meta* *math-context* *ns* *out* *print-dup* *print-length* *print-level* *print-meta* *print-readably* *read-eval* *source-path* *use-context-classloader* *warn-on-reflection* + - / < <= = == > >= accessor aclone agent agent-errors aget alength alias all-ns alter alter-meta! alter-var-root amap ancestors and apply areduce array-map aset aset-boolean aset-byte aset-char aset-double aset-float aset-int aset-long aset-short assert assoc assoc! assoc-in associative? atom await await-for await1 bases bean bigdec bigint binding bit-and bit-and-not bit-clear bit-flip bit-not bit-or bit-set bit-shift-left bit-shift-right bit-test bit-xor boolean boolean-array booleans bound-fn bound-fn* butlast byte byte-array bytes case cast char char-array char-escape-string char-name-string char? chars chunk chunk-append chunk-buffer chunk-cons chunk-first chunk-next chunk-rest chunked-seq? class class? clear-agent-errors clojure-version coll? comment commute comp comparator compare compare-and-set! compile complement concat cond condp conj conj! cons constantly construct-proxy contains? count counted? create-ns create-struct cycle dec decimal? declare definline defmacro defmethod defmulti defn defn- defonce defstruct delay delay? deliver deref derive descendants destructure disj disj! dissoc dissoc! distinct distinct? doall doc dorun doseq dosync dotimes doto double double-array doubles drop drop-last drop-while empty empty? ensure enumeration-seq eval even? every? extend extend-protocol extend-type extends? extenders false? ffirst file-seq filter find find-doc find-ns find-var first float float-array float? floats flush fn fn? fnext for force format future future-call future-cancel future-cancelled? future-done? future? gen-class gen-interface gensym get get-in get-method get-proxy-class get-thread-bindings get-validator hash hash-map hash-set identical? identity if-let if-not ifn? import in-ns inc init-proxy instance? int int-array integer? interleave intern interpose into into-array ints io! isa? iterate iterator-seq juxt key keys keyword keyword? last lazy-cat lazy-seq let letfn line-seq list list* list? load load-file load-reader load-string loaded-libs locking long long-array longs loop macroexpand macroexpand-1 make-array make-hierarchy map map? mapcat max max-key memfn memoize merge merge-with meta method-sig methods min min-key mod name namespace neg? newline next nfirst nil? nnext not not-any? not-empty not-every? not= ns ns-aliases ns-imports ns-interns ns-map ns-name ns-publics ns-refers ns-resolve ns-unalias ns-unmap nth nthnext num number? odd? or parents partial partition pcalls peek persistent! pmap pop pop! pop-thread-bindings pos? pr pr-str prefer-method prefers primitives-classnames print print-ctor print-doc print-dup print-method print-namespace-doc print-simple print-special-doc print-str printf println println-str prn prn-str promise proxy proxy-call-with-super proxy-mappings proxy-name proxy-super push-thread-bindings pvalues quot rand rand-int range ratio? rational? rationalize re-find re-groups re-matcher re-matches re-pattern re-seq read read-line read-string reify reduce ref ref-history-count ref-max-history ref-min-history ref-set refer refer-clojure release-pending-sends rem remove remove-method remove-ns repeat repeatedly replace replicate require reset! reset-meta! resolve rest resultset-seq reverse reversible? rseq rsubseq satisfies? second select-keys send send-off seq seq? seque sequence sequential? set set-validator! set? short short-array shorts shutdown-agents slurp some sort sort-by sorted-map sorted-map-by sorted-set sorted-set-by sorted? special-form-anchor special-symbol? split-at split-with str stream? string? struct struct-map subs subseq subvec supers swap! symbol symbol? sync syntax-symbol-anchor take take-last take-nth take-while test the-ns time to-array to-array-2d trampoline transient tree-seq true? type unchecked-add unchecked-dec unchecked-divide unchecked-inc unchecked-multiply unchecked-negate unchecked-remainder unchecked-subtract underive unquote unquote-splicing update-in update-proxy use val vals var-get var-set var? vary-meta vec vector vector? when when-first when-let when-not while with-bindings with-bindings* with-in-str with-loading-context with-local-vars with-meta with-open with-out-str with-precision xml-seq"),
        m = h("ns fn def defn defmethod bound-fn if if-not case condp when while when-not when-first do future comment doto locking proxy with-open with-precision reify deftype defrecord defprotocol extend extend-protocol extend-type try catch let letfn binding loop for doseq dotimes when-let if-let defstruct struct-map assoc testing deftest handler-case handle dotrace deftrace"),
        g = {
            digit: /\d/,
            digit_or_colon: /[\d:]/,
            hex: /[0-9a-fA-F]/,
            sign: /[+-]/,
            exponent: /[eE]/,
            keyword_char: /[^\s\(\[\;\)\]]/,
            basic: /[\w\$_\-]/,
            lang_keyword: /[\w*+!\-_?:\/]/
        };
    return {
        startState: function () {
            return {indentStack: null, indentation: 0, mode: !1}
        }, token: function (e, t) {
            t.indentStack == null && e.sol() && (t.indentation = e.indentation());
            if (e.eatSpace())return null;
            var s = null;
            switch (t.mode) {
                case"string":
                    var c, h = !1;
                    while ((c = e.next()) != null) {
                        if (c == '"' && !h) {
                            t.mode = !1;
                            break
                        }
                        h = !h && c == "\\"
                    }
                    s = i;
                    break;
                default:
                    var y = e.next();
                    if (y == '"') t.mode = "string", s = i; else if (y == "'" && !g.digit_or_colon.test(e.peek())) s = o; else if (y == ";") e.skipToEnd(), s = r; else if (E(y, e)) s = u; else if (y == "(" || y == "[") {
                        var S = "", x = e.column(), T;
                        if (y == "(")while ((T = e.eat(g.keyword_char)) != null)S += T;
                        S.length > 0 && m.propertyIsEnumerable(S) ? b(t, x + l, y) : (e.eatSpace(), e.eol() || e.peek() == ";" ? b(t, x + 1, y) : b(t, x + e.current().length, y)), e.backUp(e.current().length - 1), s = a
                    } else if (y == ")" || y == "]") s = a, t.indentStack != null && t.indentStack.type == (y == ")" ? "(" : "[") && w(t); else {
                        if (y == ":")return e.eatWhile(g.lang_keyword), o;
                        e.eatWhile(g.basic), d && d.propertyIsEnumerable(e.current()) ? s = f : v && v.propertyIsEnumerable(e.current()) ? s = n : p && p.propertyIsEnumerable(e.current()) ? s = o : s = null
                    }
            }
            return s
        }, indent: function (e, t) {
            return e.indentStack == null ? e.indentation : e.indentStack.indent
        }
    }
}), CodeMirror.defineMIME("text/x-clojure", "clojure"), CodeMirror.defineMode("coffeescript", function (e) {
    function n(e) {
        return new RegExp("^((" + e.join(")|(") + "))\\b")
    }

    function y(e, n) {
        if (e.sol()) {
            var c = n.scopes[0].offset;
            if (e.eatSpace()) {
                var h = e.indentation();
                return h > c ? "indent" : h < c ? "dedent" : null
            }
            c > 0 && S(e, n)
        }
        if (e.eatSpace())return null;
        var m = e.peek();
        if (e.match("####"))return e.skipToEnd(), "comment";
        if (e.match("###"))return n.tokenize = w, n.tokenize(e, n);
        if (m === "#")return e.skipToEnd(), "comment";
        if (e.match(/^-?[0-9\.]/, !1)) {
            var y = !1;
            e.match(/^-?\d*\.\d+(e[\+\-]?\d+)?/i) && (y = !0), e.match(/^-?\d+\.\d*/) && (y = !0), e.match(/^-?\.\d+/) && (y = !0);
            if (y)return e.peek() == "." && e.backUp(1), "number";
            var E = !1;
            e.match(/^-?0x[0-9a-f]+/i) && (E = !0), e.match(/^-?[1-9]\d*(e[\+\-]?\d+)?/) && (E = !0), e.match(/^-?0(?![\dx])/i) && (E = !0);
            if (E)return "number"
        }
        if (e.match(d))return n.tokenize = b(e.current(), "string"), n.tokenize(e, n);
        if (e.match(v)) {
            if (e.current() != "/" || e.match(/^.*\//, !1))return n.tokenize = b(e.current(), "string-2"), n.tokenize(e, n);
            e.backUp(1)
        }
        return e.match(u) || e.match(o) ? "punctuation" : e.match(s) || e.match(r) || e.match(l) ? "operator" : e.match(i) ? "punctuation" : e.match(g) ? "atom" : e.match(p) ? "keyword" : e.match(a) ? "variable" : e.match(f) ? "property" : (e.next(), t)
    }

    function b(n, r) {
        var i = n.length == 1;
        return function (o, u) {
            while (!o.eol()) {
                o.eatWhile(/[^'"\/\\]/);
                if (o.eat("\\")) {
                    o.next();
                    if (i && o.eol())return r
                } else {
                    if (o.match(n))return u.tokenize = y, r;
                    o.eat(/['"\/]/)
                }
            }
            return i && (e.mode.singleLineStringErrors ? r = t : u.tokenize = y), r
        }
    }

    function w(e, t) {
        while (!e.eol()) {
            e.eatWhile(/[^#]/);
            if (e.match("###")) {
                t.tokenize = y;
                break
            }
            e.eatWhile("#")
        }
        return "comment"
    }

    function E(t, n, r) {
        r = r || "coffee";
        var i = 0;
        if (r === "coffee") {
            for (var s = 0; s < n.scopes.length; s++)if (n.scopes[s].type === "coffee") {
                i = n.scopes[s].offset + e.indentUnit;
                break
            }
        } else i = t.column() + t.current().length;
        n.scopes.unshift({offset: i, type: r})
    }

    function S(e, t) {
        if (t.scopes.length == 1)return;
        if (t.scopes[0].type === "coffee") {
            var n = e.indentation(), r = -1;
            for (var i = 0; i < t.scopes.length; ++i)if (n === t.scopes[i].offset) {
                r = i;
                break
            }
            if (r === -1)return !0;
            while (t.scopes[0].offset !== n)t.scopes.shift();
            return !1
        }
        return t.scopes.shift(), !1
    }

    function x(e, n) {
        var r = n.tokenize(e, n), i = e.current();
        if (i === ".")return r = n.tokenize(e, n), i = e.current(), r === "variable" ? "variable" : t;
        i === "return" && (n.dedent += 1), ((i === "->" || i === "=>") && !n.lambda && n.scopes[0].type == "coffee" && e.peek() === "" || r === "indent") && E(e, n);
        var s = "[({".indexOf(i);
        return s !== -1 && E(e, n, "])}".slice(s, s + 1)), c.exec(i) && E(e, n), i == "then" && S(e, n), r === "dedent" && S(e, n) ? t : (s = "])}".indexOf(i), s !== -1 && S(e, n) ? t : (n.dedent > 0 && e.eol() && n.scopes[0].type == "coffee" && (n.scopes.length > 1 && n.scopes.shift(), n.dedent -= 1), r))
    }

    var t = "error", r = new RegExp("^[\\+\\-\\*/%&|\\^~<>!?]"), i = new RegExp("^[\\(\\)\\[\\]\\{\\},:`=;\\.]"),
        s = new RegExp("^((->)|(=>)|(\\+\\+)|(\\+\\=)|(\\-\\-)|(\\-\\=)|(\\*\\*)|(\\*\\=)|(\\/\\/)|(\\/\\=)|(==)|(!=)|(<=)|(>=)|(<>)|(<<)|(>>)|(//))"),
        o = new RegExp("^((\\.\\.)|(\\+=)|(\\-=)|(\\*=)|(%=)|(/=)|(&=)|(\\|=)|(\\^=))"), u = new RegExp("^((\\.\\.\\.)|(//=)|(>>=)|(<<=)|(\\*\\*=))"),
        a = new RegExp("^[_A-Za-z$][_A-Za-z$0-9]*"), f = new RegExp("^(@|this.)[_A-Za-z$][_A-Za-z$0-9]*"),
        l = n(["and", "or", "not", "is", "isnt", "in", "instanceof", "typeof"]),
        c = ["for", "while", "loop", "if", "unless", "else", "switch", "try", "catch", "finally", "class"],
        h = ["break", "by", "continue", "debugger", "delete", "do", "in", "of", "new", "return", "then", "this", "throw", "when", "until"], p = n(c.concat(h));
    c = n(c);
    var d = new RegExp("^('{3}|\"{3}|['\"])"), v = new RegExp("^(/{3}|/)"), m = ["Infinity", "NaN", "undefined", "null", "true", "false", "on", "off", "yes", "no"], g = n(m),
        T = {
            startState: function (e) {
                return {tokenize: y, scopes: [{offset: e || 0, type: "coffee"}], lastToken: null, lambda: !1, dedent: 0}
            }, token: function (e, t) {
                var n = x(e, t);
                return t.lastToken = {style: n, content: e.current()}, e.eol() && e.lambda && (t.lambda = !1), n
            }, indent: function (e, t) {
                return e.tokenize != y ? 0 : e.scopes[0].offset
            }
        };
    return T
}), CodeMirror.defineMIME("text/x-coffeescript", "coffeescript"), CodeMirror.defineMode("css", function (e) {
    function i(e) {
        var t = {};
        for (var n = 0; n < e.length; ++n)t[e[n]] = !0;
        return t
    }

    function s(e, t) {
        return n = t, e
    }

    function o(e, t) {
        var n = e.next();
        if (n == "@")return e.eatWhile(/[\w\\\-]/), s("meta", e.current());
        if (n == "/" && e.eat("*"))return t.tokenize = u, u(e, t);
        if (n == "<" && e.eat("!"))return t.tokenize = a, a(e, t);
        if (n != "=")return n != "~" && n != "|" || !e.eat("=") ? n == '"' || n == "'" ? (t.tokenize = f(n), t.tokenize(e, t)) : n == "#" ? (e.eatWhile(/[\w\\\-]/), s("atom", "hash")) : n == "!" ? (e.match(/^\s*\w*/), s("keyword", "important")) : /\d/.test(n) ? (e.eatWhile(/[\w.%]/), s("number", "unit")) : /[,.+>*\/]/.test(n) ? s(null, "select-op") : /[;{}:\[\]]/.test(n) ? s(null, n) : (e.eatWhile(/[\w\\\-]/), s("variable", "variable")) : s(null, "compare");
        s(null, "compare")
    }

    function u(e, t) {
        var n = !1, r;
        while ((r = e.next()) != null) {
            if (n && r == "/") {
                t.tokenize = o;
                break
            }
            n = r == "*"
        }
        return s("comment", "comment")
    }

    function a(e, t) {
        var n = 0, r;
        while ((r = e.next()) != null) {
            if (n >= 2 && r == ">") {
                t.tokenize = o;
                break
            }
            n = r == "-" ? n + 1 : 0
        }
        return s("comment", "comment")
    }

    function f(e) {
        return function (t, n) {
            var r = !1, i;
            while ((i = t.next()) != null) {
                if (i == e && !r)break;
                r = !r && i == "\\"
            }
            return r || (n.tokenize = o), s("string", "string")
        }
    }

    var t = e.indentUnit, n,
        r = i(["above", "absolute", "activeborder", "activecaption", "afar", "after-white-space", "ahead", "alias", "all", "all-scroll", "alternate", "always", "amharic", "amharic-abegede", "antialiased", "appworkspace", "arabic-indic", "armenian", "asterisks", "auto", "avoid", "background", "backwards", "baseline", "below", "bidi-override", "binary", "bengali", "blink", "block", "block-axis", "bold", "bolder", "border", "border-box", "both", "bottom", "break-all", "break-word", "button", "button-bevel", "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "cambodian", "capitalize", "caps-lock-indicator", "caption", "captiontext", "caret", "cell", "center", "checkbox", "circle", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic", "clear", "clip", "close-quote", "col-resize", "collapse", "compact", "condensed", "contain", "content", "content-box", "context-menu", "continuous", "copy", "cover", "crop", "cross", "crosshair", "currentcolor", "cursive", "dashed", "decimal", "decimal-leading-zero", "default", "default-button", "destination-atop", "destination-in", "destination-out", "destination-over", "devanagari", "disc", "discard", "document", "dot-dash", "dot-dot-dash", "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out", "element", "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede", "ethiopic-abegede-am-et", "ethiopic-abegede-gez", "ethiopic-abegede-ti-er", "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er", "ethiopic-halehame-aa-et", "ethiopic-halehame-am-et", "ethiopic-halehame-gez", "ethiopic-halehame-om-et", "ethiopic-halehame-sid-et", "ethiopic-halehame-so-et", "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig", "ew-resize", "expanded", "extra-condensed", "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "footnotes", "forwards", "from", "geometricPrecision", "georgian", "graytext", "groove", "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hebrew", "help", "hidden", "hide", "higher", "highlight", "highlighttext", "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "icon", "ignore", "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite", "infobackground", "infotext", "inherit", "initial", "inline", "inline-axis", "inline-block", "inline-table", "inset", "inside", "intrinsic", "invert", "italic", "justify", "kannada", "katakana", "katakana-iroha", "khmer", "landscape", "lao", "large", "larger", "left", "level", "lighter", "line-through", "linear", "lines", "list-item", "listbox", "listitem", "local", "logical", "loud", "lower", "lower-alpha", "lower-armenian", "lower-greek", "lower-hexadecimal", "lower-latin", "lower-norwegian", "lower-roman", "lowercase", "ltr", "malayalam", "match", "media-controls-background", "media-current-time-display", "media-fullscreen-button", "media-mute-button", "media-play-button", "media-return-to-realtime-button", "media-rewind-button", "media-seek-back-button", "media-seek-forward-button", "media-slider", "media-sliderthumb", "media-time-remaining-display", "media-volume-slider", "media-volume-slider-container", "media-volume-sliderthumb", "medium", "menu", "menulist", "menulist-button", "menulist-text", "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic", "mix", "mongolian", "monospace", "move", "multiple", "myanmar", "n-resize", "narrower", "navy", "ne-resize", "nesw-resize", "no-close-quote", "no-drop", "no-open-quote", "no-repeat", "none", "normal", "not-allowed", "nowrap", "ns-resize", "nw-resize", "nwse-resize", "oblique", "octal", "open-quote", "optimizeLegibility", "optimizeSpeed", "oriya", "oromo", "outset", "outside", "overlay", "overline", "padding", "padding-box", "painted", "paused", "persian", "plus-darker", "plus-lighter", "pointer", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "push-button", "radio", "read-only", "read-write", "read-write-plaintext-only", "relative", "repeat", "repeat-x", "repeat-y", "reset", "reverse", "rgb", "rgba", "ridge", "right", "round", "row-resize", "rtl", "run-in", "running", "s-resize", "sans-serif", "scroll", "scrollbar", "se-resize", "searchfield", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button", "searchfield-results-decoration", "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama", "single", "skip-white-space", "slide", "slider-horizontal", "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow", "small", "small-caps", "small-caption", "smaller", "solid", "somali", "source-atop", "source-in", "source-out", "source-over", "space", "square", "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub", "subpixel-antialiased", "super", "sw-resize", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group", "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai", "thick", "thin", "threeddarkshadow", "threedface", "threedhighlight", "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er", "tigrinya-er-abegede", "tigrinya-et", "tigrinya-et-abegede", "to", "top", "transparent", "ultra-condensed", "ultra-expanded", "underline", "up", "upper-alpha", "upper-armenian", "upper-greek", "upper-hexadecimal", "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url", "vertical", "vertical-text", "visible", "visibleFill", "visiblePainted", "visibleStroke", "visual", "w-resize", "wait", "wave", "white", "wider", "window", "windowframe", "windowtext", "x-large", "x-small", "xor", "xx-large", "xx-small", "yellow", "-wap-marquee", "-webkit-activelink", "-webkit-auto", "-webkit-baseline-middle", "-webkit-body", "-webkit-box", "-webkit-center", "-webkit-control", "-webkit-focus-ring-color", "-webkit-grab", "-webkit-grabbing", "-webkit-gradient", "-webkit-inline-box", "-webkit-left", "-webkit-link", "-webkit-marquee", "-webkit-mini-control", "-webkit-nowrap", "-webkit-pictograph", "-webkit-right", "-webkit-small-control", "-webkit-text", "-webkit-xxx-large", "-webkit-zoom-in", "-webkit-zoom-out"]);
    return {
        startState: function (e) {
            return {tokenize: o, baseIndent: e || 0, stack: []}
        }, token: function (e, t) {
            if (e.eatSpace())return null;
            var i = t.tokenize(e, t), s = t.stack[t.stack.length - 1];
            if (n == "hash" && s != "rule") i = "string-2"; else if (i == "variable")if (s == "rule") i = r[e.current()] ? "keyword" : "number"; else if (!s || s == "@media{") i = "tag";
            return s == "rule" && /^[\{\};]$/.test(n) && t.stack.pop(), n == "{" ? s == "@media" ? t.stack[t.stack.length - 1] = "@media{" : t.stack.push("{") : n == "}" ? t.stack.pop() : n == "@media" ? t.stack.push("@media") : s == "{" && n != "comment" && t.stack.push("rule"), i
        }, indent: function (e, n) {
            var r = e.stack.length;
            return /^\}/.test(n) && (r -= e.stack[e.stack.length - 1] == "rule" ? 2 : 1), e.baseIndent + r * t
        }, electricChars: "}"
    }
}), CodeMirror.defineMIME("text/css", "css"), CodeMirror.defineMode("diff", function () {
    var e = {"+": "tag", "-": "string", "@": "meta"};
    return {
        token: function (t) {
            var n = t.string.search(/[\t ]+?$/);
            if (!t.sol() || n === 0)return t.skipToEnd(), ("error " + (e[t.string.charAt(0)] || "")).replace(/ $/, "");
            var r = e[t.peek()] || t.skipToEnd();
            return n === -1 ? t.skipToEnd() : t.pos = n, r
        }
    }
}), CodeMirror.defineMIME("text/x-diff", "diff"), CodeMirror.defineMode("ecl", function (e) {
    function t(e) {
        var t = {}, n = e.split(" ");
        for (var r = 0; r < n.length; ++r)t[n[r]] = !0;
        return t
    }

    function n(e, t) {
        return t.startOfLine ? (e.skipToEnd(), "meta") : !1
    }

    function r(e, t) {
        var n;
        while ((n = e.next()) != null)if (n == '"' && !e.eat('"')) {
            t.tokenize = null;
            break
        }
        return "string"
    }

    function m(e, t) {
        var n = e.next();
        if (h[n]) {
            var r = h[n](e, t);
            if (r !== !1)return r
        }
        if (n == '"' || n == "'")return t.tokenize = g(n), t.tokenize(e, t);
        if (/[\[\]{}\(\),;\:\.]/.test(n))return v = n, null;
        if (/\d/.test(n))return e.eatWhile(/[\w\.]/), "number";
        if (n == "/") {
            if (e.eat("*"))return t.tokenize = y, y(e, t);
            if (e.eat("/"))return e.skipToEnd(), "comment"
        }
        if (d.test(n))return e.eatWhile(d), "operator";
        e.eatWhile(/[\w\$_]/);
        var i = e.current().toLowerCase();
        if (s.propertyIsEnumerable(i))return l.propertyIsEnumerable(i) && (v = "newstatement"), "keyword";
        if (o.propertyIsEnumerable(i))return l.propertyIsEnumerable(i) && (v = "newstatement"), "variable";
        if (u.propertyIsEnumerable(i))return l.propertyIsEnumerable(i) && (v = "newstatement"), "variable-2";
        if (a.propertyIsEnumerable(i))return l.propertyIsEnumerable(i) && (v = "newstatement"), "variable-3";
        if (f.propertyIsEnumerable(i))return l.propertyIsEnumerable(i) && (v = "newstatement"), "builtin";
        var p = i.length - 1;
        while (p >= 0 && (!isNaN(i[p]) || i[p] == "_"))--p;
        if (p > 0) {
            var m = i.substr(0, p + 1);
            if (a.propertyIsEnumerable(m))return l.propertyIsEnumerable(m) && (v = "newstatement"), "variable-3"
        }
        return c.propertyIsEnumerable(i) ? "atom" : null
    }

    function g(e) {
        return function (t, n) {
            var r = !1, i, s = !1;
            while ((i = t.next()) != null) {
                if (i == e && !r) {
                    s = !0;
                    break
                }
                r = !r && i == "\\"
            }
            if (s || !r && !p) n.tokenize = m;
            return "string"
        }
    }

    function y(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "/" && n) {
                t.tokenize = m;
                break
            }
            n = r == "*"
        }
        return "comment"
    }

    function b(e, t, n, r, i) {
        this.indented = e, this.column = t, this.type = n, this.align = r, this.prev = i
    }

    function w(e, t, n) {
        return e.context = new b(e.indented, t, n, null, e.context)
    }

    function E(e) {
        var t = e.context.type;
        if (t == ")" || t == "]" || t == "}") e.indented = e.context.indented;
        return e.context = e.context.prev
    }

    var i = e.indentUnit,
        s = t("abs acos allnodes ascii asin asstring atan atan2 ave case choose choosen choosesets clustersize combine correlation cos cosh count covariance cron dataset dedup define denormalize distribute distributed distribution ebcdic enth error evaluate event eventextra eventname exists exp failcode failmessage fetch fromunicode getisvalid global graph group hash hash32 hash64 hashcrc hashmd5 having if index intformat isvalid iterate join keyunicode length library limit ln local log loop map matched matchlength matchposition matchtext matchunicode max merge mergejoin min nolocal nonempty normalize parse pipe power preload process project pull random range rank ranked realformat recordof regexfind regexreplace regroup rejected rollup round roundup row rowdiff sample set sin sinh sizeof soapcall sort sorted sqrt stepped stored sum table tan tanh thisnode topn tounicode transfer trim truncate typeof ungroup unicodeorder variance which workunit xmldecode xmlencode xmltext xmlunicode"),
        o = t("apply assert build buildindex evaluate fail keydiff keypatch loadxml nothor notify output parallel sequential soapcall wait"),
        u = t("__compressed__ all and any as atmost before beginc++ best between case const counter csv descend encrypt end endc++ endmacro except exclusive expire export extend false few first flat from full function group header heading hole ifblock import in interface joined keep keyed last left limit load local locale lookup macro many maxcount maxlength min skew module named nocase noroot noscan nosort not of only opt or outer overwrite packed partition penalty physicallength pipe quote record relationship repeat return right scan self separator service shared skew skip sql store terminator thor threshold token transform trim true type unicodeorder unsorted validate virtual whole wild within xml xpath"),
        a = t("ascii big_endian boolean data decimal ebcdic integer pattern qstring real record rule set of string token udecimal unicode unsigned varstring varunicode"),
        f = t("checkpoint deprecated failcode failmessage failure global independent onwarning persist priority recovery stored success wait when"),
        l = t("catch class do else finally for if switch try while"), c = t("true false null"), h = {"#": n}, p, d = /[+\-*&%=<>!?|\/]/, v;
    return {
        startState: function (e) {
            return {tokenize: null, context: new b((e || 0) - i, 0, "top", !1), indented: 0, startOfLine: !0}
        }, token: function (e, t) {
            var n = t.context;
            e.sol() && (n.align == null && (n.align = !1), t.indented = e.indentation(), t.startOfLine = !0);
            if (e.eatSpace())return null;
            v = null;
            var r = (t.tokenize || m)(e, t);
            if (r == "comment" || r == "meta")return r;
            n.align == null && (n.align = !0);
            if (v != ";" && v != ":" || n.type != "statement")if (v == "{") w(t, e.column(), "}"); else if (v == "[") w(t, e.column(), "]"); else if (v == "(") w(t, e.column(), ")"); else if (v == "}") {
                while (n.type == "statement")n = E(t);
                n.type == "}" && (n = E(t));
                while (n.type == "statement")n = E(t)
            } else v == n.type ? E(t) : (n.type == "}" || n.type == "top" || n.type == "statement" && v == "newstatement") && w(t, e.column(), "statement"); else E(t);
            return t.startOfLine = !1, r
        }, indent: function (e, t) {
            if (e.tokenize != m && e.tokenize != null)return 0;
            var n = e.context, r = t && t.charAt(0);
            n.type == "statement" && r == "}" && (n = n.prev);
            var s = r == n.type;
            return n.type == "statement" ? n.indented + (r == "{" ? 0 : i) : n.align ? n.column + (s ? 0 : 1) : n.indented + (s ? 0 : i)
        }, electricChars: "{}"
    }
}), CodeMirror.defineMIME("text/x-ecl", "ecl"), CodeMirror.defineMIME("text/x-erlang", "erlang"), CodeMirror.defineMode("erlang", function (e, t) {
    function n(e, t, n) {
        n == "record" ? e.context = "record" : e.context = !1, n != "whitespace" && n != "comment" && (e.lastToken = t.current());
        switch (n) {
            case"atom":
                return "atom";
            case"attribute":
                return "attribute";
            case"builtin":
                return "builtin";
            case"comment":
                return "comment";
            case"fun":
                return "meta";
            case"function":
                return "tag";
            case"guard":
                return "property";
            case"keyword":
                return "keyword";
            case"macro":
                return "variable-2";
            case"number":
                return "number";
            case"operator":
                return "operator";
            case"record":
                return "bracket";
            case"string":
                return "string";
            case"type":
                return "def";
            case"variable":
                return "variable";
            case"error":
                return "error";
            case"separator":
                return null;
            case"open_paren":
                return null;
            case"close_paren":
                return null;
            default:
                return null
        }
    }

    function S(e, t) {
        return -1 < t.indexOf(e)
    }

    function x(e, t) {
        var n = e.start, r = t.length;
        if (r <= n) {
            var i = e.string.slice(n - r, n);
            return i == t
        }
        return !1
    }

    function T(e, t) {
        if (e.eatSpace())return n(t, e, "whitespace");
        if ((P(t).token == "" || P(t).token == ".") && e.peek() == "-") {
            e.next();
            if (e.eat(p) && e.eatWhile(g))return S(e.current(), r) ? n(t, e, "type") : n(t, e, "attribute");
            e.backUp(1)
        }
        var h = e.next();
        if (h == "%")return e.skipToEnd(), n(t, e, "comment");
        if (h == "?")return e.eatWhile(g), n(t, e, "macro");
        if (h == "#")return e.eatWhile(g), n(t, e, "record");
        if (h == "$")return e.next() == "\\" && (e.eatWhile(m) || e.next()), n(t, e, "string");
        if (h == "'")return L(e) ? n(t, e, "atom") : n(t, e, "error");
        if (h == '"')return k(e) ? n(t, e, "string") : n(t, e, "error");
        if (d.test(h))return e.eatWhile(g), n(t, e, "variable");
        if (p.test(h)) {
            e.eatWhile(g);
            if (e.peek() == "/")return e.next(), e.eatWhile(v) ? n(t, e, "fun") : (e.backUp(1), n(t, e, "atom"));
            var T = e.current();
            return S(T, i) ? (H(t, e), n(t, e, "keyword")) : e.peek() == "(" ? S(T, c) && (!x(e, ":") || x(e, "erlang:")) ? n(t, e, "builtin") : n(t, e, "function") : S(T, l) ? n(t, e, "guard") : S(T, o) ? n(t, e, "operator") : e.peek() == ":" ? T == "erlang" ? n(t, e, "builtin") : n(t, e, "function") : n(t, e, "atom")
        }
        return v.test(h) ? (e.eatWhile(v), e.eat("#") ? e.eatWhile(v) : (e.eat(".") && e.eatWhile(v), e.eat(/[eE]/) && (e.eat(/[-+]/), e.eatWhile(v))), n(t, e, "number")) : N(e, b, a) ? (H(t, e), n(t, e, "open_paren")) : N(e, w, f) ? (H(t, e), n(t, e, "close_paren")) : C(e, E, s) ? (t.context == 0 && H(t, e), n(t, e, "separator")) : C(e, y, u) ? n(t, e, "operator") : n(t, e, null)
    }

    function N(e, t, n) {
        if (e.current().length == 1 && t.test(e.current())) {
            e.backUp(1);
            while (t.test(e.peek())) {
                e.next();
                if (S(e.current(), n))return !0
            }
            e.backUp(e.current().length - 1)
        }
        return !1
    }

    function C(e, t, n) {
        if (e.current().length == 1 && t.test(e.current())) {
            while (t.test(e.peek()))e.next();
            while (0 < e.current().length) {
                if (S(e.current(), n))return !0;
                e.backUp(1)
            }
            e.next()
        }
        return !1
    }

    function k(e) {
        return A(e, '"', "\\")
    }

    function L(e) {
        return A(e, "'", "\\")
    }

    function A(e, t, n) {
        while (!e.eol()) {
            var r = e.next();
            if (r == t)return !0;
            r == n && e.next()
        }
        return !1
    }

    function O(e) {
        this.token = e ? e.current() : "", this.column = e ? e.column() : 0, this.indent = e ? e.indentation() : 0
    }

    function M(t, n) {
        var r = e.indentUnit, i = ["after", "catch"], s = P(t).token, o = _(n, /[^a-z]/);
        return S(s, a) ? P(t).column + s.length : s == "." || s == "" ? 0 : s == "->" ? o == "end" ? P(t, 2).column : P(t, 2).token == "fun" ? P(t, 2).column + r : P(t).indent + r : S(o, i) ? P(t).indent : P(t).column + r
    }

    function _(e, t) {
        var n = e.match(t);
        return n ? e.slice(0, n.index) : e
    }

    function D(e) {
        return e.tokenStack.pop()
    }

    function P(e, t) {
        var n = e.tokenStack.length, r = t ? t : 1;
        return n < r ? new O : e.tokenStack[n - r]
    }

    function H(e, t) {
        var n = t.current(), r = P(e).token;
        return S(n, h) ? !1 : j(r, n) ? (D(e), !1) : B(r, n) ? (D(e), H(e, t)) : (e.tokenStack.push(new O(t)), !0)
    }

    function B(e, t) {
        switch (e + " " + t) {
            case"when ->":
                return !0;
            case"-> end":
                return !0;
            case"-> .":
                return !0;
            case". .":
                return !0;
            default:
                return !1
        }
    }

    function j(e, t) {
        switch (e + " " + t) {
            case"( )":
                return !0;
            case"[ ]":
                return !0;
            case"{ }":
                return !0;
            case"<< >>":
                return !0;
            case"begin end":
                return !0;
            case"case end":
                return !0;
            case"fun end":
                return !0;
            case"if end":
                return !0;
            case"receive end":
                return !0;
            case"try end":
                return !0;
            case"-> ;":
                return !0;
            default:
                return !1
        }
    }

    var r = ["-type", "-spec", "-export_type", "-opaque"], i = ["after", "begin", "catch", "case", "cond", "end", "fun", "if", "let", "of", "query", "receive", "try", "when"],
        s = ["->", ";", ":", ".", ","], o = ["and", "andalso", "band", "bnot", "bor", "bsl", "bsr", "bxor", "div", "not", "or", "orelse", "rem", "xor"],
        u = ["+", "-", "*", "/", ">", ">=", "<", "=<", "=:=", "==", "=/=", "/=", "||", "<-"], a = ["<<", "(", "[", "{"], f = ["}", "]", ")", ">>"],
        l = ["is_atom", "is_binary", "is_bitstring", "is_boolean", "is_float", "is_function", "is_integer", "is_list", "is_number", "is_pid", "is_port", "is_record", "is_reference", "is_tuple", "atom", "binary", "bitstring", "boolean", "function", "integer", "list", "number", "pid", "port", "record", "reference", "tuple"],
        c = ["abs", "adler32", "adler32_combine", "alive", "apply", "atom_to_binary", "atom_to_list", "binary_to_atom", "binary_to_existing_atom", "binary_to_list", "binary_to_term", "bit_size", "bitstring_to_list", "byte_size", "check_process_code", "contact_binary", "crc32", "crc32_combine", "date", "decode_packet", "delete_module", "disconnect_node", "element", "erase", "exit", "float", "float_to_list", "garbage_collect", "get", "get_keys", "group_leader", "halt", "hd", "integer_to_list", "internal_bif", "iolist_size", "iolist_to_binary", "is_alive", "is_atom", "is_binary", "is_bitstring", "is_boolean", "is_float", "is_function", "is_integer", "is_list", "is_number", "is_pid", "is_port", "is_process_alive", "is_record", "is_reference", "is_tuple", "length", "link", "list_to_atom", "list_to_binary", "list_to_bitstring", "list_to_existing_atom", "list_to_float", "list_to_integer", "list_to_pid", "list_to_tuple", "load_module", "make_ref", "module_loaded", "monitor_node", "node", "node_link", "node_unlink", "nodes", "notalive", "now", "open_port", "pid_to_list", "port_close", "port_command", "port_connect", "port_control", "pre_loaded", "process_flag", "process_info", "processes", "purge_module", "put", "register", "registered", "round", "self", "setelement", "size", "spawn", "spawn_link", "spawn_monitor", "spawn_opt", "split_binary", "statistics", "term_to_binary", "time", "throw", "tl", "trunc", "tuple_size", "tuple_to_list", "unlink", "unregister", "whereis"],
        h = [",", ":", "catch", "after", "of", "cond", "let", "query"], p = /[a-z_]/, d = /[A-Z_]/, v = /[0-9]/, m = /[0-7]/, g = /[a-z_A-Z0-9]/, y = /[\+\-\*\/<>=\|:]/,
        b = /[<\(\[\{]/, w = /[>\)\]\}]/, E = /[\->\.,:;]/;
    return {
        startState: function () {
            return {tokenStack: [], context: !1, lastToken: null}
        }, token: function (e, t) {
            return T(e, t)
        }, indent: function (e, t) {
            return M(e, t)
        }
    }
}), CodeMirror.defineMode("gfm", function (e, t) {
    function s(e, t) {
        return e.sol() && e.match(/^```([\w+#]*)/) ? (t.localMode = i(RegExp.$1), t.localMode && (t.localState = t.localMode.startState()), t.token = o, "code") : n.token(e, t.mdState)
    }

    function o(e, t) {
        return e.sol() && e.match(/^```/) ? (t.localMode = t.localState = null, t.token = s, "code") : t.localMode ? t.localMode.token(e, t.localState) : (e.skipToEnd(), "code")
    }

    function u(e, t) {
        var r;
        if (e.match(/^\w+:\/\/\S+/))return "link";
        if (e.match(/^[^\[*\\<>` _][^\[*\\<>` ]*[^\[*\\<>` _]/))return n.getType(t);
        if (r = e.match(/^[^\[*\\<>` ]+/)) {
            var i = r[0];
            return i[0] === "_" && i[i.length - 1] === "_" ? (e.backUp(i.length), undefined) : n.getType(t)
        }
        if (e.eatSpace())return null
    }

    var n = CodeMirror.getMode(e, "markdown"), r = {
        html: "htmlmixed",
        js: "javascript",
        json: "application/json",
        c: "text/x-csrc",
        "c++": "text/x-c++src",
        java: "text/x-java",
        csharp: "text/x-csharp",
        "c#": "text/x-csharp"
    }, i = function () {
        var t, n = {}, i = {}, s, o = CodeMirror.listModes();
        for (t = 0; t < o.length; t++)n[o[t]] = o[t];
        var u = CodeMirror.listMIMEs();
        for (t = 0; t < u.length; t++)s = u[t].mime, i[s] = u[t].mime;
        for (var a in r)if (r[a] in n || r[a] in i) n[a] = r[a];
        return function (t) {
            return n[t] ? CodeMirror.getMode(e, n[t]) : null
        }
    }();
    return {
        startState: function () {
            var e = n.startState();
            return e.text = u, {token: s, mode: "markdown", mdState: e, localMode: null, localState: null}
        }, copyState: function (e) {
            return {
                token: e.token,
                mode: e.mode,
                mdState: CodeMirror.copyState(n, e.mdState),
                localMode: e.localMode,
                localState: e.localMode ? CodeMirror.copyState(e.localMode, e.localState) : null
            }
        }, token: function (e, t) {
            var n;
            if ((n = e.peek()) != undefined && n == "[") {
                e.next();
                if ((n = e.peek()) == undefined || n != "[")return e.backUp(1), t.token(e, t);
                while ((n = e.next()) != undefined && n != "]");
                if (n == "]" && (n = e.next()) != undefined && n == "]")return "link";
                e.backUp(1)
            }
            return e.match(/^\$[^\$]+\$/) ? "string" : e.match(/^\\\((.*?)\\\)/) ? "string" : e.match(/^\$\$[^\$]+\$\$/) ? "string" : e.match(/^\\\[(.*?)\\\]/) ? "string" : t.token(e, t)
        }
    }
}, "markdown"), CodeMirror.defineMode("go", function (e, t) {
    function a(e, t) {
        var n = e.next();
        if (n == '"' || n == "'" || n == "`")return t.tokenize = f(n), t.tokenize(e, t);
        if (/[\d\.]/.test(n))return n == "." ? e.match(/^[0-9]+([eE][\-+]?[0-9]+)?/) : n == "0" ? e.match(/^[xX][0-9a-fA-F]+/) || e.match(/^0[0-7]+/) : e.match(/^[0-9]*\.?[0-9]*([eE][\-+]?[0-9]+)?/), "number";
        if (/[\[\]{}\(\),;\:\.]/.test(n))return u = n, null;
        if (n == "/") {
            if (e.eat("*"))return t.tokenize = l, l(e, t);
            if (e.eat("/"))return e.skipToEnd(), "comment"
        }
        if (o.test(n))return e.eatWhile(o), "operator";
        e.eatWhile(/[\w\$_]/);
        var s = e.current();
        if (r.propertyIsEnumerable(s)) {
            if (s == "case" || s == "default") u = "case";
            return "keyword"
        }
        return i.propertyIsEnumerable(s) ? "atom" : "variable"
    }

    function f(e) {
        return function (t, n) {
            var r = !1, i, s = !1;
            while ((i = t.next()) != null) {
                if (i == e && !r) {
                    s = !0;
                    break
                }
                r = !r && i == "\\"
            }
            if (s || !r && e != "`") n.tokenize = a;
            return "string"
        }
    }

    function l(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "/" && n) {
                t.tokenize = a;
                break
            }
            n = r == "*"
        }
        return "comment"
    }

    function c(e, t, n, r, i) {
        this.indented = e, this.column = t, this.type = n, this.align = r, this.prev = i
    }

    function h(e, t, n) {
        return e.context = new c(e.indented, t, n, null, e.context)
    }

    function p(e) {
        var t = e.context.type;
        if (t == ")" || t == "]" || t == "}") e.indented = e.context.indented;
        return e.context = e.context.prev
    }

    var n = e.indentUnit, r = {
        "break": !0,
        "case": !0,
        chan: !0,
        "const": !0,
        "continue": !0,
        "default": !0,
        defer: !0,
        "else": !0,
        fallthrough: !0,
        "for": !0,
        func: !0,
        go: !0,
        "goto": !0,
        "if": !0,
        "import": !0,
        "interface": !0,
        map: !0,
        "package": !0,
        range: !0,
        "return": !0,
        select: !0,
        struct: !0,
        "switch": !0,
        type: !0,
        "var": !0,
        bool: !0,
        "byte": !0,
        complex64: !0,
        complex128: !0,
        float32: !0,
        float64: !0,
        int8: !0,
        int16: !0,
        int32: !0,
        int64: !0,
        string: !0,
        uint8: !0,
        uint16: !0,
        uint32: !0,
        uint64: !0,
        "int": !0,
        uint: !0,
        uintptr: !0
    }, i = {
        "true": !0,
        "false": !0,
        iota: !0,
        nil: !0,
        append: !0,
        cap: !0,
        close: !0,
        complex: !0,
        copy: !0,
        imag: !0,
        len: !0,
        make: !0,
        "new": !0,
        panic: !0,
        print: !0,
        println: !0,
        real: !0,
        recover: !0
    }, s = {"else": !0, "for": !0, func: !0, "if": !0, "interface": !0, select: !0, struct: !0, "switch": !0}, o = /[+\-*&^%:=<>!|\/]/, u;
    return {
        startState: function (e) {
            return {tokenize: null, context: new c((e || 0) - n, 0, "top", !1), indented: 0, startOfLine: !0}
        }, token: function (e, t) {
            var n = t.context;
            e.sol() && (n.align == null && (n.align = !1), t.indented = e.indentation(), t.startOfLine = !0, n.type == "case" && (n.type = "}"));
            if (e.eatSpace())return null;
            u = null;
            var r = (t.tokenize || a)(e, t);
            return r == "comment" ? r : (n.align == null && (n.align = !0), u == "{" ? h(t, e.column(), "}") : u == "[" ? h(t, e.column(), "]") : u == "(" ? h(t, e.column(), ")") : u == "case" ? n.type = "case" : u == "}" && n.type == "}" ? n = p(t) : u == n.type && p(t), t.startOfLine = !1, r)
        }, indent: function (e, t) {
            if (e.tokenize != a && e.tokenize != null)return 0;
            var r = e.context, i = t && t.charAt(0);
            if (r.type == "case" && /^(?:case|default)\b/.test(t))return e.context.type = "}", r.indented;
            var s = i == r.type;
            return r.align ? r.column + (s ? 0 : 1) : r.indented + (s ? 0 : n)
        }, electricChars: "{}:"
    }
}), CodeMirror.defineMIME("text/x-go", "go"), CodeMirror.defineMode("groovy", function (e, t) {
    function n(e) {
        var t = {}, n = e.split(" ");
        for (var r = 0; r < n.length; ++r)t[n[r]] = !0;
        return t
    }

    function u(e, t) {
        var n = e.next();
        if (n == '"' || n == "'")return a(n, e, t);
        if (/[\[\]{}\(\),;\:\.]/.test(n))return o = n, null;
        if (/\d/.test(n))return e.eatWhile(/[\w\.]/), e.eat(/eE/) && (e.eat(/\+\-/), e.eatWhile(/\d/)), "number";
        if (n == "/") {
            if (e.eat("*"))return t.tokenize.push(l), l(e, t);
            if (e.eat("/"))return e.skipToEnd(), "comment";
            if (c(t.lastToken))return a(n, e, t)
        }
        if (n == "-" && e.eat(">"))return o = "->", null;
        if (/[+\-*&%=<>!?|\/~]/.test(n))return e.eatWhile(/[+\-*&%=<>|~]/), "operator";
        e.eatWhile(/[\w\$_]/);
        if (n == "@")return e.eatWhile(/[\w\$_\.]/), "meta";
        if (t.lastToken == ".")return "property";
        if (e.eat(":"))return o = "proplabel", "property";
        var u = e.current();
        return s.propertyIsEnumerable(u) ? "atom" : r.propertyIsEnumerable(u) ? (i.propertyIsEnumerable(u) && (o = "newstatement"), "keyword") : "variable"
    }

    function a(e, t, n) {
        function i(t, n) {
            var i = !1, s, o = !r;
            while ((s = t.next()) != null) {
                if (s == e && !i) {
                    if (!r)break;
                    if (t.match(e + e)) {
                        o = !0;
                        break
                    }
                }
                if (e == '"' && s == "$" && !i && t.eat("{"))return n.tokenize.push(f()), "string";
                i = !i && s == "\\"
            }
            return o && n.tokenize.pop(), "string"
        }

        var r = !1;
        if (e != "/" && t.eat(e)) {
            if (!t.eat(e))return "string";
            r = !0
        }
        return n.tokenize.push(i), i(t, n)
    }

    function f() {
        function t(t, n) {
            if (t.peek() == "}") {
                e--;
                if (e == 0)return n.tokenize.pop(), n.tokenize[n.tokenize.length - 1](t, n)
            } else t.peek() == "{" && e++;
            return u(t, n)
        }

        var e = 1;
        return t.isBase = !0, t
    }

    function l(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "/" && n) {
                t.tokenize.pop();
                break
            }
            n = r == "*"
        }
        return "comment"
    }

    function c(e) {
        return !e || e == "operator" || e == "->" || /[\.\[\{\(,;:]/.test(e) || e == "newstatement" || e == "keyword" || e == "proplabel"
    }

    function h(e, t, n, r, i) {
        this.indented = e, this.column = t, this.type = n, this.align = r, this.prev = i
    }

    function p(e, t, n) {
        return e.context = new h(e.indented, t, n, null, e.context)
    }

    function d(e) {
        var t = e.context.type;
        if (t == ")" || t == "]" || t == "}") e.indented = e.context.indented;
        return e.context = e.context.prev
    }

    var r = n("abstract as assert boolean break byte case catch char class const continue def default do double else enum extends final finally float for goto if implements import in instanceof int interface long native new package private protected public return short static strictfp super switch synchronized threadsafe throw throws transient try void volatile while"),
        i = n("catch class do else finally for if switch try while enum interface def"), s = n("null true false this"), o;
    return u.isBase = !0, {
        startState: function (t) {
            return {tokenize: [u], context: new h((t || 0) - e.indentUnit, 0, "top", !1), indented: 0, startOfLine: !0, lastToken: null}
        }, token: function (e, t) {
            var n = t.context;
            e.sol() && (n.align == null && (n.align = !1), t.indented = e.indentation(), t.startOfLine = !0, n.type == "statement" && !c(t.lastToken) && (d(t), n = t.context));
            if (e.eatSpace())return null;
            o = null;
            var r = t.tokenize[t.tokenize.length - 1](e, t);
            if (r == "comment")return r;
            n.align == null && (n.align = !0);
            if (o != ";" && o != ":" || n.type != "statement")if (o == "->" && n.type == "statement" && n.prev.type == "}") d(t), t.context.align = !1; else if (o == "{") p(t, e.column(), "}"); else if (o == "[") p(t, e.column(), "]"); else if (o == "(") p(t, e.column(), ")"); else if (o == "}") {
                while (n.type == "statement")n = d(t);
                n.type == "}" && (n = d(t));
                while (n.type == "statement")n = d(t)
            } else o == n.type ? d(t) : (n.type == "}" || n.type == "top" || n.type == "statement" && o == "newstatement") && p(t, e.column(), "statement"); else d(t);
            return t.startOfLine = !1, t.lastToken = o || r, r
        }, indent: function (t, n) {
            if (!t.tokenize[t.tokenize.length - 1].isBase)return 0;
            var r = n && n.charAt(0), i = t.context;
            i.type == "statement" && !c(t.lastToken) && (i = i.prev);
            var s = r == i.type;
            return i.type == "statement" ? i.indented + (r == "{" ? 0 : e.indentUnit) : i.align ? i.column + (s ? 0 : 1) : i.indented + (s ? 0 : e.indentUnit)
        }, electricChars: "{}"
    }
}), CodeMirror.defineMIME("text/x-groovy", "groovy"), CodeMirror.defineMode("haskell", function (e, t) {
    function n(e, t, n) {
        return t(n), n(e, t)
    }

    function h(e, t) {
        if (e.eatWhile(c))return null;
        var h = e.next();
        if (l.test(h)) {
            if (h == "{" && e.eat("-")) {
                var v = "comment";
                return e.eat("#") && (v = "meta"), n(e, t, p(v, 1))
            }
            return null
        }
        if (h == "'")return e.eat("\\") ? e.next() : e.next(), e.eat("'") ? "string" : "error";
        if (h == '"')return n(e, t, d);
        if (i.test(h))return e.eatWhile(a), e.eat(".") ? "qualifier" : "variable-2";
        if (r.test(h))return e.eatWhile(a), "variable";
        if (s.test(h)) {
            if (h == "0") {
                if (e.eat(/[xX]/))return e.eatWhile(o), "integer";
                if (e.eat(/[oO]/))return e.eatWhile(u), "number"
            }
            e.eatWhile(s);
            var v = "number";
            return e.eat(".") && (v = "number", e.eatWhile(s)), e.eat(/[eE]/) && (v = "number", e.eat(/[-+]/), e.eatWhile(s)), v
        }
        if (f.test(h)) {
            if (h == "-" && e.eat(/-/)) {
                e.eatWhile(/-/);
                if (!e.eat(f))return e.skipToEnd(), "comment"
            }
            var v = "variable";
            return h == ":" && (v = "variable-2"), e.eatWhile(f), v
        }
        return "error"
    }

    function p(e, t) {
        return t == 0 ? h : function (n, r) {
            var i = t;
            while (!n.eol()) {
                var s = n.next();
                if (s == "{" && n.eat("-")) ++i; else if (s == "-" && n.eat("}")) {
                    --i;
                    if (i == 0)return r(h), e
                }
            }
            return r(p(e, i)), e
        }
    }

    function d(e, t) {
        while (!e.eol()) {
            var n = e.next();
            if (n == '"')return t(h), "string";
            if (n == "\\") {
                if (e.eol() || e.eat(c))return t(v), "string";
                e.eat("&") || e.next()
            }
        }
        return t(h), "error"
    }

    function v(e, t) {
        return e.eat("\\") ? n(e, t, d) : (e.next(), t(h), "error")
    }

    var r = /[a-z_]/, i = /[A-Z]/, s = /[0-9]/, o = /[0-9A-Fa-f]/, u = /[0-7]/, a = /[a-z_A-Z0-9']/, f = /[-!#$%&*+.\/<=>?@\\^|~:]/, l = /[(),;[\]`{}]/, c = /[ \t\v\f]/,
        m = function () {
            function t(t) {
                return function () {
                    for (var n = 0; n < arguments.length; n++)e[arguments[n]] = t
                }
            }

            var e = {};
            return t("keyword")("case", "class", "data", "default", "deriving", "do", "else", "foreign", "if", "import", "in", "infix", "infixl", "infixr", "instance", "let", "module", "newtype", "of", "then", "type", "where", "_"), t("keyword")("..", ":", "::", "=", "\\", '"', "<-", "->", "@", "~", "=>"), t("builtin")("!!", "$!", "$", "&&", "+", "++", "-", ".", "/", "/=", "<", "<=", "=<<", "==", ">", ">=", ">>", ">>=", "^", "^^", "||", "*", "**"), t("builtin")("Bool", "Bounded", "Char", "Double", "EQ", "Either", "Enum", "Eq", "False", "FilePath", "Float", "Floating", "Fractional", "Functor", "GT", "IO", "IOError", "Int", "Integer", "Integral", "Just", "LT", "Left", "Maybe", "Monad", "Nothing", "Num", "Ord", "Ordering", "Rational", "Read", "ReadS", "Real", "RealFloat", "RealFrac", "Right", "Show", "ShowS", "String", "True"), t("builtin")("abs", "acos", "acosh", "all", "and", "any", "appendFile", "asTypeOf", "asin", "asinh", "atan", "atan2", "atanh", "break", "catch", "ceiling", "compare", "concat", "concatMap", "const", "cos", "cosh", "curry", "cycle", "decodeFloat", "div", "divMod", "drop", "dropWhile", "either", "elem", "encodeFloat", "enumFrom", "enumFromThen", "enumFromThenTo", "enumFromTo", "error", "even", "exp", "exponent", "fail", "filter", "flip", "floatDigits", "floatRadix", "floatRange", "floor", "fmap", "foldl", "foldl1", "foldr", "foldr1", "fromEnum", "fromInteger", "fromIntegral", "fromRational", "fst", "gcd", "getChar", "getContents", "getLine", "head", "id", "init", "interact", "ioError", "isDenormalized", "isIEEE", "isInfinite", "isNaN", "isNegativeZero", "iterate", "last", "lcm", "length", "lex", "lines", "log", "logBase", "lookup", "map", "mapM", "mapM_", "max", "maxBound", "maximum", "maybe", "min", "minBound", "minimum", "mod", "negate", "not", "notElem", "null", "odd", "or", "otherwise", "pi", "pred", "print", "product", "properFraction", "putChar", "putStr", "putStrLn", "quot", "quotRem", "read", "readFile", "readIO", "readList", "readLn", "readParen", "reads", "readsPrec", "realToFrac", "recip", "rem", "repeat", "replicate", "return", "reverse", "round", "scaleFloat", "scanl", "scanl1", "scanr", "scanr1", "seq", "sequence", "sequence_", "show", "showChar", "showList", "showParen", "showString", "shows", "showsPrec", "significand", "signum", "sin", "sinh", "snd", "span", "splitAt", "sqrt", "subtract", "succ", "sum", "tail", "take", "takeWhile", "tan", "tanh", "toEnum", "toInteger", "toRational", "truncate", "uncurry", "undefined", "unlines", "until", "unwords", "unzip", "unzip3", "userError", "words", "writeFile", "zip", "zip3", "zipWith", "zipWith3"), e
        }();
    return {
        startState: function () {
            return {f: h}
        }, copyState: function (e) {
            return {f: e.f}
        }, token: function (e, t) {
            var n = t.f(e, function (e) {
                t.f = e
            }), r = e.current();
            return r in m ? m[r] : n
        }
    }
}), CodeMirror.defineMIME("text/x-haskell", "haskell"), CodeMirror.defineMode("haxe", function (e, t) {
    function s(e, t, n) {
        return t.tokenize = n, n(e, t)
    }

    function o(e, t) {
        var n = !1, r;
        while ((r = e.next()) != null) {
            if (r == t && !n)return !1;
            n = !n && r == "\\"
        }
        return n
    }

    function f(e, t, n) {
        return u = e, a = n, t
    }

    function l(e, t) {
        var n = e.next();
        if (n == '"' || n == "'")return s(e, t, c(n));
        if (/[\[\]{}\(\),;\:\.]/.test(n))return f(n);
        if (n == "0" && e.eat(/x/i))return e.eatWhile(/[\da-f]/i), f("number", "number");
        if (/\d/.test(n) || n == "-" && e.eat(/\d/))return e.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/), f("number", "number");
        if (t.reAllowed && n == "~" && e.eat(/\//))return o(e, "/"), e.eatWhile(/[gimsu]/), f("regexp", "string-2");
        if (n == "/")return e.eat("*") ? s(e, t, h) : e.eat("/") ? (e.skipToEnd(), f("comment", "comment")) : (e.eatWhile(i), f("operator", null, e.current()));
        if (n == "#")return e.skipToEnd(), f("conditional", "meta");
        if (n == "@")return e.eat(/:/), e.eatWhile(/[\w_]/), f("metadata", "meta");
        if (i.test(n))return e.eatWhile(i), f("operator", null, e.current());
        var u;
        if (/[A-Z]/.test(n))return e.eatWhile(/[\w_<>]/), u = e.current(), f("type", "variable-3", u);
        e.eatWhile(/[\w_]/);
        var u = e.current(), a = r.propertyIsEnumerable(u) && r[u];
        return a && t.kwAllowed ? f(a.type, a.style, u) : f("variable", "variable", u)
    }

    function c(e) {
        return function (t, n) {
            return o(t, e) || (n.tokenize = l), f("string", "string")
        }
    }

    function h(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "/" && n) {
                t.tokenize = l;
                break
            }
            n = r == "*"
        }
        return f("comment", "comment")
    }

    function d(e, t, n, r, i, s) {
        this.indented = e, this.column = t, this.type = n, this.prev = i, this.info = s, r != null && (this.align = r)
    }

    function v(e, t) {
        for (var n = e.localVars; n; n = n.next)if (n.name == t)return !0
    }

    function m(e, t, n, r, i) {
        var s = e.cc;
        b.state = e, b.stream = i, b.marked = null, b.cc = s, e.lexical.hasOwnProperty("align") || (e.lexical.align = !0);
        for (; ;) {
            var o = s.length ? s.pop() : A;
            if (o(n, r)) {
                while (s.length && s[s.length - 1].lex)s.pop()();
                return b.marked ? b.marked : n == "variable" && v(e, r) ? "variable-2" : n == "variable" && g(e, r) ? "variable-3" : t
            }
        }
    }

    function g(e, t) {
        if (/[a-z]/.test(t.charAt(0)))return !1;
        var n = e.importedtypes.length;
        for (var r = 0; r < n; r++)if (e.importedtypes[r] == t)return !0
    }

    function y(e) {
        var t = b.state;
        for (var n = t.importedtypes; n; n = n.next)if (n.name == e)return;
        t.importedtypes = {name: e, next: t.importedtypes}
    }

    function w() {
        for (var e = arguments.length - 1; e >= 0; e--)b.cc.push(arguments[e])
    }

    function E() {
        return w.apply(null, arguments), !0
    }

    function S(e) {
        var t = b.state;
        if (t.context) {
            b.marked = "def";
            for (var n = t.localVars; n; n = n.next)if (n.name == e)return;
            t.localVars = {name: e, next: t.localVars}
        }
    }

    function T() {
        b.state.context || (b.state.localVars = x), b.state.context = {prev: b.state.context, vars: b.state.localVars}
    }

    function N() {
        b.state.localVars = b.state.context.vars, b.state.context = b.state.context.prev
    }

    function C(e, t) {
        var n = function () {
            var n = b.state;
            n.lexical = new d(n.indented, b.stream.column(), e, null, n.lexical, t)
        };
        return n.lex = !0, n
    }

    function k() {
        var e = b.state;
        e.lexical.prev && (e.lexical.type == ")" && (e.indented = e.lexical.indented), e.lexical = e.lexical.prev)
    }

    function L(e) {
        return function (n) {
            return n == e ? E() : e == ";" ? w() : E(arguments.callee)
        }
    }

    function A(e) {
        return e == "@" ? E(P) : e == "var" ? E(C("vardef"), z, L(";"), k) : e == "keyword a" ? E(C("form"), O, A, k) : e == "keyword b" ? E(C("form"), A, k) : e == "{" ? E(C("}"), T, U, k, N) : e == ";" ? E() : e == "attribute" ? E(D) : e == "function" ? E($) : e == "for" ? E(C("form"), L("("), C(")"), X, L(")"), k, A, k) : e == "variable" ? E(C("stat"), F) : e == "switch" ? E(C("form"), O, C("}", "switch"), L("{"), U, k, k) : e == "case" ? E(O, L(":")) : e == "default" ? E(L(":")) : e == "catch" ? E(C("form"), T, L("("), G, L(")"), A, k, N) : e == "import" ? E(B, L(";")) : e == "typedef" ? E(j) : w(C("stat"), O, L(";"), k)
    }

    function O(e) {
        return p.hasOwnProperty(e) ? E(_) : e == "function" ? E($) : e == "keyword c" ? E(M) : e == "(" ? E(C(")"), M, L(")"), k, _) : e == "operator" ? E(O) : e == "[" ? E(C("]"), R(O, "]"), k, _) : e == "{" ? E(C("}"), R(q, "}"), k, _) : E()
    }

    function M(e) {
        return e.match(/[;\}\)\],]/) ? w() : w(O)
    }

    function _(e, t) {
        if (e == "operator" && /\+\+|--/.test(t))return E(_);
        if (e == "operator" || e == ":")return E(O);
        if (e == ";")return;
        if (e == "(")return E(C(")"), R(O, ")"), k, _);
        if (e == ".")return E(I, _);
        if (e == "[")return E(C("]"), O, L("]"), k, _)
    }

    function D(e, t) {
        if (e == "attribute")return E(D);
        if (e == "function")return E($);
        if (e == "var")return E(z)
    }

    function P(e, t) {
        if (e == ":")return E(P);
        if (e == "variable")return E(P);
        if (e == "(")return E(C(")"), comasep(H, ")"), k, A)
    }

    function H(e, t) {
        if (typ == "variable")return E()
    }

    function B(e, t) {
        if (e == "variable" && /[A-Z]/.test(t.charAt(0)))return y(t), E();
        if (e == "variable" || e == "property" || e == ".")return E(B)
    }

    function j(e, t) {
        if (e == "variable" && /[A-Z]/.test(t.charAt(0)))return y(t), E()
    }

    function F(e) {
        return e == ":" ? E(k, A) : w(_, L(";"), k)
    }

    function I(e) {
        if (e == "variable")return b.marked = "property", E()
    }

    function q(e) {
        e == "variable" && (b.marked = "property");
        if (p.hasOwnProperty(e))return E(L(":"), O)
    }

    function R(e, t) {
        function n(r) {
            return r == "," ? E(e, n) : r == t ? E() : E(L(t))
        }

        return function (i) {
            return i == t ? E() : w(e, n)
        }
    }

    function U(e) {
        return e == "}" ? E() : w(A, U)
    }

    function z(e, t) {
        return e == "variable" ? (S(t), E(J, W)) : E()
    }

    function W(e, t) {
        if (t == "=")return E(O, W);
        if (e == ",")return E(z)
    }

    function X(e, t) {
        return e == "variable" && S(t), E(C(")"), T, V, O, k, A, N)
    }

    function V(e, t) {
        if (t == "in")return E()
    }

    function $(e, t) {
        if (e == "variable")return S(t), E($);
        if (t == "new")return E($);
        if (e == "(")return E(C(")"), T, R(G, ")"), k, J, A, N)
    }

    function J(e, t) {
        if (e == ":")return E(K)
    }

    function K(e, t) {
        if (e == "type")return E();
        if (e == "variable")return E();
        if (e == "{")return E(C("}"), R(Q, "}"), k)
    }

    function Q(e, t) {
        if (e == "variable")return E(J)
    }

    function G(e, t) {
        if (e == "variable")return S(t), E(J)
    }

    var n = e.indentUnit, r = function () {
            function e(e) {
                return {type: e, style: "keyword"}
            }

            var t = e("keyword a"), n = e("keyword b"), r = e("keyword c"), i = e("operator"), s = {type: "atom", style: "atom"}, o = {type: "attribute", style: "attribute"},
                u = e("typedef");
            return {
                "if": t,
                "while": t,
                "else": n,
                "do": n,
                "try": n,
                "return": r,
                "break": r,
                "continue": r,
                "new": r,
                "throw": r,
                "var": e("var"),
                inline: o,
                "static": o,
                using: e("import"),
                "public": o,
                "private": o,
                cast: e("cast"),
                "import": e("import"),
                macro: e("macro"),
                "function": e("function"),
                "catch": e("catch"),
                untyped: e("untyped"),
                callback: e("cb"),
                "for": e("for"),
                "switch": e("switch"),
                "case": e("case"),
                "default": e("default"),
                "in": i,
                never: e("property_access"),
                trace: e("trace"),
                "class": u,
                "enum": u,
                "interface": u,
                typedef: u,
                "extends": u,
                "implements": u,
                dynamic: u,
                "true": s,
                "false": s,
                "null": s
            }
        }(), i = /[+\-*&%=<>!?|]/, u, a, p = {atom: !0, number: !0, variable: !0, string: !0, regexp: !0}, b = {state: null, column: null, marked: null, cc: null},
        x = {name: "this", next: null};
    return k.lex = !0, {
        startState: function (e) {
            var r = ["Int", "Float", "String", "Void", "Std", "Bool", "Dynamic", "Array"];
            return {
                tokenize: l,
                reAllowed: !0,
                kwAllowed: !0,
                cc: [],
                lexical: new d((e || 0) - n, 0, "block", !1),
                localVars: t.localVars,
                importedtypes: r,
                context: t.localVars && {vars: t.localVars},
                indented: 0
            }
        }, token: function (e, t) {
            e.sol() && (t.lexical.hasOwnProperty("align") || (t.lexical.align = !1), t.indented = e.indentation());
            if (e.eatSpace())return null;
            var n = t.tokenize(e, t);
            return u == "comment" ? n : (t.reAllowed = u == "operator" || u == "keyword c" || !!u.match(/^[\[{}\(,;:]$/), t.kwAllowed = u != ".", m(t, n, u, a, e))
        }, indent: function (e, t) {
            if (e.tokenize != l)return 0;
            var r = t && t.charAt(0), i = e.lexical;
            i.type == "stat" && r == "}" && (i = i.prev);
            var s = i.type, o = r == s;
            return s == "vardef" ? i.indented + 4 : s == "form" && r == "{" ? i.indented : s == "stat" || s == "form" ? i.indented + n : i.info == "switch" && !o ? i.indented + (/^(?:case|default)\b/.test(t) ? n : 2 * n) : i.align ? i.column + (o ? 0 : 1) : i.indented + (o ? 0 : n)
        }, compareStates: function (e, t) {
            return e.localVars == t.localVars && e.context == t.context
        }, electricChars: "{}"
    }
}), CodeMirror.defineMIME("text/x-haxe", "haxe"), CodeMirror.defineMode("htmlembedded", function (e, t) {
    function o(e, t) {
        return e.match(n, !1) ? (t.token = u, i.token(e, t.scriptState)) : s.token(e, t.htmlState)
    }

    function u(e, t) {
        return e.match(r, !1) ? (t.token = o, s.token(e, t.htmlState)) : i.token(e, t.scriptState)
    }

    var n = t.scriptStartRegex || /^<%/i, r = t.scriptEndRegex || /^%>/i, i, s;
    return {
        startState: function () {
            return i = i || CodeMirror.getMode(e, t.scriptingModeSpec), s = s || CodeMirror.getMode(e, "htmlmixed"), {
                token: t.startOpen ? u : o,
                htmlState: s.startState(),
                scriptState: i.startState()
            }
        }, token: function (e, t) {
            return t.token(e, t)
        }, indent: function (e, t) {
            return e.token == o ? s.indent(e.htmlState, t) : i.indent(e.scriptState, t)
        }, copyState: function (e) {
            return {token: e.token, htmlState: CodeMirror.copyState(s, e.htmlState), scriptState: CodeMirror.copyState(i, e.scriptState)}
        }, electricChars: "/{}:"
    }
}, "htmlmixed"), CodeMirror.defineMIME("application/x-ejs", {
    name: "htmlembedded",
    scriptingModeSpec: "javascript"
}), CodeMirror.defineMIME("application/x-aspx", {name: "htmlembedded", scriptingModeSpec: "text/x-csharp"}), CodeMirror.defineMIME("application/x-jsp", {
    name: "htmlembedded",
    scriptingModeSpec: "text/x-java"
}), CodeMirror.defineMode("htmlmixed", function (e, t) {
    function s(e, t) {
        var s = n.token(e, t.htmlState);
        return s == "tag" && e.current() == ">" && t.htmlState.context && (/^script$/i.test(t.htmlState.context.tagName) ? (t.token = u, t.localState = r.startState(n.indent(t.htmlState, "")), t.mode = "javascript") : /^style$/i.test(t.htmlState.context.tagName) && (t.token = a, t.localState = i.startState(n.indent(t.htmlState, "")), t.mode = "css")), s
    }

    function o(e, t, n) {
        var r = e.current(), i = r.search(t);
        return i > -1 && e.backUp(r.length - i), n
    }

    function u(e, t) {
        return e.match(/^<\/\s*script\s*>/i, !1) ? (t.token = s, t.localState = null, t.mode = "html", s(e, t)) : o(e, /<\/\s*script\s*>/, r.token(e, t.localState))
    }

    function a(e, t) {
        return e.match(/^<\/\s*style\s*>/i, !1) ? (t.token = s, t.localState = null, t.mode = "html", s(e, t)) : o(e, /<\/\s*style\s*>/, i.token(e, t.localState))
    }

    var n = CodeMirror.getMode(e, {name: "xml", htmlMode: !0}), r = CodeMirror.getMode(e, "javascript"), i = CodeMirror.getMode(e, "css");
    return {
        startState: function () {
            var e = n.startState();
            return {token: s, localState: null, mode: "html", htmlState: e}
        }, copyState: function (e) {
            if (e.localState)var t = CodeMirror.copyState(e.token == a ? i : r, e.localState);
            return {token: e.token, localState: t, mode: e.mode, htmlState: CodeMirror.copyState(n, e.htmlState)}
        }, token: function (e, t) {
            return t.token(e, t)
        }, indent: function (e, t) {
            return e.token == s || /^\s*<\//.test(t) ? n.indent(e.htmlState, t) : e.token == u ? r.indent(e.localState, t) : i.indent(e.localState, t)
        }, compareStates: function (e, t) {
            return e.mode != t.mode ? !1 : e.localState ? CodeMirror.Pass : n.compareStates(e.htmlState, t.htmlState)
        }, electricChars: "/{}:"
    }
}, "xml", "javascript", "css"), CodeMirror.defineMIME("text/html", "htmlmixed"), CodeMirror.defineMode("javascript", function (e, t) {
    function o(e, t, n) {
        return t.tokenize = n, n(e, t)
    }

    function u(e, t) {
        var n = !1, r;
        while ((r = e.next()) != null) {
            if (r == t && !n)return !1;
            n = !n && r == "\\"
        }
        return n
    }

    function l(e, t, n) {
        return a = e, f = n, t
    }

    function c(e, t) {
        var n = e.next();
        if (n == '"' || n == "'")return o(e, t, h(n));
        if (/[\[\]{}\(\),;\:\.]/.test(n))return l(n);
        if (n == "0" && e.eat(/x/i))return e.eatWhile(/[\da-f]/i), l("number", "number");
        if (/\d/.test(n) || n == "-" && e.eat(/\d/))return e.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/), l("number", "number");
        if (n == "/")return e.eat("*") ? o(e, t, p) : e.eat("/") ? (e.skipToEnd(), l("comment", "comment")) : t.reAllowed ? (u(e, "/"), e.eatWhile(/[gimy]/), l("regexp", "string-2")) : (e.eatWhile(s), l("operator", null, e.current()));
        if (n == "#")return e.skipToEnd(), l("error", "error");
        if (s.test(n))return e.eatWhile(s), l("operator", null, e.current());
        e.eatWhile(/[\w\$_]/);
        var r = e.current(), a = i.propertyIsEnumerable(r) && i[r];
        return a && t.kwAllowed ? l(a.type, a.style, r) : l("variable", "variable", r)
    }

    function h(e) {
        return function (t, n) {
            return u(t, e) || (n.tokenize = c), l("string", "string")
        }
    }

    function p(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "/" && n) {
                t.tokenize = c;
                break
            }
            n = r == "*"
        }
        return l("comment", "comment")
    }

    function v(e, t, n, r, i, s) {
        this.indented = e, this.column = t, this.type = n, this.prev = i, this.info = s, r != null && (this.align = r)
    }

    function m(e, t) {
        for (var n = e.localVars; n; n = n.next)if (n.name == t)return !0
    }

    function g(e, t, n, i, s) {
        var o = e.cc;
        y.state = e, y.stream = s, y.marked = null, y.cc = o, e.lexical.hasOwnProperty("align") || (e.lexical.align = !0);
        for (; ;) {
            var u = o.length ? o.pop() : r ? A : L;
            if (u(n, i)) {
                while (o.length && o[o.length - 1].lex)o.pop()();
                return y.marked ? y.marked : n == "variable" && m(e, i) ? "variable-2" : t
            }
        }
    }

    function b() {
        for (var e = arguments.length - 1; e >= 0; e--)y.cc.push(arguments[e])
    }

    function w() {
        return b.apply(null, arguments), !0
    }

    function E(e) {
        var t = y.state;
        if (t.context) {
            y.marked = "def";
            for (var n = t.localVars; n; n = n.next)if (n.name == e)return;
            t.localVars = {name: e, next: t.localVars}
        }
    }

    function x() {
        y.state.context || (y.state.localVars = S), y.state.context = {prev: y.state.context, vars: y.state.localVars}
    }

    function T() {
        y.state.localVars = y.state.context.vars, y.state.context = y.state.context.prev
    }

    function N(e, t) {
        var n = function () {
            var n = y.state;
            n.lexical = new v(n.indented, y.stream.column(), e, null, n.lexical, t)
        };
        return n.lex = !0, n
    }

    function C() {
        var e = y.state;
        e.lexical.prev && (e.lexical.type == ")" && (e.indented = e.lexical.indented), e.lexical = e.lexical.prev)
    }

    function k(e) {
        return function (n) {
            return n == e ? w() : e == ";" ? b() : w(arguments.callee)
        }
    }

    function L(e) {
        return e == "var" ? w(N("vardef"), j, k(";"), C) : e == "keyword a" ? w(N("form"), A, L, C) : e == "keyword b" ? w(N("form"), L, C) : e == "{" ? w(N("}"), B, C) : e == ";" ? w() : e == "function" ? w(z) : e == "for" ? w(N("form"), k("("), N(")"), I, k(")"), C, L, C) : e == "variable" ? w(N("stat"), _) : e == "switch" ? w(N("form"), A, N("}", "switch"), k("{"), B, C, C) : e == "case" ? w(A, k(":")) : e == "default" ? w(k(":")) : e == "catch" ? w(N("form"), x, k("("), W, k(")"), L, C, T) : b(N("stat"), A, k(";"), C)
    }

    function A(e) {
        return d.hasOwnProperty(e) ? w(M) : e == "function" ? w(z) : e == "keyword c" ? w(O) : e == "(" ? w(N(")"), O, k(")"), C, M) : e == "operator" ? w(A) : e == "[" ? w(N("]"), H(A, "]"), C, M) : e == "{" ? w(N("}"), H(P, "}"), C, M) : w()
    }

    function O(e) {
        return e.match(/[;\}\)\],]/) ? b() : b(A)
    }

    function M(e, t) {
        if (e == "operator" && /\+\+|--/.test(t))return w(M);
        if (e == "operator" && t == "?")return w(A, k(":"), A);
        if (e == ";")return;
        if (e == "(")return w(N(")"), H(A, ")"), C, M);
        if (e == ".")return w(D, M);
        if (e == "[")return w(N("]"), A, k("]"), C, M)
    }

    function _(e) {
        return e == ":" ? w(C, L) : b(M, k(";"), C)
    }

    function D(e) {
        if (e == "variable")return y.marked = "property", w()
    }

    function P(e) {
        e == "variable" && (y.marked = "property");
        if (d.hasOwnProperty(e))return w(k(":"), A)
    }

    function H(e, t) {
        function n(r) {
            return r == "," ? w(e, n) : r == t ? w() : w(k(t))
        }

        return function (i) {
            return i == t ? w() : b(e, n)
        }
    }

    function B(e) {
        return e == "}" ? w() : b(L, B)
    }

    function j(e, t) {
        return e == "variable" ? (E(t), w(F)) : w()
    }

    function F(e, t) {
        if (t == "=")return w(A, F);
        if (e == ",")return w(j)
    }

    function I(e) {
        return e == "var" ? w(j, R) : e == ";" ? b(R) : e == "variable" ? w(q) : b(R)
    }

    function q(e, t) {
        return t == "in" ? w(A) : w(M, R)
    }

    function R(e, t) {
        return e == ";" ? w(U) : t == "in" ? w(A) : w(A, k(";"), U)
    }

    function U(e) {
        e != ")" && w(A)
    }

    function z(e, t) {
        if (e == "variable")return E(t), w(z);
        if (e == "(")return w(N(")"), x, H(W, ")"), C, L, T)
    }

    function W(e, t) {
        if (e == "variable")return E(t), w()
    }

    var n = e.indentUnit, r = t.json, i = function () {
            function e(e) {
                return {type: e, style: "keyword"}
            }

            var t = e("keyword a"), n = e("keyword b"), r = e("keyword c"), i = e("operator"), s = {type: "atom", style: "atom"};
            return {
                "if": t,
                "while": t,
                "with": t,
                "else": n,
                "do": n,
                "try": n,
                "finally": n,
                "return": r,
                "break": r,
                "continue": r,
                "new": r,
                "delete": r,
                "throw": r,
                "var": e("var"),
                "const": e("var"),
                let: e("var"),
                "function": e("function"),
                "catch": e("catch"),
                "for": e("for"),
                "switch": e("switch"),
                "case": e("case"),
                "default": e("default"),
                "in": i,
                "typeof": i,
                "instanceof": i,
                "true": s,
                "false": s,
                "null": s,
                "undefined": s,
                NaN: s,
                Infinity: s
            }
        }(), s = /[+\-*&%=<>!?|]/, a, f, d = {atom: !0, number: !0, variable: !0, string: !0, regexp: !0}, y = {state: null, column: null, marked: null, cc: null},
        S = {name: "this", next: {name: "arguments"}};
    return C.lex = !0, {
        startState: function (e) {
            return {
                tokenize: c,
                reAllowed: !0,
                kwAllowed: !0,
                cc: [],
                lexical: new v((e || 0) - n, 0, "block", !1),
                localVars: t.localVars,
                context: t.localVars && {vars: t.localVars},
                indented: 0
            }
        }, token: function (e, t) {
            e.sol() && (t.lexical.hasOwnProperty("align") || (t.lexical.align = !1), t.indented = e.indentation());
            if (e.eatSpace())return null;
            var n = t.tokenize(e, t);
            return a == "comment" ? n : (t.reAllowed = a == "operator" || a == "keyword c" || !!a.match(/^[\[{}\(,;:]$/), t.kwAllowed = a != ".", g(t, n, a, f, e))
        }, indent: function (e, t) {
            if (e.tokenize != c)return 0;
            var r = t && t.charAt(0), i = e.lexical;
            i.type == "stat" && r == "}" && (i = i.prev);
            var s = i.type, o = r == s;
            return s == "vardef" ? i.indented + 4 : s == "form" && r == "{" ? i.indented : s == "stat" || s == "form" ? i.indented + n : i.info == "switch" && !o ? i.indented + (/^(?:case|default)\b/.test(t) ? n : 2 * n) : i.align ? i.column + (o ? 0 : 1) : i.indented + (o ? 0 : n)
        }, electricChars: ":{}"
    }
}), CodeMirror.defineMIME("text/javascript", "javascript"), CodeMirror.defineMIME("application/json", {
    name: "javascript",
    json: !0
}), CodeMirror.defineMode("jinja2", function (e, t) {
    function r(e, t) {
        var n = e.next();
        if (n == "{")if (n = e.eat(/\{|%|#/))return e.eat("-"), t.tokenize = i(n), "tag"
    }

    function i(e) {
        return e == "{" && (e = "}"), function (t, i) {
            var s = t.next();
            return (s == e || s == "-" && t.eat(e)) && t.eat("}") ? (i.tokenize = r, "tag") : t.match(n) ? "keyword" : e == "#" ? "comment" : "string"
        }
    }

    var n = ["block", "endblock", "for", "endfor", "in", "true", "false", "loop", "none", "self", "super", "if", "as", "not", "and", "else", "import", "with", "without", "context"];
    return n = new RegExp("^((" + n.join(")|(") + "))\\b"), {
        startState: function () {
            return {tokenize: r}
        }, token: function (e, t) {
            return t.tokenize(e, t)
        }
    }
}), CodeMirror.defineMode("less", function (e) {
    function r(e, t) {
        return n = t, e
    }

    function s(e) {
        for (var t = 0; t < i.length; t++)if (e === i[t])return !0
    }

    function o(e, t) {
        var n = e.next();
        if (n == "@")return e.eatWhile(/[\w\-]/), r("meta", e.current());
        if (n == "/" && e.eat("*"))return t.tokenize = a, a(e, t);
        if (n == "<" && e.eat("!"))return t.tokenize = f, f(e, t);
        if (n != "=")return n != "~" && n != "|" || !e.eat("=") ? n == '"' || n == "'" ? (t.tokenize = l(n), t.tokenize(e, t)) : n == "/" ? e.eat("/") ? (t.tokenize = u, u(e, t)) : (e.eatWhile(/[\a-zA-Z0-9\-_.\s]/), /\/|\)|#/.test(e.peek() || e.eol() || e.eatSpace() && e.peek() == ")") ? r("string", "string") : r("number", "unit")) : n == "!" ? (e.match(/^\s*\w*/), r("keyword", "important")) : /\d/.test(n) ? (e.eatWhile(/[\w.%]/), r("number", "unit")) : /[,+<>*\/]/.test(n) ? r(null, "select-op") : /[;{}:\[\]()]/.test(n) ? n == ":" ? (e.eatWhile(/[active|hover|link|visited]/), e.current().match(/active|hover|link|visited/) ? r("tag", "tag") : r(null, n)) : r(null, n) : n == "." ? (e.eatWhile(/[\a-zA-Z0-9\-_]/), r("tag", "tag")) : n == "#" ? (e.eatWhile(/[A-Za-z0-9]/), e.current().length === 4 || e.current().length === 7 ? e.current().match(/[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}/, false) != null ? e.current().substring(1) != e.current().match(/[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}/, false) ? r("atom", "tag") : (e.eatSpace(), /[\/<>.(){!$%^&*_\-\\?=+\|#'~`]/.test(e.peek()) ? r("atom", "tag") : e.peek() == "}" ? r("number", "unit") : /[a-zA-Z\\]/.test(e.peek()) ? r("atom", "tag") : e.eol() ? r("atom", "tag") : r("number", "unit")) : (e.eatWhile(/[\w\\\-]/), r("atom", "tag")) : (e.eatWhile(/[\w\\\-]/), r("atom", "tag"))) : n == "&" ? (e.eatWhile(/[\w\-]/), r(null, n)) : (e.eatWhile(/[\w\\\-_%.{]/), e.current().match(/http|https/) != null ? (e.eatWhile(/[\w\\\-_%.{:\/]/), r("string", "string")) : e.peek() == "<" || e.peek() == ">" ? r("tag", "tag") : e.peek().match(/\(/) != null ? r(null, n) : e.peek() == "/" && t.stack[t.stack.length - 1] != undefined ? r("string", "string") : e.current().match(/\-\d|\-.\d/) ? r("number", "unit") : s(e.current()) ? r("tag", "tag") : /\/|[\s\)]/.test(e.peek() || e.eol() || e.eatSpace() && e.peek() == "/") && e.current().indexOf(".") !== -1 ? e.current().substring(e.current().length - 1, e.current().length) == "{" ? (e.backUp(1), r("tag", "tag")) : e.eatSpace() && e.peek().match(/[{<>.a-zA-Z]/) != null || e.eol() ? r("tag", "tag") : r("string", "string") : e.eol() ? (e.current().substring(e.current().length - 1, e.current().length) == "{" && e.backUp(1), r("tag", "tag")) : r("variable", "variable")) : r(null, "compare");
        r(null, "compare")
    }

    function u(e, t) {
        return e.skipToEnd(), t.tokenize = o, r("comment", "comment")
    }

    function a(e, t) {
        var n = !1, i;
        while ((i = e.next()) != null) {
            if (n && i == "/") {
                t.tokenize = o;
                break
            }
            n = i == "*"
        }
        return r("comment", "comment")
    }

    function f(e, t) {
        var n = 0, i;
        while ((i = e.next()) != null) {
            if (n >= 2 && i == ">") {
                t.tokenize = o;
                break
            }
            n = i == "-" ? n + 1 : 0
        }
        return r("comment", "comment")
    }

    function l(e) {
        return function (t, n) {
            var i = !1, s;
            while ((s = t.next()) != null) {
                if (s == e && !i)break;
                i = !i && s == "\\"
            }
            return i || (n.tokenize = o), r("string", "string")
        }
    }

    var t = e.indentUnit, n,
        i = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "command", "datalist", "dd", "del", "details", "dfn", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "keygen", "kbd", "label", "legend", "li", "link", "map", "mark", "menu", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"];
    return {
        startState: function (e) {
            return {tokenize: o, baseIndent: e || 0, stack: []}
        }, token: function (e, t) {
            if (e.eatSpace())return null;
            var r = t.tokenize(e, t), i = t.stack[t.stack.length - 1];
            if (n == "hash" && i == "rule") r = "atom"; else if (r == "variable")if (i == "rule") r = null; else if (!i || i == "@media{") r = e.current() == "when" ? "variable" : e.string.match(/#/g) != undefined ? null : /[\s,|\s\)]/.test(e.peek()) ? "tag" : null;
            return i == "rule" && /^[\{\};]$/.test(n) && t.stack.pop(), n == "{" ? i == "@media" ? t.stack[t.stack.length - 1] = "@media{" : t.stack.push("{") : n == "}" ? t.stack.pop() : n == "@media" ? t.stack.push("@media") : i == "{" && n != "comment" && t.stack.push("rule"), r
        }, indent: function (e, n) {
            var r = e.stack.length;
            return /^\}/.test(n) && (r -= e.stack[e.stack.length - 1] == "rule" ? 2 : 1), e.baseIndent + r * t
        }, electricChars: "}"
    }
}), CodeMirror.defineMIME("text/x-less", "less"), CodeMirror.mimeModes.hasOwnProperty("text/css") || CodeMirror.defineMIME("text/css", "less"), CodeMirror.defineMode("lua", function (e, t) {
    function r(e) {
        return new RegExp("^(?:" + e.join("|") + ")", "i")
    }

    function i(e) {
        return new RegExp("^(?:" + e.join("|") + ")$", "i")
    }

    function c(e) {
        var t = 0;
        while (e.eat("="))++t;
        return e.eat("["), t
    }

    function h(e, t) {
        var n = e.next();
        return n == "-" && e.eat("-") ? e.eat("[") ? (t.cur = p(c(e), "comment"))(e, t) : (e.skipToEnd(), "comment") : n == '"' || n == "'" ? (t.cur = d(n))(e, t) : n == "[" && /[\[=]/.test(e.peek()) ? (t.cur = p(c(e), "string"))(e, t) : /\d/.test(n) ? (e.eatWhile(/[\w.%]/), "number") : /[\w_]/.test(n) ? (e.eatWhile(/[\w\\\-_.]/), "variable") : null
    }

    function p(e, t) {
        return function (n, r) {
            var i = null, s;
            while ((s = n.next()) != null)if (i == null) s == "]" && (i = 0); else if (s == "=") ++i; else {
                if (s == "]" && i == e) {
                    r.cur = h;
                    break
                }
                i = null
            }
            return t
        }
    }

    function d(e) {
        return function (t, n) {
            var r = !1, i;
            while ((i = t.next()) != null) {
                if (i == e && !r)break;
                r = !r && i == "\\"
            }
            return r || (n.cur = h), "string"
        }
    }

    var n = e.indentUnit, s = i(t.specials || []),
        o = i(["_G", "_VERSION", "assert", "collectgarbage", "dofile", "error", "getfenv", "getmetatable", "ipairs", "load", "loadfile", "loadstring", "module", "next", "pairs", "pcall", "print", "rawequal", "rawget", "rawset", "require", "select", "setfenv", "setmetatable", "tonumber", "tostring", "type", "unpack", "xpcall", "coroutine.create", "coroutine.resume", "coroutine.running", "coroutine.status", "coroutine.wrap", "coroutine.yield", "debug.debug", "debug.getfenv", "debug.gethook", "debug.getinfo", "debug.getlocal", "debug.getmetatable", "debug.getregistry", "debug.getupvalue", "debug.setfenv", "debug.sethook", "debug.setlocal", "debug.setmetatable", "debug.setupvalue", "debug.traceback", "close", "flush", "lines", "read", "seek", "setvbuf", "write", "io.close", "io.flush", "io.input", "io.lines", "io.open", "io.output", "io.popen", "io.read", "io.stderr", "io.stdin", "io.stdout", "io.tmpfile", "io.type", "io.write", "math.abs", "math.acos", "math.asin", "math.atan", "math.atan2", "math.ceil", "math.cos", "math.cosh", "math.deg", "math.exp", "math.floor", "math.fmod", "math.frexp", "math.huge", "math.ldexp", "math.log", "math.log10", "math.max", "math.min", "math.modf", "math.pi", "math.pow", "math.rad", "math.random", "math.randomseed", "math.sin", "math.sinh", "math.sqrt", "math.tan", "math.tanh", "os.clock", "os.date", "os.difftime", "os.execute", "os.exit", "os.getenv", "os.remove", "os.rename", "os.setlocale", "os.time", "os.tmpname", "package.cpath", "package.loaded", "package.loaders", "package.loadlib", "package.path", "package.preload", "package.seeall", "string.byte", "string.char", "string.dump", "string.find", "string.format", "string.gmatch", "string.gsub", "string.len", "string.lower", "string.match", "string.rep", "string.reverse", "string.sub", "string.upper", "table.concat", "table.insert", "table.maxn", "table.remove", "table.sort"]),
        u = i(["and", "break", "elseif", "false", "nil", "not", "or", "return", "true", "function", "end", "if", "then", "else", "do", "while", "repeat", "until", "for", "in", "local"]),
        a = i(["function", "if", "repeat", "do", "\\(", "{"]), f = i(["end", "until", "\\)", "}"]), l = r(["end", "until", "\\)", "}", "else", "elseif"]);
    return {
        startState: function (e) {
            return {basecol: e || 0, indentDepth: 0, cur: h}
        }, token: function (e, t) {
            if (e.eatSpace())return null;
            var n = t.cur(e, t), r = e.current();
            return n == "variable" && (u.test(r) ? n = "keyword" : o.test(r) ? n = "builtin" : s.test(r) && (n = "variable-2")), n != "comment" && n != "string" && (a.test(r) ? ++t.indentDepth : f.test(r) && --t.indentDepth), n
        }, indent: function (e, t) {
            var r = l.test(t);
            return e.basecol + n * (e.indentDepth - (r ? 1 : 0))
        }
    }
}), CodeMirror.defineMIME("text/x-lua", "lua"), CodeMirror.defineMode("markdown", function (e, t) {
    function b(e, t, n) {
        return t.f = t.inline = n, n(e, t)
    }

    function w(e, t, n) {
        return t.f = t.block = n, n(e, t)
    }

    function E(e) {
        return e.em = !1, e.strong = !1, e.quote = !1, !n && e.f == x && (e.f = C, e.block = S), null
    }

    function S(e, t) {
        var n;
        if (t.indentationDiff >= 4)return t.indentation -= t.indentationDiff, e.skipToEnd(), s;
        if (e.eatSpace())return null;
        if (e.peek() === "#" || e.match(g)) t.header = !0; else if (e.eat(">")) t.indentation++, t.quote = !0; else {
            if (e.peek() === "[")return b(e, t, A);
            if (e.match(d, !0))return a;
            if (n = e.match(v, !0) || e.match(m, !0))return t.indentation += n[0].length, u
        }
        return b(e, t, t.inline)
    }

    function x(e, t) {
        var i = r.token(e, t.htmlState);
        return n && i === "tag" && t.htmlState.type !== "openTag" && !t.htmlState.context && (t.f = C, t.block = S), t.md_inside && e.current().indexOf(">") != -1 && (t.f = C, t.block = S, t.htmlState.context = undefined), i
    }

    function T(e) {
        var t = [];
        return e.strong ? t.push(e.em ? p : h) : e.em && t.push(c), e.header && t.push(i), e.quote && t.push(o), t.length ? t.join(" ") : null
    }

    function N(e, t) {
        return e.match(y, !0) ? T(t) : undefined
    }

    function C(e, t) {
        var n = t.text(e, t);
        if (typeof n != "undefined")return n;
        var r = e.next();
        if (r === "\\")return e.next(), T(t);
        if (r === "`")return b(e, t, _(s, "`"));
        if (r === "[")return b(e, t, k);
        if (r === "<" && e.match(/^\w/, !1)) {
            var i = !1;
            if (e.string.indexOf(">") != -1) {
                var o = e.string.substring(1, e.string.indexOf(">"));
                /markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(o) && (t.md_inside = !0)
            }
            return e.backUp(1), w(e, t, x)
        }
        if (r === "<" && e.match(/^\/\w*?>/))return t.md_inside = !1, "tag";
        var u = T(t);
        return r === "*" || r === "_" ? e.eat(r) ? (t.strong = !t.strong) ? T(t) : u : (t.em = !t.em) ? T(t) : u : T(t)
    }

    function k(e, t) {
        while (!e.eol()) {
            var n = e.next();
            n === "\\" && e.next();
            if (n === "]")return t.inline = t.f = L, f
        }
        return f
    }

    function L(e, t) {
        e.eatSpace();
        var n = e.next();
        return n === "(" || n === "[" ? b(e, t, _(l, n === "(" ? ")" : "]")) : "error"
    }

    function A(e, t) {
        return e.match(/^[^\]]*\]:/, !0) ? (t.f = O, f) : b(e, t, C)
    }

    function O(e, t) {
        return e.eatSpace(), e.match(/^[^\s]+/, !0), t.f = t.inline = C, l
    }

    function M(e) {
        return M[e] || (M[e] = new RegExp("^(?:[^\\\\\\" + e + "]|\\\\.)*(?:\\" + e + "|$)")), M[e]
    }

    function _(e, t, n) {
        return n = n || C, function (r, i) {
            return r.match(M(t)), i.inline = i.f = n, e
        }
    }

    var n = CodeMirror.mimeModes.hasOwnProperty("text/html"), r = CodeMirror.getMode(e, n ? "text/html" : "text/plain"), i = "header", s = "comment", o = "quote",
        u = "string", a = "hr", f = "link", l = "string", c = "em", h = "strong", p = "emstrong", d = /^([*\-=_])(?:\s*\1){2,}\s*$/, v = /^[*\-+]\s+/, m = /^[0-9]+\.\s+/,
        g = /^(?:\={3,}|-{3,})$/, y = /^[^\[*_\\<>`]+/;
    return {
        startState: function () {
            return {f: S, block: S, htmlState: CodeMirror.startState(r), indentation: 0, inline: C, text: N, em: !1, strong: !1, header: !1, quote: !1}
        }, copyState: function (e) {
            return {
                f: e.f,
                block: e.block,
                htmlState: CodeMirror.copyState(r, e.htmlState),
                indentation: e.indentation,
                inline: e.inline,
                text: e.text,
                em: e.em,
                strong: e.strong,
                header: e.header,
                quote: e.quote,
                md_inside: e.md_inside
            }
        }, token: function (e, t) {
            if (e.sol()) {
                if (e.match(/^\s*$/, !0))return E(t);
                t.header = !1, t.f = t.block;
                var n = e.match(/^\s*/, !0)[0].replace(/\t/g, "    ").length;
                t.indentationDiff = n - t.indentation, t.indentation = n;
                if (n > 0)return null
            }
            return t.f(e, t)
        }, blankLine: E, getType: T
    }
}, "xml"), CodeMirror.defineMIME("text/x-markdown", "markdown"), CodeMirror.defineMode("mysql", function (e) {
    function r(e) {
        return new RegExp("^(?:" + e.join("|") + ")$", "i")
    }

    function u(e, t) {
        var r = e.next();
        n = null;
        if (r == "$" || r == "?")return e.match(/^[\w\d]*/), "variable-2";
        if (r == "<" && !e.match(/^[\s\u00a0=]/, !1))return e.match(/^[^\s\u00a0>]*>?/), "atom";
        if (r == '"' || r == "'")return t.tokenize = a(r), t.tokenize(e, t);
        if (r == "`")return t.tokenize = f(r), t.tokenize(e, t);
        if (/[{}\(\),\.;\[\]]/.test(r))return n = r, null;
        if (r != "-") {
            if (o.test(r))return e.eatWhile(o), null;
            if (r == ":")return e.eatWhile(/[\w\d\._\-]/), "atom";
            e.eatWhile(/[_\w\d]/);
            if (e.eat(":"))return e.eatWhile(/[\w\d_\-]/), "atom";
            var l = e.current(), c;
            return i.test(l) ? null : s.test(l) ? "keyword" : "variable"
        }
        var u = e.next();
        if (u == "-")return e.skipToEnd(), "comment"
    }

    function a(e) {
        return function (t, n) {
            var r = !1, i;
            while ((i = t.next()) != null) {
                if (i == e && !r) {
                    n.tokenize = u;
                    break
                }
                r = !r && i == "\\"
            }
            return "string"
        }
    }

    function f(e) {
        return function (t, n) {
            var r = !1, i;
            while ((i = t.next()) != null) {
                if (i == e && !r) {
                    n.tokenize = u;
                    break
                }
                r = !r && i == "\\"
            }
            return "variable-2"
        }
    }

    function l(e, t, n) {
        e.context = {prev: e.context, indent: e.indent, col: n, type: t}
    }

    function c(e) {
        e.indent = e.context.indent, e.context = e.context.prev
    }

    var t = e.indentUnit, n, i = r(["str", "lang", "langmatches", "datatype", "bound", "sameterm", "isiri", "isuri", "isblank", "isliteral", "union", "a"]),
        s = r(["ACCESSIBLE", "ALTER", "AS", "BEFORE", "BINARY", "BY", "CASE", "CHARACTER", "COLUMN", "CONTINUE", "CROSS", "CURRENT_TIMESTAMP", "DATABASE", "DAY_MICROSECOND", "DEC", "DEFAULT", "DESC", "DISTINCT", "DOUBLE", "EACH", "ENCLOSED", "EXIT", "FETCH", "FLOAT8", "FOREIGN", "GRANT", "HIGH_PRIORITY", "HOUR_SECOND", "IN", "INNER", "INSERT", "INT2", "INT8", "INTO", "JOIN", "KILL", "LEFT", "LINEAR", "LOCALTIME", "LONG", "LOOP", "MATCH", "MEDIUMTEXT", "MINUTE_SECOND", "NATURAL", "NULL", "OPTIMIZE", "OR", "OUTER", "PRIMARY", "RANGE", "READ_WRITE", "REGEXP", "REPEAT", "RESTRICT", "RIGHT", "SCHEMAS", "SENSITIVE", "SHOW", "SPECIFIC", "SQLSTATE", "SQL_CALC_FOUND_ROWS", "STARTING", "TERMINATED", "TINYINT", "TRAILING", "UNDO", "UNLOCK", "USAGE", "UTC_DATE", "VALUES", "VARCHARACTER", "WHERE", "WRITE", "ZEROFILL", "ALL", "AND", "ASENSITIVE", "BIGINT", "BOTH", "CASCADE", "CHAR", "COLLATE", "CONSTRAINT", "CREATE", "CURRENT_TIME", "CURSOR", "DAY_HOUR", "DAY_SECOND", "DECLARE", "DELETE", "DETERMINISTIC", "DIV", "DUAL", "ELSEIF", "EXISTS", "FALSE", "FLOAT4", "FORCE", "FULLTEXT", "HAVING", "HOUR_MINUTE", "IGNORE", "INFILE", "INSENSITIVE", "INT1", "INT4", "INTERVAL", "ITERATE", "KEYS", "LEAVE", "LIMIT", "LOAD", "LOCK", "LONGTEXT", "MASTER_SSL_VERIFY_SERVER_CERT", "MEDIUMINT", "MINUTE_MICROSECOND", "MODIFIES", "NO_WRITE_TO_BINLOG", "ON", "OPTIONALLY", "OUT", "PRECISION", "PURGE", "READS", "REFERENCES", "RENAME", "REQUIRE", "REVOKE", "SCHEMA", "SELECT", "SET", "SPATIAL", "SQLEXCEPTION", "SQL_BIG_RESULT", "SSL", "TABLE", "TINYBLOB", "TO", "TRUE", "UNIQUE", "UPDATE", "USING", "UTC_TIMESTAMP", "VARCHAR", "WHEN", "WITH", "YEAR_MONTH", "ADD", "ANALYZE", "ASC", "BETWEEN", "BLOB", "CALL", "CHANGE", "CHECK", "CONDITION", "CONVERT", "CURRENT_DATE", "CURRENT_USER", "DATABASES", "DAY_MINUTE", "DECIMAL", "DELAYED", "DESCRIBE", "DISTINCTROW", "DROP", "ELSE", "ESCAPED", "EXPLAIN", "FLOAT", "FOR", "FROM", "GROUP", "HOUR_MICROSECOND", "IF", "INDEX", "INOUT", "INT", "INT3", "INTEGER", "IS", "KEY", "LEADING", "LIKE", "LINES", "LOCALTIMESTAMP", "LONGBLOB", "LOW_PRIORITY", "MEDIUMBLOB", "MIDDLEINT", "MOD", "NOT", "NUMERIC", "OPTION", "ORDER", "OUTFILE", "PROCEDURE", "READ", "REAL", "RELEASE", "REPLACE", "RETURN", "RLIKE", "SECOND_MICROSECOND", "SEPARATOR", "SMALLINT", "SQL", "SQLWARNING", "SQL_SMALL_RESULT", "STRAIGHT_JOIN", "THEN", "TINYTEXT", "TRIGGER", "UNION", "UNSIGNED", "USE", "UTC_TIME", "VARBINARY", "VARYING", "WHILE", "XOR", "FULL", "COLUMNS", "MIN", "MAX", "STDEV", "COUNT"]),
        o = /[*+\-<>=&|]/;
    return {
        startState: function (e) {
            return {tokenize: u, context: null, indent: 0, col: 0}
        }, token: function (e, t) {
            e.sol() && (t.context && t.context.align == null && (t.context.align = !1), t.indent = e.indentation());
            if (e.eatSpace())return null;
            var r = t.tokenize(e, t);
            r != "comment" && t.context && t.context.align == null && t.context.type != "pattern" && (t.context.align = !0);
            if (n == "(") l(t, ")", e.column()); else if (n == "[") l(t, "]", e.column()); else if (n == "{") l(t, "}", e.column()); else if (/[\]\}\)]/.test(n)) {
                while (t.context && t.context.type == "pattern")c(t);
                t.context && n == t.context.type && c(t)
            } else n == "." && t.context && t.context.type == "pattern" ? c(t) : /atom|string|variable/.test(r) && t.context && (/[\}\]]/.test(t.context.type) ? l(t, "pattern", e.column()) : t.context.type == "pattern" && !t.context.align && (t.context.align = !0, t.context.col = e.column()));
            return r
        }, indent: function (e, n) {
            var r = n && n.charAt(0), i = e.context;
            if (/[\]\}]/.test(r))while (i && i.type == "pattern")i = i.prev;
            var s = i && r == i.type;
            return i ? i.type == "pattern" ? i.col : i.align ? i.col + (s ? 0 : 1) : i.indent + (s ? 0 : t) : 0
        }
    }
}), CodeMirror.defineMIME("text/x-mysql", "mysql"), CodeMirror.defineMode("ntriples", function () {
    function t(t, n) {
        var r = t.location, i;
        r == e.PRE_SUBJECT && n == "<" ? i = e.WRITING_SUB_URI : r == e.PRE_SUBJECT && n == "_" ? i = e.WRITING_BNODE_URI : r == e.PRE_PRED && n == "<" ? i = e.WRITING_PRED_URI : r == e.PRE_OBJ && n == "<" ? i = e.WRITING_OBJ_URI : r == e.PRE_OBJ && n == "_" ? i = e.WRITING_OBJ_BNODE : r == e.PRE_OBJ && n == '"' ? i = e.WRITING_OBJ_LITERAL : r == e.WRITING_SUB_URI && n == ">" ? i = e.PRE_PRED : r == e.WRITING_BNODE_URI && n == " " ? i = e.PRE_PRED : r == e.WRITING_PRED_URI && n == ">" ? i = e.PRE_OBJ : r == e.WRITING_OBJ_URI && n == ">" ? i = e.POST_OBJ : r == e.WRITING_OBJ_BNODE && n == " " ? i = e.POST_OBJ : r == e.WRITING_OBJ_LITERAL && n == '"' ? i = e.POST_OBJ : r == e.WRITING_LIT_LANG && n == " " ? i = e.POST_OBJ : r == e.WRITING_LIT_TYPE && n == ">" ? i = e.POST_OBJ : r == e.WRITING_OBJ_LITERAL && n == "@" ? i = e.WRITING_LIT_LANG : r == e.WRITING_OBJ_LITERAL && n == "^" ? i = e.WRITING_LIT_TYPE : n != " " || r != e.PRE_SUBJECT && r != e.PRE_PRED && r != e.PRE_OBJ && r != e.POST_OBJ ? r == e.POST_OBJ && n == "." ? i = e.PRE_SUBJECT : i = e.ERROR : i = r, t.location = i
    }

    var e = {
        PRE_SUBJECT: 0,
        WRITING_SUB_URI: 1,
        WRITING_BNODE_URI: 2,
        PRE_PRED: 3,
        WRITING_PRED_URI: 4,
        PRE_OBJ: 5,
        WRITING_OBJ_URI: 6,
        WRITING_OBJ_BNODE: 7,
        WRITING_OBJ_LITERAL: 8,
        WRITING_LIT_LANG: 9,
        WRITING_LIT_TYPE: 10,
        POST_OBJ: 11,
        ERROR: 12
    }, n = function (e) {
        return e != " "
    }, r = function (e) {
        return e != ">"
    };
    return {
        startState: function () {
            return {location: e.PRE_SUBJECT, uris: [], anchors: [], bnodes: [], langs: [], types: []}
        }, token: function (e, n) {
            var r = e.next();
            if (r == "<") {
                t(n, r);
                var i = "";
                return e.eatWhile(function (e) {
                    return e != "#" && e != ">" ? (i += e, !0) : !1
                }), n.uris.push(i), e.match("#", !1) ? "variable" : (e.next(), t(n, ">"), "variable")
            }
            if (r == "#") {
                var s = "";
                return e.eatWhile(function (e) {
                    return e != ">" && e != " " ? (s += e, !0) : !1
                }), n.anchors.push(s), "variable-2"
            }
            if (r == ">")return t(n, ">"), "variable";
            if (r == "_") {
                t(n, r);
                var o = "";
                return e.eatWhile(function (e) {
                    return e != " " ? (o += e, !0) : !1
                }), n.bnodes.push(o), e.next(), t(n, " "), "builtin"
            }
            if (r == '"')return t(n, r), e.eatWhile(function (e) {
                return e != '"'
            }), e.next(), e.peek() != "@" && e.peek() != "^" && t(n, '"'), "string";
            if (r == "@") {
                t(n, "@");
                var u = "";
                return e.eatWhile(function (e) {
                    return e != " " ? (u += e, !0) : !1
                }), n.langs.push(u), e.next(), t(n, " "), "string-2"
            }
            if (r == "^") {
                e.next(), t(n, "^");
                var a = "";
                return e.eatWhile(function (e) {
                    return e != ">" ? (a += e, !0) : !1
                }), n.types.push(a), e.next(), t(n, ">"), "variable"
            }
            r == " " && t(n, r), r == "." && t(n, r)
        }
    }
}), CodeMirror.defineMIME("text/n-triples", "ntriples"), CodeMirror.defineMode("ocaml", function (e) {
    function n(e, n) {
        var s = e.sol(), o = e.next();
        if (o === '"')return n.tokenize = r, n.tokenize(e, n);
        if (o === "(" && e.eat("*"))return n.commentLevel++, n.tokenize = i, n.tokenize(e, n);
        if (o === "~")return e.eatWhile(/\w/), "variable-2";
        if (o === "`")return e.eatWhile(/\w/), "quote";
        if (/\d/.test(o))return e.eatWhile(/[\d]/), e.eat(".") && e.eatWhile(/[\d]/), "number";
        if (/[+\-*&%=<>!?|]/.test(o))return "operator";
        e.eatWhile(/\w/);
        var u = e.current();
        return t[u] || "variable"
    }

    function r(e, t) {
        var r, i = !1, s = !1;
        while ((r = e.next()) != null) {
            if (r === '"' && !s) {
                i = !0;
                break
            }
            s = !s && r === "\\"
        }
        return i && !s && (t.tokenize = n), "string"
    }

    function i(e, t) {
        var r, i;
        while (t.commentLevel > 0 && (i = e.next()) != null)r === "(" && i === "*" && t.commentLevel++, r === "*" && i === ")" && t.commentLevel--, r = i;
        return t.commentLevel <= 0 && (t.tokenize = n), "comment"
    }

    var t = {
        "true": "atom",
        "false": "atom",
        let: "keyword",
        rec: "keyword",
        "in": "keyword",
        of: "keyword",
        and: "keyword",
        succ: "keyword",
        "if": "keyword",
        then: "keyword",
        "else": "keyword",
        "for": "keyword",
        to: "keyword",
        "while": "keyword",
        "do": "keyword",
        done: "keyword",
        fun: "keyword",
        "function": "keyword",
        val: "keyword",
        type: "keyword",
        mutable: "keyword",
        match: "keyword",
        "with": "keyword",
        "try": "keyword",
        raise: "keyword",
        begin: "keyword",
        end: "keyword",
        open: "builtin",
        trace: "builtin",
        ignore: "builtin",
        exit: "builtin",
        print_string: "builtin",
        print_endline: "builtin"
    };
    return {
        startState: function () {
            return {tokenize: n, commentLevel: 0}
        }, token: function (e, t) {
            return e.eatSpace() ? null : t.tokenize(e, t)
        }
    }
}), CodeMirror.defineMIME("text/x-ocaml", "ocaml"), CodeMirror.defineMode("pascal", function (e) {
    function t(e) {
        var t = {}, n = e.split(" ");
        for (var r = 0; r < n.length; ++r)t[n[r]] = !0;
        return t
    }

    function s(e, t) {
        var s = e.next();
        if (s == "#" && t.startOfLine)return e.skipToEnd(), "meta";
        if (s == '"' || s == "'")return t.tokenize = o(s), t.tokenize(e, t);
        if (s == "(" && e.eat("*"))return t.tokenize = u, u(e, t);
        if (/[\[\]{}\(\),;\:\.]/.test(s))return null;
        if (/\d/.test(s))return e.eatWhile(/[\w\.]/), "number";
        if (s == "/" && e.eat("/"))return e.skipToEnd(), "comment";
        if (i.test(s))return e.eatWhile(i), "operator";
        e.eatWhile(/[\w\$_]/);
        var a = e.current();
        return n.propertyIsEnumerable(a) ? "keyword" : r.propertyIsEnumerable(a) ? "atom" : "variable"
    }

    function o(e) {
        return function (t, n) {
            var r = !1, i, s = !1;
            while ((i = t.next()) != null) {
                if (i == e && !r) {
                    s = !0;
                    break
                }
                r = !r && i == "\\"
            }
            if (s || !r) n.tokenize = null;
            return "string"
        }
    }

    function u(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == ")" && n) {
                t.tokenize = null;
                break
            }
            n = r == "*"
        }
        return "comment"
    }

    var n = t("and array begin case const div do downto else end file for forward integer boolean char function goto if in label mod nil not of or packed procedure program record repeat set string then to type until var while with"),
        r = {"null": !0}, i = /[+\-*&%=<>!?|\/]/;
    return {
        startState: function (e) {
            return {tokenize: null}
        }, token: function (e, t) {
            if (e.eatSpace())return null;
            var n = (t.tokenize || s)(e, t);
            return n == "comment" || n == "meta" ? n : n
        }, electricChars: "{}"
    }
}), CodeMirror.defineMIME("text/x-pascal", "pascal"), CodeMirror.defineMode("perl", function (e, t) {
    function s(e, t, n, r, i) {
        return t.chain = null, t.style = null, t.tail = null, t.tokenize = function (e, t) {
            var s = !1, o, a = 0;
            while (o = e.next()) {
                if (o === n[a] && !s)return n[++a] !== undefined ? (t.chain = n[a], t.style = r, t.tail = i) : i && e.eatWhile(i), t.tokenize = u, r;
                s = !s && o == "\\"
            }
            return r
        }, t.tokenize(e, t)
    }

    function o(e, t, n) {
        return t.tokenize = function (e, t) {
            return e.string == n && (t.tokenize = u), e.skipToEnd(), "string"
        }, t.tokenize(e, t)
    }

    function u(e, t) {
        if (e.eatSpace())return null;
        if (t.chain)return s(e, t, t.chain, t.style, t.tail);
        if (e.match(/^\-?[\d\.]/, !1) && e.match(/^(\-?(\d*\.\d+(e[+-]?\d+)?|\d+\.\d*)|0x[\da-fA-F]+|0b[01]+|\d+(e[+-]?\d+)?)/))return "number";
        if (e.match(/^<<(?=\w)/))return e.eatWhile(/\w/), o(e, t, e.current().substr(2));
        if (e.sol() && e.match(/^\=item(?!\w)/))return o(e, t, "=cut");
        var u = e.next();
        if (u == '"' || u == "'") {
            if (e.prefix(3) == "<<" + u) {
                var a = e.pos;
                e.eatWhile(/\w/);
                var f = e.current().substr(1);
                if (f && e.eat(u))return o(e, t, f);
                e.pos = a
            }
            return s(e, t, [u], "string")
        }
        if (u == "q") {
            var l = e.look(-2);
            if (!l || !/\w/.test(l)) {
                l = e.look(0);
                if (l == "x") {
                    l = e.look(1);
                    if (l == "(")return e.eatSuffix(2), s(e, t, [")"], r, i);
                    if (l == "[")return e.eatSuffix(2), s(e, t, ["]"], r, i);
                    if (l == "{")return e.eatSuffix(2), s(e, t, ["}"], r, i);
                    if (l == "<")return e.eatSuffix(2), s(e, t, [">"], r, i);
                    if (/[\^'"!~\/]/.test(l))return e.eatSuffix(1), s(e, t, [e.eat(l)], r, i)
                } else if (l == "q") {
                    l = e.look(1);
                    if (l == "(")return e.eatSuffix(2), s(e, t, [")"], "string");
                    if (l == "[")return e.eatSuffix(2), s(e, t, ["]"], "string");
                    if (l == "{")return e.eatSuffix(2), s(e, t, ["}"], "string");
                    if (l == "<")return e.eatSuffix(2), s(e, t, [">"], "string");
                    if (/[\^'"!~\/]/.test(l))return e.eatSuffix(1), s(e, t, [e.eat(l)], "string")
                } else if (l == "w") {
                    l = e.look(1);
                    if (l == "(")return e.eatSuffix(2), s(e, t, [")"], "bracket");
                    if (l == "[")return e.eatSuffix(2), s(e, t, ["]"], "bracket");
                    if (l == "{")return e.eatSuffix(2), s(e, t, ["}"], "bracket");
                    if (l == "<")return e.eatSuffix(2), s(e, t, [">"], "bracket");
                    if (/[\^'"!~\/]/.test(l))return e.eatSuffix(1), s(e, t, [e.eat(l)], "bracket")
                } else if (l == "r") {
                    l = e.look(1);
                    if (l == "(")return e.eatSuffix(2), s(e, t, [")"], r, i);
                    if (l == "[")return e.eatSuffix(2), s(e, t, ["]"], r, i);
                    if (l == "{")return e.eatSuffix(2), s(e, t, ["}"], r, i);
                    if (l == "<")return e.eatSuffix(2), s(e, t, [">"], r, i);
                    if (/[\^'"!~\/]/.test(l))return e.eatSuffix(1), s(e, t, [e.eat(l)], r, i)
                } else if (/[\^'"!~\/(\[{<]/.test(l)) {
                    if (l == "(")return e.eatSuffix(1), s(e, t, [")"], "string");
                    if (l == "[")return e.eatSuffix(1), s(e, t, ["]"], "string");
                    if (l == "{")return e.eatSuffix(1), s(e, t, ["}"], "string");
                    if (l == "<")return e.eatSuffix(1), s(e, t, [">"], "string");
                    if (/[\^'"!~\/]/.test(l))return s(e, t, [e.eat(l)], "string")
                }
            }
        }
        if (u == "m") {
            var l = e.look(-2);
            if (!l || !/\w/.test(l)) {
                l = e.eat(/[(\[{<\^'"!~\/]/);
                if (l) {
                    if (/[\^'"!~\/]/.test(l))return s(e, t, [l], r, i);
                    if (l == "(")return s(e, t, [")"], r, i);
                    if (l == "[")return s(e, t, ["]"], r, i);
                    if (l == "{")return s(e, t, ["}"], r, i);
                    if (l == "<")return s(e, t, [">"], r, i)
                }
            }
        }
        if (u == "s") {
            var l = /[\/>\]})\w]/.test(e.look(-2));
            if (!l) {
                l = e.eat(/[(\[{<\^'"!~\/]/);
                if (l)return l == "[" ? s(e, t, ["]", "]"], r, i) : l == "{" ? s(e, t, ["}", "}"], r, i) : l == "<" ? s(e, t, [">", ">"], r, i) : l == "(" ? s(e, t, [")", ")"], r, i) : s(e, t, [l, l], r, i)
            }
        }
        if (u == "y") {
            var l = /[\/>\]})\w]/.test(e.look(-2));
            if (!l) {
                l = e.eat(/[(\[{<\^'"!~\/]/);
                if (l)return l == "[" ? s(e, t, ["]", "]"], r, i) : l == "{" ? s(e, t, ["}", "}"], r, i) : l == "<" ? s(e, t, [">", ">"], r, i) : l == "(" ? s(e, t, [")", ")"], r, i) : s(e, t, [l, l], r, i)
            }
        }
        if (u == "t") {
            var l = /[\/>\]})\w]/.test(e.look(-2));
            if (!l) {
                l = e.eat("r");
                if (l) {
                    l = e.eat(/[(\[{<\^'"!~\/]/);
                    if (l)return l == "[" ? s(e, t, ["]", "]"], r, i) : l == "{" ? s(e, t, ["}", "}"], r, i) : l == "<" ? s(e, t, [">", ">"], r, i) : l == "(" ? s(e, t, [")", ")"], r, i) : s(e, t, [l, l], r, i)
                }
            }
        }
        if (u == "`")return s(e, t, [u], "variable-2");
        if (u == "/")return /~\s*$/.test(e.prefix()) ? s(e, t, [u], r, i) : "operator";
        if (u == "$") {
            var a = e.pos;
            if (e.eatWhile(/\d/) || e.eat("{") && e.eatWhile(/\d/) && e.eat("}"))return "variable-2";
            e.pos = a
        }
        if (/[$@%]/.test(u)) {
            var a = e.pos;
            if (e.eat("^") && e.eat(/[A-Z]/) || !/[@$%&]/.test(e.look(-2)) && e.eat(/[=|\\\-#?@;:&`~\^!\[\]*'"$+.,\/<>()]/)) {
                var l = e.current();
                if (n[l])return "variable-2"
            }
            e.pos = a
        }
        if (/[$@%&]/.test(u))if (e.eatWhile(/[\w$\[\]]/) || e.eat("{") && e.eatWhile(/[\w$\[\]]/) && e.eat("}")) {
            var l = e.current();
            return n[l] ? "variable-2" : "variable"
        }
        if (u == "#" && e.look(-2) != "$")return e.skipToEnd(), "comment";
        if (/[:+\-\^*$&%@=<>!?|\/~\.]/.test(u)) {
            var a = e.pos;
            e.eatWhile(/[:+\-\^*$&%@=<>!?|\/~\.]/);
            if (n[e.current()])return "operator";
            e.pos = a
        }
        if (u == "_" && e.pos == 1) {
            if (e.suffix(6) == "_END__")return s(e, t, ["\0"], "comment");
            if (e.suffix(7) == "_DATA__")return s(e, t, ["\0"], "variable-2");
            if (e.suffix(7) == "_C__")return s(e, t, ["\0"], "string")
        }
        if (/\w/.test(u)) {
            var a = e.pos;
            if (e.look(-2) == "{" && (e.look(0) == "}" || e.eatWhile(/\w/) && e.look(0) == "}"))return "string";
            e.pos = a
        }
        if (/[A-Z]/.test(u)) {
            var c = e.look(-2), a = e.pos;
            e.eatWhile(/[A-Z_]/);
            if (!/[\da-z]/.test(e.look(0))) {
                var l = n[e.current()];
                return l ? (l[1] && (l = l[0]), c != ":" ? l == 1 ? "keyword" : l == 2 ? "def" : l == 3 ? "atom" : l == 4 ? "operator" : l == 5 ? "variable-2" : "meta" : "meta") : "meta"
            }
            e.pos = a
        }
        if (/[a-zA-Z_]/.test(u)) {
            var c = e.look(-2);
            e.eatWhile(/\w/);
            var l = n[e.current()];
            return l ? (l[1] && (l = l[0]), c != ":" ? l == 1 ? "keyword" : l == 2 ? "def" : l == 3 ? "atom" : l == 4 ? "operator" : l == 5 ? "variable-2" : "meta" : "meta") : "meta"
        }
        return null
    }

    var n = {
        "->": 4,
        "++": 4,
        "--": 4,
        "**": 4,
        "=~": 4,
        "!~": 4,
        "*": 4,
        "/": 4,
        "%": 4,
        x: 4,
        "+": 4,
        "-": 4,
        ".": 4,
        "<<": 4,
        ">>": 4,
        "<": 4,
        ">": 4,
        "<=": 4,
        ">=": 4,
        lt: 4,
        gt: 4,
        le: 4,
        ge: 4,
        "==": 4,
        "!=": 4,
        "<=>": 4,
        eq: 4,
        ne: 4,
        cmp: 4,
        "~~": 4,
        "&": 4,
        "|": 4,
        "^": 4,
        "&&": 4,
        "||": 4,
        "//": 4,
        "..": 4,
        "...": 4,
        "?": 4,
        ":": 4,
        "=": 4,
        "+=": 4,
        "-=": 4,
        "*=": 4,
        ",": 4,
        "=>": 4,
        "::": 4,
        not: 4,
        and: 4,
        or: 4,
        xor: 4,
        BEGIN: [5, 1],
        END: [5, 1],
        PRINT: [5, 1],
        PRINTF: [5, 1],
        GETC: [5, 1],
        READ: [5, 1],
        READLINE: [5, 1],
        DESTROY: [5, 1],
        TIE: [5, 1],
        TIEHANDLE: [5, 1],
        UNTIE: [5, 1],
        STDIN: 5,
        STDIN_TOP: 5,
        STDOUT: 5,
        STDOUT_TOP: 5,
        STDERR: 5,
        STDERR_TOP: 5,
        $ARG: 5,
        $_: 5,
        "@ARG": 5,
        "@_": 5,
        $LIST_SEPARATOR: 5,
        '$"': 5,
        $PROCESS_ID: 5,
        $PID: 5,
        $$: 5,
        $REAL_GROUP_ID: 5,
        $GID: 5,
        "$(": 5,
        $EFFECTIVE_GROUP_ID: 5,
        $EGID: 5,
        "$)": 5,
        $PROGRAM_NAME: 5,
        $0: 5,
        $SUBSCRIPT_SEPARATOR: 5,
        $SUBSEP: 5,
        "$;": 5,
        $REAL_USER_ID: 5,
        $UID: 5,
        "$<": 5,
        $EFFECTIVE_USER_ID: 5,
        $EUID: 5,
        "$>": 5,
        $a: 5,
        $b: 5,
        $COMPILING: 5,
        "$^C": 5,
        $DEBUGGING: 5,
        "$^D": 5,
        "${^ENCODING}": 5,
        $ENV: 5,
        "%ENV": 5,
        $SYSTEM_FD_MAX: 5,
        "$^F": 5,
        "@F": 5,
        "${^GLOBAL_PHASE}": 5,
        "$^H": 5,
        "%^H": 5,
        "@INC": 5,
        "%INC": 5,
        $INPLACE_EDIT: 5,
        "$^I": 5,
        "$^M": 5,
        $OSNAME: 5,
        "$^O": 5,
        "${^OPEN}": 5,
        $PERLDB: 5,
        "$^P": 5,
        $SIG: 5,
        "%SIG": 5,
        $BASETIME: 5,
        "$^T": 5,
        "${^TAINT}": 5,
        "${^UNICODE}": 5,
        "${^UTF8CACHE}": 5,
        "${^UTF8LOCALE}": 5,
        $PERL_VERSION: 5,
        "$^V": 5,
        "${^WIN32_SLOPPY_STAT}": 5,
        $EXECUTABLE_NAME: 5,
        "$^X": 5,
        $1: 5,
        $MATCH: 5,
        "$&": 5,
        "${^MATCH}": 5,
        $PREMATCH: 5,
        "$`": 5,
        "${^PREMATCH}": 5,
        $POSTMATCH: 5,
        "$'": 5,
        "${^POSTMATCH}": 5,
        $LAST_PAREN_MATCH: 5,
        "$+": 5,
        $LAST_SUBMATCH_RESULT: 5,
        "$^N": 5,
        "@LAST_MATCH_END": 5,
        "@+": 5,
        "%LAST_PAREN_MATCH": 5,
        "%+": 5,
        "@LAST_MATCH_START": 5,
        "@-": 5,
        "%LAST_MATCH_START": 5,
        "%-": 5,
        $LAST_REGEXP_CODE_RESULT: 5,
        "$^R": 5,
        "${^RE_DEBUG_FLAGS}": 5,
        "${^RE_TRIE_MAXBUF}": 5,
        $ARGV: 5,
        "@ARGV": 5,
        ARGV: 5,
        ARGVOUT: 5,
        $OUTPUT_FIELD_SEPARATOR: 5,
        $OFS: 5,
        "$,": 5,
        $INPUT_LINE_NUMBER: 5,
        $NR: 5,
        "$.": 5,
        $INPUT_RECORD_SEPARATOR: 5,
        $RS: 5,
        "$/": 5,
        $OUTPUT_RECORD_SEPARATOR: 5,
        $ORS: 5,
        "$\\": 5,
        $OUTPUT_AUTOFLUSH: 5,
        "$|": 5,
        $ACCUMULATOR: 5,
        "$^A": 5,
        $FORMAT_FORMFEED: 5,
        "$^L": 5,
        $FORMAT_PAGE_NUMBER: 5,
        "$%": 5,
        $FORMAT_LINES_LEFT: 5,
        "$-": 5,
        $FORMAT_LINE_BREAK_CHARACTERS: 5,
        "$:": 5,
        $FORMAT_LINES_PER_PAGE: 5,
        "$=": 5,
        $FORMAT_TOP_NAME: 5,
        "$^": 5,
        $FORMAT_NAME: 5,
        "$~": 5,
        "${^CHILD_ERROR_NATIVE}": 5,
        $EXTENDED_OS_ERROR: 5,
        "$^E": 5,
        $EXCEPTIONS_BEING_CAUGHT: 5,
        "$^S": 5,
        $WARNING: 5,
        "$^W": 5,
        "${^WARNING_BITS}": 5,
        $OS_ERROR: 5,
        $ERRNO: 5,
        "$!": 5,
        "%OS_ERROR": 5,
        "%ERRNO": 5,
        "%!": 5,
        $CHILD_ERROR: 5,
        "$?": 5,
        $EVAL_ERROR: 5,
        "$@": 5,
        $OFMT: 5,
        "$#": 5,
        "$*": 5,
        $ARRAY_BASE: 5,
        "$[": 5,
        $OLD_PERL_VERSION: 5,
        "$]": 5,
        "if": [1, 1],
        elsif: [1, 1],
        "else": [1, 1],
        "while": [1, 1],
        unless: [1, 1],
        "for": [1, 1],
        foreach: [1, 1],
        abs: 1,
        accept: 1,
        alarm: 1,
        atan2: 1,
        bind: 1,
        binmode: 1,
        bless: 1,
        bootstrap: 1,
        "break": 1,
        caller: 1,
        chdir: 1,
        chmod: 1,
        chomp: 1,
        chop: 1,
        chown: 1,
        chr: 1,
        chroot: 1,
        close: 1,
        closedir: 1,
        connect: 1,
        "continue": [1, 1],
        cos: 1,
        crypt: 1,
        dbmclose: 1,
        dbmopen: 1,
        "default": 1,
        defined: 1,
        "delete": 1,
        die: 1,
        "do": 1,
        dump: 1,
        each: 1,
        endgrent: 1,
        endhostent: 1,
        endnetent: 1,
        endprotoent: 1,
        endpwent: 1,
        endservent: 1,
        eof: 1,
        eval: 1,
        exec: 1,
        exists: 1,
        exit: 1,
        exp: 1,
        fcntl: 1,
        fileno: 1,
        flock: 1,
        fork: 1,
        format: 1,
        formline: 1,
        getc: 1,
        getgrent: 1,
        getgrgid: 1,
        getgrnam: 1,
        gethostbyaddr: 1,
        gethostbyname: 1,
        gethostent: 1,
        getlogin: 1,
        getnetbyaddr: 1,
        getnetbyname: 1,
        getnetent: 1,
        getpeername: 1,
        getpgrp: 1,
        getppid: 1,
        getpriority: 1,
        getprotobyname: 1,
        getprotobynumber: 1,
        getprotoent: 1,
        getpwent: 1,
        getpwnam: 1,
        getpwuid: 1,
        getservbyname: 1,
        getservbyport: 1,
        getservent: 1,
        getsockname: 1,
        getsockopt: 1,
        given: 1,
        glob: 1,
        gmtime: 1,
        "goto": 1,
        grep: 1,
        hex: 1,
        "import": 1,
        index: 1,
        "int": 1,
        ioctl: 1,
        join: 1,
        keys: 1,
        kill: 1,
        last: 1,
        lc: 1,
        lcfirst: 1,
        length: 1,
        link: 1,
        listen: 1,
        local: 2,
        localtime: 1,
        lock: 1,
        log: 1,
        lstat: 1,
        m: null,
        map: 1,
        mkdir: 1,
        msgctl: 1,
        msgget: 1,
        msgrcv: 1,
        msgsnd: 1,
        my: 2,
        "new": 1,
        next: 1,
        no: 1,
        oct: 1,
        open: 1,
        opendir: 1,
        ord: 1,
        our: 2,
        pack: 1,
        "package": 1,
        pipe: 1,
        pop: 1,
        pos: 1,
        print: 1,
        printf: 1,
        prototype: 1,
        push: 1,
        q: null,
        qq: null,
        qr: null,
        quotemeta: null,
        qw: null,
        qx: null,
        rand: 1,
        read: 1,
        readdir: 1,
        readline: 1,
        readlink: 1,
        readpipe: 1,
        recv: 1,
        redo: 1,
        ref: 1,
        rename: 1,
        require: 1,
        reset: 1,
        "return": 1,
        reverse: 1,
        rewinddir: 1,
        rindex: 1,
        rmdir: 1,
        s: null,
        say: 1,
        scalar: 1,
        seek: 1,
        seekdir: 1,
        select: 1,
        semctl: 1,
        semget: 1,
        semop: 1,
        send: 1,
        setgrent: 1,
        sethostent: 1,
        setnetent: 1,
        setpgrp: 1,
        setpriority: 1,
        setprotoent: 1,
        setpwent: 1,
        setservent: 1,
        setsockopt: 1,
        shift: 1,
        shmctl: 1,
        shmget: 1,
        shmread: 1,
        shmwrite: 1,
        shutdown: 1,
        sin: 1,
        sleep: 1,
        socket: 1,
        socketpair: 1,
        sort: 1,
        splice: 1,
        split: 1,
        sprintf: 1,
        sqrt: 1,
        srand: 1,
        stat: 1,
        state: 1,
        study: 1,
        sub: 1,
        substr: 1,
        symlink: 1,
        syscall: 1,
        sysopen: 1,
        sysread: 1,
        sysseek: 1,
        system: 1,
        syswrite: 1,
        tell: 1,
        telldir: 1,
        tie: 1,
        tied: 1,
        time: 1,
        times: 1,
        tr: null,
        truncate: 1,
        uc: 1,
        ucfirst: 1,
        umask: 1,
        undef: 1,
        unlink: 1,
        unpack: 1,
        unshift: 1,
        untie: 1,
        use: 1,
        utime: 1,
        values: 1,
        vec: 1,
        wait: 1,
        waitpid: 1,
        wantarray: 1,
        warn: 1,
        when: 1,
        write: 1,
        y: null
    }, r = "string-2", i = /[goseximacplud]/;
    return {
        startState: function () {
            return {tokenize: u, chain: null, style: null, tail: null}
        }, token: function (e, t) {
            return (t.tokenize || u)(e, t)
        }, electricChars: "{}"
    }
}), CodeMirror.defineMIME("text/x-perl", "perl"), CodeMirror.StringStream.prototype.look = function (e) {
    return this.string.charAt(this.pos + (e || 0))
}, CodeMirror.StringStream.prototype.prefix = function (e) {
    if (e) {
        var t = this.pos - e;
        return this.string.substr(t >= 0 ? t : 0, e)
    }
    return this.string.substr(0, this.pos - 1)
}, CodeMirror.StringStream.prototype.suffix = function (e) {
    var t = this.string.length, n = t - this.pos + 1;
    return this.string.substr(this.pos, e && e < t ? e : n)
}, CodeMirror.StringStream.prototype.nsuffix = function (e) {
    var t = this.pos, n = e || this.string.length - this.pos + 1;
    return this.pos += n, this.string.substr(t, n)
}, CodeMirror.StringStream.prototype.eatSuffix = function (e) {
    var t = this.pos + e, n;
    t <= 0 ? this.pos = 0 : t >= (n = this.string.length - 1) ? this.pos = n : this.pos = t
}, function () {
    function e(e) {
        var t = {}, n = e.split(" ");
        for (var r = 0; r < n.length; ++r)t[n[r]] = !0;
        return t
    }

    function t(e) {
        return function (t, n) {
            return t.match(e) ? n.tokenize = null : t.skipToEnd(), "string"
        }
    }

    var n = {
        name: "clike",
        keywords: e("abstract and array as break case catch class clone const continue declare default do else elseif enddeclare endfor endforeach endif endswitch endwhile extends final for foreach function global goto if implements interface instanceof namespace new or private protected public static switch throw trait try use var while xor die echo empty exit eval include include_once isset list require require_once return print unset __halt_compiler self static parent"),
        blockKeywords: e("catch do else elseif for foreach if switch try while"),
        atoms: e("true false null TRUE FALSE NULL"),
        multiLineStrings: !0,
        hooks: {
            $: function (e, t) {
                return e.eatWhile(/[\w\$_]/), "variable-2"
            }, "<": function (e, n) {
                return e.match(/<</) ? (e.eatWhile(/[\w\.]/), n.tokenize = t(e.current().slice(3)), n.tokenize(e, n)) : !1
            }, "#": function (e, t) {
                while (!e.eol() && !e.match("?>", !1))e.next();
                return "comment"
            }, "/": function (e, t) {
                if (e.eat("/")) {
                    while (!e.eol() && !e.match("?>", !1))e.next();
                    return "comment"
                }
                return !1
            }
        }
    };
    CodeMirror.defineMode("php", function (e, t) {
        function u(e, t) {
            var n = t.mode == "php";
            e.sol() && t.pending != '"' && (t.pending = null);
            if (t.curMode == r) {
                if (e.match(/^<\?\w*/))return t.curMode = o, t.curState = t.php, t.curClose = "?>", t.mode = "php", "meta";
                if (t.pending == '"') {
                    while (!e.eol() && e.next() != '"');
                    var a = "string"
                } else if (t.pending && e.pos < t.pending.end) {
                    e.pos = t.pending.end;
                    var a = t.pending.style
                } else var a = r.token(e, t.curState);
                t.pending = null;
                var f = e.current(), l = f.search(/<\?/);
                return l != -1 ? (a == "string" && /\"$/.test(f) && !/\?>/.test(f) ? t.pending = '"' : t.pending = {
                    end: e.pos,
                    style: a
                }, e.backUp(f.length - l)) : a == "tag" && e.current() == ">" && t.curState.context && (/^script$/i.test(t.curState.context.tagName) ? (t.curMode = i, t.curState = i.startState(r.indent(t.curState, "")), t.curClose = /^<\/\s*script\s*>/i, t.mode = "javascript") : /^style$/i.test(t.curState.context.tagName) && (t.curMode = s, t.curState = s.startState(r.indent(t.curState, "")), t.curClose = /^<\/\s*style\s*>/i, t.mode = "css")), a
            }
            return (!n || t.php.tokenize == null) && e.match(t.curClose, n) ? (t.curMode = r, t.curState = t.html, t.curClose = null, t.mode = "html", n ? "meta" : u(e, t)) : t.curMode.token(e, t.curState)
        }

        var r = CodeMirror.getMode(e, {name: "xml", htmlMode: !0}), i = CodeMirror.getMode(e, "javascript"), s = CodeMirror.getMode(e, "css"), o = CodeMirror.getMode(e, n);
        return {
            startState: function () {
                var e = r.startState();
                return {
                    html: e,
                    php: o.startState(),
                    curMode: t.startOpen ? o : r,
                    curState: t.startOpen ? o.startState() : e,
                    curClose: t.startOpen ? /^\?>/ : null,
                    mode: t.startOpen ? "php" : "html",
                    pending: null
                }
            }, copyState: function (e) {
                var t = e.html, n = CodeMirror.copyState(r, t), i = e.php, s = CodeMirror.copyState(o, i), u;
                return e.curState == t ? u = n : e.curState == i ? u = s : u = CodeMirror.copyState(e.curMode, e.curState), {
                    html: n,
                    php: s,
                    curMode: e.curMode,
                    curState: u,
                    curClose: e.curClose,
                    mode: e.mode,
                    pending: e.pending
                }
            }, token: u, indent: function (e, t) {
                return e.curMode != o && /^\s*<\//.test(t) || e.curMode == o && /^\?>/.test(t) ? r.indent(e.html, t) : e.curMode.indent(e.curState, t)
            }, electricChars: "/{}:"
        }
    }, "xml", "clike", "javascript", "css"), CodeMirror.defineMIME("application/x-httpd-php", "php"), CodeMirror.defineMIME("application/x-httpd-php-open", {
        name: "php",
        startOpen: !0
    }), CodeMirror.defineMIME("text/x-php", n)
}(), CodeMirror.defineMode("pig", function (e, t) {
    function a(e, t, n) {
        return t.tokenize = n, n(e, t)
    }

    function l(e, t) {
        return f = e, t
    }

    function c(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "/" && n) {
                t.tokenize = p;
                break
            }
            n = r == "*"
        }
        return l("comment", "comment")
    }

    function h(e) {
        return function (t, n) {
            var r = !1, i, s = !1;
            while ((i = t.next()) != null) {
                if (i == e && !r) {
                    s = !0;
                    break
                }
                r = !r && i == "\\"
            }
            if (s || !r && !o) n.tokenize = p;
            return l("string", "error")
        }
    }

    function p(e, t) {
        var n = e.next();
        return n == '"' || n == "'" ? a(e, t, h(n)) : /[\[\]{}\(\),;\.]/.test(n) ? l(n) : /\d/.test(n) ? (e.eatWhile(/[\w\.]/), l("number", "number")) : n == "/" ? e.eat("*") ? a(e, t, c) : (e.eatWhile(u), l("operator", "operator")) : n == "-" ? e.eat("-") ? (e.skipToEnd(), l("comment", "comment")) : (e.eatWhile(u), l("operator", "operator")) : u.test(n) ? (e.eatWhile(u), l("operator", "operator")) : (e.eatWhile(/[\w\$_]/), r && r.propertyIsEnumerable(e.current().toUpperCase()) && !e.eat(")") && !e.eat(".") ? ("keyword", "keyword") : i && i.propertyIsEnumerable(e.current().toUpperCase()) ? ("keyword", "variable-2") : s && s.propertyIsEnumerable(e.current().toUpperCase()) ? ("keyword", "variable-3") : l("variable", "pig-word"))
    }

    var n = e.indentUnit, r = t.keywords, i = t.builtins, s = t.types, o = t.multiLineStrings, u = /[*+\-%<>=&?:\/!|]/, f;
    return {
        startState: function (e) {
            return {tokenize: p, startOfLine: !0}
        }, token: function (e, t) {
            if (e.eatSpace())return null;
            var n = t.tokenize(e, t);
            return n
        }
    }
}), function () {
    function e(e) {
        var t = {}, n = e.split(" ");
        for (var r = 0; r < n.length; ++r)t[n[r]] = !0;
        return t
    }

    var t = "ABS ACOS ARITY ASIN ATAN AVG BAGSIZE BINSTORAGE BLOOM BUILDBLOOM CBRT CEIL CONCAT COR COS COSH COUNT COUNT_STAR COV CONSTANTSIZE CUBEDIMENSIONS DIFF DISTINCT DOUBLEABS DOUBLEAVG DOUBLEBASE DOUBLEMAX DOUBLEMIN DOUBLEROUND DOUBLESUM EXP FLOOR FLOATABS FLOATAVG FLOATMAX FLOATMIN FLOATROUND FLOATSUM GENERICINVOKER INDEXOF INTABS INTAVG INTMAX INTMIN INTSUM INVOKEFORDOUBLE INVOKEFORFLOAT INVOKEFORINT INVOKEFORLONG INVOKEFORSTRING INVOKER ISEMPTY JSONLOADER JSONMETADATA JSONSTORAGE LAST_INDEX_OF LCFIRST LOG LOG10 LOWER LONGABS LONGAVG LONGMAX LONGMIN LONGSUM MAX MIN MAPSIZE MONITOREDUDF NONDETERMINISTIC OUTPUTSCHEMA  PIGSTORAGE PIGSTREAMING RANDOM REGEX_EXTRACT REGEX_EXTRACT_ALL REPLACE ROUND SIN SINH SIZE SQRT STRSPLIT SUBSTRING SUM STRINGCONCAT STRINGMAX STRINGMIN STRINGSIZE TAN TANH TOBAG TOKENIZE TOMAP TOP TOTUPLE TRIM TEXTLOADER TUPLESIZE UCFIRST UPPER UTF8STORAGECONVERTER ",
        n = "VOID IMPORT RETURNS DEFINE LOAD FILTER FOREACH ORDER CUBE DISTINCT COGROUP JOIN CROSS UNION SPLIT INTO IF OTHERWISE ALL AS BY USING INNER OUTER ONSCHEMA PARALLEL PARTITION GROUP AND OR NOT GENERATE FLATTEN ASC DESC IS STREAM THROUGH STORE MAPREDUCE SHIP CACHE INPUT OUTPUT STDERROR STDIN STDOUT LIMIT SAMPLE LEFT RIGHT FULL EQ GT LT GTE LTE NEQ MATCHES TRUE FALSE ",
        r = "BOOLEAN INT LONG FLOAT DOUBLE CHARARRAY BYTEARRAY BAG TUPLE MAP ";
    CodeMirror.defineMIME("text/x-pig", {name: "pig", builtins: e(t), keywords: e(n), types: e(r)})
}(), CodeMirror.defineMode("plsql", function (e, t) {
    function f(e, t, n) {
        return t.tokenize = n, n(e, t)
    }

    function c(e, t) {
        return l = e, t
    }

    function h(e, t) {
        var n = e.next();
        return n == '"' || n == "'" ? f(e, t, p(n)) : /[\[\]{}\(\),;\.]/.test(n) ? c(n) : /\d/.test(n) ? (e.eatWhile(/[\w\.]/), c("number", "number")) : n == "/" ? e.eat("*") ? f(e, t, d) : (e.eatWhile(a), c("operator", "operator")) : n == "-" ? e.eat("-") ? (e.skipToEnd(), c("comment", "comment")) : (e.eatWhile(a), c("operator", "operator")) : n == "@" || n == "$" ? (e.eatWhile(/[\w\d\$_]/), c("word", "variable")) : a.test(n) ? (e.eatWhile(a), c("operator", "operator")) : (e.eatWhile(/[\w\$_]/), r && r.propertyIsEnumerable(e.current().toLowerCase()) ? c("keyword", "keyword") : i && i.propertyIsEnumerable(e.current().toLowerCase()) ? c("keyword", "builtin") : s && s.propertyIsEnumerable(e.current().toLowerCase()) ? c("keyword", "variable-2") : o && o.propertyIsEnumerable(e.current().toLowerCase()) ? c("keyword", "variable-3") : c("word", "variable"))
    }

    function p(e) {
        return function (t, n) {
            var r = !1, i, s = !1;
            while ((i = t.next()) != null) {
                if (i == e && !r) {
                    s = !0;
                    break
                }
                r = !r && i == "\\"
            }
            if (s || !r && !u) n.tokenize = h;
            return c("string", "plsql-string")
        }
    }

    function d(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "/" && n) {
                t.tokenize = h;
                break
            }
            n = r == "*"
        }
        return c("comment", "plsql-comment")
    }

    var n = e.indentUnit, r = t.keywords, i = t.functions, s = t.types, o = t.sqlplus, u = t.multiLineStrings, a = /[+\-*&%=<>!?:\/|]/, l;
    return {
        startState: function (e) {
            return {tokenize: h, startOfLine: !0}
        }, token: function (e, t) {
            if (e.eatSpace())return null;
            var n = t.tokenize(e, t);
            return n
        }
    }
}), function () {
    function e(e) {
        var t = {}, n = e.split(" ");
        for (var r = 0; r < n.length; ++r)t[n[r]] = !0;
        return t
    }

    var t = "abort accept access add all alter and any array arraylen as asc assert assign at attributes audit authorization avg base_table begin between binary_integer body boolean by case cast char char_base check close cluster clusters colauth column comment commit compress connect connected constant constraint crash create current currval cursor data_base database date dba deallocate debugoff debugon decimal declare default definition delay delete desc digits dispose distinct do drop else elsif enable end entry escape exception exception_init exchange exclusive exists exit external fast fetch file for force form from function generic goto grant group having identified if immediate in increment index indexes indicator initial initrans insert interface intersect into is key level library like limited local lock log logging long loop master maxextents maxtrans member minextents minus mislabel mode modify multiset new next no noaudit nocompress nologging noparallel not nowait number_base object of off offline on online only open option or order out package parallel partition pctfree pctincrease pctused pls_integer positive positiven pragma primary prior private privileges procedure public raise range raw read rebuild record ref references refresh release rename replace resource restrict return returning reverse revoke rollback row rowid rowlabel rownum rows run savepoint schema segment select separate session set share snapshot some space split sql start statement storage subtype successful synonym tabauth table tables tablespace task terminate then to trigger truncate type union unique unlimited unrecoverable unusable update use using validate value values variable view views when whenever where while with work",
        n = "abs acos add_months ascii asin atan atan2 average bfilename ceil chartorowid chr concat convert cos cosh count decode deref dual dump dup_val_on_index empty error exp false floor found glb greatest hextoraw initcap instr instrb isopen last_day least lenght lenghtb ln lower lpad ltrim lub make_ref max min mod months_between new_time next_day nextval nls_charset_decl_len nls_charset_id nls_charset_name nls_initcap nls_lower nls_sort nls_upper nlssort no_data_found notfound null nvl others power rawtohex reftohex round rowcount rowidtochar rpad rtrim sign sin sinh soundex sqlcode sqlerrm sqrt stddev substr substrb sum sysdate tan tanh to_char to_date to_label to_multi_byte to_number to_single_byte translate true trunc uid upper user userenv variance vsize",
        r = "bfile blob character clob dec float int integer mlslabel natural naturaln nchar nclob number numeric nvarchar2 real rowtype signtype smallint string varchar varchar2",
        i = "appinfo arraysize autocommit autoprint autorecovery autotrace blockterminator break btitle cmdsep colsep compatibility compute concat copycommit copytypecheck define describe echo editfile embedded escape exec execute feedback flagger flush heading headsep instance linesize lno loboffset logsource long longchunksize markup native newpage numformat numwidth pagesize pause pno recsep recsepchar release repfooter repheader serveroutput shiftinout show showmode size spool sqlblanklines sqlcase sqlcode sqlcontinue sqlnumber sqlpluscompatibility sqlprefix sqlprompt sqlterminator suffix tab term termout time timing trimout trimspool ttitle underline verify version wrap";
    CodeMirror.defineMIME("text/x-plsql", {name: "plsql", keywords: e(t), functions: e(n), types: e(r), sqlplus: e(i)})
}(), CodeMirror.defineMode("properties", function () {
    return {
        token: function (e, t) {
            var n = e.sol() || t.afterSection, r = e.eol();
            t.afterSection = !1, n && (t.nextMultiline ? (t.inMultiline = !0, t.nextMultiline = !1) : t.position = "def"), r && !t.nextMultiline && (t.inMultiline = !1, t.position = "def");
            if (n)while (e.eatSpace());
            var i = e.next();
            return !n || i !== "#" && i !== "!" && i !== ";" ? n && i === "[" ? (t.afterSection = !0, e.skipTo("]"), e.eat("]"), "header") : i === "=" || i === ":" ? (t.position = "quote", null) : (i === "\\" && t.position === "quote" && e.next() !== "u" && (t.nextMultiline = !0), t.position) : (t.position = "comment", e.skipToEnd(), "comment")
        }, startState: function () {
            return {position: "def", nextMultiline: !1, inMultiline: !1, afterSection: !1}
        }
    }
}), CodeMirror.defineMIME("text/x-properties", "properties"), CodeMirror.defineMIME("text/x-ini", "properties"), CodeMirror.defineMode("python", function (e, t) {
    function r(e) {
        return new RegExp("^((" + e.join(")|(") + "))\\b")
    }

    function b(e, t) {
        if (e.sol()) {
            var r = t.scopes[0].offset;
            if (e.eatSpace()) {
                var c = e.indentation();
                return c > r ? y = "indent" : c < r && (y = "dedent"), null
            }
            r > 0 && S(e, t)
        }
        if (e.eatSpace())return null;
        var h = e.peek();
        if (h === "#")return e.skipToEnd(), "comment";
        if (e.match(/^[0-9\.]/, !1)) {
            var p = !1;
            e.match(/^\d*\.\d+(e[\+\-]?\d+)?/i) && (p = !0), e.match(/^\d+\.\d*/) && (p = !0), e.match(/^\.\d+/) && (p = !0);
            if (p)return e.eat(/J/i), "number";
            var d = !1;
            e.match(/^0x[0-9a-f]+/i) && (d = !0), e.match(/^0b[01]+/i) && (d = !0), e.match(/^0o[0-7]+/i) && (d = !0), e.match(/^[1-9]\d*(e[\+\-]?\d+)?/) && (e.eat(/J/i), d = !0), e.match(/^0(?![\dx])/i) && (d = !0);
            if (d)return e.eat(/L/i), "number"
        }
        return e.match(v) ? (t.tokenize = w(e.current()), t.tokenize(e, t)) : e.match(a) || e.match(u) ? null : e.match(o) || e.match(i) || e.match(l) ? "operator" : e.match(s) ? null : e.match(m) ? "keyword" : e.match(g) ? "builtin" : e.match(f) ? "variable" : (e.next(), n)
    }

    function w(e) {
        while ("rub".indexOf(e.charAt(0).toLowerCase()) >= 0)e = e.substr(1);
        var r = e.length == 1, i = "string";
        return function (o, u) {
            while (!o.eol()) {
                o.eatWhile(/[^'"\\]/);
                if (o.eat("\\")) {
                    o.next();
                    if (r && o.eol())return i
                } else {
                    if (o.match(e))return u.tokenize = b, i;
                    o.eat(/['"]/)
                }
            }
            if (r) {
                if (t.singleLineStringErrors)return n;
                u.tokenize = b
            }
            return i
        }
    }

    function E(t, n, r) {
        r = r || "py";
        var i = 0;
        if (r === "py") {
            if (n.scopes[0].type !== "py") {
                n.scopes[0].offset = t.indentation();
                return
            }
            for (var s = 0; s < n.scopes.length; ++s)if (n.scopes[s].type === "py") {
                i = n.scopes[s].offset + e.indentUnit;
                break
            }
        } else i = t.column() + t.current().length;
        n.scopes.unshift({offset: i, type: r})
    }

    function S(e, t, n) {
        n = n || "py";
        if (t.scopes.length == 1)return;
        if (t.scopes[0].type === "py") {
            var r = e.indentation(), i = -1;
            for (var s = 0; s < t.scopes.length; ++s)if (r === t.scopes[s].offset) {
                i = s;
                break
            }
            if (i === -1)return !0;
            while (t.scopes[0].offset !== r)t.scopes.shift();
            return !1
        }
        return n === "py" ? (t.scopes[0].offset = e.indentation(), !1) : t.scopes[0].type != n ? !0 : (t.scopes.shift(), !1)
    }

    function x(e, t) {
        y = null;
        var r = t.tokenize(e, t), i = e.current();
        if (i === ".")return r = e.match(f, !1) ? null : n, r === null && t.lastToken === "meta" && (r = "meta"), r;
        if (i === "@")return e.match(f, !1) ? "meta" : n;
        (r === "variable" || r === "builtin") && t.lastToken === "meta" && (r = "meta");
        if (i === "pass" || i === "return") t.dedent += 1;
        i === "lambda" && (t.lambda = !0), (i === ":" && !t.lambda && t.scopes[0].type == "py" || y === "indent") && E(e, t);
        var s = "[({".indexOf(i);
        return s !== -1 && E(e, t, "])}".slice(s, s + 1)), y === "dedent" && S(e, t) ? n : (s = "])}".indexOf(i), s !== -1 && S(e, t, i) ? n : (t.dedent > 0 && e.eol() && t.scopes[0].type == "py" && (t.scopes.length > 1 && t.scopes.shift(), t.dedent -= 1), r))
    }

    var n = "error", i = new RegExp("^[\\+\\-\\*/%&|\\^~<>!]"), s = new RegExp("^[\\(\\)\\[\\]\\{\\}@,:`=;\\.]"),
        o = new RegExp("^((==)|(!=)|(<=)|(>=)|(<>)|(<<)|(>>)|(//)|(\\*\\*))"), u = new RegExp("^((\\+=)|(\\-=)|(\\*=)|(%=)|(/=)|(&=)|(\\|=)|(\\^=))"),
        a = new RegExp("^((//=)|(>>=)|(<<=)|(\\*\\*=))"), f = new RegExp("^[_A-Za-z][_A-Za-z0-9]*"), l = r(["and", "or", "not", "is", "in"]),
        c = ["as", "assert", "break", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "lambda", "pass", "raise", "return", "try", "while", "with", "yield"],
        h = ["abs", "all", "any", "bin", "bool", "bytearray", "callable", "chr", "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod", "enumerate", "eval", "filter", "float", "format", "frozenset", "getattr", "globals", "hasattr", "hash", "help", "hex", "id", "input", "int", "isinstance", "issubclass", "iter", "len", "list", "locals", "map", "max", "memoryview", "min", "next", "object", "oct", "open", "ord", "pow", "property", "range", "repr", "reversed", "round", "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super", "tuple", "type", "vars", "zip", "__import__", "NotImplemented", "Ellipsis", "__debug__"],
        p = {
            builtins: ["apply", "basestring", "buffer", "cmp", "coerce", "execfile", "file", "intern", "long", "raw_input", "reduce", "reload", "unichr", "unicode", "xrange", "False", "True", "None"],
            keywords: ["exec", "print"]
        }, d = {builtins: ["ascii", "bytes", "exec", "print"], keywords: ["nonlocal", "False", "True", "None"]};
    if (!t.version || parseInt(t.version, 10) !== 3) {
        c = c.concat(p.keywords), h = h.concat(p.builtins);
        var v = new RegExp("^(([rub]|(ur)|(br))?('{3}|\"{3}|['\"]))", "i")
    } else {
        c = c.concat(d.keywords), h = h.concat(d.builtins);
        var v = new RegExp("^(([rb]|(br))?('{3}|\"{3}|['\"]))", "i")
    }
    var m = r(c), g = r(h), y = null, T = {
        startState: function (e) {
            return {tokenize: b, scopes: [{offset: e || 0, type: "py"}], lastToken: null, lambda: !1, dedent: 0}
        }, token: function (e, t) {
            var n = x(e, t);
            return t.lastToken = n, e.eol() && e.lambda && (t.lambda = !1), n
        }, indent: function (e, t) {
            return e.tokenize != b ? 0 : e.scopes[0].offset
        }
    };
    return T
}), CodeMirror.defineMIME("text/x-python", "python"), CodeMirror.defineMode("r", function (e) {
    function t(e) {
        var t = e.split(" "), n = {};
        for (var r = 0; r < t.length; ++r)n[t[r]] = !0;
        return n
    }

    function a(e, t) {
        u = null;
        var a = e.next();
        if (a == "#")return e.skipToEnd(), "comment";
        if (a == "0" && e.eat("x"))return e.eatWhile(/[\da-f]/i), "number";
        if (a == "." && e.eat(/\d/))return e.match(/\d*(?:e[+\-]?\d+)?/), "number";
        if (/\d/.test(a))return e.match(/\d*(?:\.\d+)?(?:e[+\-]\d+)?L?/), "number";
        if (a == "'" || a == '"')return t.tokenize = f(a), "string";
        if (a == "." && e.match(/.[.\d]+/))return "keyword";
        if (/[\w\.]/.test(a) && a != "_") {
            e.eatWhile(/[\w\.]/);
            var l = e.current();
            return n.propertyIsEnumerable(l) ? "atom" : i.propertyIsEnumerable(l) ? (s.propertyIsEnumerable(l) && (u = "block"), "keyword") : r.propertyIsEnumerable(l) ? "builtin" : "variable"
        }
        return a == "%" ? (e.skipTo("%") && e.next(), "variable-2") : a == "<" && e.eat("-") ? "arrow" : a == "=" && t.ctx.argList ? "arg-is" : o.test(a) ? a == "$" ? "dollar" : (e.eatWhile(o), "operator") : /[\(\){}\[\];]/.test(a) ? (u = a, a == ";" ? "semi" : null) : null
    }

    function f(e) {
        return function (t, n) {
            if (t.eat("\\")) {
                var r = t.next();
                return r == "x" ? t.match(/^[a-f0-9]{2}/i) : (r == "u" || r == "U") && t.eat("{") && t.skipTo("}") ? t.next() : r == "u" ? t.match(/^[a-f0-9]{4}/i) : r == "U" ? t.match(/^[a-f0-9]{8}/i) : /[0-7]/.test(r) && t.match(/^[0-7]{1,2}/), "string-2"
            }
            var i;
            while ((i = t.next()) != null) {
                if (i == e) {
                    n.tokenize = a;
                    break
                }
                if (i == "\\") {
                    t.backUp(1);
                    break
                }
            }
            return "string"
        }
    }

    function l(e, t, n) {
        e.ctx = {type: t, indent: e.indent, align: null, column: n.column(), prev: e.ctx}
    }

    function c(e) {
        e.indent = e.ctx.indent, e.ctx = e.ctx.prev
    }

    var n = t("NULL NA Inf NaN NA_integer_ NA_real_ NA_complex_ NA_character_"), r = t("list quote bquote eval return call parse deparse"),
        i = t("if else repeat while function for in next break"), s = t("if else repeat while function for"), o = /[+\-*\/^<>=!&|~$:]/, u;
    return {
        startState: function (t) {
            return {tokenize: a, ctx: {type: "top", indent: -e.indentUnit, align: !1}, indent: 0, afterIdent: !1}
        }, token: function (e, t) {
            e.sol() && (t.ctx.align == null && (t.ctx.align = !1), t.indent = e.indentation());
            if (e.eatSpace())return null;
            var n = t.tokenize(e, t);
            n != "comment" && t.ctx.align == null && (t.ctx.align = !0);
            var r = t.ctx.type;
            return (u == ";" || u == "{" || u == "}") && r == "block" && c(t), u == "{" ? l(t, "}", e) : u == "(" ? (l(t, ")", e), t.afterIdent && (t.ctx.argList = !0)) : u == "[" ? l(t, "]", e) : u == "block" ? l(t, "block", e) : u == r && c(t), t.afterIdent = n == "variable" || n == "keyword", n
        }, indent: function (t, n) {
            if (t.tokenize != a)return 0;
            var r = n && n.charAt(0), i = t.ctx, s = r == i.type;
            return i.type == "block" ? i.indent + (r == "{" ? 0 : e.indentUnit) : i.align ? i.column + (s ? 0 : 1) : i.indent + (s ? 0 : e.indentUnit)
        }
    }
}), CodeMirror.defineMIME("text/x-rsrc", "r"), CodeMirror.defineMode("changes", function (e, t) {
    var n = /^-+$/, r = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)  ?\d{1,2} \d{2}:\d{2}(:\d{2})? [A-Z]{3,4} \d{4} - /,
        i = /^[\w+.-]+@[\w.-]+/;
    return {
        token: function (e) {
            if (e.sol()) {
                if (e.match(n))return "tag";
                if (e.match(r))return "tag"
            }
            return e.match(i) ? "string" : (e.next(), null)
        }
    }
}), CodeMirror.defineMIME("text/x-rpm-changes", "changes"), CodeMirror.defineMode("spec", function (e, t) {
    var n = /^(i386|i586|i686|x86_64|ppc64|ppc|ia64|s390x|s390|sparc64|sparcv9|sparc|noarch|alphaev6|alpha|hppa|mipsel)/,
        r = /^(Name|Version|Release|License|Summary|Url|Group|Source|BuildArch|BuildRequires|BuildRoot|AutoReqProv|Provides|Requires(\(\w+\))?|Obsoletes|Conflicts|Recommends|Source\d*|Patch\d*|ExclusiveArch|NoSource|Supplements):/,
        i = /^%(debug_package|package|description|prep|build|install|files|clean|changelog|preun|postun|pre|post|triggerin|triggerun|pretrans|posttrans|verifyscript|check|triggerpostun|triggerprein|trigger)/,
        s = /^%(ifnarch|ifarch|if)/, o = /^%(else|endif)/, u = /^(\!|\?|\<\=|\<|\>\=|\>|\=\=|\&\&|\|\|)/;
    return {
        startState: function () {
            return {controlFlow: !1, macroParameters: !1, section: !1}
        }, token: function (e, t) {
            var a = e.peek();
            if (a == "#")return e.skipToEnd(), "comment";
            if (e.sol()) {
                if (e.match(r))return "preamble";
                if (e.match(i))return "section"
            }
            if (e.match(/^\$\w+/))return "def";
            if (e.match(/^\$\{\w+\}/))return "def";
            if (e.match(o))return "keyword";
            if (e.match(s))return t.controlFlow = !0, "keyword";
            if (t.controlFlow) {
                if (e.match(u))return "operator";
                if (e.match(/^(\d+)/))return "number";
                e.eol() && (t.controlFlow = !1)
            }
            if (e.match(n))return "number";
            if (e.match(/^%[\w]+/))return e.match(/^\(/) && (t.macroParameters = !0), "macro";
            if (t.macroParameters) {
                if (e.match(/^\d+/))return "number";
                if (e.match(/^\)/))return t.macroParameters = !1, "macro"
            }
            return e.match(/^%\{\??[\w \-]+\}/) ? "macro" : (e.next(), null)
        }
    }
}), CodeMirror.defineMIME("text/x-rpm-spec", "spec"), CodeMirror.defineMode("rst", function (e, t) {
    function n(e, t, n) {
        e.fn = t, r(e, n)
    }

    function r(e, t) {
        e.ctx = t || {}
    }

    function i(e, t) {
        if (t && typeof t != "string") {
            var r = t.current();
            t = r[r.length - 1]
        }
        n(e, x, {back: t})
    }

    function s(e) {
        if (e) {
            var t = CodeMirror.listModes();
            for (var n in t)if (t[n] == e)return !0
        }
        return !1
    }

    function o(t) {
        return s(t) ? CodeMirror.getMode(e, t) : null
    }

    function x(e, t) {
        function c(e) {
            return s || !t.ctx.back || e.test(t.ctx.back)
        }

        function h(t) {
            return e.eol() || e.match(t, !1)
        }

        function p(t) {
            return e.match(t) && c(/\W/) && h(/\W/)
        }

        var r, s, o;
        if (e.eat(/\\/))return r = e.next(), i(t, r), null;
        s = e.sol();
        if (s && (r = e.eat(f))) {
            for (o = 0; e.eat(r); o++);
            if (o >= 3 && e.match(/^\s*$/))return i(t, null), "header";
            e.backUp(o + 1)
        }
        if (s && e.match(m))return e.eol() || n(t, N), "meta";
        if (e.match(g)) {
            if (!u) n(t, L); else {
                var l = u;
                n(t, L, {mode: l, local: l.startState()})
            }
            return "meta"
        }
        if (s && e.match(S, !1)) {
            if (!a)return n(t, L), "meta";
            var l = a;
            return n(t, L, {mode: l, local: l.startState()}), null
        }
        if (p(d))return i(t, e), "footnote";
        if (p(v))return i(t, e), "citation";
        r = e.next();
        if (c(y)) {
            if (!(r !== ":" && r !== "|" || !e.eat(/\S/))) {
                var b;
                return r === ":" ? b = "builtin" : b = "atom", n(t, T, {ch: r, wide: !1, prev: null, token: b}), b
            }
            if (r === "*" || r === "`") {
                var w = r, E = !1;
                r = e.next(), r == w && (E = !0, r = e.next());
                if (r && !/\s/.test(r)) {
                    var b;
                    return w === "*" ? b = E ? "strong" : "em" : b = E ? "string" : "string-2", n(t, T, {ch: w, wide: E, prev: null, token: b}), b
                }
            }
        }
        return i(t, r), null
    }

    function T(e, t) {
        function o(e) {
            return t.ctx.prev = e, s
        }

        var r = e.next(), s = t.ctx.token;
        if (r != t.ctx.ch)return o(r);
        if (/\s/.test(t.ctx.prev))return o(r);
        if (t.ctx.wide) {
            r = e.next();
            if (r != t.ctx.ch)return o(r)
        }
        return !e.eol() && !b.test(e.peek()) ? (t.ctx.wide && e.backUp(1), o(r)) : (n(t, x), i(t, r), s)
    }

    function N(e, t) {
        var r = null;
        if (e.match(l)) r = "attribute"; else if (e.match(c)) r = "link"; else if (e.match(h)) r = "quote"; else {
            if (!e.match(p))return e.eatSpace(), e.eol() ? (i(t, e), null) : (e.skipToEnd(), n(t, k), "comment");
            r = "quote"
        }
        return n(t, C, {start: !0}), r
    }

    function C(e, t) {
        var n = "body";
        return !t.ctx.start || e.sol() ? A(e, t, n) : (e.skipToEnd(), r(t), n)
    }

    function k(e, t) {
        return A(e, t, "comment")
    }

    function L(e, t) {
        return u ? e.sol() ? (e.eatSpace() || i(t, e), null) : u.token(e, t.ctx.local) : A(e, t, "meta")
    }

    function A(e, t, n) {
        return e.eol() || e.eatSpace() ? (e.skipToEnd(), n) : (i(t, e), null)
    }

    var u = o(t.verbatim), a = o("python"), f = /^[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/, l = /^\s*\w([-:.\w]*\w)?::(\s|$)/, c = /^\s*_[\w-]+:(\s|$)/,
        h = /^\s*\[(\d+|#)\](\s|$)/, p = /^\s*\[[A-Za-z][\w-]*\](\s|$)/, d = /^\[(\d+|#)\]_/, v = /^\[[A-Za-z][\w-]*\]_/, m = /^\.\.(\s|$)/, g = /^::\s*$/,
        y = /^[-\s"([{</:]/, b = /^[-\s`'")\]}>/:.,;!?\\_]/, w = /^\s*((\d+|[A-Za-z#])[.)]|\((\d+|[A-Z-a-z#])\))\s/, E = /^\s*[-\+\*]\s/, S = /^\s+(>>>|In \[\d+\]:)\s/;
    return {
        startState: function () {
            return {fn: x, ctx: {}}
        }, copyState: function (e) {
            return {fn: e.fn, ctx: e.ctx}
        }, token: function (e, t) {
            var n = t.fn(e, t);
            return n
        }
    }
}, "python"), CodeMirror.defineMIME("text/x-rst", "rst"), CodeMirror.defineMode("ruby", function (e, t) {
    function n(e) {
        var t = {};
        for (var n = 0, r = e.length; n < r; ++n)t[e[n]] = !0;
        return t
    }

    function a(e, t, n) {
        return n.tokenize.push(e), e(t, n)
    }

    function f(e, t) {
        u = null;
        if (e.sol() && e.match("=begin") && e.eol())return t.tokenize.push(p), "comment";
        if (e.eatSpace())return null;
        var n = e.next(), r;
        if (n == "`" || n == "'" || n == '"' || n == "/" && !e.eol() && e.peek() != " ")return a(c(n, "string", n == '"' || n == "`"), e, t);
        if (n == "%") {
            var i, s = !1;
            e.eat("s") ? i = "atom" : e.eat(/[WQ]/) ? (i = "string", s = !0) : e.eat(/[wxqr]/) && (i = "string");
            var f = e.eat(/[^\w\s]/);
            return f ? (o.propertyIsEnumerable(f) && (f = o[f]), a(c(f, i, s, !0), e, t)) : "operator"
        }
        if (n == "#")return e.skipToEnd(), "comment";
        if (n == "<" && (r = e.match(/^<-?[\`\"\']?([a-zA-Z_?]\w*)[\`\"\']?(?:;|$)/)))return a(h(r[1]), e, t);
        if (n == "0")return e.eat("x") ? e.eatWhile(/[\da-fA-F]/) : e.eat("b") ? e.eatWhile(/[01]/) : e.eatWhile(/[0-7]/), "number";
        if (/\d/.test(n))return e.match(/^[\d_]*(?:\.[\d_]+)?(?:[eE][+\-]?[\d_]+)?/), "number";
        if (n == "?") {
            while (e.match(/^\\[CM]-/));
            return e.eat("\\") ? e.eatWhile(/\w/) : e.next(), "string"
        }
        return n == ":" ? e.eat("'") ? a(c("'", "atom", !1), e, t) : e.eat('"') ? a(c('"', "atom", !0), e, t) : (e.eatWhile(/[\w\?]/), "atom") : n == "@" ? (e.eat("@"), e.eatWhile(/[\w\?]/), "variable-2") : n == "$" ? (e.next(), e.eatWhile(/[\w\?]/), "variable-3") : /\w/.test(n) ? (e.eatWhile(/[\w\?]/), e.eat(":") ? "atom" : "ident") : n != "|" || !t.varList && t.lastTok != "{" && t.lastTok != "do" ? /[\(\)\[\]{}\\;]/.test(n) ? (u = n, null) : n == "-" && e.eat(">") ? "arrow" : /[=+\-\/*:\.^%<>~|]/.test(n) ? (e.eatWhile(/[=+\-\/*:\.^%<>~|]/), "operator") : null : (u = "|", null)
    }

    function l() {
        var e = 1;
        return function (t, n) {
            if (t.peek() == "}") {
                e--;
                if (e == 0)return n.tokenize.pop(), n.tokenize[n.tokenize.length - 1](t, n)
            } else t.peek() == "{" && e++;
            return f(t, n)
        }
    }

    function c(e, t, n, r) {
        return function (i, s) {
            var o = !1, u;
            while ((u = i.next()) != null) {
                if (u == e && (r || !o)) {
                    s.tokenize.pop();
                    break
                }
                if (n && u == "#" && !o && i.eat("{")) {
                    s.tokenize.push(l(arguments.callee));
                    break
                }
                o = !o && u == "\\"
            }
            return t
        }
    }

    function h(e) {
        return function (t, n) {
            return t.match(e) ? n.tokenize.pop() : t.skipToEnd(), "string"
        }
    }

    function p(e, t) {
        return e.sol() && e.match("=end") && e.eol() && t.tokenize.pop(), e.skipToEnd(), "comment"
    }

    var r = n(["alias", "and", "BEGIN", "begin", "break", "case", "class", "def", "defined?", "do", "else", "elsif", "END", "end", "ensure", "false", "for", "if", "in", "module", "next", "not", "or", "redo", "rescue", "retry", "return", "self", "super", "then", "true", "undef", "unless", "until", "when", "while", "yield", "nil", "raise", "throw", "catch", "fail", "loop", "callcc", "caller", "lambda", "proc", "public", "protected", "private", "require", "load", "require_relative", "extend", "autoload"]),
        i = n(["def", "class", "case", "for", "while", "do", "module", "then", "catch", "loop", "proc", "begin"]), s = n(["end", "until"]), o = {"[": "]", "{": "}", "(": ")"},
        u;
    return {
        startState: function () {
            return {tokenize: [f], indented: 0, context: {type: "top", indented: -e.indentUnit}, continuedLine: !1, lastTok: null, varList: !1}
        }, token: function (e, t) {
            e.sol() && (t.indented = e.indentation());
            var n = t.tokenize[t.tokenize.length - 1](e, t), o;
            if (n == "ident") {
                var a = e.current();
                n = r.propertyIsEnumerable(e.current()) ? "keyword" : /^[A-Z]/.test(a) ? "tag" : t.lastTok == "def" || t.lastTok == "class" || t.varList ? "def" : "variable", i.propertyIsEnumerable(a) ? o = "indent" : s.propertyIsEnumerable(a) ? o = "dedent" : (a == "if" || a == "unless") && e.column() == e.indentation() && (o = "indent")
            }
            if (u || n && n != "comment") t.lastTok = a || u || n;
            return u == "|" && (t.varList = !t.varList), o == "indent" || /[\(\[\{]/.test(u) ? t.context = {
                prev: t.context,
                type: u || n,
                indented: t.indented
            } : (o == "dedent" || /[\)\]\}]/.test(u)) && t.context.prev && (t.context = t.context.prev), e.eol() && (t.continuedLine = u == "\\" || n == "operator"), n
        }, indent: function (t, n) {
            if (t.tokenize[t.tokenize.length - 1] != f)return 0;
            var r = n && n.charAt(0), i = t.context, s = i.type == o[r] || i.type == "keyword" && /^(?:end|until|else|elsif|when|rescue)\b/.test(n);
            return i.indented + (s ? 0 : e.indentUnit) + (t.continuedLine ? e.indentUnit : 0)
        }, electricChars: "}de"
    }
}), CodeMirror.defineMIME("text/x-ruby", "ruby"), CodeMirror.defineMode("rust", function () {
    function u(e, t) {
        return s = e, t
    }

    function a(e, t) {
        var n = e.next();
        if (n == '"')return t.tokenize = f, t.tokenize(e, t);
        if (n == "'")return s = "atom", e.eat("\\") ? e.skipTo("'") ? (e.next(), "string") : "error" : (e.next(), e.eat("'") ? "string" : "error");
        if (n == "/") {
            if (e.eat("/"))return e.skipToEnd(), "comment";
            if (e.eat("*"))return t.tokenize = l(1), t.tokenize(e, t)
        }
        if (n == "#")return e.eat("[") ? (s = "open-attr", null) : (e.eatWhile(/\w/), u("macro", "meta"));
        if (n == ":" && e.match(":<"))return u("op", null);
        if (n.match(/\d/) || n == "." && e.eat(/\d/)) {
            var r = !1;
            return !e.match(/^x[\da-f]+/i) && !e.match(/^b[01]+/) && (e.eatWhile(/\d/), e.eat(".") && (r = !0, e.eatWhile(/\d/)), e.match(/^e[+\-]?\d+/i) && (r = !0)), r ? e.match(/^f(?:32|64)/) : e.match(/^[ui](?:8|16|32|64)/), u("atom", "number")
        }
        return n.match(/[()\[\]{}:;,]/) ? u(n, null) : n == "-" && e.eat(">") ? u("->", null) : n.match(i) ? (e.eatWhile(i), u("op", null)) : (e.eatWhile(/\w/), o = e.current(), e.match(/^::\w/) ? (e.backUp(1), u("prefix", "variable-2")) : t.keywords.propertyIsEnumerable(o) ? u(t.keywords[o], o.match(/true|false/) ? "atom" : "keyword") : u("name", "variable"))
    }

    function f(e, t) {
        var n, r = !1;
        while (n = e.next()) {
            if (n == '"' && !r)return t.tokenize = a, u("atom", "string");
            r = !r && n == "\\"
        }
        return u("op", "string")
    }

    function l(e) {
        return function (t, n) {
            var r = null, i;
            while (i = t.next()) {
                if (i == "/" && r == "*") {
                    if (e == 1) {
                        n.tokenize = a;
                        break
                    }
                    return n.tokenize = l(e - 1), n.tokenize(t, n)
                }
                if (i == "*" && r == "/")return n.tokenize = l(e + 1), n.tokenize(t, n);
                r = i
            }
            return "comment"
        }
    }

    function h() {
        for (var e = arguments.length - 1; e >= 0; e--)c.cc.push(arguments[e])
    }

    function p() {
        return h.apply(null, arguments), !0
    }

    function d(e, t) {
        var n = function () {
            var n = c.state;
            n.lexical = {indented: n.indented, column: c.stream.column(), type: e, prev: n.lexical, info: t}
        };
        return n.lex = !0, n
    }

    function v() {
        var e = c.state;
        e.lexical.prev && (e.lexical.type == ")" && (e.indented = e.lexical.indented), e.lexical = e.lexical.prev)
    }

    function m() {
        c.state.keywords = r
    }

    function g() {
        c.state.keywords = n
    }

    function y(e, t) {
        function n(r) {
            return r == "," ? p(e, n) : r == t ? p() : p(n)
        }

        return function (r) {
            return r == t ? p() : h(e, n)
        }
    }

    function b(e, t) {
        return p(d("stat", t), e, v, w)
    }

    function w(e) {
        return e == "}" ? p() : e == "let" ? b(L, "let") : e == "fn" ? b(_) : e == "type" ? p(d("stat"), D, E, v, w) : e == "enum" ? b(P) : e == "mod" ? b(B) : e == "iface" ? b(j) : e == "impl" ? b(F) : e == "open-attr" ? p(d("]"), y(S, "]"), v) : e == "ignore" || e.match(/[\]\);,]/) ? p(w) : h(d("stat"), S, v, E, w)
    }

    function E(e) {
        return e == ";" ? p() : h()
    }

    function S(e) {
        return e == "atom" || e == "name" ? p(x) : e == "{" ? p(d("}"), N, v) : e.match(/[\[\(]/) ? Q(e, S) : e.match(/[\]\)\};,]/) ? h() : e == "if-style" ? p(S, S) : e == "else-style" || e == "op" ? p(S) : e == "for" ? p(W, O, M, S, S) : e == "alt" ? p(S, V) : e == "fn" ? p(_) : e == "macro" ? p(K) : p()
    }

    function x(e) {
        return o == "." ? p(T) : o == "::<" ? p(I, x) : e == "op" || o == ":" ? p(S) : e == "(" || e == "[" ? Q(e, S) : h()
    }

    function T(e) {
        return o.match(/^\w+$/) ? (c.marked = "variable", p(x)) : h(S)
    }

    function N(e) {
        if (e == "op") {
            if (o == "|")return p(k, v, d("}", "block"), w);
            if (o == "||")return p(v, d("}", "block"), w)
        }
        return o == "mutable" || o.match(/^\w+$/) && c.stream.peek() == ":" && !c.stream.match("::", !1) ? h(C(S)) : h(w)
    }

    function C(e) {
        function t(n) {
            return o == "mutable" || o == "with" ? (c.marked = "keyword", p(t)) : o.match(/^\w*$/) ? (c.marked = "variable", p(t)) : n == ":" ? p(e, t) : n == "}" ? p() : p(t)
        }

        return t
    }

    function k(e) {
        return e == "name" ? (c.marked = "def", p(k)) : e == "op" && o == "|" ? p() : p(k)
    }

    function L(e) {
        return e.match(/[\]\)\};]/) ? p() : o == "=" ? p(S, A) : e == "," ? p(L) : h(W, O, L)
    }

    function A(e) {
        return e.match(/[\]\)\};,]/) ? h(L) : h(S, A)
    }

    function O(e) {
        return e == ":" ? p(m, R, g) : h()
    }

    function M(e) {
        return e == "name" && o == "in" ? (c.marked = "keyword", p()) : h()
    }

    function _(e) {
        return o == "@" || o == "~" ? (c.marked = "keyword", p(_)) : e == "name" ? (c.marked = "def", p(_)) : o == "<" ? p(I, _) : e == "{" ? h(S) : e == "(" ? p(d(")"), y(q, ")"), v, _) : e == "->" ? p(m, R, g, _) : e == ";" ? p() : p(_)
    }

    function D(e) {
        return e == "name" ? (c.marked = "def", p(D)) : o == "<" ? p(I, D) : o == "=" ? p(m, R, g) : p(D)
    }

    function P(e) {
        return e == "name" ? (c.marked = "def", p(P)) : o == "<" ? p(I, P) : o == "=" ? p(m, R, g, E) : e == "{" ? p(d("}"), m, H, g, v) : p(P)
    }

    function H(e) {
        return e == "}" ? p() : e == "(" ? p(d(")"), y(R, ")"), v, H) : (o.match(/^\w+$/) && (c.marked = "def"), p(H))
    }

    function B(e) {
        return e == "name" ? (c.marked = "def", p(B)) : e == "{" ? p(d("}"), w, v) : h()
    }

    function j(e) {
        return e == "name" ? (c.marked = "def", p(j)) : o == "<" ? p(I, j) : e == "{" ? p(d("}"), w, v) : h()
    }

    function F(e) {
        return o == "<" ? p(I, F) : o == "of" || o == "for" ? (c.marked = "keyword", p(R, F)) : e == "name" ? (c.marked = "def", p(F)) : e == "{" ? p(d("}"), w, v) : h()
    }

    function I(e) {
        return o == ">" ? p() : o == "," ? p(I) : o == ":" ? p(R, I) : h(R, I)
    }

    function q(e) {
        return e == "name" ? (c.marked = "def", p(q)) : e == ":" ? p(m, R, g) : h()
    }

    function R(e) {
        return e == "name" ? (c.marked = "variable-3", p(U)) : o == "mutable" ? (c.marked = "keyword", p(R)) : e == "atom" ? p(U) : e == "op" || e == "obj" ? p(R) : e == "fn" ? p(z) : e == "{" ? p(d("{"), C(R), v) : Q(e, R)
    }

    function U(e) {
        return o == "<" ? p(I) : h()
    }

    function z(e) {
        return e == "(" ? p(d("("), y(R, ")"), v, z) : e == "->" ? p(R) : h()
    }

    function W(e) {
        return e == "name" ? (c.marked = "def", p(X)) : e == "atom" ? p(X) : e == "op" ? p(W) : e.match(/[\]\)\};,]/) ? h() : Q(e, W)
    }

    function X(e) {
        return e == "op" && o == "." ? p() : o == "to" ? (c.marked = "keyword", p(W)) : h()
    }

    function V(e) {
        return e == "{" ? p(d("}", "alt"), $, v) : h()
    }

    function $(e) {
        return e == "}" ? p() : e == "|" ? p($) : o == "when" ? (c.marked = "keyword", p(S, J)) : e.match(/[\]\);,]/) ? p($) : h(W, J)
    }

    function J(e) {
        return e == "{" ? p(d("}", "alt"), w, v, $) : h($)
    }

    function K(e) {
        return e.match(/[\[\(\{]/) ? Q(e, S) : h()
    }

    function Q(e, t) {
        return e == "[" ? p(d("]"), y(t, "]"), v) : e == "(" ? p(d(")"), y(t, ")"), v) : e == "{" ? p(d("}"), y(t, "}"), v) : p()
    }

    function G(e, t, n) {
        var r = e.cc;
        c.state = e, c.stream = t, c.marked = null, c.cc = r;
        for (; ;) {
            var i = r.length ? r.pop() : w;
            if (i(s)) {
                while (r.length && r[r.length - 1].lex)r.pop()();
                return c.marked || n
            }
        }
    }

    var e = 4, t = 2, n = {
        "if": "if-style",
        "while": "if-style",
        "else": "else-style",
        "do": "else-style",
        ret: "else-style",
        fail: "else-style",
        "break": "atom",
        cont: "atom",
        "const": "let",
        resource: "fn",
        let: "let",
        fn: "fn",
        "for": "for",
        alt: "alt",
        iface: "iface",
        impl: "impl",
        type: "type",
        "enum": "enum",
        mod: "mod",
        as: "op",
        "true": "atom",
        "false": "atom",
        assert: "op",
        check: "op",
        claim: "op",
        "native": "ignore",
        unsafe: "ignore",
        "import": "else-style",
        "export": "else-style",
        copy: "op",
        log: "op",
        log_err: "op",
        use: "op",
        bind: "op",
        self: "atom"
    }, r = function () {
        var e = {fn: "fn", block: "fn", obj: "obj"}, t = "bool uint int i8 i16 i32 i64 u8 u16 u32 u64 float f32 f64 str char".split(" ");
        for (var n = 0, r = t.length; n < r; ++n)e[t[n]] = "atom";
        return e
    }(), i = /[+\-*&%=<>!?|\.@]/, s, o, c = {state: null, stream: null, marked: null, cc: null};
    return v.lex = m.lex = g.lex = !0, {
        startState: function () {
            return {tokenize: a, cc: [], lexical: {indented: -e, column: 0, type: "top", align: !1}, keywords: n, indented: 0}
        }, token: function (e, t) {
            e.sol() && (t.lexical.hasOwnProperty("align") || (t.lexical.align = !1), t.indented = e.indentation());
            if (e.eatSpace())return null;
            s = o = null;
            var n = t.tokenize(e, t);
            return n == "comment" ? n : (t.lexical.hasOwnProperty("align") || (t.lexical.align = !0), s == "prefix" ? n : (o || (o = e.current()), G(t, e, n)))
        }, indent: function (n, r) {
            if (n.tokenize != a)return 0;
            var i = r && r.charAt(0), s = n.lexical, o = s.type, u = i == o;
            return o == "stat" ? s.indented + e : s.align ? s.column + (u ? 0 : 1) : s.indented + (u ? 0 : s.info == "alt" ? t : e)
        }, electricChars: "{}"
    }
}), CodeMirror.defineMIME("text/x-rustsrc", "rust"), CodeMirror.defineMode("scheme", function (e, t) {
    function c(e) {
        var t = {}, n = e.split(" ");
        for (var r = 0; r < n.length; ++r)t[n[r]] = !0;
        return t
    }

    function d(e, t, n) {
        this.indent = e, this.type = t, this.prev = n
    }

    function v(e, t, n) {
        e.indentStack = new d(t, n, e.indentStack)
    }

    function m(e) {
        e.indentStack = e.indentStack.prev
    }

    function E(e) {
        return e.match(g)
    }

    function S(e) {
        return e.match(y)
    }

    function x(e, t) {
        return t === !0 && e.backUp(1), e.match(w)
    }

    function T(e) {
        return e.match(b)
    }

    var n = "builtin", r = "comment", i = "string", s = "atom", o = "number", u = "bracket", a = "keyword", f = 2, l = 1,
        h = c("\u03bb case-lambda call/cc class define-class exit-handler field import inherit init-field interface let*-values let-values let/ec mixin opt-lambda override protect provide public rename require require-for-syntax syntax syntax-case syntax-error unit/sig unless when with-syntax and begin call-with-current-continuation call-with-input-file call-with-output-file case cond define define-syntax delay do dynamic-wind else for-each if lambda let let* let-syntax letrec letrec-syntax map or syntax-rules abs acos angle append apply asin assoc assq assv atan boolean? caar cadr call-with-input-file call-with-output-file call-with-values car cdddar cddddr cdr ceiling char->integer char-alphabetic? char-ci<=? char-ci<? char-ci=? char-ci>=? char-ci>? char-downcase char-lower-case? char-numeric? char-ready? char-upcase char-upper-case? char-whitespace? char<=? char<? char=? char>=? char>? char? close-input-port close-output-port complex? cons cos current-input-port current-output-port denominator display eof-object? eq? equal? eqv? eval even? exact->inexact exact? exp expt #f floor force gcd imag-part inexact->exact inexact? input-port? integer->char integer? interaction-environment lcm length list list->string list->vector list-ref list-tail list? load log magnitude make-polar make-rectangular make-string make-vector max member memq memv min modulo negative? newline not null-environment null? number->string number? numerator odd? open-input-file open-output-file output-port? pair? peek-char port? positive? procedure? quasiquote quote quotient rational? rationalize read read-char real-part real? remainder reverse round scheme-report-environment set! set-car! set-cdr! sin sqrt string string->list string->number string->symbol string-append string-ci<=? string-ci<? string-ci=? string-ci>=? string-ci>? string-copy string-fill! string-length string-ref string-set! string<=? string<? string=? string>=? string>? string? substring symbol->string symbol? #t tan transcript-off transcript-on truncate values vector vector->list vector-fill! vector-length vector-ref vector-set! with-input-from-file with-output-to-file write write-char zero?"),
        p = c("define let letrec let* lambda"),
        g = new RegExp(/^(?:[-+]i|[-+][01]+#*(?:\/[01]+#*)?i|[-+]?[01]+#*(?:\/[01]+#*)?@[-+]?[01]+#*(?:\/[01]+#*)?|[-+]?[01]+#*(?:\/[01]+#*)?[-+](?:[01]+#*(?:\/[01]+#*)?)?i|[-+]?[01]+#*(?:\/[01]+#*)?)(?=[()\s;"]|$)/i),
        y = new RegExp(/^(?:[-+]i|[-+][0-7]+#*(?:\/[0-7]+#*)?i|[-+]?[0-7]+#*(?:\/[0-7]+#*)?@[-+]?[0-7]+#*(?:\/[0-7]+#*)?|[-+]?[0-7]+#*(?:\/[0-7]+#*)?[-+](?:[0-7]+#*(?:\/[0-7]+#*)?)?i|[-+]?[0-7]+#*(?:\/[0-7]+#*)?)(?=[()\s;"]|$)/i),
        b = new RegExp(/^(?:[-+]i|[-+][\da-f]+#*(?:\/[\da-f]+#*)?i|[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?@[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?|[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?[-+](?:[\da-f]+#*(?:\/[\da-f]+#*)?)?i|[-+]?[\da-f]+#*(?:\/[\da-f]+#*)?)(?=[()\s;"]|$)/i),
        w = new RegExp(/^(?:[-+]i|[-+](?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)i|[-+]?(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)@[-+]?(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)|[-+]?(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)[-+](?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*)?i|(?:(?:(?:\d+#+\.?#*|\d+\.\d*#*|\.\d+#*|\d+)(?:[esfdl][-+]?\d+)?)|\d+#*\/\d+#*))(?=[()\s;"]|$)/i);
    return {
        startState: function () {
            return {indentStack: null, indentation: 0, mode: !1, sExprComment: !1}
        }, token: function (e, t) {
            t.indentStack == null && e.sol() && (t.indentation = e.indentation());
            if (e.eatSpace())return null;
            var a = null;
            switch (t.mode) {
                case"string":
                    var l, c = !1;
                    while ((l = e.next()) != null) {
                        if (l == '"' && !c) {
                            t.mode = !1;
                            break
                        }
                        c = !c && l == "\\"
                    }
                    a = i;
                    break;
                case"comment":
                    var l, d = !1;
                    while ((l = e.next()) != null) {
                        if (l == "#" && d) {
                            t.mode = !1;
                            break
                        }
                        d = l == "|"
                    }
                    a = r;
                    break;
                case"s-expr-comment":
                    t.mode = !1;
                    if (e.peek() != "(" && e.peek() != "[") {
                        e.eatWhile(/[^/s]/), a = r;
                        break
                    }
                    t.sExprComment = 0;
                default:
                    var g = e.next();
                    if (g == '"') t.mode = "string", a = i; else if (g == "'") a = s; else if (g == "#")if (e.eat("|")) t.mode = "comment", a = r; else if (e.eat(/[tf]/i)) a = s; else if (e.eat(";")) t.mode = "s-expr-comment", a = r; else {
                        var y = null, b = !1, w = !0;
                        e.eat(/[ei]/i) ? b = !0 : e.backUp(1), e.match(/^#b/i) ? y = E : e.match(/^#o/i) ? y = S : e.match(/^#x/i) ? y = T : e.match(/^#d/i) ? y = x : e.match(/^[-+0-9.]/, !1) ? (w = !1, y = x) : b || e.eat("#"), y != null && (w && !b && e.match(/^#[ei]/i), y(e) && (a = o))
                    } else if (/^[-+0-9.]/.test(g) && x(e, !0)) a = o; else if (g == ";") e.skipToEnd(), a = r; else if (g == "(" || g == "[") {
                        var N = "", C = e.column(), k;
                        while ((k = e.eat(/[^\s\(\[\;\)\]]/)) != null)N += k;
                        N.length > 0 && p.propertyIsEnumerable(N) ? v(t, C + f, g) : (e.eatSpace(), e.eol() || e.peek() == ";" ? v(t, C + 1, g) : v(t, C + e.current().length, g)), e.backUp(e.current().length - 1), typeof t.sExprComment == "number" && t.sExprComment++, a = u
                    } else g == ")" || g == "]" ? (a = u, t.indentStack != null && t.indentStack.type == (g == ")" ? "(" : "[") && (m(t), typeof t.sExprComment == "number" && --t.sExprComment == 0 && (a = r, t.sExprComment = !1))) : (e.eatWhile(/[\w\$_\-!$%&*+\.\/:<=>?@\^~]/), h && h.propertyIsEnumerable(e.current()) ? a = n : a = "variable")
            }
            return typeof t.sExprComment == "number" ? r : a
        }, indent: function (e, t) {
            return e.indentStack == null ? e.indentation : e.indentStack.indent
        }
    }
}), CodeMirror.defineMIME("text/x-scheme", "scheme"), CodeMirror.defineMode("shell", function (e) {
    function n(e, n) {
        var r = n.split(" ");
        for (var i = 0; i < r.length; i++)t[r[i]] = e
    }

    function r(e, n) {
        var r = e.sol(), u = e.next();
        if (u === "'" || u === '"' || u === "`")return n.tokens.unshift(i(u)), o(e, n);
        if (u === "#")return r && e.eat("!") ? (e.skipToEnd(), "meta") : (e.skipToEnd(), "comment");
        if (u === "$")return n.tokens.unshift(s), o(e, n);
        if (u === "+" || u === "=")return "operator";
        if (u === "-")return e.eat("-"), e.eatWhile(/\w/), "attribute";
        if (/\d/.test(u)) {
            e.eatWhile(/\d/);
            if (!/\w/.test(e.peek()))return "number"
        }
        e.eatWhile(/\w/);
        var a = e.current();
        return e.peek() === "=" && /\w+/.test(a) ? "def" : t[a] || null
    }

    function i(e) {
        return function (t, n) {
            var r, i = !1, o = !1;
            while ((r = t.next()) != null) {
                if (r === e && !o) {
                    i = !0;
                    break
                }
                if (r === "$" && !o && e !== "'") {
                    o = !0, t.backUp(1), n.tokens.unshift(s);
                    break
                }
                o = !o && r === "\\"
            }
            return (i || !o) && n.tokens.shift(), e === "`" || e === ")" ? "quote" : "string"
        }
    }

    function o(e, t) {
        return (t.tokens[0] || r)(e, t)
    }

    var t = {};
    n("atom", "true false"), n("keyword", "if then do else elif while until for in esac fi fin fil done exit set unset export function"), n("builtin", "ab awk bash beep cat cc cd chown chmod chroot clear cp curl cut diff echo find gawk gcc get git grep kill killall ln ls make mkdir openssl mv nc node npm ping ps restart rm rmdir sed service sh shopt shred source sort sleep ssh start stop su sudo tee telnet top touch vi vim wall wc wget who write yes zsh");
    var s = function (e, t) {
        t.tokens.length > 1 && e.eat("$");
        var n = e.next(), r = /\w/;
        return n === "{" && (r = /[^}]/), n === "(" ? (t.tokens[0] = i(")"), o(e, t)) : (/\d/.test(n) || (e.eatWhile(r), e.eat("}")), t.tokens.shift(), "def")
    };
    return {
        startState: function () {
            return {tokens: []}
        }, token: function (e, t) {
            return e.eatSpace() ? null : o(e, t)
        }
    }
}), CodeMirror.defineMIME("text/x-sh", "shell"), CodeMirror.defineMode("smalltalk", function (e, t) {
    var n = /[+\-/\\*~<>=@%|&?!.:;^]/, r = /true|false|nil|self|super|thisContext/, i = function (e, t) {
        this.next = e, this.parent = t
    }, s = function (e, t, n) {
        this.name = e, this.context = t, this.eos = n
    }, o = function () {
        this.context = new i(u, null), this.expectVariable = !0, this.indentation = 0, this.userIndentationDelta = 0
    };
    o.prototype.userIndent = function (t) {
        this.userIndentationDelta = t > 0 ? t / e.indentUnit - this.indentation : 0
    };
    var u = function (e, t, o) {
        var u = new s(null, t, !1), c = e.next();
        return c === '"' ? u = a(e, new i(a, t)) : c === "'" ? u = f(e, new i(f, t)) : c === "#" ? (e.eatWhile(/[^ .]/), u.name = "string-2") : c === "$" ? (e.eatWhile(/[^ ]/), u.name = "string-2") : c === "|" && o.expectVariable ? u.context = new i(l, t) : /[\[\]{}()]/.test(c) ? (u.name = "bracket", u.eos = /[\[{(]/.test(c), c === "[" ? o.indentation++ : c === "]" && (o.indentation = Math.max(0, o.indentation - 1))) : n.test(c) ? (e.eatWhile(n), u.name = "operator", u.eos = c !== ";") : /\d/.test(c) ? (e.eatWhile(/[\w\d]/), u.name = "number") : /[\w_]/.test(c) ? (e.eatWhile(/[\w\d_]/), u.name = o.expectVariable ? r.test(e.current()) ? "keyword" : "variable" : null) : u.eos = o.expectVariable, u
    }, a = function (e, t) {
        return e.eatWhile(/[^"]/), new s("comment", e.eat('"') ? t.parent : t, !0)
    }, f = function (e, t) {
        return e.eatWhile(/[^']/), new s("string", e.eat("'") ? t.parent : t, !1)
    }, l = function (e, t, n) {
        var r = new s(null, t, !1), i = e.next();
        return i === "|" ? (r.context = t.parent, r.eos = !0) : (e.eatWhile(/[^|]/), r.name = "variable"), r
    };
    return {
        startState: function () {
            return new o
        }, token: function (e, t) {
            t.userIndent(e.indentation());
            if (e.eatSpace())return null;
            var n = t.context.next(e, t.context, t);
            return t.context = n.context, t.expectVariable = n.eos, t.lastToken = n, n.name
        }, blankLine: function (e) {
            e.userIndent(0)
        }, indent: function (t, n) {
            var r = t.context.next === u && n && n.charAt(0) === "]" ? -1 : t.userIndentationDelta;
            return (t.indentation + r) * e.indentUnit
        }, electricChars: "]"
    }
}), CodeMirror.defineMIME("text/x-stsrc", {name: "smalltalk"}), CodeMirror.defineMode("smarty", function (e, t) {
    function u(e, t) {
        return r = t, e
    }

    function a(e, t) {
        function n(n) {
            return t.tokenize = n, n(e, t)
        }

        return e.match(s, !0) ? e.eat("*") ? n(c("comment", "*" + o)) : (t.tokenize = f, "tag") : (e.next(), null)
    }

    function f(e, t) {
        if (e.match(o, !0))return t.tokenize = a, u("tag", null);
        var s = e.next();
        if (s == "$")return e.eatWhile(i.validIdentifier), u("variable-2", "variable");
        if (s == ".")return u("operator", "property");
        if (i.stringChar.test(s))return t.tokenize = l(s), u("string", "string");
        if (i.operatorChars.test(s))return e.eatWhile(i.operatorChars), u("operator", "operator");
        if (s == "[" || s == "]")return u("bracket", "bracket");
        if (/\d/.test(s))return e.eatWhile(/\d/), u("number", "number");
        if (t.last == "variable") {
            if (s == "@")return e.eatWhile(i.validIdentifier), u("property", "property");
            if (s == "|")return e.eatWhile(i.validIdentifier), u("qualifier", "modifier")
        } else {
            if (t.last == "whitespace")return e.eatWhile(i.validIdentifier), u("attribute", "modifier");
            if (t.last == "property")return e.eatWhile(i.validIdentifier), u("property", null);
            if (/\s/.test(s))return r = "whitespace", null
        }
        var f = "";
        s != "/" && (f += s);
        var c = "";
        while (c = e.eat(i.validIdentifier))f += c;
        var h, p;
        for (h = 0, p = n.length; h < p; h++)if (n[h] == f)return u("keyword", "keyword");
        return /\s/.test(s) ? null : u("tag", "tag")
    }

    function l(e) {
        return function (t, n) {
            while (!t.eol())if (t.next() == e) {
                n.tokenize = f;
                break
            }
            return "string"
        }
    }

    function c(e, t) {
        return function (n, r) {
            while (!n.eol()) {
                if (n.match(t)) {
                    r.tokenize = a;
                    break
                }
                n.next()
            }
            return e
        }
    }

    var n = ["debug", "extends", "function", "include", "literal"], r, i = {operatorChars: /[+\-*&%=<>!?]/, validIdentifier: /[a-zA-Z0-9\_]/, stringChar: /[\'\"]/},
        s = typeof e.mode.leftDelimiter != "undefined" ? e.mode.leftDelimiter : "{", o = typeof e.mode.rightDelimiter != "undefined" ? e.mode.rightDelimiter : "}";
    return {
        startState: function () {
            return {tokenize: a, mode: "smarty", last: null}
        }, token: function (e, t) {
            var n = t.tokenize(e, t);
            return t.last = r, n
        }, electricChars: ""
    }
}), CodeMirror.defineMIME("text/x-smarty", "smarty"), CodeMirror.defineMode("sparql", function (e) {
    function r(e) {
        return new RegExp("^(?:" + e.join("|") + ")$", "i")
    }

    function u(e, t) {
        var r = e.next();
        n = null;
        if (r == "$" || r == "?")return e.match(/^[\w\d]*/), "variable-2";
        if (r == "<" && !e.match(/^[\s\u00a0=]/, !1))return e.match(/^[^\s\u00a0>]*>?/), "atom";
        if (r == '"' || r == "'")return t.tokenize = a(r), t.tokenize(e, t);
        if (/[{}\(\),\.;\[\]]/.test(r))return n = r, null;
        if (r == "#")return e.skipToEnd(), "comment";
        if (o.test(r))return e.eatWhile(o), null;
        if (r == ":")return e.eatWhile(/[\w\d\._\-]/), "atom";
        e.eatWhile(/[_\w\d]/);
        if (e.eat(":"))return e.eatWhile(/[\w\d_\-]/), "atom";
        var u = e.current(), f;
        return i.test(u) ? null : s.test(u) ? "keyword" : "variable"
    }

    function a(e) {
        return function (t, n) {
            var r = !1, i;
            while ((i = t.next()) != null) {
                if (i == e && !r) {
                    n.tokenize = u;
                    break
                }
                r = !r && i == "\\"
            }
            return "string"
        }
    }

    function f(e, t, n) {
        e.context = {prev: e.context, indent: e.indent, col: n, type: t}
    }

    function l(e) {
        e.indent = e.context.indent, e.context = e.context.prev
    }

    var t = e.indentUnit, n, i = r(["str", "lang", "langmatches", "datatype", "bound", "sameterm", "isiri", "isuri", "isblank", "isliteral", "union", "a"]),
        s = r(["base", "prefix", "select", "distinct", "reduced", "construct", "describe", "ask", "from", "named", "where", "order", "limit", "offset", "filter", "optional", "graph", "by", "asc", "desc"]),
        o = /[*+\-<>=&|]/;
    return {
        startState: function (e) {
            return {tokenize: u, context: null, indent: 0, col: 0}
        }, token: function (e, t) {
            e.sol() && (t.context && t.context.align == null && (t.context.align = !1), t.indent = e.indentation());
            if (e.eatSpace())return null;
            var r = t.tokenize(e, t);
            r != "comment" && t.context && t.context.align == null && t.context.type != "pattern" && (t.context.align = !0);
            if (n == "(") f(t, ")", e.column()); else if (n == "[") f(t, "]", e.column()); else if (n == "{") f(t, "}", e.column()); else if (/[\]\}\)]/.test(n)) {
                while (t.context && t.context.type == "pattern")l(t);
                t.context && n == t.context.type && l(t)
            } else n == "." && t.context && t.context.type == "pattern" ? l(t) : /atom|string|variable/.test(r) && t.context && (/[\}\]]/.test(t.context.type) ? f(t, "pattern", e.column()) : t.context.type == "pattern" && !t.context.align && (t.context.align = !0, t.context.col = e.column()));
            return r
        }, indent: function (e, n) {
            var r = n && n.charAt(0), i = e.context;
            if (/[\]\}]/.test(r))while (i && i.type == "pattern")i = i.prev;
            var s = i && r == i.type;
            return i ? i.type == "pattern" ? i.col : i.align ? i.col + (s ? 0 : 1) : i.indent + (s ? 0 : t) : 0
        }
    }
}), CodeMirror.defineMIME("application/x-sparql-query", "sparql"), CodeMirror.defineMode("stex", function (e, t) {
    function n(e, t) {
        e.cmdState.push(t)
    }

    function r(e) {
        return e.cmdState.length > 0 ? e.cmdState[e.cmdState.length - 1] : null
    }

    function i(e) {
        if (e.cmdState.length > 0) {
            var t = e.cmdState.pop();
            t.closeBracket()
        }
    }

    function s(e) {
        var t = e.cmdState;
        for (var n = t.length - 1; n >= 0; n--) {
            var r = t[n];
            if (r.name == "DEFAULT")continue;
            return r.styleIdentifier()
        }
        return null
    }

    function o(e, t, n, r) {
        return function () {
            this.name = e, this.bracketNo = 0, this.style = t, this.styles = r, this.brackets = n, this.styleIdentifier = function (e) {
                return this.bracketNo <= this.styles.length ? this.styles[this.bracketNo - 1] : null
            }, this.openBracket = function (e) {
                return this.bracketNo++, "bracket"
            }, this.closeBracket = function (e) {
            }
        }
    }

    function a(e, t) {
        e.f = t
    }

    function f(e, t) {
        if (e.match(/^\\[a-zA-Z@]+/)) {
            var i = e.current();
            i = i.substr(1, i.length - 1);
            var o;
            return u.hasOwnProperty(i) ? o = u[i] : o = u.DEFAULT, o = new o, n(t, o), a(t, c), o.style
        }
        if (e.match(/^\\[$&%#{}_]/))return "tag";
        if (e.match(/^\\[,;!\/]/))return "tag";
        var f = e.next();
        if (f == "%")return e.eol() || a(t, l), "comment";
        if (f == "}" || f == "]")return o = r(t), o ? (o.closeBracket(f), a(t, c), "bracket") : "error";
        return f == "{" || f == "[" ? (o = u.DEFAULT, o = new o, n(t, o), "bracket") : /\d/.test(f) ? (e.eatWhile(/[\w.%]/), "atom") : (e.eatWhile(/[\w-_]/), s(t))
    }

    function l(e, t) {
        return e.skipToEnd(), a(t, f), "comment"
    }

    function c(e, t) {
        var n = e.peek();
        if (n == "{" || n == "[") {
            var s = r(t), o = s.openBracket(n);
            return e.eat(n), a(t, f), "bracket"
        }
        return /[ \t\r]/.test(n) ? (e.eat(n), null) : (a(t, f), s = r(t), s && i(t), f(e, t))
    }

    var u = new Array;
    return u.importmodule = o("importmodule", "tag", "{[", ["string", "builtin"]), u.documentclass = o("documentclass", "tag", "{[", ["", "atom"]), u.usepackage = o("documentclass", "tag", "[", ["atom"]), u.begin = o("documentclass", "tag", "[", ["atom"]), u.end = o("documentclass", "tag", "[", ["atom"]), u.DEFAULT = function () {
        this.name = "DEFAULT", this.style = "tag", this.styleIdentifier = function (e) {
        }, this.openBracket = function (e) {
        }, this.closeBracket = function (e) {
        }
    }, {
        startState: function () {
            return {f: f, cmdState: []}
        }, copyState: function (e) {
            return {f: e.f, cmdState: e.cmdState.slice(0, e.cmdState.length)}
        }, token: function (e, t) {
            var n = t.f(e, t), r = e.current();
            return n
        }
    }
}), CodeMirror.defineMIME("text/x-stex", "stex"), CodeMirror.defineMIME("text/x-latex", "stex"), CodeMirror.defineMode("tiddlywiki", function (e, t) {
    function y(e, t, n) {
        return t.tokenize = n, n(e, t)
    }

    function b(e, t) {
        var n = !1, r;
        while ((r = e.next()) != null) {
            if (r == t && !n)return !1;
            n = !n && r == "\\"
        }
        return n
    }

    function S(e, t, n) {
        return w = e, E = n, t
    }

    function x(e, t) {
        var n = e.sol(), i, v;
        t.block = !1, i = e.peek();
        if (n && /[<\/\*{}\-]/.test(i)) {
            if (e.match(d))return t.block = !0, y(e, t, k);
            if (e.match(f))return S("quote", "quote");
            if (e.match(u) || e.match(a))return S("code", "comment");
            if (e.match(l) || e.match(c) || e.match(h) || e.match(p))return S("code", "comment");
            if (e.match(o))return S("hr", "hr")
        }
        i = e.next();
        if (n && /[\/\*!#;:>|]/.test(i)) {
            if (i == "!")return e.skipToEnd(), S("header", "header");
            if (i == "*")return e.eatWhile("*"), S("list", "comment");
            if (i == "#")return e.eatWhile("#"), S("list", "comment");
            if (i == ";")return e.eatWhile(";"), S("list", "comment");
            if (i == ":")return e.eatWhile(":"), S("list", "comment");
            if (i == ">")return e.eatWhile(">"), S("quote", "quote");
            if (i == "|")return S("table", "header")
        }
        if (i == "{" && e.match(/\{\{/))return y(e, t, k);
        if (/[hf]/i.test(i) && /[ti]/i.test(e.peek()) && e.match(/\b(ttps?|tp|ile):\/\/[\-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i))return S("link", "link");
        if (i == '"')return S("string", "string");
        if (i == "~")return S("text", "brace");
        if (/[\[\]]/.test(i) && e.peek() == i)return e.next(), S("brace", "brace");
        if (i == "@")return e.eatWhile(s), S("link", "link");
        if (/\d/.test(i))return e.eatWhile(/\d/), S("number", "number");
        if (i == "/") {
            if (e.eat("%"))return y(e, t, N);
            if (e.eat("/"))return y(e, t, L)
        }
        if (i == "_" && e.eat("_"))return y(e, t, A);
        if (i == "-" && e.eat("-")) {
            if (e.peek() != " ")return y(e, t, O);
            if (e.peek() == " ")return S("text", "brace")
        }
        if (i == "'" && e.eat("'"))return y(e, t, C);
        if (i != "<")return S(i);
        if (e.eat("<"))return y(e, t, M);
        e.eatWhile(/[\w\$_]/);
        var m = e.current(), g = r.propertyIsEnumerable(m) && r[m];
        return g ? S(g.type, g.style, m) : S("text", null, m)
    }

    function T(e) {
        return function (t, n) {
            return b(t, e) || (n.tokenize = x), S("string", "string")
        }
    }

    function N(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "/" && n) {
                t.tokenize = x;
                break
            }
            n = r == "%"
        }
        return S("comment", "comment")
    }

    function C(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "'" && n) {
                t.tokenize = x;
                break
            }
            n = r == "'"
        }
        return S("text", "strong")
    }

    function k(e, t) {
        var n, r = t.block;
        return r && e.current() ? S("code", "comment") : !r && e.match(g) ? (t.tokenize = x, S("code", "comment")) : r && e.sol() && e.match(v) ? (t.tokenize = x, S("code", "comment")) : (n = e.next(), r ? S("code", "comment") : S("code", "comment"))
    }

    function L(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "/" && n) {
                t.tokenize = x;
                break
            }
            n = r == "/"
        }
        return S("text", "em")
    }

    function A(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "_" && n) {
                t.tokenize = x;
                break
            }
            n = r == "_"
        }
        return S("text", "underlined")
    }

    function O(e, t) {
        var n = !1, r, i;
        while (r = e.next()) {
            if (r == "-" && n) {
                t.tokenize = x;
                break
            }
            n = r == "-"
        }
        return S("text", "strikethrough")
    }

    function M(e, t) {
        var n, r, s, o;
        return e.current() == "<<" ? S("brace", "macro") : (n = e.next(), n ? n == ">" && e.peek() == ">" ? (e.next(), t.tokenize = x, S("brace", "macro")) : (e.eatWhile(/[\w\$_]/), s = e.current(), o = i.propertyIsEnumerable(s) && i[s], o ? S(o.type, o.style, s) : S("macro", null, s)) : (t.tokenize = x, S(n)))
    }

    var n = e.indentUnit, r = function () {
            function e(e) {
                return {type: e, style: "text"}
            }

            return {}
        }(), i = function () {
            function e(e) {
                return {type: e, style: "macro"}
            }

            return {
                allTags: e("allTags"),
                closeAll: e("closeAll"),
                list: e("list"),
                newJournal: e("newJournal"),
                newTiddler: e("newTiddler"),
                permaview: e("permaview"),
                saveChanges: e("saveChanges"),
                search: e("search"),
                slider: e("slider"),
                tabs: e("tabs"),
                tag: e("tag"),
                tagging: e("tagging"),
                tags: e("tags"),
                tiddler: e("tiddler"),
                timeline: e("timeline"),
                today: e("today"),
                version: e("version"),
                option: e("option"),
                "with": e("with"),
                filter: e("filter")
            }
        }(), s = /[\w_\-]/i, o = /^\-\-\-\-+$/, u = /^\/\*\*\*$/, a = /^\*\*\*\/$/, f = /^<<<$/, l = /^\/\/\{\{\{$/, c = /^\/\/\}\}\}$/, h = /^<!--\{\{\{-->$/,
        p = /^<!--\}\}\}-->$/, d = /^\{\{\{$/, v = /^\}\}\}$/, m = /\{\{\{/, g = /.*?\}\}\}/, w, E;
    return {
        startState: function (e) {
            return {tokenize: x, indented: 0, level: 0}
        }, token: function (e, t) {
            if (e.eatSpace())return null;
            var n = t.tokenize(e, t);
            return n
        }, electricChars: ""
    }
}), CodeMirror.defineMIME("text/x-tiddlywiki", "tiddlywiki"), CodeMirror.defineMode("tiki", function (e, t) {
    function n(e, t, n) {
        return function (r, s) {
            while (!r.eol()) {
                if (r.match(t)) {
                    s.tokenize = i;
                    break
                }
                r.next()
            }
            return n && (s.tokenize = n), e
        }
    }

    function r(e, t) {
        return function (t, n) {
            while (!t.eol())t.next();
            return n.tokenize = i, e
        }
    }

    function i(e, t) {
        function s(n) {
            return t.tokenize = n, n(e, t)
        }

        var o = e.sol(), u = e.next();
        switch (u) {
            case"{":
                var f = e.eat("/") ? "closeTag" : "openTag";
                e.eatSpace();
                var l = "", c;
                while (c = e.eat(/[^\s\u00a0=\"\'\/?(}]/))l += c;
                return t.tokenize = a, "tag";
            case"_":
                if (e.eat("_"))return s(n("strong", "__", i));
                break;
            case"'":
                if (e.eat("'"))return s(n("em", "''", i));
                break;
            case"(":
                if (e.eat("("))return s(n("variable-2", "))", i));
                break;
            case"[":
                return s(n("variable-3", "]", i));
            case"|":
                if (e.eat("|"))return s(n("comment", "||"));
                break;
            case"-":
                if (e.eat("="))return s(n("header string", "=-", i));
                if (e.eat("-"))return s(n("error tw-deleted", "--", i));
                break;
            case"=":
                if (e.match("=="))return s(n("tw-underline", "===", i));
                break;
            case":":
                if (e.eat(":"))return s(n("comment", "::"));
                break;
            case"^":
                return s(n("tw-box", "^"));
            case"~":
                if (e.match("np~"))return s(n("meta", "~/np~"))
        }
        if (o)switch (u) {
            case"!":
                return e.match("!!!!!") ? s(r("header string")) : e.match("!!!!") ? s(r("header string")) : e.match("!!!") ? s(r("header string")) : e.match("!!") ? s(r("header string")) : s(r("header string"));
            case"*":
            case"#":
            case"+":
                return s(r("tw-listitem bracket"))
        }
        return null
    }

    function a(e, t) {
        var n = e.next(), r = e.peek();
        return n == "}" ? (t.tokenize = i, "tag") : n == "(" || n == ")" ? "bracket" : n == "=" ? (u = "equals", r == ">" && (n = e.next(), r = e.peek()), /[\'\"]/.test(r) || (t.tokenize = l()), "operator") : /[\'\"]/.test(n) ? (t.tokenize = f(n), t.tokenize(e, t)) : (e.eatWhile(/[^\s\u00a0=\"\'\/?]/), "keyword")
    }

    function f(e) {
        return function (t, n) {
            while (!t.eol())if (t.next() == e) {
                n.tokenize = a;
                break
            }
            return "string"
        }
    }

    function l() {
        return function (e, t) {
            while (!e.eol()) {
                var n = e.next(), r = e.peek();
                if (n == " " || n == "," || /[ )}]/.test(r)) {
                    t.tokenize = a;
                    break
                }
            }
            return "string"
        }
    }

    function p() {
        for (var e = arguments.length - 1; e >= 0; e--)c.cc.push(arguments[e])
    }

    function d() {
        return p.apply(null, arguments), !0
    }

    function v(e, t) {
        var n = c.context && c.context.noIndent;
        c.context = {prev: c.context, pluginName: e, indent: c.indented, startOfLine: t, noIndent: n}
    }

    function m() {
        c.context && (c.context = c.context.prev)
    }

    function g(e) {
        if (e == "openPlugin")return c.pluginName = o, d(w, y(c.startOfLine));
        if (e == "closePlugin") {
            var t = !1;
            return c.context ? (t = c.context.pluginName != o, m()) : t = !0, t && (h = "error"), d(b(t))
        }
        return e == "string" ? ((!c.context || c.context.name != "!cdata") && v("!cdata"), c.tokenize == i && m(), d()) : d()
    }

    function y(e) {
        return function (t) {
            return t == "selfclosePlugin" || t == "endPlugin" ? d() : t == "endPlugin" ? (v(c.pluginName, e), d()) : d()
        }
    }

    function b(e) {
        return function (t) {
            return e && (h = "error"), t == "endPlugin" ? d() : p()
        }
    }

    function w(e) {
        return e == "keyword" ? (h = "attribute", d(w)) : e == "equals" ? d(E, w) : p()
    }

    function E(e) {
        return e == "keyword" ? (h = "string", d()) : e == "string" ? d(S) : p()
    }

    function S(e) {
        return e == "string" ? d(S) : p()
    }

    var s = e.indentUnit, o, u, c, h;
    return {
        startState: function () {
            return {tokenize: i, cc: [], indented: 0, startOfLine: !0, pluginName: null, context: null}
        }, token: function (e, t) {
            e.sol() && (t.startOfLine = !0, t.indented = e.indentation());
            if (e.eatSpace())return null;
            h = u = o = null;
            var n = t.tokenize(e, t);
            if ((n || u) && n != "comment") {
                c = t;
                for (; ;) {
                    var r = t.cc.pop() || g;
                    if (r(u || n))break
                }
            }
            return t.startOfLine = !1, h || n
        }, indent: function (e, t) {
            var n = e.context;
            if (n && n.noIndent)return 0;
            n && /^{\//.test(t) && (n = n.prev);
            while (n && !n.startOfLine)n = n.prev;
            return n ? n.indent + s : 0
        }, compareStates: function (e, t) {
            if (e.indented != t.indented || e.pluginName != t.pluginName)return !1;
            for (var n = e.context, r = t.context; ; n = n.prev, r = r.prev) {
                if (!n || !r)return n == r;
                if (n.pluginName != r.pluginName)return !1
            }
        }, electricChars: "/"
    }
}), CodeMirror.defineMIME("text/tiki", "tiki"), CodeMirror.defineMode("vb", function (e, t) {
    function r(e) {
        return new RegExp("^((" + e.join(")|(") + "))\\b", "i")
    }

    function N(e, t) {
        t.currentIndent++
    }

    function C(e, t) {
        t.currentIndent--
    }

    function k(e, t) {
        if (e.eatSpace())return null;
        var r = e.peek();
        if (r === "'")return e.skipToEnd(), "comment";
        if (e.match(/^((&H)|(&O))?[0-9\.a-f]/i, !1)) {
            var l = !1;
            e.match(/^\d*\.\d+F?/i) ? l = !0 : e.match(/^\d+\.\d*F?/) ? l = !0 : e.match(/^\.\d+F?/) && (l = !0);
            if (l)return e.eat(/J/i), "number";
            var c = !1;
            e.match(/^&H[0-9a-f]+/i) ? c = !0 : e.match(/^&O[0-7]+/i) ? c = !0 : e.match(/^[1-9]\d*F?/) ? (e.eat(/J/i), c = !0) : e.match(/^0(?![\dx])/i) && (c = !0);
            if (c)return e.eat(/L/i), "number"
        }
        return e.match(y) ? (t.tokenize = L(e.current()), t.tokenize(e, t)) : e.match(a) || e.match(u) ? null : e.match(o) || e.match(i) || e.match(p) ? "operator" : e.match(s) ? null : e.match(x) ? (N(e, t), t.doInCurrentLine = !0, "keyword") : e.match(b) ? (t.doInCurrentLine ? t.doInCurrentLine = !1 : N(e, t), "keyword") : e.match(w) ? "keyword" : e.match(S) ? (C(e, t), C(e, t), "keyword") : e.match(E) ? (C(e, t), "keyword") : e.match(g) ? "keyword" : e.match(m) ? "keyword" : e.match(f) ? "variable" : (e.next(), n)
    }

    function L(e) {
        var r = e.length == 1, i = "string";
        return function (o, u) {
            while (!o.eol()) {
                o.eatWhile(/[^'"]/);
                if (o.match(e))return u.tokenize = k, i;
                o.eat(/['"]/)
            }
            if (r) {
                if (t.singleLineStringErrors)return n;
                u.tokenize = k
            }
            return i
        }
    }

    function A(e, t) {
        var r = t.tokenize(e, t), i = e.current();
        if (i === ".")return r = t.tokenize(e, t), i = e.current(), r === "variable" ? "variable" : n;
        var s = "[({".indexOf(i);
        return s !== -1 && N(e, t), T === "dedent" && C(e, t) ? n : (s = "])}".indexOf(i), s !== -1 && C(e, t) ? n : r)
    }

    var n = "error", i = new RegExp("^[\\+\\-\\*/%&\\\\|\\^~<>!]"), s = new RegExp("^[\\(\\)\\[\\]\\{\\}@,:`=;\\.]"),
        o = new RegExp("^((==)|(<>)|(<=)|(>=)|(<>)|(<<)|(>>)|(//)|(\\*\\*))"), u = new RegExp("^((\\+=)|(\\-=)|(\\*=)|(%=)|(/=)|(&=)|(\\|=)|(\\^=))"),
        a = new RegExp("^((//=)|(>>=)|(<<=)|(\\*\\*=))"), f = new RegExp("^[_A-Za-z][_A-Za-z0-9]*"),
        l = ["class", "module", "sub", "enum", "select", "while", "if", "function", "get", "set", "property"], c = ["else", "elseif", "case"], h = ["next", "loop"],
        p = r(["and", "or", "not", "xor", "in"]),
        d = ["as", "dim", "break", "continue", "optional", "then", "until", "goto", "byval", "byref", "new", "handles", "property", "return", "const", "private", "protected", "friend", "public", "shared", "static", "true", "false"],
        v = ["integer", "string", "double", "decimal", "boolean", "short", "char", "float", "single"], m = r(d), g = r(v), y = '"', b = r(l), w = r(c), E = r(h),
        S = r(["end"]), x = r(["do"]), T = null, O = {
            electricChars: "dDpPtTfFeE ", startState: function (e) {
                return {tokenize: k, lastToken: null, currentIndent: 0, nextLineIndent: 0, doInCurrentLine: !1}
            }, token: function (e, t) {
                e.sol() && (t.currentIndent += t.nextLineIndent, t.nextLineIndent = 0, t.doInCurrentLine = 0);
                var n = A(e, t);
                return t.lastToken = {style: n, content: e.current()}, n
            }, indent: function (t, n) {
                var r = n.replace(/^\s+|\s+$/g, "");
                return r.match(E) || r.match(S) || r.match(w) ? e.indentUnit * (t.currentIndent - 1) : t.currentIndent < 0 ? 0 : t.currentIndent * e.indentUnit
            }
        };
    return O
}), CodeMirror.defineMIME("text/x-vb", "vb"), CodeMirror.defineMode("vbscript", function () {
    var e = /^(?:Call|Case|CDate|Clear|CInt|CLng|Const|CStr|Description|Dim|Do|Each|Else|ElseIf|End|Err|Error|Exit|False|For|Function|If|LCase|Loop|LTrim|Next|Nothing|Now|Number|On|Preserve|Quit|ReDim|Resume|RTrim|Select|Set|Sub|Then|To|Trim|True|UBound|UCase|Until|VbCr|VbCrLf|VbLf|VbTab)$/im;
    return {
        token: function (t) {
            if (t.eatSpace())return null;
            var n = t.next();
            if (n == "'")return t.skipToEnd(), "comment";
            if (n == '"')return t.skipTo('"'), "string";
            if (/\w/.test(n)) {
                t.eatWhile(/\w/);
                if (e.test(t.current()))return "keyword"
            }
            return null
        }
    }
}), CodeMirror.defineMIME("text/vbscript", "vbscript"), CodeMirror.defineMode("velocity", function (e) {
    function t(e) {
        var t = {}, n = e.split(" ");
        for (var r = 0; r < n.length; ++r)t[n[r]] = !0;
        return t
    }

    function a(e, t, n) {
        return t.tokenize = n, n(e, t)
    }

    function f(e, t) {
        var n = t.beforeParams;
        t.beforeParams = !1;
        var u = e.next();
        if (u != '"' && u != "'" || !t.inParams) {
            if (/[\[\]{}\(\),;\.]/.test(u))return u == "(" && n ? t.inParams = !0 : u == ")" && (t.inParams = !1), null;
            if (/\d/.test(u))return e.eatWhile(/[\w\.]/), "number";
            if (u == "#" && e.eat("*"))return a(e, t, c);
            if (u == "#" && e.match(/ *\[ *\[/))return a(e, t, h);
            if (u == "#" && e.eat("#"))return e.skipToEnd(), "comment";
            if (u == "$")return e.eatWhile(/[\w\d\$_\.{}]/), s && s.propertyIsEnumerable(e.current().toLowerCase()) ? "keyword" : (t.beforeParams = !0, "builtin");
            if (o.test(u))return e.eatWhile(o), "operator";
            e.eatWhile(/[\w\$_{}]/);
            var f = e.current().toLowerCase();
            return r && r.propertyIsEnumerable(f) ? "keyword" : i && i.propertyIsEnumerable(f) || e.current().match(/^#[a-z0-9_]+ *$/i) && e.peek() == "(" ? (t.beforeParams = !0, "keyword") : null
        }
        return a(e, t, l(u))
    }

    function l(e) {
        return function (t, n) {
            var r = !1, i, s = !1;
            while ((i = t.next()) != null) {
                if (i == e && !r) {
                    s = !0;
                    break
                }
                r = !r && i == "\\"
            }
            return s && (n.tokenize = f), "string"
        }
    }

    function c(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "#" && n) {
                t.tokenize = f;
                break
            }
            n = r == "*"
        }
        return "comment"
    }

    function h(e, t) {
        var n = 0, r;
        while (r = e.next()) {
            if (r == "#" && n == 2) {
                t.tokenize = f;
                break
            }
            r == "]" ? n++ : r != " " && (n = 0)
        }
        return "meta"
    }

    var n = e.indentUnit, r = t("#end #else #break #stop #[[ #]] #{end} #{else} #{break} #{stop}"),
        i = t("#if #elseif #foreach #set #include #parse #macro #define #evaluate #{if} #{elseif} #{foreach} #{set} #{include} #{parse} #{macro} #{define} #{evaluate}"),
        s = t("$foreach.count $foreach.hasNext $foreach.first $foreach.last $foreach.topmost $foreach.parent $velocityCount"), o = /[+\-*&%=<>!?:\/|]/, u = !0;
    return {
        startState: function (e) {
            return {tokenize: f, beforeParams: !1, inParams: !1}
        }, token: function (e, t) {
            return e.eatSpace() ? null : t.tokenize(e, t)
        }
    }
}), CodeMirror.defineMIME("text/velocity", "velocity"), CodeMirror.defineMode("verilog", function (e, t) {
    function l(e, t) {
        var n = e.next();
        if (o[n]) {
            var u = o[n](e, t);
            if (u !== !1)return u
        }
        if (n == '"')return t.tokenize = c(n), t.tokenize(e, t);
        if (/[\[\]{}\(\),;\:\.]/.test(n))return f = n, null;
        if (/[\d']/.test(n))return e.eatWhile(/[\w\.']/), "number";
        if (n == "/") {
            if (e.eat("*"))return t.tokenize = h, h(e, t);
            if (e.eat("/"))return e.skipToEnd(), "comment"
        }
        if (a.test(n))return e.eatWhile(a), "operator";
        e.eatWhile(/[\w\$_]/);
        var l = e.current();
        return r.propertyIsEnumerable(l) ? (i.propertyIsEnumerable(l) && (f = "newstatement"), "keyword") : s.propertyIsEnumerable(l) ? "atom" : "variable"
    }

    function c(e) {
        return function (t, n) {
            var r = !1, i, s = !1;
            while ((i = t.next()) != null) {
                if (i == e && !r) {
                    s = !0;
                    break
                }
                r = !r && i == "\\"
            }
            if (s || !r && !u) n.tokenize = l;
            return "string"
        }
    }

    function h(e, t) {
        var n = !1, r;
        while (r = e.next()) {
            if (r == "/" && n) {
                t.tokenize = l;
                break
            }
            n = r == "*"
        }
        return "comment"
    }

    function p(e, t, n, r, i) {
        this.indented = e, this.column = t, this.type = n, this.align = r, this.prev = i
    }

    function d(e, t, n) {
        return e.context = new p(e.indented, t, n, null, e.context)
    }

    function v(e) {
        var t = e.context.type;
        if (t == ")" || t == "]" || t == "}") e.indented = e.context.indented;
        return e.context = e.context.prev
    }

    var n = e.indentUnit, r = t.keywords || {}, i = t.blockKeywords || {}, s = t.atoms || {}, o = t.hooks || {}, u = t.multiLineStrings,
        a = /[&|~><!\)\(*#%@+\/=?\:;}{,\.\^\-\[\]]/, f;
    return {
        startState: function (e) {
            return {tokenize: null, context: new p((e || 0) - n, 0, "top", !1), indented: 0, startOfLine: !0}
        }, token: function (e, t) {
            var n = t.context;
            e.sol() && (n.align == null && (n.align = !1), t.indented = e.indentation(), t.startOfLine = !0);
            if (e.eatSpace())return null;
            f = null;
            var r = (t.tokenize || l)(e, t);
            if (r == "comment" || r == "meta")return r;
            n.align == null && (n.align = !0);
            if (f != ";" && f != ":" || n.type != "statement")if (f == "{") d(t, e.column(), "}"); else if (f == "[") d(t, e.column(), "]"); else if (f == "(") d(t, e.column(), ")"); else if (f == "}") {
                while (n.type == "statement")n = v(t);
                n.type == "}" && (n = v(t));
                while (n.type == "statement")n = v(t)
            } else f == n.type ? v(t) : (n.type == "}" || n.type == "top" || n.type == "statement" && f == "newstatement") && d(t, e.column(), "statement"); else v(t);
            return t.startOfLine = !1, r
        }, indent: function (e, t) {
            if (e.tokenize != l && e.tokenize != null)return 0;
            var r = t && t.charAt(0), i = e.context, s = r == i.type;
            return i.type == "statement" ? i.indented + (r == "{" ? 0 : n) : i.align ? i.column + (s ? 0 : 1) : i.indented + (s ? 0 : n)
        }, electricChars: "{}"
    }
}),function () {
    function e(e) {
        var t = {}, n = e.split(" ");
        for (var r = 0; r < n.length; ++r)t[n[r]] = !0;
        return t
    }

    function r(e, t) {
        return e.eatWhile(/[\w\$_]/), "meta"
    }

    function i(e, t) {
        var n;
        while ((n = e.next()) != null)if (n == '"' && !e.eat('"')) {
            t.tokenize = null;
            break
        }
        return "string"
    }

    var t = "always and assign automatic begin buf bufif0 bufif1 case casex casez cell cmos config deassign default defparam design disable edge else end endcase endconfig endfunction endgenerate endmodule endprimitive endspecify endtable endtask event for force forever fork function generate genvar highz0 highz1 if ifnone incdir include initial inout input instance integer join large liblist library localparam macromodule medium module nand negedge nmos nor noshowcancelled not notif0 notif1 or output parameter pmos posedge primitive pull0 pull1 pulldown pullup pulsestyle_onevent pulsestyle_ondetect rcmos real realtime reg release repeat rnmos rpmos rtran rtranif0 rtranif1 scalared showcancelled signed small specify specparam strong0 strong1 supply0 supply1 table task time tran tranif0 tranif1 tri tri0 tri1 triand trior trireg unsigned use vectored wait wand weak0 weak1 while wire wor xnor xor",
        n = "begin bufif0 bufif1 case casex casez config else end endcase endconfig endfunction endgenerate endmodule endprimitive endspecify endtable endtask for forever function generate if ifnone macromodule module primitive repeat specify table task while";
    CodeMirror.defineMIME("text/x-verilog", {name: "verilog", keywords: e(t), blockKeywords: e(n), atoms: e("null"), hooks: {"`": r, $: r}})
}(),CodeMirror.defineMode("xml", function (e, t) {
    function u(e, t) {
        function n(n) {
            return t.tokenize = n, n(e, t)
        }

        var r = e.next();
        if (r == "<") {
            if (e.eat("!"))return e.eat("[") ? e.match("CDATA[") ? n(l("atom", "]]>")) : null : e.match("--") ? n(l("comment", "-->")) : e.match("DOCTYPE", !0, !0) ? (e.eatWhile(/[\w\._\-]/), n(c(1))) : null;
            if (e.eat("?"))return e.eatWhile(/[\w\._\-]/), t.tokenize = l("meta", "?>"), "meta";
            o = e.eat("/") ? "closeTag" : "openTag", e.eatSpace(), s = "";
            var i;
            while (i = e.eat(/[^\s\u00a0=<>\"\'\/?]/))s += i;
            return t.tokenize = a, "tag"
        }
        if (r == "&") {
            var u;
            return e.eat("#") ? e.eat("x") ? u = e.eatWhile(/[a-fA-F\d]/) && e.eat(";") : u = e.eatWhile(/[\d]/) && e.eat(";") : u = e.eatWhile(/[\w\.\-:]/) && e.eat(";"), u ? "atom" : "error"
        }
        return e.eatWhile(/[^&<]/), null
    }

    function a(e, t) {
        var n = e.next();
        return n == ">" || n == "/" && e.eat(">") ? (t.tokenize = u, o = n == ">" ? "endTag" : "selfcloseTag", "tag") : n == "=" ? (o = "equals", null) : /[\'\"]/.test(n) ? (t.tokenize = f(n), t.tokenize(e, t)) : (e.eatWhile(/[^\s\u00a0=<>\"\'\/?]/), "word")
    }

    function f(e) {
        return function (t, n) {
            while (!t.eol())if (t.next() == e) {
                n.tokenize = a;
                break
            }
            return "string"
        }
    }

    function l(e, t) {
        return function (n, r) {
            while (!n.eol()) {
                if (n.match(t)) {
                    r.tokenize = u;
                    break
                }
                n.next()
            }
            return e
        }
    }

    function c(e) {
        return function (t, n) {
            var r;
            while ((r = t.next()) != null) {
                if (r == "<")return n.tokenize = c(e + 1), n.tokenize(t, n);
                if (r == ">") {
                    if (e == 1) {
                        n.tokenize = u;
                        break
                    }
                    return n.tokenize = c(e - 1), n.tokenize(t, n)
                }
            }
            return "meta"
        }
    }

    function d() {
        for (var e = arguments.length - 1; e >= 0; e--)h.cc.push(arguments[e])
    }

    function v() {
        return d.apply(null, arguments), !0
    }

    function m(e, t) {
        var n = r.doNotIndent.hasOwnProperty(e) || h.context && h.context.noIndent;
        h.context = {prev: h.context, tagName: e, indent: h.indented, startOfLine: t, noIndent: n}
    }

    function g() {
        h.context && (h.context = h.context.prev)
    }

    function y(e) {
        if (e == "openTag")return h.tagName = s, v(S, b(h.startOfLine));
        if (e == "closeTag") {
            var t = !1;
            return h.context ? h.context.tagName != s && (r.implicitlyClosed.hasOwnProperty(h.context.tagName.toLowerCase()) && g(), t = !h.context || h.context.tagName != s) : t = !0, t && (p = "error"), v(w(t))
        }
        return v()
    }

    function b(e) {
        return function (t) {
            return t == "selfcloseTag" || t == "endTag" && r.autoSelfClosers.hasOwnProperty(h.tagName.toLowerCase()) ? (E(h.tagName.toLowerCase()), v()) : t == "endTag" ? (E(h.tagName.toLowerCase()), m(h.tagName, e), v()) : v()
        }
    }

    function w(e) {
        return function (t) {
            return e && (p = "error"), t == "endTag" ? (g(), v()) : (p = "error", v(arguments.callee))
        }
    }

    function E(e) {
        var t;
        for (; ;) {
            if (!h.context)return;
            t = h.context.tagName.toLowerCase();
            if (!r.contextGrabbers.hasOwnProperty(t) || !r.contextGrabbers[t].hasOwnProperty(e))return;
            g()
        }
    }

    function S(e) {
        return e == "word" ? (p = "attribute", v(x, S)) : e == "endTag" || e == "selfcloseTag" ? d() : (p = "error", v(S))
    }

    function x(e) {
        return e == "equals" ? v(T, S) : (r.allowMissing || (p = "error"), e == "endTag" || e == "selfcloseTag" ? d() : v())
    }

    function T(e) {
        return e == "string" ? v(N) : e == "word" && r.allowUnquoted ? (p = "string", v()) : (p = "error", e == "endTag" || e == "selfCloseTag" ? d() : v())
    }

    function N(e) {
        return e == "string" ? v(N) : d()
    }

    var n = e.indentUnit, r = t.htmlMode ? {
        autoSelfClosers: {
            area: !0,
            base: !0,
            br: !0,
            col: !0,
            command: !0,
            embed: !0,
            frame: !0,
            hr: !0,
            img: !0,
            input: !0,
            keygen: !0,
            link: !0,
            meta: !0,
            param: !0,
            source: !0,
            track: !0,
            wbr: !0
        },
        implicitlyClosed: {dd: !0, li: !0, optgroup: !0, option: !0, p: !0, rp: !0, rt: !0, tbody: !0, td: !0, tfoot: !0, th: !0, tr: !0},
        contextGrabbers: {
            dd: {dd: !0, dt: !0},
            dt: {dd: !0, dt: !0},
            li: {li: !0},
            option: {option: !0, optgroup: !0},
            optgroup: {optgroup: !0},
            p: {
                address: !0,
                article: !0,
                aside: !0,
                blockquote: !0,
                dir: !0,
                div: !0,
                dl: !0,
                fieldset: !0,
                footer: !0,
                form: !0,
                h1: !0,
                h2: !0,
                h3: !0,
                h4: !0,
                h5: !0,
                h6: !0,
                header: !0,
                hgroup: !0,
                hr: !0,
                menu: !0,
                nav: !0,
                ol: !0,
                p: !0,
                pre: !0,
                section: !0,
                table: !0,
                ul: !0
            },
            rp: {rp: !0, rt: !0},
            rt: {rp: !0, rt: !0},
            tbody: {tbody: !0, tfoot: !0},
            td: {td: !0, th: !0},
            tfoot: {tbody: !0},
            th: {td: !0, th: !0},
            thead: {tbody: !0, tfoot: !0},
            tr: {tr: !0}
        },
        doNotIndent: {pre: !0},
        allowUnquoted: !0,
        allowMissing: !0
    } : {autoSelfClosers: {}, implicitlyClosed: {}, contextGrabbers: {}, doNotIndent: {}, allowUnquoted: !1, allowMissing: !1}, i = t.alignCDATA, s, o, h, p;
    return {
        startState: function () {
            return {tokenize: u, cc: [], indented: 0, startOfLine: !0, tagName: null, context: null}
        }, token: function (e, t) {
            e.sol() && (t.startOfLine = !0, t.indented = e.indentation());
            if (e.eatSpace())return null;
            p = o = s = null;
            var n = t.tokenize(e, t);
            t.type = o;
            if ((n || o) && n != "comment") {
                h = t;
                for (; ;) {
                    var r = t.cc.pop() || y;
                    if (r(o || n))break
                }
            }
            return t.startOfLine = !1, p || n
        }, indent: function (e, t, r) {
            var s = e.context;
            if (e.tokenize != a && e.tokenize != u || s && s.noIndent)return r ? r.match(/^(\s*)/)[0].length : 0;
            if (i && /<!\[CDATA\[/.test(t))return 0;
            s && /^<\//.test(t) && (s = s.prev);
            while (s && !s.startOfLine)s = s.prev;
            return s ? s.indent + n : 0
        }, compareStates: function (e, t) {
            if (e.indented != t.indented || e.tokenize != t.tokenize)return !1;
            for (var n = e.context, r = t.context; ; n = n.prev, r = r.prev) {
                if (!n || !r)return n == r;
                if (n.tagName != r.tagName || n.indent != r.indent)return !1
            }
        }, electricChars: "/"
    }
}),CodeMirror.defineMIME("text/xml", "xml"),CodeMirror.defineMIME("application/xml", "xml"),CodeMirror.mimeModes.hasOwnProperty("text/html") || CodeMirror.defineMIME("text/html", {
    name: "xml",
    htmlMode: !0
}),CodeMirror.defineMode("xquery", function (e, t) {
    function s(e, t, n) {
        return r = e, i = n, t
    }

    function o(e, t, n) {
        return t.tokenize = n, n(e, t)
    }

    function u(e, t) {
        var r = e.next(), i = !1, u = E(e);
        if (r == "<") {
            if (e.match("!--", !0))return o(e, t, p);
            if (e.match("![CDATA", !1))return t.tokenize = d, s("tag", "tag");
            if (e.match("?", !1))return o(e, t, v);
            var h = e.eat("/");
            e.eatSpace();
            var g = "", y;
            while (y = e.eat(/[^\s\u00a0=<>\"\'\/?]/))g += y;
            return o(e, t, c(g, h))
        }
        if (r == "{")return x(t, {type: "codeblock"}), s("", "");
        if (r == "}")return T(t), s("", "");
        if (m(t))return r == ">" ? s("tag", "tag") : r == "/" && e.eat(">") ? (T(t), s("tag", "tag")) : s("word", "variable");
        if (/\d/.test(r))return e.match(/^\d*(?:\.\d*)?(?:E[+\-]?\d+)?/), s("number", "atom");
        if (r === "(" && e.eat(":"))return x(t, {type: "comment"}), o(e, t, a);
        if (!!u || r !== '"' && r !== "'") {
            if (r === "$")return o(e, t, l);
            if (r === ":" && e.eat("="))return s("operator", "keyword");
            if (r === "(")return x(t, {type: "paren"}), s("", "");
            if (r === ")")return T(t), s("", "");
            if (r === "[")return x(t, {type: "bracket"}), s("", "");
            if (r === "]")return T(t), s("", "");
            var w = n.propertyIsEnumerable(r) && n[r];
            if (u && r === '"')while (e.next() !== '"');
            if (u && r === "'")while (e.next() !== "'");
            w || e.eatWhile(/[\w\$_-]/);
            var S = e.eat(":");
            !e.eat(":") && S && e.eatWhile(/[\w\$_-]/), e.match(/^[ \t]*\(/, !1) && (i = !0);
            var N = e.current();
            return w = n.propertyIsEnumerable(N) && n[N], i && !w && (w = {
                type: "function_call",
                style: "variable def"
            }), b(t) ? (T(t), s("word", "variable", N)) : ((N == "element" || N == "attribute" || w.type == "axis_specifier") && x(t, {type: "xmlconstructor"}), w ? s(w.type, w.style, N) : s("word", "variable", N))
        }
        return o(e, t, f(r))
    }

    function a(e, t) {
        var n = !1, r = !1, i = 0, o;
        while (o = e.next()) {
            if (o == ")" && n) {
                if (!(i > 0)) {
                    T(t);
                    break
                }
                i--
            } else o == ":" && r && i++;
            n = o == ":", r = o == "("
        }
        return s("comment", "comment")
    }

    function f(e, t) {
        return function (n, r) {
            var i;
            if (w(r) && n.current() == e)return T(r), t && (r.tokenize = t), s("string", "string");
            x(r, {type: "string", name: e, tokenize: f(e, t)});
            if (n.match("{", !1) && g(r))return r.tokenize = u, s("string", "string");
            while (i = n.next()) {
                if (i == e) {
                    T(r), t && (r.tokenize = t);
                    break
                }
                if (n.match("{", !1) && g(r))return r.tokenize = u, s("string", "string")
            }
            return s("string", "string")
        }
    }

    function l(e, t) {
        var n = /[\w\$_-]/;
        if (e.eat('"')) {
            while (e.next() !== '"');
            e.eat(":")
        } else e.eatWhile(n), e.match(":=", !1) || e.eat(":");
        return e.eatWhile(n), t.tokenize = u, s("variable", "variable")
    }

    function c(e, t) {
        return function (n, r) {
            return n.eatSpace(), t && n.eat(">") ? (T(r), r.tokenize = u, s("tag", "tag")) : (n.eat("/") || x(r, {
                type: "tag",
                name: e,
                tokenize: u
            }), n.eat(">") ? (r.tokenize = u, s("tag", "tag")) : (r.tokenize = h, s("tag", "tag")))
        }
    }

    function h(e, t) {
        var n = e.next();
        if (n == "/" && e.eat(">"))return g(t) && T(t), m(t) && T(t), s("tag", "tag");
        if (n == ">")return g(t) && T(t), s("tag", "tag");
        if (n == "=")return s("", "");
        if (n == '"' || n == "'")return o(e, t, f(n, h));
        g(t) || x(t, {type: "attribute", name: name, tokenize: h}), e.eat(/[a-zA-Z_:]/), e.eatWhile(/[-a-zA-Z0-9_:.]/), e.eatSpace();
        if (e.match(">", !1) || e.match("/", !1)) T(t), t.tokenize = u;
        return s("attribute", "attribute")
    }

    function p(e, t) {
        var n;
        while (n = e.next())if (n == "-" && e.match("->", !0))return t.tokenize = u, s("comment", "comment")
    }

    function d(e, t) {
        var n;
        while (n = e.next())if (n == "]" && e.match("]", !0))return t.tokenize = u, s("comment", "comment")
    }

    function v(e, t) {
        var n;
        while (n = e.next())if (n == "?" && e.match(">", !0))return t.tokenize = u, s("comment", "comment meta")
    }

    function m(e) {
        return S(e, "tag")
    }

    function g(e) {
        return S(e, "attribute")
    }

    function y(e) {
        return S(e, "codeblock")
    }

    function b(e) {
        return S(e, "xmlconstructor")
    }

    function w(e) {
        return S(e, "string")
    }

    function E(e) {
        return e.current() === '"' ? e.match(/^[^\"]+\"\:/, !1) : e.current() === "'" ? e.match(/^[^\"]+\'\:/, !1) : !1
    }

    function S(e, t) {
        return e.stack.length && e.stack[e.stack.length - 1].type == t
    }

    function x(e, t) {
        e.stack.push(t)
    }

    function T(e) {
        var t = e.stack.pop(), n = e.stack.length && e.stack[e.stack.length - 1].tokenize;
        e.tokenize = n || u
    }

    var n = function () {
        function e(e) {
            return {type: e, style: "keyword"}
        }

        var t = e("keyword a"), n = e("keyword b"), r = e("keyword c"), i = e("operator"), s = {type: "atom", style: "atom"}, o = {type: "punctuation", style: ""},
            u = {type: "axis_specifier", style: "qualifier"}, a = {
                "if": t,
                "switch": t,
                "while": t,
                "for": t,
                "else": n,
                then: n,
                "try": n,
                "finally": n,
                "catch": n,
                element: r,
                attribute: r,
                let: r,
                "implements": r,
                "import": r,
                module: r,
                namespace: r,
                "return": r,
                "super": r,
                "this": r,
                "throws": r,
                where: r,
                "private": r,
                ",": o,
                "null": s,
                "fn:false()": s,
                "fn:true()": s
            },
            f = ["after", "ancestor", "ancestor-or-self", "and", "as", "ascending", "assert", "attribute", "before", "by", "case", "cast", "child", "comment", "declare", "default", "define", "descendant", "descendant-or-self", "descending", "document", "document-node", "element", "else", "eq", "every", "except", "external", "following", "following-sibling", "follows", "for", "function", "if", "import", "in", "instance", "intersect", "item", "let", "module", "namespace", "node", "node", "of", "only", "or", "order", "parent", "precedes", "preceding", "preceding-sibling", "processing-instruction", "ref", "return", "returns", "satisfies", "schema", "schema-element", "self", "some", "sortby", "stable", "text", "then", "to", "treat", "typeswitch", "union", "variable", "version", "where", "xquery", "empty-sequence"];
        for (var l = 0, c = f.length; l < c; l++)a[f[l]] = e(f[l]);
        var h = ["xs:string", "xs:float", "xs:decimal", "xs:double", "xs:integer", "xs:boolean", "xs:date", "xs:dateTime", "xs:time", "xs:duration", "xs:dayTimeDuration", "xs:time", "xs:yearMonthDuration", "numeric", "xs:hexBinary", "xs:base64Binary", "xs:anyURI", "xs:QName", "xs:byte", "xs:boolean", "xs:anyURI", "xf:yearMonthDuration"];
        for (var l = 0, c = h.length; l < c; l++)a[h[l]] = s;
        var p = ["eq", "ne", "lt", "le", "gt", "ge", ":=", "=", ">", ">=", "<", "<=", ".", "|", "?", "and", "or", "div", "idiv", "mod", "*", "/", "+", "-"];
        for (var l = 0, c = p.length; l < c; l++)a[p[l]] = i;
        var d = ["self::", "attribute::", "child::", "descendant::", "descendant-or-self::", "parent::", "ancestor::", "ancestor-or-self::", "following::", "preceding::", "following-sibling::", "preceding-sibling::"];
        for (var l = 0, c = d.length; l < c; l++)a[d[l]] = u;
        return a
    }(), r, i;
    return {
        startState: function (e) {
            return {tokenize: u, cc: [], stack: []}
        }, token: function (e, t) {
            if (e.eatSpace())return null;
            var n = t.tokenize(e, t);
            return n
        }
    }
}),CodeMirror.defineMIME("application/xquery", "xquery"),CodeMirror.defineMode("yaml", function () {
    var e = ["true", "false", "on", "off", "yes", "no"], t = new RegExp("\\b((" + e.join(")|(") + "))$", "i");
    return {
        token: function (e, n) {
            var r = e.peek(), i = n.escaped;
            n.escaped = !1;
            if (r == "#")return e.skipToEnd(), "comment";
            if (n.literal && e.indentation() > n.keyCol)return e.skipToEnd(), "string";
            n.literal && (n.literal = !1);
            if (e.sol()) {
                n.keyCol = 0, n.pair = !1, n.pairStart = !1;
                if (e.match(/---/))return "def";
                if (e.match(/\.\.\./))return "def";
                if (e.match(/\s*-\s+/))return "meta"
            }
            if (!n.pair && e.match(/^\s*([a-z0-9\._-])+(?=\s*:)/i))return n.pair = !0, n.keyCol = e.indentation(), "atom";
            if (n.pair && e.match(/^:\s*/))return n.pairStart = !0, "meta";
            if (e.match(/^(\{|\}|\[|\])/))return r == "{" ? n.inlinePairs++ : r == "}" ? n.inlinePairs-- : r == "[" ? n.inlineList++ : n.inlineList--, "meta";
            if (n.inlineList > 0 && !i && r == ",")return e.next(), "meta";
            if (n.inlinePairs > 0 && !i && r == ",")return n.keyCol = 0, n.pair = !1, n.pairStart = !1, e.next(), "meta";
            if (n.pairStart) {
                if (e.match(/^\s*(\||\>)\s*/))return n.literal = !0, "meta";
                if (e.match(/^\s*(\&|\*)[a-z0-9\._-]+\b/i))return "variable-2";
                if (n.inlinePairs == 0 && e.match(/^\s*-?[0-9\.\,]+\s?$/))return "number";
                if (n.inlinePairs > 0 && e.match(/^\s*-?[0-9\.\,]+\s?(?=(,|}))/))return "number";
                if (e.match(t))return "keyword"
            }
            return n.pairStart = !1, n.escaped = r == "\\", e.next(), null
        }, startState: function () {
            return {pair: !1, pairStart: !1, keyCol: 0, inlinePairs: 0, inlineList: 0, literal: !1, escaped: !1}
        }
    }
}),CodeMirror.defineMIME("text/x-yaml", "yaml")