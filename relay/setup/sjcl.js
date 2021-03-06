"use strict";
var sjcl = {
  cipher: {},
  hash: {},
  keyexchange: {},
  mode: {},
  misc: {},
  codec: {},
  exception: {
    corrupt: function (a) {
      this.toString = function () {
        return "CORRUPT: " + this.message;
      };
      this.message = a;
    },
    invalid: function (a) {
      this.toString = function () {
        return "INVALID: " + this.message;
      };
      this.message = a;
    },
    bug: function (a) {
      this.toString = function () {
        return "BUG: " + this.message;
      };
      this.message = a;
    },
    notReady: function (a) {
      this.toString = function () {
        return "NOT READY: " + this.message;
      };
      this.message = a;
    },
  },
};
sjcl.cipher.aes = function (a) {
  this.u[0][0][0] || this.N();
  var b,
    c,
    d,
    e,
    f = this.u[0][4],
    g = this.u[1];
  b = a.length;
  var h = 1;
  if (4 !== b && 6 !== b && 8 !== b)
    throw new sjcl.exception.invalid("invalid aes key size");
  this.b = [(d = a.slice(0)), (e = [])];
  for (a = b; a < 4 * b + 28; a++) {
    c = d[a - 1];
    if (0 === a % b || (8 === b && 4 === a % b))
      (c =
        (f[c >>> 24] << 24) ^
        (f[(c >> 16) & 255] << 16) ^
        (f[(c >> 8) & 255] << 8) ^
        f[c & 255]),
        0 === a % b &&
          ((c = (c << 8) ^ (c >>> 24) ^ (h << 24)),
          (h = (h << 1) ^ (283 * (h >> 7))));
    d[a] = d[a - b] ^ c;
  }
  for (b = 0; a; b++, a--)
    (c = d[b & 3 ? a : a - 4]),
      (e[b] =
        4 >= a || 4 > b
          ? c
          : g[0][f[c >>> 24]] ^
            g[1][f[(c >> 16) & 255]] ^
            g[2][f[(c >> 8) & 255]] ^
            g[3][f[c & 255]]);
};
sjcl.cipher.aes.prototype = {
  encrypt: function (a) {
    return r(this, a, 0);
  },
  decrypt: function (a) {
    return r(this, a, 1);
  },
  u: [
    [[], [], [], [], []],
    [[], [], [], [], []],
  ],
  N: function () {
    var a = this.u[0],
      b = this.u[1],
      c = a[4],
      d = b[4],
      e,
      f,
      g,
      h = [],
      k = [],
      n,
      l,
      m,
      p;
    for (e = 0; 0x100 > e; e++) k[(h[e] = (e << 1) ^ (283 * (e >> 7))) ^ e] = e;
    for (f = g = 0; !c[f]; f ^= n || 1, g = k[g] || 1)
      for (
        m = g ^ (g << 1) ^ (g << 2) ^ (g << 3) ^ (g << 4),
          m = (m >> 8) ^ (m & 255) ^ 99,
          c[f] = m,
          d[m] = f,
          l = h[(e = h[(n = h[f])])],
          p = (0x1010101 * l) ^ (0x10001 * e) ^ (0x101 * n) ^ (0x1010100 * f),
          l = (0x101 * h[m]) ^ (0x1010100 * m),
          e = 0;
        4 > e;
        e++
      )
        (a[e][f] = l = (l << 24) ^ (l >>> 8)),
          (b[e][m] = p = (p << 24) ^ (p >>> 8));
    for (e = 0; 5 > e; e++) (a[e] = a[e].slice(0)), (b[e] = b[e].slice(0));
  },
};
function r(a, b, c) {
  if (4 !== b.length)
    throw new sjcl.exception.invalid("invalid aes block size");
  var d = a.b[c],
    e = b[0] ^ d[0],
    f = b[c ? 3 : 1] ^ d[1],
    g = b[2] ^ d[2];
  b = b[c ? 1 : 3] ^ d[3];
  var h,
    k,
    n,
    l = d.length / 4 - 2,
    m,
    p = 4,
    q = [0, 0, 0, 0];
  h = a.u[c];
  a = h[0];
  var u = h[1],
    v = h[2],
    w = h[3],
    x = h[4];
  for (m = 0; m < l; m++)
    (h =
      a[e >>> 24] ^ u[(f >> 16) & 255] ^ v[(g >> 8) & 255] ^ w[b & 255] ^ d[p]),
      (k =
        a[f >>> 24] ^
        u[(g >> 16) & 255] ^
        v[(b >> 8) & 255] ^
        w[e & 255] ^
        d[p + 1]),
      (n =
        a[g >>> 24] ^
        u[(b >> 16) & 255] ^
        v[(e >> 8) & 255] ^
        w[f & 255] ^
        d[p + 2]),
      (b =
        a[b >>> 24] ^
        u[(e >> 16) & 255] ^
        v[(f >> 8) & 255] ^
        w[g & 255] ^
        d[p + 3]),
      (p += 4),
      (e = h),
      (f = k),
      (g = n);
  for (m = 0; 4 > m; m++)
    (q[c ? 3 & -m : m] =
      (x[e >>> 24] << 24) ^
      (x[(f >> 16) & 255] << 16) ^
      (x[(g >> 8) & 255] << 8) ^
      x[b & 255] ^
      d[p++]),
      (h = e),
      (e = f),
      (f = g),
      (g = b),
      (b = h);
  return q;
}
sjcl.bitArray = {
  bitSlice: function (a, b, c) {
    a = sjcl.bitArray.Y(a.slice(b / 32), 32 - (b & 31)).slice(1);
    return void 0 === c ? a : sjcl.bitArray.clamp(a, c - b);
  },
  extract: function (a, b, c) {
    var d = Math.floor((-b - c) & 31);
    return (
      (((b + c - 1) ^ b) & -32
        ? (a[(b / 32) | 0] << (32 - d)) ^ (a[(b / 32 + 1) | 0] >>> d)
        : a[(b / 32) | 0] >>> d) &
      ((1 << c) - 1)
    );
  },
  concat: function (a, b) {
    if (0 === a.length || 0 === b.length) return a.concat(b);
    var c = a[a.length - 1],
      d = sjcl.bitArray.getPartial(c);
    return 32 === d
      ? a.concat(b)
      : sjcl.bitArray.Y(b, d, c | 0, a.slice(0, a.length - 1));
  },
  bitLength: function (a) {
    var b = a.length;
    return 0 === b ? 0 : 32 * (b - 1) + sjcl.bitArray.getPartial(a[b - 1]);
  },
  clamp: function (a, b) {
    if (32 * a.length < b) return a;
    a = a.slice(0, Math.ceil(b / 32));
    var c = a.length;
    b = b & 31;
    0 < c &&
      b &&
      (a[c - 1] = sjcl.bitArray.partial(
        b,
        a[c - 1] & (2147483648 >> (b - 1)),
        1
      ));
    return a;
  },
  partial: function (a, b, c) {
    return 32 === a ? b : (c ? b | 0 : b << (32 - a)) + 0x10000000000 * a;
  },
  getPartial: function (a) {
    return Math.round(a / 0x10000000000) || 32;
  },
  equal: function (a, b) {
    if (sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b)) return !1;
    var c = 0,
      d;
    for (d = 0; d < a.length; d++) c |= a[d] ^ b[d];
    return 0 === c;
  },
  Y: function (a, b, c, d) {
    var e;
    e = 0;
    for (void 0 === d && (d = []); 32 <= b; b -= 32) d.push(c), (c = 0);
    if (0 === b) return d.concat(a);
    for (e = 0; e < a.length; e++)
      d.push(c | (a[e] >>> b)), (c = a[e] << (32 - b));
    e = a.length ? a[a.length - 1] : 0;
    a = sjcl.bitArray.getPartial(e);
    d.push(sjcl.bitArray.partial((b + a) & 31, 32 < b + a ? c : d.pop(), 1));
    return d;
  },
  B: function (a, b) {
    return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]];
  },
  byteswapM: function (a) {
    var b, c;
    for (b = 0; b < a.length; ++b)
      (c = a[b]),
        (a[b] =
          (c >>> 24) | ((c >>> 8) & 0xff00) | ((c & 0xff00) << 8) | (c << 24));
    return a;
  },
};
sjcl.codec.utf8String = {
  fromBits: function (a) {
    var b = "",
      c = sjcl.bitArray.bitLength(a),
      d,
      e;
    for (d = 0; d < c / 8; d++)
      0 === (d & 3) && (e = a[d / 4]),
        (b += String.fromCharCode(((e >>> 8) >>> 8) >>> 8)),
        (e <<= 8);
    return decodeURIComponent(escape(b));
  },
  toBits: function (a) {
    a = unescape(encodeURIComponent(a));
    var b = [],
      c,
      d = 0;
    for (c = 0; c < a.length; c++)
      (d = (d << 8) | a.charCodeAt(c)), 3 === (c & 3) && (b.push(d), (d = 0));
    c & 3 && b.push(sjcl.bitArray.partial(8 * (c & 3), d));
    return b;
  },
};
sjcl.codec.hex = {
  fromBits: function (a) {
    var b = "",
      c;
    for (c = 0; c < a.length; c++)
      b += ((a[c] | 0) + 0xf00000000000).toString(16).substr(4);
    return b.substr(0, sjcl.bitArray.bitLength(a) / 4);
  },
  toBits: function (a) {
    var b,
      c = [],
      d;
    a = a.replace(/\s|0x/g, "");
    d = a.length;
    a = a + "00000000";
    for (b = 0; b < a.length; b += 8) c.push(parseInt(a.substr(b, 8), 16) ^ 0);
    return sjcl.bitArray.clamp(c, 4 * d);
  },
};
sjcl.codec.base64 = {
  S: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  fromBits: function (a, b, c) {
    var d = "",
      e = 0,
      f = sjcl.codec.base64.S,
      g = 0,
      h = sjcl.bitArray.bitLength(a);
    c && (f = f.substr(0, 62) + "-_");
    for (c = 0; 6 * d.length < h; )
      (d += f.charAt((g ^ (a[c] >>> e)) >>> 26)),
        6 > e ? ((g = a[c] << (6 - e)), (e += 26), c++) : ((g <<= 6), (e -= 6));
    for (; d.length & 3 && !b; ) d += "=";
    return d;
  },
  toBits: function (a, b) {
    a = a.replace(/\s|=/g, "");
    var c = [],
      d,
      e = 0,
      f = sjcl.codec.base64.S,
      g = 0,
      h;
    b && (f = f.substr(0, 62) + "-_");
    for (d = 0; d < a.length; d++) {
      h = f.indexOf(a.charAt(d));
      if (0 > h) throw new sjcl.exception.invalid("this isn't base64!");
      26 < e
        ? ((e -= 26), c.push(g ^ (h >>> e)), (g = h << (32 - e)))
        : ((e += 6), (g ^= h << (32 - e)));
    }
    e & 56 && c.push(sjcl.bitArray.partial(e & 56, g, 1));
    return c;
  },
};
sjcl.codec.base64url = {
  fromBits: function (a) {
    return sjcl.codec.base64.fromBits(a, 1, 1);
  },
  toBits: function (a) {
    return sjcl.codec.base64.toBits(a, 1);
  },
};
sjcl.hash.sha256 = function (a) {
  this.b[0] || this.N();
  a
    ? ((this.g = a.g.slice(0)), (this.f = a.f.slice(0)), (this.c = a.c))
    : this.reset();
};
sjcl.hash.sha256.hash = function (a) {
  return new sjcl.hash.sha256().update(a).finalize();
};
sjcl.hash.sha256.prototype = {
  blockSize: 512,
  reset: function () {
    this.g = this.D.slice(0);
    this.f = [];
    this.c = 0;
    return this;
  },
  update: function (a) {
    "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a));
    var b,
      c = (this.f = sjcl.bitArray.concat(this.f, a));
    b = this.c;
    a = this.c = b + sjcl.bitArray.bitLength(a);
    if (0x1fffffffffffff < a)
      throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");
    if ("undefined" !== typeof Uint32Array) {
      var d = new Uint32Array(c),
        e = 0;
      for (b = 512 + b - ((512 + b) & 0x1ff); b <= a; b += 512)
        this.l(d.subarray(16 * e, 16 * (e + 1))), (e += 1);
      c.splice(0, 16 * e);
    } else
      for (b = 512 + b - ((512 + b) & 0x1ff); b <= a; b += 512)
        this.l(c.splice(0, 16));
    return this;
  },
  finalize: function () {
    var a,
      b = this.f,
      c = this.g,
      b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)]);
    for (a = b.length + 2; a & 15; a++) b.push(0);
    b.push(Math.floor(this.c / 0x100000000));
    for (b.push(this.c | 0); b.length; ) this.l(b.splice(0, 16));
    this.reset();
    return c;
  },
  D: [],
  b: [],
  N: function () {
    function a(a) {
      return (0x100000000 * (a - Math.floor(a))) | 0;
    }
    for (var b = 0, c = 2, d, e; 64 > b; c++) {
      e = !0;
      for (d = 2; d * d <= c; d++)
        if (0 === c % d) {
          e = !1;
          break;
        }
      e &&
        (8 > b && (this.D[b] = a(Math.pow(c, 0.5))),
        (this.b[b] = a(Math.pow(c, 1 / 3))),
        b++);
    }
  },
  l: function (a) {
    var b,
      c,
      d,
      e = this.g,
      f = this.b,
      g = e[0],
      h = e[1],
      k = e[2],
      n = e[3],
      l = e[4],
      m = e[5],
      p = e[6],
      q = e[7];
    for (b = 0; 64 > b; b++)
      16 > b
        ? (c = a[b])
        : ((c = a[(b + 1) & 15]),
          (d = a[(b + 14) & 15]),
          (c = a[b & 15] =
            (((c >>> 7) ^ (c >>> 18) ^ (c >>> 3) ^ (c << 25) ^ (c << 14)) +
              ((d >>> 17) ^ (d >>> 19) ^ (d >>> 10) ^ (d << 15) ^ (d << 13)) +
              a[b & 15] +
              a[(b + 9) & 15]) |
            0)),
        (c =
          c +
          q +
          ((l >>> 6) ^
            (l >>> 11) ^
            (l >>> 25) ^
            (l << 26) ^
            (l << 21) ^
            (l << 7)) +
          (p ^ (l & (m ^ p))) +
          f[b]),
        (q = p),
        (p = m),
        (m = l),
        (l = (n + c) | 0),
        (n = k),
        (k = h),
        (h = g),
        (g =
          (c +
            ((h & k) ^ (n & (h ^ k))) +
            ((h >>> 2) ^
              (h >>> 13) ^
              (h >>> 22) ^
              (h << 30) ^
              (h << 19) ^
              (h << 10))) |
          0);
    e[0] = (e[0] + g) | 0;
    e[1] = (e[1] + h) | 0;
    e[2] = (e[2] + k) | 0;
    e[3] = (e[3] + n) | 0;
    e[4] = (e[4] + l) | 0;
    e[5] = (e[5] + m) | 0;
    e[6] = (e[6] + p) | 0;
    e[7] = (e[7] + q) | 0;
  },
};
sjcl.hash.sha1 = function (a) {
  a
    ? ((this.g = a.g.slice(0)), (this.f = a.f.slice(0)), (this.c = a.c))
    : this.reset();
};
sjcl.hash.sha1.hash = function (a) {
  return new sjcl.hash.sha1().update(a).finalize();
};
sjcl.hash.sha1.prototype = {
  blockSize: 512,
  reset: function () {
    this.g = this.D.slice(0);
    this.f = [];
    this.c = 0;
    return this;
  },
  update: function (a) {
    "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a));
    var b,
      c = (this.f = sjcl.bitArray.concat(this.f, a));
    b = this.c;
    a = this.c = b + sjcl.bitArray.bitLength(a);
    if (0x1fffffffffffff < a)
      throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");
    if ("undefined" !== typeof Uint32Array) {
      var d = new Uint32Array(c),
        e = 0;
      for (
        b = this.blockSize + b - ((this.blockSize + b) & (this.blockSize - 1));
        b <= a;
        b += this.blockSize
      )
        this.l(d.subarray(16 * e, 16 * (e + 1))), (e += 1);
      c.splice(0, 16 * e);
    } else
      for (
        b = this.blockSize + b - ((this.blockSize + b) & (this.blockSize - 1));
        b <= a;
        b += this.blockSize
      )
        this.l(c.splice(0, 16));
    return this;
  },
  finalize: function () {
    var a,
      b = this.f,
      c = this.g,
      b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)]);
    for (a = b.length + 2; a & 15; a++) b.push(0);
    b.push(Math.floor(this.c / 0x100000000));
    for (b.push(this.c | 0); b.length; ) this.l(b.splice(0, 16));
    this.reset();
    return c;
  },
  D: [1732584193, 4023233417, 2562383102, 271733878, 3285377520],
  b: [1518500249, 1859775393, 2400959708, 3395469782],
  l: function (a) {
    var b,
      c,
      d,
      e,
      f,
      g,
      h = this.g,
      k;
    if ("undefined" !== typeof Uint32Array)
      for (k = Array(80), c = 0; 16 > c; c++) k[c] = a[c];
    else k = a;
    c = h[0];
    d = h[1];
    e = h[2];
    f = h[3];
    g = h[4];
    for (a = 0; 79 >= a; a++)
      16 <= a &&
        ((b = k[a - 3] ^ k[a - 8] ^ k[a - 14] ^ k[a - 16]),
        (k[a] = (b << 1) | (b >>> 31))),
        (b =
          19 >= a
            ? (d & e) | (~d & f)
            : 39 >= a
            ? d ^ e ^ f
            : 59 >= a
            ? (d & e) | (d & f) | (e & f)
            : 79 >= a
            ? d ^ e ^ f
            : void 0),
        (b =
          (((c << 5) | (c >>> 27)) +
            b +
            g +
            k[a] +
            this.b[Math.floor(a / 20)]) |
          0),
        (g = f),
        (f = e),
        (e = (d << 30) | (d >>> 2)),
        (d = c),
        (c = b);
    h[0] = (h[0] + c) | 0;
    h[1] = (h[1] + d) | 0;
    h[2] = (h[2] + e) | 0;
    h[3] = (h[3] + f) | 0;
    h[4] = (h[4] + g) | 0;
  },
};
sjcl.mode.ccm = {
  name: "ccm",
  F: [],
  listenProgress: function (a) {
    sjcl.mode.ccm.F.push(a);
  },
  unListenProgress: function (a) {
    a = sjcl.mode.ccm.F.indexOf(a);
    -1 < a && sjcl.mode.ccm.F.splice(a, 1);
  },
  da: function (a) {
    var b = sjcl.mode.ccm.F.slice(),
      c;
    for (c = 0; c < b.length; c += 1) b[c](a);
  },
  encrypt: function (a, b, c, d, e) {
    var f,
      g = b.slice(0),
      h = sjcl.bitArray,
      k = h.bitLength(c) / 8,
      n = h.bitLength(g) / 8;
    e = e || 64;
    d = d || [];
    if (7 > k)
      throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");
    for (f = 2; 4 > f && n >>> (8 * f); f++);
    f < 15 - k && (f = 15 - k);
    c = h.clamp(c, 8 * (15 - f));
    b = sjcl.mode.ccm.U(a, b, c, d, e, f);
    g = sjcl.mode.ccm.V(a, g, c, b, e, f);
    return h.concat(g.data, g.tag);
  },
  decrypt: function (a, b, c, d, e) {
    e = e || 64;
    d = d || [];
    var f = sjcl.bitArray,
      g = f.bitLength(c) / 8,
      h = f.bitLength(b),
      k = f.clamp(b, h - e),
      n = f.bitSlice(b, h - e),
      h = (h - e) / 8;
    if (7 > g)
      throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");
    for (b = 2; 4 > b && h >>> (8 * b); b++);
    b < 15 - g && (b = 15 - g);
    c = f.clamp(c, 8 * (15 - b));
    k = sjcl.mode.ccm.V(a, k, c, n, e, b);
    a = sjcl.mode.ccm.U(a, k.data, c, d, e, b);
    if (!f.equal(k.tag, a))
      throw new sjcl.exception.corrupt("ccm: tag doesn't match");
    return k.data;
  },
  ka: function (a, b, c, d, e, f) {
    var g = [],
      h = sjcl.bitArray,
      k = h.B;
    d = [h.partial(8, (b.length ? 64 : 0) | ((d - 2) << 2) | (f - 1))];
    d = h.concat(d, c);
    d[3] |= e;
    d = a.encrypt(d);
    if (b.length)
      for (
        c = h.bitLength(b) / 8,
          65279 >= c
            ? (g = [h.partial(16, c)])
            : 0xffffffff >= c && (g = h.concat([h.partial(16, 65534)], [c])),
          g = h.concat(g, b),
          b = 0;
        b < g.length;
        b += 4
      )
        d = a.encrypt(k(d, g.slice(b, b + 4).concat([0, 0, 0])));
    return d;
  },
  U: function (a, b, c, d, e, f) {
    var g = sjcl.bitArray,
      h = g.B;
    e /= 8;
    if (e % 2 || 4 > e || 16 < e)
      throw new sjcl.exception.invalid("ccm: invalid tag length");
    if (0xffffffff < d.length || 0xffffffff < b.length)
      throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");
    c = sjcl.mode.ccm.ka(a, d, c, e, g.bitLength(b) / 8, f);
    for (d = 0; d < b.length; d += 4)
      c = a.encrypt(h(c, b.slice(d, d + 4).concat([0, 0, 0])));
    return g.clamp(c, 8 * e);
  },
  V: function (a, b, c, d, e, f) {
    var g,
      h = sjcl.bitArray;
    g = h.B;
    var k = b.length,
      n = h.bitLength(b),
      l = k / 50,
      m = l;
    c = h
      .concat([h.partial(8, f - 1)], c)
      .concat([0, 0, 0])
      .slice(0, 4);
    d = h.bitSlice(g(d, a.encrypt(c)), 0, e);
    if (!k) return { tag: d, data: [] };
    for (g = 0; g < k; g += 4)
      g > l && (sjcl.mode.ccm.da(g / k), (l += m)),
        c[3]++,
        (e = a.encrypt(c)),
        (b[g] ^= e[0]),
        (b[g + 1] ^= e[1]),
        (b[g + 2] ^= e[2]),
        (b[g + 3] ^= e[3]);
    return { tag: d, data: h.clamp(b, n) };
  },
};
void 0 === sjcl.beware && (sjcl.beware = {});
sjcl.beware[
  "CBC mode is dangerous because it doesn't protect message integrity."
] = function () {
  sjcl.mode.cbc = {
    name: "cbc",
    encrypt: function (a, b, c, d) {
      if (d && d.length)
        throw new sjcl.exception.invalid("cbc can't authenticate data");
      if (128 !== sjcl.bitArray.bitLength(c))
        throw new sjcl.exception.invalid("cbc iv must be 128 bits");
      var e = sjcl.bitArray,
        f = e.B,
        g = e.bitLength(b),
        h = 0,
        k = [];
      if (g & 7)
        throw new sjcl.exception.invalid(
          "pkcs#5 padding only works for multiples of a byte"
        );
      for (d = 0; h + 128 <= g; d += 4, h += 128)
        (c = a.encrypt(f(c, b.slice(d, d + 4)))),
          k.splice(d, 0, c[0], c[1], c[2], c[3]);
      g = 0x1010101 * (16 - ((g >> 3) & 15));
      c = a.encrypt(f(c, e.concat(b, [g, g, g, g]).slice(d, d + 4)));
      k.splice(d, 0, c[0], c[1], c[2], c[3]);
      return k;
    },
    decrypt: function (a, b, c, d) {
      if (d && d.length)
        throw new sjcl.exception.invalid("cbc can't authenticate data");
      if (128 !== sjcl.bitArray.bitLength(c))
        throw new sjcl.exception.invalid("cbc iv must be 128 bits");
      if (sjcl.bitArray.bitLength(b) & 127 || !b.length)
        throw new sjcl.exception.corrupt(
          "cbc ciphertext must be a positive multiple of the block size"
        );
      var e = sjcl.bitArray,
        f = e.B,
        g,
        h = [];
      for (d = 0; d < b.length; d += 4)
        (g = b.slice(d, d + 4)),
          (c = f(c, a.decrypt(g))),
          h.splice(d, 0, c[0], c[1], c[2], c[3]),
          (c = g);
      g = h[d - 1] & 255;
      if (0 === g || 16 < g)
        throw new sjcl.exception.corrupt("pkcs#5 padding corrupt");
      c = 0x1010101 * g;
      if (
        !e.equal(
          e.bitSlice([c, c, c, c], 0, 8 * g),
          e.bitSlice(h, 32 * h.length - 8 * g, 32 * h.length)
        )
      )
        throw new sjcl.exception.corrupt("pkcs#5 padding corrupt");
      return e.bitSlice(h, 0, 32 * h.length - 8 * g);
    },
  };
};
sjcl.misc.hmac = function (a, b) {
  this.W = b = b || sjcl.hash.sha256;
  var c = [[], []],
    d,
    e = b.prototype.blockSize / 32;
  this.A = [new b(), new b()];
  a.length > e && (a = b.hash(a));
  for (d = 0; d < e; d++)
    (c[0][d] = a[d] ^ 909522486), (c[1][d] = a[d] ^ 1549556828);
  this.A[0].update(c[0]);
  this.A[1].update(c[1]);
  this.P = new b(this.A[0]);
};
sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function (a) {
  if (this.Z)
    throw new sjcl.exception.invalid("encrypt on already updated hmac called!");
  this.update(a);
  return this.digest(a);
};
sjcl.misc.hmac.prototype.reset = function () {
  this.P = new this.W(this.A[0]);
  this.Z = !1;
};
sjcl.misc.hmac.prototype.update = function (a) {
  this.Z = !0;
  this.P.update(a);
};
sjcl.misc.hmac.prototype.digest = function () {
  var a = this.P.finalize(),
    a = new this.W(this.A[1]).update(a).finalize();
  this.reset();
  return a;
};
sjcl.misc.pbkdf2 = function (a, b, c, d, e) {
  c = c || 1e4;
  if (0 > d || 0 > c)
    throw new sjcl.exception.invalid("invalid params to pbkdf2");
  "string" === typeof a && (a = sjcl.codec.utf8String.toBits(a));
  "string" === typeof b && (b = sjcl.codec.utf8String.toBits(b));
  e = e || sjcl.misc.hmac;
  a = new e(a);
  var f,
    g,
    h,
    k,
    n = [],
    l = sjcl.bitArray;
  for (k = 1; 32 * n.length < (d || 1); k++) {
    e = f = a.encrypt(l.concat(b, [k]));
    for (g = 1; g < c; g++)
      for (f = a.encrypt(f), h = 0; h < f.length; h++) e[h] ^= f[h];
    n = n.concat(e);
  }
  d && (n = l.clamp(n, d));
  return n;
};
sjcl.prng = function (a) {
  this.h = [new sjcl.hash.sha256()];
  this.o = [0];
  this.O = 0;
  this.G = {};
  this.M = 0;
  this.T = {};
  this.X = this.i = this.s = this.fa = 0;
  this.b = [0, 0, 0, 0, 0, 0, 0, 0];
  this.m = [0, 0, 0, 0];
  this.K = void 0;
  this.L = a;
  this.C = !1;
  this.J = { progress: {}, seeded: {} };
  this.w = this.ea = 0;
  this.H = 1;
  this.I = 2;
  this.aa = 0x10000;
  this.R = [0, 48, 64, 96, 128, 192, 0x100, 384, 512, 768, 1024];
  this.ba = 3e4;
  this.$ = 80;
};
sjcl.prng.prototype = {
  randomWords: function (a, b) {
    var c = [],
      d;
    d = this.isReady(b);
    var e;
    if (d === this.w)
      throw new sjcl.exception.notReady("generator isn't seeded");
    if (d & this.I) {
      d = !(d & this.H);
      e = [];
      var f = 0,
        g;
      this.X = e[0] = new Date().valueOf() + this.ba;
      for (g = 0; 16 > g; g++) e.push((0x100000000 * Math.random()) | 0);
      for (
        g = 0;
        g < this.h.length &&
        ((e = e.concat(this.h[g].finalize())),
        (f += this.o[g]),
        (this.o[g] = 0),
        d || !(this.O & (1 << g)));
        g++
      );
      this.O >= 1 << this.h.length &&
        (this.h.push(new sjcl.hash.sha256()), this.o.push(0));
      this.i -= f;
      f > this.s && (this.s = f);
      this.O++;
      this.b = sjcl.hash.sha256.hash(this.b.concat(e));
      this.K = new sjcl.cipher.aes(this.b);
      for (
        d = 0;
        4 > d && ((this.m[d] = (this.m[d] + 1) | 0), !this.m[d]);
        d++
      );
    }
    for (d = 0; d < a; d += 4)
      0 === (d + 1) % this.aa && t(this),
        (e = y(this)),
        c.push(e[0], e[1], e[2], e[3]);
    t(this);
    return c.slice(0, a);
  },
  setDefaultParanoia: function (a, b) {
    if (
      0 === a &&
      "Setting paranoia=0 will ruin your security; use it only for testing" !==
        b
    )
      throw new sjcl.exception.invalid(
        "Setting paranoia=0 will ruin your security; use it only for testing"
      );
    this.L = a;
  },
  addEntropy: function (a, b, c) {
    c = c || "user";
    var d,
      e,
      f = new Date().valueOf(),
      g = this.G[c],
      h = this.isReady(),
      k = 0;
    d = this.T[c];
    void 0 === d && (d = this.T[c] = this.fa++);
    void 0 === g && (g = this.G[c] = 0);
    this.G[c] = (this.G[c] + 1) % this.h.length;
    switch (typeof a) {
      case "number":
        void 0 === b && (b = 1);
        this.h[g].update([d, this.M++, 1, b, f, 1, a | 0]);
        break;
      case "object":
        c = Object.prototype.toString.call(a);
        if ("[object Uint32Array]" === c) {
          e = [];
          for (c = 0; c < a.length; c++) e.push(a[c]);
          a = e;
        } else
          for (
            "[object Array]" !== c && (k = 1), c = 0;
            c < a.length && !k;
            c++
          )
            "number" !== typeof a[c] && (k = 1);
        if (!k) {
          if (void 0 === b)
            for (c = b = 0; c < a.length; c++)
              for (e = a[c]; 0 < e; ) b++, (e = e >>> 1);
          this.h[g].update([d, this.M++, 2, b, f, a.length].concat(a));
        }
        break;
      case "string":
        void 0 === b && (b = a.length);
        this.h[g].update([d, this.M++, 3, b, f, a.length]);
        this.h[g].update(a);
        break;
      default:
        k = 1;
    }
    if (k)
      throw new sjcl.exception.bug(
        "random: addEntropy only supports number, array of numbers or string"
      );
    this.o[g] += b;
    this.i += b;
    h === this.w &&
      (this.isReady() !== this.w && z("seeded", Math.max(this.s, this.i)),
      z("progress", this.getProgress()));
  },
  isReady: function (a) {
    a = this.R[void 0 !== a ? a : this.L];
    return this.s && this.s >= a
      ? this.o[0] > this.$ && new Date().valueOf() > this.X
        ? this.I | this.H
        : this.H
      : this.i >= a
      ? this.I | this.w
      : this.w;
  },
  getProgress: function (a) {
    a = this.R[a ? a : this.L];
    return this.s >= a ? 1 : this.i > a ? 1 : this.i / a;
  },
  startCollectors: function () {
    if (!this.C) {
      this.a = {
        loadTimeCollector: A(this, this.ja),
        mouseCollector: A(this, this.la),
        keyboardCollector: A(this, this.ia),
        accelerometerCollector: A(this, this.ca),
        touchCollector: A(this, this.na),
      };
      if (window.addEventListener)
        window.addEventListener("load", this.a.loadTimeCollector, !1),
          window.addEventListener("mousemove", this.a.mouseCollector, !1),
          window.addEventListener("keypress", this.a.keyboardCollector, !1),
          window.addEventListener(
            "devicemotion",
            this.a.accelerometerCollector,
            !1
          ),
          window.addEventListener("touchmove", this.a.touchCollector, !1);
      else if (document.attachEvent)
        document.attachEvent("onload", this.a.loadTimeCollector),
          document.attachEvent("onmousemove", this.a.mouseCollector),
          document.attachEvent("keypress", this.a.keyboardCollector);
      else throw new sjcl.exception.bug("can't attach event");
      this.C = !0;
    }
  },
  stopCollectors: function () {
    this.C &&
      (window.removeEventListener
        ? (window.removeEventListener("load", this.a.loadTimeCollector, !1),
          window.removeEventListener("mousemove", this.a.mouseCollector, !1),
          window.removeEventListener("keypress", this.a.keyboardCollector, !1),
          window.removeEventListener(
            "devicemotion",
            this.a.accelerometerCollector,
            !1
          ),
          window.removeEventListener("touchmove", this.a.touchCollector, !1))
        : document.detachEvent &&
          (document.detachEvent("onload", this.a.loadTimeCollector),
          document.detachEvent("onmousemove", this.a.mouseCollector),
          document.detachEvent("keypress", this.a.keyboardCollector)),
      (this.C = !1));
  },
  addEventListener: function (a, b) {
    this.J[a][this.ea++] = b;
  },
  removeEventListener: function (a, b) {
    var c,
      d,
      e = this.J[a],
      f = [];
    for (d in e) e.hasOwnProperty(d) && e[d] === b && f.push(d);
    for (c = 0; c < f.length; c++) (d = f[c]), delete e[d];
  },
  ia: function () {
    B(this, 1);
  },
  la: function (a) {
    var b, c;
    try {
      (b = a.x || a.clientX || a.offsetX || 0),
        (c = a.y || a.clientY || a.offsetY || 0);
    } catch (d) {
      c = b = 0;
    }
    0 != b && 0 != c && this.addEntropy([b, c], 2, "mouse");
    B(this, 0);
  },
  na: function (a) {
    a = a.touches[0] || a.changedTouches[0];
    this.addEntropy([a.pageX || a.clientX, a.pageY || a.clientY], 1, "touch");
    B(this, 0);
  },
  ja: function () {
    B(this, 2);
  },
  ca: function (a) {
    a =
      a.accelerationIncludingGravity.x ||
      a.accelerationIncludingGravity.y ||
      a.accelerationIncludingGravity.z;
    if (window.orientation) {
      var b = window.orientation;
      "number" === typeof b && this.addEntropy(b, 1, "accelerometer");
    }
    a && this.addEntropy(a, 2, "accelerometer");
    B(this, 0);
  },
};
function z(a, b) {
  var c,
    d = sjcl.random.J[a],
    e = [];
  for (c in d) d.hasOwnProperty(c) && e.push(d[c]);
  for (c = 0; c < e.length; c++) e[c](b);
}
function B(a, b) {
  "undefined" !== typeof window &&
  window.performance &&
  "function" === typeof window.performance.now
    ? a.addEntropy(window.performance.now(), b, "loadtime")
    : a.addEntropy(new Date().valueOf(), b, "loadtime");
}
function t(a) {
  a.b = y(a).concat(y(a));
  a.K = new sjcl.cipher.aes(a.b);
}
function y(a) {
  for (var b = 0; 4 > b && ((a.m[b] = (a.m[b] + 1) | 0), !a.m[b]); b++);
  return a.K.encrypt(a.m);
}
function A(a, b) {
  return function () {
    b.apply(a, arguments);
  };
}
sjcl.random = new sjcl.prng(6);
a: try {
  var C, D, E, F;
  if ((F = "undefined" !== typeof module && module.exports)) {
    var G;
    try {
      G = require("crypto");
    } catch (a) {
      G = null;
    }
    F = D = G;
  }
  if (F && D.randomBytes)
    (C = D.randomBytes(128)),
      (C = new Uint32Array(new Uint8Array(C).buffer)),
      sjcl.random.addEntropy(C, 1024, "crypto['randomBytes']");
  else if (
    "undefined" !== typeof window &&
    "undefined" !== typeof Uint32Array
  ) {
    E = new Uint32Array(32);
    if (window.crypto && window.crypto.getRandomValues)
      window.crypto.getRandomValues(E);
    else if (window.msCrypto && window.msCrypto.getRandomValues)
      window.msCrypto.getRandomValues(E);
    else break a;
    sjcl.random.addEntropy(E, 1024, "crypto['getRandomValues']");
  }
} catch (a) {
  "undefined" !== typeof window &&
    window.console &&
    (console.log("There was an error collecting entropy from the browser:"),
    console.log(a));
}
sjcl.json = {
  defaults: {
    v: 1,
    iter: 1e4,
    ks: 128,
    ts: 64,
    mode: "ccm",
    adata: "",
    cipher: "aes",
  },
  ha: function (a, b, c, d) {
    c = c || {};
    d = d || {};
    var e = sjcl.json,
      f = e.j({ iv: sjcl.random.randomWords(4, 0) }, e.defaults),
      g;
    e.j(f, c);
    c = f.adata;
    "string" === typeof f.salt && (f.salt = sjcl.codec.base64.toBits(f.salt));
    "string" === typeof f.iv && (f.iv = sjcl.codec.base64.toBits(f.iv));
    if (
      !sjcl.mode[f.mode] ||
      !sjcl.cipher[f.cipher] ||
      ("string" === typeof a && 100 >= f.iter) ||
      (64 !== f.ts && 96 !== f.ts && 128 !== f.ts) ||
      (128 !== f.ks && 192 !== f.ks && 0x100 !== f.ks) ||
      2 > f.iv.length ||
      4 < f.iv.length
    )
      throw new sjcl.exception.invalid("json encrypt: invalid parameters");
    "string" === typeof a
      ? ((g = sjcl.misc.cachedPbkdf2(a, f)),
        (a = g.key.slice(0, f.ks / 32)),
        (f.salt = g.salt))
      : sjcl.ecc &&
        a instanceof sjcl.ecc.elGamal.publicKey &&
        ((g = a.kem()), (f.kemtag = g.tag), (a = g.key.slice(0, f.ks / 32)));
    "string" === typeof b && (b = sjcl.codec.utf8String.toBits(b));
    "string" === typeof c && (f.adata = c = sjcl.codec.utf8String.toBits(c));
    g = new sjcl.cipher[f.cipher](a);
    e.j(d, f);
    d.key = a;
    f.ct =
      "ccm" === f.mode &&
      sjcl.arrayBuffer &&
      sjcl.arrayBuffer.ccm &&
      b instanceof ArrayBuffer
        ? sjcl.arrayBuffer.ccm.encrypt(g, b, f.iv, c, f.ts)
        : sjcl.mode[f.mode].encrypt(g, b, f.iv, c, f.ts);
    return f;
  },
  encrypt: function (a, b, c, d) {
    var e = sjcl.json,
      f = e.ha.apply(e, arguments);
    return e.encode(f);
  },
  ga: function (a, b, c, d) {
    c = c || {};
    d = d || {};
    var e = sjcl.json;
    b = e.j(e.j(e.j({}, e.defaults), b), c, !0);
    var f, g;
    f = b.adata;
    "string" === typeof b.salt && (b.salt = sjcl.codec.base64.toBits(b.salt));
    "string" === typeof b.iv && (b.iv = sjcl.codec.base64.toBits(b.iv));
    if (
      !sjcl.mode[b.mode] ||
      !sjcl.cipher[b.cipher] ||
      ("string" === typeof a && 100 >= b.iter) ||
      (64 !== b.ts && 96 !== b.ts && 128 !== b.ts) ||
      (128 !== b.ks && 192 !== b.ks && 0x100 !== b.ks) ||
      !b.iv ||
      2 > b.iv.length ||
      4 < b.iv.length
    )
      throw new sjcl.exception.invalid("json decrypt: invalid parameters");
    "string" === typeof a
      ? ((g = sjcl.misc.cachedPbkdf2(a, b)),
        (a = g.key.slice(0, b.ks / 32)),
        (b.salt = g.salt))
      : sjcl.ecc &&
        a instanceof sjcl.ecc.elGamal.secretKey &&
        (a = a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0, b.ks / 32));
    "string" === typeof f && (f = sjcl.codec.utf8String.toBits(f));
    g = new sjcl.cipher[b.cipher](a);
    f =
      "ccm" === b.mode &&
      sjcl.arrayBuffer &&
      sjcl.arrayBuffer.ccm &&
      b.ct instanceof ArrayBuffer
        ? sjcl.arrayBuffer.ccm.decrypt(g, b.ct, b.iv, b.tag, f, b.ts)
        : sjcl.mode[b.mode].decrypt(g, b.ct, b.iv, f, b.ts);
    e.j(d, b);
    d.key = a;
    return 1 === c.raw ? f : sjcl.codec.utf8String.fromBits(f);
  },
  decrypt: function (a, b, c, d) {
    var e = sjcl.json;
    return e.ga(a, e.decode(b), c, d);
  },
  encode: function (a) {
    var b,
      c = "{",
      d = "";
    for (b in a)
      if (a.hasOwnProperty(b)) {
        if (!b.match(/^[a-z0-9]+$/i))
          throw new sjcl.exception.invalid(
            "json encode: invalid property name"
          );
        c += d + '"' + b + '":';
        d = ",";
        switch (typeof a[b]) {
          case "number":
          case "boolean":
            c += a[b];
            break;
          case "string":
            c += '"' + escape(a[b]) + '"';
            break;
          case "object":
            c += '"' + sjcl.codec.base64.fromBits(a[b], 0) + '"';
            break;
          default:
            throw new sjcl.exception.bug("json encode: unsupported type");
        }
      }
    return c + "}";
  },
  decode: function (a) {
    a = a.replace(/\s/g, "");
    if (!a.match(/^\{.*\}$/))
      throw new sjcl.exception.invalid("json decode: this isn't json!");
    a = a.replace(/^\{|\}$/g, "").split(/,/);
    var b = {},
      c,
      d;
    for (c = 0; c < a.length; c++) {
      if (
        !(d = a[c].match(
          /^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i
        ))
      )
        throw new sjcl.exception.invalid("json decode: this isn't json!");
      null != d[3]
        ? (b[d[2]] = parseInt(d[3], 10))
        : null != d[4]
        ? (b[d[2]] = d[2].match(/^(ct|adata|salt|iv)$/)
            ? sjcl.codec.base64.toBits(d[4])
            : unescape(d[4]))
        : null != d[5] && (b[d[2]] = "true" === d[5]);
    }
    return b;
  },
  j: function (a, b, c) {
    void 0 === a && (a = {});
    if (void 0 === b) return a;
    for (var d in b)
      if (b.hasOwnProperty(d)) {
        if (c && void 0 !== a[d] && a[d] !== b[d])
          throw new sjcl.exception.invalid("required parameter overridden");
        a[d] = b[d];
      }
    return a;
  },
  pa: function (a, b) {
    var c = {},
      d;
    for (d in a) a.hasOwnProperty(d) && a[d] !== b[d] && (c[d] = a[d]);
    return c;
  },
  oa: function (a, b) {
    var c = {},
      d;
    for (d = 0; d < b.length; d++) void 0 !== a[b[d]] && (c[b[d]] = a[b[d]]);
    return c;
  },
};
sjcl.encrypt = sjcl.json.encrypt;
sjcl.decrypt = sjcl.json.decrypt;
sjcl.misc.ma = {};
sjcl.misc.cachedPbkdf2 = function (a, b) {
  var c = sjcl.misc.ma,
    d;
  b = b || {};
  d = b.iter || 1e3;
  c = c[a] = c[a] || {};
  d = c[d] = c[d] || {
    firstSalt:
      b.salt && b.salt.length ? b.salt.slice(0) : sjcl.random.randomWords(2, 0),
  };
  c = void 0 === b.salt ? d.firstSalt : b.salt;
  d[c] = d[c] || sjcl.misc.pbkdf2(a, c, b.iter);
  return { key: d[c].slice(0), salt: c.slice(0) };
};
"undefined" !== typeof module && module.exports && (module.exports = sjcl);
"function" === typeof define &&
  define([], function () {
    return sjcl;
  });
