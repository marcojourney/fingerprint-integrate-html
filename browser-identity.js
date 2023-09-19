var browser_identity;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 326:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getVisitorId = exports.getVisitorData = exports.prepareForSources = exports.hashComponents = exports.componentsToDebugString = void 0;
const async_1 = __webpack_require__(497);
const hashing_1 = __webpack_require__(473);
const misc_1 = __webpack_require__(235);
const confidence_1 = __webpack_require__(812);
function componentsToCanonicalString(components) {
    let result = '';
    for (const componentKey of Object.keys(components).sort()) {
        const component = components[componentKey];
        const value = 'error' in component ? 'error' : JSON.stringify(component.value);
        result += `${result ? '|' : ''}${componentKey.replace(/([:|\\])/g, '\\$1')}:${value}`;
    }
    return result;
}
function componentsToDebugString(components) {
    return JSON.stringify(components, (_key, value) => {
        if (value instanceof Error) {
            return (0, misc_1.errorToObject)(value);
        }
        return value;
    }, 2);
}
exports.componentsToDebugString = componentsToDebugString;
function hashComponents(components) {
    return (0, hashing_1.x64hash128)(componentsToCanonicalString(components));
}
exports.hashComponents = hashComponents;
/**
 * Makes a GetResult implementation that calculates the visitor id hash on demand.
 * Designed for optimisation.
 */
function makeLazyGetResult(attributes) {
    let visitorIdCache;
    // This function runs very fast, so there is no need to make it lazy
    const confidence = (0, confidence_1.default)(attributes);
    // A plain class isn't used because its getters and setters aren't enumerable.
    return {
        get visitorId() {
            if (visitorIdCache === undefined) {
                visitorIdCache = hashComponents(this.attributes);
            }
            return visitorIdCache;
        },
        set visitorId(visitorId) {
            visitorIdCache = visitorId;
        },
        confidence,
        attributes
    };
}
/**
 * A delay is required to ensure consistent entropy components.
 * See https://github.com/fingerprintjs/fingerprintjs/issues/254
 * and https://github.com/fingerprintjs/fingerprintjs/issues/307
 * and https://github.com/fingerprintjs/fingerprintjs/commit/945633e7c5f67ae38eb0fea37349712f0e669b18
 */
function prepareForSources(delayFallback = 50) {
    // A proper deadline is unknown. Let it be twice the fallback timeout so that both cases have the same average time.
    return (0, async_1.requestIdleCallbackIfAvailable)(delayFallback, delayFallback * 2);
}
exports.prepareForSources = prepareForSources;
/**
 * The function isn't exported from the index file to not allow to call it without `load()`.
 * The hiding gives more freedom for future non-breaking updates.
 *
 * A factory function is used instead of a class to shorten the attribute names in the minified code.
 * Native private class fields could've been used, but TypeScript doesn't allow them with `"target": "es5"`.
 */
function makeAgent(attributes) {
    return makeLazyGetResult(attributes);
}
/**
 * Builds an instance of Agent and waits a delay required for a proper operation.
 */
function getVisitorData(attributes) {
    return __awaiter(this, void 0, void 0, function* () {
        return makeAgent(attributes);
    });
}
exports.getVisitorData = getVisitorData;
/**
 *
 * @param attributes
 * @returns
 */
function getVisitorId(attributes) {
    const result = makeLazyGetResult(attributes);
    return result === null || result === void 0 ? void 0 : result.visitorId;
}
exports.getVisitorId = getVisitorId;


/***/ }),

/***/ 812:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.commentTemplate = void 0;
const data_1 = __webpack_require__(634);
const browser_1 = __webpack_require__(479);
exports.commentTemplate = '$ if upgrade to Pro: https://fpjs.dev/pro';
function getConfidence(components) {
    const openConfidenceScore = getOpenConfidenceScore(components);
    const proConfidenceScore = deriveProConfidenceScore(openConfidenceScore);
    return { score: openConfidenceScore, comment: exports.commentTemplate.replace(/\$/g, `${proConfidenceScore}`) };
}
exports["default"] = getConfidence;
function getOpenConfidenceScore(components) {
    // In order to calculate the true probability of the visitor identifier being correct, we need to know the number of
    // website visitors (the higher the number, the less the probability because the fingerprint entropy is limited).
    // JS agent doesn't know the number of visitors, so we can only do an approximate assessment.
    if ((0, browser_1.isAndroid)()) {
        return 0.4;
    }
    // Safari (mobile and desktop)
    if ((0, browser_1.isWebKit)()) {
        return (0, browser_1.isDesktopSafari)() ? 0.5 : 0.3;
    }
    const platform = 'value' in components.platform ? components.platform.value : '';
    // Windows
    if (/^Win/.test(platform)) {
        // The score is greater than on macOS because of the higher variety of devices running Windows.
        // Chrome provides more entropy than Firefox according too
        // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Windows%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
        // So we assign the same score to them.
        return 0.6;
    }
    // macOS
    if (/^Mac/.test(platform)) {
        // Chrome provides more entropy than Safari and Safari provides more entropy than Firefox.
        // Chrome is more popular than Safari and Safari is more popular than Firefox according to
        // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Mac%20OS%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
        // So we assign the same score to them.
        return 0.5;
    }
    // Another platform, e.g. a desktop Linux. It's rare, so it should be pretty unique.
    return 0.7;
}
function deriveProConfidenceScore(openConfidenceScore) {
    return (0, data_1.round)(0.99 + 0.01 * openConfidenceScore, 0.0001);
}


/***/ }),

/***/ 313:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getStateFromError = void 0;
function getApplePayState() {
    const { ApplePaySession } = window;
    if (typeof (ApplePaySession === null || ApplePaySession === void 0 ? void 0 : ApplePaySession.canMakePayments) !== 'function') {
        return -1 /* ApplePayState.NoAPI */;
    }
    try {
        return ApplePaySession.canMakePayments() ? 1 /* ApplePayState.Enabled */ : 0 /* ApplePayState.Disabled */;
    }
    catch (error) {
        return getStateFromError(error);
    }
}
exports["default"] = getApplePayState;
/**
 * The return type is a union instead of the enum, because it's too challenging to embed the const enum into another
 * project. Turning it into a union is a simple and an elegant solution.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function getStateFromError(error) {
    if (error instanceof Error) {
        // See full expected error messages in the test
        if (error.name === 'InvalidAccessError') {
            if (/\bfrom\b.*\binsecure\b/i.test(error.message)) {
                return -2 /* ApplePayState.NotAvailableInInsecureContext */;
            }
            if (/\bdifferent\b.*\borigin\b.*top.level\b.*\bframe\b/i.test(error.message)) {
                return -3 /* ApplePayState.NotAvailableInFrame */;
            }
        }
        if (error.name === 'SecurityError') {
            if (/\bthird.party iframes?.*\bnot.allowed\b/i.test(error.message)) {
                return -3 /* ApplePayState.NotAvailableInFrame */;
            }
        }
    }
    throw error;
}
exports.getStateFromError = getStateFromError;


/***/ }),

/***/ 548:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Unlike most other architectures, on x86/x86-64 when floating-point instructions
 * have no NaN arguments, but produce NaN output, the output NaN has sign bit set.
 * We use it to distinguish x86/x86-64 from other architectures, by doing subtraction
 * of two infinities (must produce NaN per IEEE 754 standard).
 *
 * See https://codebrowser.bddppq.com/pytorch/pytorch/third_party/XNNPACK/src/init.c.html#79
 */
function getArchitecture() {
    const f = new Float32Array(1);
    const u8 = new Uint8Array(f.buffer);
    f[0] = Infinity;
    f[0] = f[0] - f[0];
    return u8[3];
}
exports["default"] = getArchitecture;


/***/ }),

/***/ 295:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const browser_1 = __webpack_require__(479);
const async_1 = __webpack_require__(497);
/**
 * A deep description: https://fingerprint.com/blog/audio-fingerprinting/
 * Inspired by and based on https://github.com/cozylife/audio-fingerprint
 */
function getAudioFingerprint() {
    const w = window;
    const AudioContext = w.OfflineAudioContext || w.webkitOfflineAudioContext;
    if (!AudioContext) {
        return -2 /* SpecialFingerprint.NotSupported */;
    }
    // In some browsers, audio context always stays suspended unless the context is started in response to a user action
    // (e.g. a click or a tap). It prevents audio fingerprint from being taken at an arbitrary moment of time.
    // Such browsers are old and unpopular, so the audio fingerprinting is just skipped in them.
    // See a similar case explanation at https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
    if (doesCurrentBrowserSuspendAudioContext()) {
        return -1 /* SpecialFingerprint.KnownToSuspend */;
    }
    const hashFromIndex = 4500;
    const hashToIndex = 5000;
    const context = new AudioContext(1, hashToIndex, 44100);
    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 10000;
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;
    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);
    const [renderPromise, finishRendering] = startRenderingAudio(context);
    const fingerprintPromise = renderPromise.then((buffer) => getHash(buffer.getChannelData(0).subarray(hashFromIndex)), (error) => {
        if (error.name === "timeout" /* InnerErrorName.Timeout */ || error.name === "suspended" /* InnerErrorName.Suspended */) {
            return -3 /* SpecialFingerprint.Timeout */;
        }
        throw error;
    });
    // Suppresses the console error message in case when the fingerprint fails before requested
    (0, async_1.suppressUnhandledRejectionWarning)(fingerprintPromise);
    return () => {
        finishRendering();
        return fingerprintPromise;
    };
}
exports["default"] = getAudioFingerprint;
/**
 * Checks if the current browser is known to always suspend audio context
 */
function doesCurrentBrowserSuspendAudioContext() {
    return (0, browser_1.isWebKit)() && !(0, browser_1.isDesktopSafari)() && !(0, browser_1.isWebKit606OrNewer)();
}
/**
 * Starts rendering the audio context.
 * When the returned function is called, the render process starts finishing.
 */
function startRenderingAudio(context) {
    const renderTryMaxCount = 3;
    const renderRetryDelay = 500;
    const runningMaxAwaitTime = 500;
    const runningSufficientTime = 5000;
    let finalize = () => undefined;
    const resultPromise = new Promise((resolve, reject) => {
        let isFinalized = false;
        let renderTryCount = 0;
        let startedRunningAt = 0;
        context.oncomplete = (event) => resolve(event.renderedBuffer);
        const startRunningTimeout = () => {
            setTimeout(() => reject(makeInnerError("timeout" /* InnerErrorName.Timeout */)), Math.min(runningMaxAwaitTime, startedRunningAt + runningSufficientTime - Date.now()));
        };
        const tryRender = () => {
            try {
                const renderingPromise = context.startRendering();
                // `context.startRendering` has two APIs: Promise and callback, we check that it's really a promise just in case
                if ((0, async_1.isPromise)(renderingPromise)) {
                    // Suppresses all unhadled rejections in case of scheduled redundant retries after successful rendering
                    (0, async_1.suppressUnhandledRejectionWarning)(renderingPromise);
                }
                switch (context.state) {
                    case 'running':
                        startedRunningAt = Date.now();
                        if (isFinalized) {
                            startRunningTimeout();
                        }
                        break;
                    // Sometimes the audio context doesn't start after calling `startRendering` (in addition to the cases where
                    // audio context doesn't start at all). A known case is starting an audio context when the browser tab is in
                    // background on iPhone. Retries usually help in this case.
                    case 'suspended':
                        // The audio context can reject starting until the tab is in foreground. Long fingerprint duration
                        // in background isn't a problem, therefore the retry attempts don't count in background. It can lead to
                        // a situation when a fingerprint takes very long time and finishes successfully. FYI, the audio context
                        // can be suspended when `document.hidden === false` and start running after a retry.
                        if (!document.hidden) {
                            renderTryCount++;
                        }
                        if (isFinalized && renderTryCount >= renderTryMaxCount) {
                            reject(makeInnerError("suspended" /* InnerErrorName.Suspended */));
                        }
                        else {
                            setTimeout(tryRender, renderRetryDelay);
                        }
                        break;
                }
            }
            catch (error) {
                reject(error);
            }
        };
        tryRender();
        finalize = () => {
            if (!isFinalized) {
                isFinalized = true;
                if (startedRunningAt > 0) {
                    startRunningTimeout();
                }
            }
        };
    });
    return [resultPromise, finalize];
}
function getHash(signal) {
    let hash = 0;
    for (let i = 0; i < signal.length; ++i) {
        hash += Math.abs(signal[i]);
    }
    return hash;
}
function makeInnerError(name) {
    const error = new Error(name);
    error.name = name;
    return error;
}


/***/ }),

/***/ 743:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const async_1 = __webpack_require__(497);
// https://www.browserleaks.com/canvas#how-does-it-work
function getCanvasFingerprint() {
    return __awaiter(this, void 0, void 0, function* () {
        let winding = false;
        let geometry;
        let text;
        const [canvas, context] = makeCanvasContext();
        if (!isSupported(canvas, context)) {
            geometry = text = 'unsupported';
        }
        else {
            winding = doesSupportWinding(context);
            renderTextImage(canvas, context);
            yield (0, async_1.releaseEventLoop)();
            const textImage1 = canvasToString(canvas);
            const textImage2 = canvasToString(canvas); // It's slightly faster to double-encode the text image
            // Some browsers add a noise to the canvas: https://github.com/fingerprintjs/fingerprintjs/issues/791
            // The canvas is excluded from the fingerprint in this case
            if (textImage1 !== textImage2) {
                geometry = text = 'unstable';
            }
            else {
                text = textImage1;
                // Text is unstable:
                // https://github.com/fingerprintjs/fingerprintjs/issues/583
                // https://github.com/fingerprintjs/fingerprintjs/issues/103
                // Therefore it's extracted into a separate image.
                renderGeometryImage(canvas, context);
                yield (0, async_1.releaseEventLoop)();
                geometry = canvasToString(canvas);
            }
        }
        return { winding, geometry, text };
    });
}
exports["default"] = getCanvasFingerprint;
function makeCanvasContext() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return [canvas, canvas.getContext('2d')];
}
function isSupported(canvas, context) {
    return !!(context && canvas.toDataURL);
}
function doesSupportWinding(context) {
    // https://web.archive.org/web/20170825024655/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
    context.rect(0, 0, 10, 10);
    context.rect(2, 2, 6, 6);
    return !context.isPointInPath(5, 5, 'evenodd');
}
function renderTextImage(canvas, context) {
    // Resizing the canvas cleans it
    canvas.width = 240;
    canvas.height = 60;
    context.textBaseline = 'alphabetic';
    context.fillStyle = '#f60';
    context.fillRect(100, 1, 62, 20);
    context.fillStyle = '#069';
    // It's important to use explicit built-in fonts in order to exclude the affect of font preferences
    // (there is a separate entropy source for them).
    context.font = '11pt "Times New Roman"';
    // The choice of emojis has a gigantic impact on rendering performance (especially in FF).
    // Some newer emojis cause it to slow down 50-200 times.
    // There must be no text to the right of the emoji, see https://github.com/fingerprintjs/fingerprintjs/issues/574
    // A bare emoji shouldn't be used because the canvas will change depending on the script encoding:
    // https://github.com/fingerprintjs/fingerprintjs/issues/66
    // Escape sequence shouldn't be used too because Terser will turn it into a bare unicode.
    const printedText = `Cwm fjordbank gly ${String.fromCharCode(55357, 56835) /* 😃 */}`;
    context.fillText(printedText, 2, 15);
    context.fillStyle = 'rgba(102, 204, 0, 0.2)';
    context.font = '18pt Arial';
    context.fillText(printedText, 4, 45);
}
function renderGeometryImage(canvas, context) {
    // Resizing the canvas cleans it
    canvas.width = 122;
    canvas.height = 110;
    // Canvas blending
    // https://web.archive.org/web/20170826194121/http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
    // http://jsfiddle.net/NDYV8/16/
    context.globalCompositeOperation = 'multiply';
    for (const [color, x, y] of [
        ['#f2f', 40, 40],
        ['#2ff', 80, 40],
        ['#ff2', 60, 80],
    ]) {
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, 40, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
    }
    // Canvas winding
    // https://web.archive.org/web/20130913061632/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // http://jsfiddle.net/NDYV8/19/
    context.fillStyle = '#f9c';
    context.arc(60, 60, 60, 0, Math.PI * 2, true);
    context.arc(60, 60, 20, 0, Math.PI * 2, true);
    context.fill('evenodd');
}
function canvasToString(canvas) {
    return canvas.toDataURL();
}


/***/ }),

/***/ 21:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getColorDepth() {
    return window.screen.colorDepth;
}
exports["default"] = getColorDepth;


/***/ }),

/***/ 871:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut
 */
function getColorGamut() {
    // rec2020 includes p3 and p3 includes srgb
    for (const gamut of ['rec2020', 'p3', 'srgb']) {
        if (matchMedia(`(color-gamut: ${gamut})`).matches) {
            return gamut;
        }
    }
    return undefined;
}
exports["default"] = getColorGamut;


/***/ }),

/***/ 549:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @see https://www.w3.org/TR/mediaqueries-5/#prefers-contrast
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast
 */
function getContrastPreference() {
    if (doesMatch('no-preference')) {
        return 0 /* ContrastPreference.None */;
    }
    // The sources contradict on the keywords. Probably 'high' and 'low' will never be implemented.
    // Need to check it when all browsers implement the feature.
    if (doesMatch('high') || doesMatch('more')) {
        return 1 /* ContrastPreference.More */;
    }
    if (doesMatch('low') || doesMatch('less')) {
        return -1 /* ContrastPreference.Less */;
    }
    if (doesMatch('forced')) {
        return 10 /* ContrastPreference.ForcedColors */;
    }
    return undefined;
}
exports["default"] = getContrastPreference;
function doesMatch(value) {
    return matchMedia(`(prefers-contrast: ${value})`).matches;
}


/***/ }),

/***/ 292:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
 * cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past with
 * site-specific exceptions. Don't rely on it.
 *
 * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js Taken from here
 */
function areCookiesEnabled() {
    const d = document;
    // Taken from here: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
    // navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
    // cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past
    // with site-specific exceptions. Don't rely on it.
    // try..catch because some in situations `document.cookie` is exposed but throws a
    // SecurityError if you try to access it; e.g. documents created from data URIs
    // or in sandboxed iframes (depending on flags/context)
    try {
        // Create cookie
        d.cookie = 'cookietest=1; SameSite=Strict;';
        const result = d.cookie.indexOf('cookietest=') !== -1;
        // Delete cookie
        d.cookie = 'cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT';
        return result;
    }
    catch (e) {
        return false;
    }
}
exports["default"] = areCookiesEnabled;


/***/ }),

/***/ 67:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getCpuClass() {
    return navigator.cpuClass;
}
exports["default"] = getCpuClass;


/***/ }),

/***/ 800:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const data_1 = __webpack_require__(634);
function getDeviceMemory() {
    // `navigator.deviceMemory` is a string containing a number in some unidentified cases
    return (0, data_1.replaceNaN)((0, data_1.toFloat)(navigator.deviceMemory), undefined);
}
exports["default"] = getDeviceMemory;


/***/ }),

/***/ 867:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getBlockedSelectors = exports.isApplicable = exports.getFilters = void 0;
const browser_1 = __webpack_require__(479);
const dom_1 = __webpack_require__(593);
const data_1 = __webpack_require__(634);
const async_1 = __webpack_require__(497);
/**
 * Only single element selector are supported (no operators like space, +, >, etc).
 * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
 * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
 *
 * The "inappropriate" selectors are obfuscated. See https://github.com/fingerprintjs/fingerprintjs/issues/734.
 * A function is used instead of a plain object to help tree-shaking.
 *
 * The function code is generated automatically. See docs/content_blockers.md to learn how to make the list.
 */
function getFilters() {
    const fromB64 = atob; // Just for better minification
    return {
        abpIndo: [
            '#Iklan-Melayang',
            '#Kolom-Iklan-728',
            '#SidebarIklan-wrapper',
            '[title="ALIENBOLA" i]',
            fromB64('I0JveC1CYW5uZXItYWRz'),
        ],
        abpvn: ['.quangcao', '#mobileCatfish', fromB64('LmNsb3NlLWFkcw=='), '[id^="bn_bottom_fixed_"]', '#pmadv'],
        adBlockFinland: [
            '.mainostila',
            fromB64('LnNwb25zb3JpdA=='),
            '.ylamainos',
            fromB64('YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd'),
            fromB64('YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd'),
        ],
        adBlockPersian: [
            '#navbar_notice_50',
            '.kadr',
            'TABLE[width="140px"]',
            '#divAgahi',
            fromB64('YVtocmVmXj0iaHR0cDovL2cxLnYuZndtcm0ubmV0L2FkLyJd'),
        ],
        adBlockWarningRemoval: [
            '#adblock-honeypot',
            '.adblocker-root',
            '.wp_adblock_detect',
            fromB64('LmhlYWRlci1ibG9ja2VkLWFk'),
            fromB64('I2FkX2Jsb2NrZXI='),
        ],
        adGuardAnnoyances: [
            '.hs-sosyal',
            '#cookieconsentdiv',
            'div[class^="app_gdpr"]',
            '.as-oil',
            '[data-cypress="soft-push-notification-modal"]',
        ],
        adGuardBase: [
            '.BetterJsPopOverlay',
            fromB64('I2FkXzMwMFgyNTA='),
            fromB64('I2Jhbm5lcmZsb2F0MjI='),
            fromB64('I2NhbXBhaWduLWJhbm5lcg=='),
            fromB64('I0FkLUNvbnRlbnQ='),
        ],
        adGuardChinese: [
            fromB64('LlppX2FkX2FfSA=='),
            fromB64('YVtocmVmKj0iLmh0aGJldDM0LmNvbSJd'),
            '#widget-quan',
            fromB64('YVtocmVmKj0iLzg0OTkyMDIwLnh5eiJd'),
            fromB64('YVtocmVmKj0iLjE5NTZobC5jb20vIl0='),
        ],
        adGuardFrench: [
            '#pavePub',
            fromB64('LmFkLWRlc2t0b3AtcmVjdGFuZ2xl'),
            '.mobile_adhesion',
            '.widgetadv',
            fromB64('LmFkc19iYW4='),
        ],
        adGuardGerman: ['aside[data-portal-id="leaderboard"]'],
        adGuardJapanese: [
            '#kauli_yad_1',
            fromB64('YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0='),
            fromB64('Ll9wb3BJbl9pbmZpbml0ZV9hZA=='),
            fromB64('LmFkZ29vZ2xl'),
            fromB64('Ll9faXNib29zdFJldHVybkFk'),
        ],
        adGuardMobile: [
            fromB64('YW1wLWF1dG8tYWRz'),
            fromB64('LmFtcF9hZA=='),
            'amp-embed[type="24smi"]',
            '#mgid_iframe1',
            fromB64('I2FkX2ludmlld19hcmVh'),
        ],
        adGuardRussian: [
            fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZC5sZXRtZWFkcy5jb20vIl0='),
            fromB64('LnJlY2xhbWE='),
            'div[id^="smi2adblock"]',
            fromB64('ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd'),
            '#psyduckpockeball',
        ],
        adGuardSocial: [
            fromB64('YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0='),
            fromB64('YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0='),
            '.etsy-tweet',
            '#inlineShare',
            '.popup-social',
        ],
        adGuardSpanishPortuguese: ['#barraPublicidade', '#Publicidade', '#publiEspecial', '#queTooltip', '.cnt-publi'],
        adGuardTrackingProtection: [
            '#qoo-counter',
            fromB64('YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=='),
            fromB64('YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0='),
            fromB64('YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=='),
            '#top100counter',
        ],
        adGuardTurkish: [
            '#backkapat',
            fromB64('I3Jla2xhbWk='),
            fromB64('YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0='),
            fromB64('YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd'),
            fromB64('YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ=='),
        ],
        bulgarian: [fromB64('dGQjZnJlZW5ldF90YWJsZV9hZHM='), '#ea_intext_div', '.lapni-pop-over', '#xenium_hot_offers'],
        easyList: [
            '.yb-floorad',
            fromB64('LndpZGdldF9wb19hZHNfd2lkZ2V0'),
            fromB64('LnRyYWZmaWNqdW5reS1hZA=='),
            '.textad_headline',
            fromB64('LnNwb25zb3JlZC10ZXh0LWxpbmtz'),
        ],
        easyListChina: [
            fromB64('LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=='),
            fromB64('LmZyb250cGFnZUFkdk0='),
            '#taotaole',
            '#aafoot.top_box',
            '.cfa_popup',
        ],
        easyListCookie: [
            '.ezmob-footer',
            '.cc-CookieWarning',
            '[data-cookie-number]',
            fromB64('LmF3LWNvb2tpZS1iYW5uZXI='),
            '.sygnal24-gdpr-modal-wrap',
        ],
        easyListCzechSlovak: [
            '#onlajny-stickers',
            fromB64('I3Jla2xhbW5pLWJveA=='),
            fromB64('LnJla2xhbWEtbWVnYWJvYXJk'),
            '.sklik',
            fromB64('W2lkXj0ic2tsaWtSZWtsYW1hIl0='),
        ],
        easyListDutch: [
            fromB64('I2FkdmVydGVudGll'),
            fromB64('I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=='),
            '.adstekst',
            fromB64('YVtocmVmXj0iaHR0cHM6Ly94bHR1YmUubmwvY2xpY2svIl0='),
            '#semilo-lrectangle',
        ],
        easyListGermany: [
            '#SSpotIMPopSlider',
            fromB64('LnNwb25zb3JsaW5rZ3J1ZW4='),
            fromB64('I3dlcmJ1bmdza3k='),
            fromB64('I3Jla2xhbWUtcmVjaHRzLW1pdHRl'),
            fromB64('YVtocmVmXj0iaHR0cHM6Ly9iZDc0Mi5jb20vIl0='),
        ],
        easyListItaly: [
            fromB64('LmJveF9hZHZfYW5udW5jaQ=='),
            '.sb-box-pubbliredazionale',
            fromB64('YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd'),
            fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd'),
            fromB64('YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ=='),
        ],
        easyListLithuania: [
            fromB64('LnJla2xhbW9zX3RhcnBhcw=='),
            fromB64('LnJla2xhbW9zX251b3JvZG9z'),
            fromB64('aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd'),
            fromB64('aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd'),
            fromB64('aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd'),
        ],
        estonian: [fromB64('QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==')],
        fanboyAnnoyances: ['#ac-lre-player', '.navigate-to-top', '#subscribe_popup', '.newsletter_holder', '#back-top'],
        fanboyAntiFacebook: ['.util-bar-module-firefly-visible'],
        fanboyEnhancedTrackers: [
            '.open.pushModal',
            '#issuem-leaky-paywall-articles-zero-remaining-nag',
            '#sovrn_container',
            'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
            '.BlockNag__Card',
        ],
        fanboySocial: ['#FollowUs', '#meteored_share', '#social_follow', '.article-sharer', '.community__social-desc'],
        frellwitSwedish: [
            fromB64('YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=='),
            fromB64('YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=='),
            'article.category-samarbete',
            fromB64('ZGl2LmhvbGlkQWRz'),
            'ul.adsmodern',
        ],
        greekAdBlock: [
            fromB64('QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd'),
            fromB64('QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=='),
            fromB64('QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd'),
            'DIV.agores300',
            'TABLE.advright',
        ],
        hungarian: [
            '#cemp_doboz',
            '.optimonk-iframe-container',
            fromB64('LmFkX19tYWlu'),
            fromB64('W2NsYXNzKj0iR29vZ2xlQWRzIl0='),
            '#hirdetesek_box',
        ],
        iDontCareAboutCookies: [
            '.alert-info[data-block-track*="CookieNotice"]',
            '.ModuleTemplateCookieIndicator',
            '.o--cookies--container',
            '#cookies-policy-sticky',
            '#stickyCookieBar',
        ],
        icelandicAbp: [fromB64('QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==')],
        latvian: [
            fromB64('YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0O' +
                'iA0MHB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0='),
            fromB64('YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6I' +
                'DMxcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ=='),
        ],
        listKr: [
            fromB64('YVtocmVmKj0iLy9hZC5wbGFuYnBsdXMuY28ua3IvIl0='),
            fromB64('I2xpdmVyZUFkV3JhcHBlcg=='),
            fromB64('YVtocmVmKj0iLy9hZHYuaW1hZHJlcC5jby5rci8iXQ=='),
            fromB64('aW5zLmZhc3R2aWV3LWFk'),
            '.revenue_unit_item.dable',
        ],
        listeAr: [
            fromB64('LmdlbWluaUxCMUFk'),
            '.right-and-left-sponsers',
            fromB64('YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=='),
            fromB64('YVtocmVmKj0iYm9vcmFxLm9yZyJd'),
            fromB64('YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd'),
        ],
        listeFr: [
            fromB64('YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=='),
            fromB64('I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=='),
            fromB64('YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0='),
            '.site-pub-interstitiel',
            'div[id^="crt-"][data-criteo-id]',
        ],
        officialPolish: [
            '#ceneo-placeholder-ceneo-12',
            fromB64('W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd'),
            fromB64('YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ=='),
            fromB64('YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=='),
            fromB64('ZGl2I3NrYXBpZWNfYWQ='),
        ],
        ro: [
            fromB64('YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd'),
            fromB64('YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd'),
            fromB64('YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0='),
            fromB64('YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd'),
            'a[href^="/url/"]',
        ],
        ruAd: [
            fromB64('YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd'),
            fromB64('YVtocmVmKj0iLy91dGltZy5ydS8iXQ=='),
            fromB64('YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0='),
            '#pgeldiz',
            '.yandex-rtb-block',
        ],
        thaiAds: [
            'a[href*=macau-uta-popup]',
            fromB64('I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=='),
            fromB64('LmFkczMwMHM='),
            '.bumq',
            '.img-kosana',
        ],
        webAnnoyancesUltralist: [
            '#mod-social-share-2',
            '#social-tools',
            fromB64('LmN0cGwtZnVsbGJhbm5lcg=='),
            '.zergnet-recommend',
            '.yt.btn-link.btn-md.btn',
        ],
    };
}
exports.getFilters = getFilters;
/**
 * The order of the returned array means nothing (it's always sorted alphabetically).
 *
 * Notice that the source is slightly unstable.
 * Safari provides a 2-taps way to disable all content blockers on a page temporarily.
 * Also content blockers can be disabled permanently for a domain, but it requires 4 taps.
 * So empty array shouldn't be treated as "no blockers", it should be treated as "no signal".
 * If you are a website owner, don't make your visitors want to disable content blockers.
 */
function getDomBlockers({ debug } = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isApplicable()) {
            return undefined;
        }
        const filters = getFilters();
        const filterNames = Object.keys(filters);
        const allSelectors = [].concat(...filterNames.map((filterName) => filters[filterName]));
        const blockedSelectors = yield getBlockedSelectors(allSelectors);
        if (debug) {
            printDebug(filters, blockedSelectors);
        }
        const activeBlockers = filterNames.filter((filterName) => {
            const selectors = filters[filterName];
            const blockedCount = (0, data_1.countTruthy)(selectors.map((selector) => blockedSelectors[selector]));
            return blockedCount > selectors.length * 0.6;
        });
        activeBlockers.sort();
        return activeBlockers;
    });
}
exports["default"] = getDomBlockers;
function isApplicable() {
    // Safari (desktop and mobile) and all Android browsers keep content blockers in both regular and private mode
    return (0, browser_1.isWebKit)() || (0, browser_1.isAndroid)();
}
exports.isApplicable = isApplicable;
function getBlockedSelectors(selectors) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const d = document;
        const root = d.createElement('div');
        const elements = new Array(selectors.length);
        const blockedSelectors = {}; // Set() isn't used just in case somebody need older browser support
        forceShow(root);
        // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
        // browser will alternate tree modification and layout reading, that is very slow.
        for (let i = 0; i < selectors.length; ++i) {
            const element = (0, dom_1.selectorToElement)(selectors[i]);
            if (element.tagName === 'DIALOG') {
                ;
                element.show();
            }
            const holder = d.createElement('div'); // Protects from unwanted effects of `+` and `~` selectors of filters
            forceShow(holder);
            holder.appendChild(element);
            root.appendChild(holder);
            elements[i] = element;
        }
        // document.body can be null while the page is loading
        while (!d.body) {
            yield (0, async_1.wait)(50);
        }
        d.body.appendChild(root);
        yield (0, async_1.releaseEventLoop)();
        try {
            // Then check which of the elements are blocked
            for (let i = 0; i < selectors.length; ++i) {
                if (!elements[i].offsetParent) {
                    blockedSelectors[selectors[i]] = true;
                }
            }
        }
        finally {
            // Then remove the elements
            (_a = root.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(root);
        }
        return blockedSelectors;
    });
}
exports.getBlockedSelectors = getBlockedSelectors;
function forceShow(element) {
    element.style.setProperty('visibility', 'hidden', 'important');
    element.style.setProperty('display', 'block', 'important');
}
function printDebug(filters, blockedSelectors) {
    let message = 'DOM blockers debug:\n```';
    for (const filterName of Object.keys(filters)) {
        message += `\n${filterName}:`;
        for (const selector of filters[filterName]) {
            message += `\n  ${blockedSelectors[selector] ? '🚫' : '➡️'} ${selector}`;
        }
    }
    // console.log is ok here because it's under a debug clause
    // eslint-disable-next-line no-console
    console.log(`${message}\n\`\`\``);
}


/***/ }),

/***/ 830:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.presets = void 0;
const browser_1 = __webpack_require__(479);
const dom_1 = __webpack_require__(593);
/**
 * We use m or w because these two characters take up the maximum width.
 * Also there are a couple of ligatures.
 */
const defaultText = 'mmMwWLliI0fiflO&1';
/**
 * Settings of text blocks to measure. The keys are random but persistent words.
 */
exports.presets = {
    /**
     * The default font. User can change it in desktop Chrome, desktop Firefox, IE 11,
     * Android Chrome (but only when the size is ≥ than the default) and Android Firefox.
     */
    default: [],
    /** OS font on macOS. User can change its size and weight. Applies after Safari restart. */
    apple: [{ font: '-apple-system-body' }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    serif: [{ fontFamily: 'serif' }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    sans: [{ fontFamily: 'sans-serif' }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    mono: [{ fontFamily: 'monospace' }],
    /**
     * Check the smallest allowed font size. User can change it in desktop Chrome, desktop Firefox and desktop Safari.
     * The height can be 0 in Chrome on a retina display.
     */
    min: [{ fontSize: '1px' }],
    /** Tells one OS from another in desktop Chrome. */
    system: [{ fontFamily: 'system-ui' }],
};
/**
 * The result is a dictionary of the width of the text samples.
 * Heights aren't included because they give no extra entropy and are unstable.
 *
 * The result is very stable in IE 11, Edge 18 and Safari 14.
 * The result changes when the OS pixel density changes in Chromium 87. The real pixel density is required to solve,
 * but seems like it's impossible: https://stackoverflow.com/q/1713771/1118709.
 * The "min" and the "mono" (only on Windows) value may change when the page is zoomed in Firefox 87.
 */
function getFontPreferences() {
    return withNaturalFonts((document, container) => {
        const elements = {};
        const sizes = {};
        // First create all elements to measure. If the DOM steps below are done in a single cycle,
        // browser will alternate tree modification and layout reading, that is very slow.
        for (const key of Object.keys(exports.presets)) {
            const [style = {}, text = defaultText] = exports.presets[key];
            const element = document.createElement('span');
            element.textContent = text;
            element.style.whiteSpace = 'nowrap';
            for (const name of Object.keys(style)) {
                const value = style[name];
                if (value !== undefined) {
                    element.style[name] = value;
                }
            }
            elements[key] = element;
            container.appendChild(document.createElement('br'));
            container.appendChild(element);
        }
        // Then measure the created elements
        for (const key of Object.keys(exports.presets)) {
            sizes[key] = elements[key].getBoundingClientRect().width;
        }
        return sizes;
    });
}
exports["default"] = getFontPreferences;
/**
 * Creates a DOM environment that provides the most natural font available, including Android OS font.
 * Measurements of the elements are zoom-independent.
 * Don't put a content to measure inside an absolutely positioned element.
 */
function withNaturalFonts(action, containerWidthPx = 4000) {
    /*
     * Requirements for Android Chrome to apply the system font size to a text inside an iframe:
     * - The iframe mustn't have a `display: none;` style;
     * - The text mustn't be positioned absolutely;
     * - The text block must be wide enough.
     *   2560px on some devices in portrait orientation for the biggest font size option (32px);
     * - There must be much enough text to form a few lines (I don't know the exact numbers);
     * - The text must have the `text-size-adjust: none` style. Otherwise the text will scale in "Desktop site" mode;
     *
     * Requirements for Android Firefox to apply the system font size to a text inside an iframe:
     * - The iframe document must have a header: `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
     *   The only way to set it is to use the `srcdoc` attribute of the iframe;
     * - The iframe content must get loaded before adding extra content with JavaScript;
     *
     * https://example.com as the iframe target always inherits Android font settings so it can be used as a reference.
     *
     * Observations on how page zoom affects the measurements:
     * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
     * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
     * - macOS Safari 14.0: offsetWidth = 5% fluctuation;
     * - macOS Safari 14.0: getBoundingClientRect = 5% fluctuation;
     * - iOS Safari 9, 10, 11.0, 12.0: haven't found a way to zoom a page (pinch doesn't change layout);
     * - iOS Safari 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
     * - iOS Safari 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
     * - iOS Safari 14.0: offsetWidth = 100% reliable;
     * - iOS Safari 14.0: getBoundingClientRect = 100% reliable;
     * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + offsetWidth = 1px fluctuation;
     * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + getBoundingClientRect = 100% reliable;
     * - Chrome 87: offsetWidth = 1px fluctuation;
     * - Chrome 87: getBoundingClientRect = 0.7px fluctuation;
     * - Firefox 48, 51: offsetWidth = 10% fluctuation;
     * - Firefox 48, 51: getBoundingClientRect = 10% fluctuation;
     * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: offsetWidth = width 100% reliable, height 10% fluctuation;
     * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: getBoundingClientRect = width 100% reliable, height 10%
     *   fluctuation;
     * - Android Chrome 86: haven't found a way to zoom a page (pinch doesn't change layout);
     * - Android Firefox 84: font size in accessibility settings changes all the CSS sizes, but offsetWidth and
     *   getBoundingClientRect keep measuring with regular units, so the size reflects the font size setting and doesn't
     *   fluctuate;
     * - IE 11, Edge 18: zoom 1/devicePixelRatio + offsetWidth = 100% reliable;
     * - IE 11, Edge 18: zoom 1/devicePixelRatio + getBoundingClientRect = reflects the zoom level;
     * - IE 11, Edge 18: offsetWidth = 100% reliable;
     * - IE 11, Edge 18: getBoundingClientRect = 100% reliable;
     */
    return (0, dom_1.withIframe)((_, iframeWindow) => {
        const iframeDocument = iframeWindow.document;
        const iframeBody = iframeDocument.body;
        const bodyStyle = iframeBody.style;
        bodyStyle.width = `${containerWidthPx}px`;
        bodyStyle.webkitTextSizeAdjust = bodyStyle.textSizeAdjust = 'none';
        // See the big comment above
        if ((0, browser_1.isChromium)()) {
            iframeBody.style.zoom = `${1 / iframeWindow.devicePixelRatio}`;
        }
        else if ((0, browser_1.isWebKit)()) {
            iframeBody.style.zoom = 'reset';
        }
        // See the big comment above
        const linesOfText = iframeDocument.createElement('div');
        linesOfText.textContent = [...Array((containerWidthPx / 20) << 0)].map(() => 'word').join(' ');
        iframeBody.appendChild(linesOfText);
        return action(iframeDocument, iframeBody);
    }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
}


/***/ }),

/***/ 337:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const async_1 = __webpack_require__(497);
const dom_1 = __webpack_require__(593);
// We use m or w because these two characters take up the maximum width.
// And we use a LLi so that the same matching fonts can get separated.
const testString = 'mmMwWLliI0O&1';
// We test using 48px font size, we may use any size. I guess larger the better.
const textSize = '48px';
// A font will be compared against all the three default fonts.
// And if for any default fonts it doesn't match, then that font is available.
const baseFonts = ['monospace', 'sans-serif', 'serif'];
const fontList = [
    // This is android-specific font from "Roboto" family
    'sans-serif-thin',
    'ARNO PRO',
    'Agency FB',
    'Arabic Typesetting',
    'Arial Unicode MS',
    'AvantGarde Bk BT',
    'BankGothic Md BT',
    'Batang',
    'Bitstream Vera Sans Mono',
    'Calibri',
    'Century',
    'Century Gothic',
    'Clarendon',
    'EUROSTILE',
    'Franklin Gothic',
    'Futura Bk BT',
    'Futura Md BT',
    'GOTHAM',
    'Gill Sans',
    'HELV',
    'Haettenschweiler',
    'Helvetica Neue',
    'Humanst521 BT',
    'Leelawadee',
    'Letter Gothic',
    'Levenim MT',
    'Lucida Bright',
    'Lucida Sans',
    'Menlo',
    'MS Mincho',
    'MS Outlook',
    'MS Reference Specialty',
    'MS UI Gothic',
    'MT Extra',
    'MYRIAD PRO',
    'Marlett',
    'Meiryo UI',
    'Microsoft Uighur',
    'Minion Pro',
    'Monotype Corsiva',
    'PMingLiU',
    'Pristina',
    'SCRIPTINA',
    'Segoe UI Light',
    'Serifa',
    'SimHei',
    'Small Fonts',
    'Staccato222 BT',
    'TRAJAN PRO',
    'Univers CE 55 Medium',
    'Vrinda',
    'ZWAdobeF',
];
// kudos to http://www.lalit.org/lab/javascript-css-font-detect/
function getFonts() {
    // Running the script in an iframe makes it not affect the page look and not be affected by the page CSS. See:
    // https://github.com/fingerprintjs/fingerprintjs/issues/592
    // https://github.com/fingerprintjs/fingerprintjs/issues/628
    return (0, dom_1.withIframe)((_, { document }) => __awaiter(this, void 0, void 0, function* () {
        const holder = document.body;
        holder.style.fontSize = textSize;
        // div to load spans for the default fonts and the fonts to detect
        const spansContainer = document.createElement('div');
        spansContainer.style.setProperty('visibility', 'hidden', 'important');
        const defaultWidth = {};
        const defaultHeight = {};
        // creates a span where the fonts will be loaded
        const createSpan = (fontFamily) => {
            const span = document.createElement('span');
            const { style } = span;
            style.position = 'absolute';
            style.top = '0';
            style.left = '0';
            style.fontFamily = fontFamily;
            span.textContent = testString;
            spansContainer.appendChild(span);
            return span;
        };
        // creates a span and load the font to detect and a base font for fallback
        const createSpanWithFonts = (fontToDetect, baseFont) => {
            return createSpan(`'${fontToDetect}',${baseFont}`);
        };
        // creates spans for the base fonts and adds them to baseFontsDiv
        const initializeBaseFontsSpans = () => {
            return baseFonts.map(createSpan);
        };
        // creates spans for the fonts to detect and adds them to fontsDiv
        const initializeFontsSpans = () => {
            // Stores {fontName : [spans for that font]}
            const spans = {};
            for (const font of fontList) {
                spans[font] = baseFonts.map((baseFont) => createSpanWithFonts(font, baseFont));
            }
            return spans;
        };
        // checks if a font is available
        const isFontAvailable = (fontSpans) => {
            return baseFonts.some((baseFont, baseFontIndex) => fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont] ||
                fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont]);
        };
        // create spans for base fonts
        const baseFontsSpans = initializeBaseFontsSpans();
        // create spans for fonts to detect
        const fontsSpans = initializeFontsSpans();
        // add all the spans to the DOM
        holder.appendChild(spansContainer);
        yield (0, async_1.releaseEventLoop)();
        // get the default width for the three base fonts
        for (let index = 0; index < baseFonts.length; index++) {
            defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
            defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
        }
        // check available fonts
        return fontList.filter((font) => isFontAvailable(fontsSpans[font]));
    }));
}
exports["default"] = getFonts;


/***/ }),

/***/ 205:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
 */
function areColorsForced() {
    if (doesMatch('active')) {
        return true;
    }
    if (doesMatch('none')) {
        return false;
    }
    return undefined;
}
exports["default"] = areColorsForced;
function doesMatch(value) {
    return matchMedia(`(forced-colors: ${value})`).matches;
}


/***/ }),

/***/ 382:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const data_1 = __webpack_require__(634);
function getHardwareConcurrency() {
    // sometimes hardware concurrency is a string
    return (0, data_1.replaceNaN)((0, data_1.toInt)(navigator.hardwareConcurrency), undefined);
}
exports["default"] = getHardwareConcurrency;


/***/ }),

/***/ 646:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @see https://www.w3.org/TR/mediaqueries-5/#dynamic-range
 */
function isHDR() {
    if (doesMatch('high')) {
        return true;
    }
    if (doesMatch('standard')) {
        return false;
    }
    return undefined;
}
exports["default"] = isHDR;
function doesMatch(value) {
    return matchMedia(`(dynamic-range: ${value})`).matches;
}


/***/ }),

/***/ 555:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sources = void 0;
const entropy_source_1 = __webpack_require__(949);
const audio_1 = __webpack_require__(295);
const fonts_1 = __webpack_require__(337);
const plugins_1 = __webpack_require__(679);
const canvas_1 = __webpack_require__(743);
const touch_support_1 = __webpack_require__(778);
const os_cpu_1 = __webpack_require__(733);
const languages_1 = __webpack_require__(627);
const color_depth_1 = __webpack_require__(21);
const device_memory_1 = __webpack_require__(800);
const screen_resolution_1 = __webpack_require__(228);
const screen_frame_1 = __webpack_require__(520);
const hardware_concurrency_1 = __webpack_require__(382);
const timezone_1 = __webpack_require__(866);
const session_storage_1 = __webpack_require__(63);
const local_storage_1 = __webpack_require__(364);
const indexed_db_1 = __webpack_require__(903);
const open_database_1 = __webpack_require__(727);
const cpu_class_1 = __webpack_require__(67);
const platform_1 = __webpack_require__(760);
const vendor_1 = __webpack_require__(458);
const vendor_flavors_1 = __webpack_require__(835);
const cookies_enabled_1 = __webpack_require__(292);
const dom_blockers_1 = __webpack_require__(867);
const color_gamut_1 = __webpack_require__(871);
const inverted_colors_1 = __webpack_require__(394);
const forced_colors_1 = __webpack_require__(205);
const monochrome_1 = __webpack_require__(366);
const contrast_1 = __webpack_require__(549);
const reduced_motion_1 = __webpack_require__(454);
const hdr_1 = __webpack_require__(646);
const math_1 = __webpack_require__(373);
const font_preferences_1 = __webpack_require__(830);
const pdf_viewer_enabled_1 = __webpack_require__(577);
const architecture_1 = __webpack_require__(548);
const apple_pay_1 = __webpack_require__(313);
const private_click_measurement_1 = __webpack_require__(955);
const webgl_1 = __webpack_require__(858);
/**
 * The list of entropy sources used to make visitor identifiers.
 *
 * This value isn't restricted by Semantic Versioning, i.e. it may be changed without bumping minor or major version of
 * this package.
 *
 * Note: Rollup and Webpack are smart enough to remove unused properties of this object during tree-shaking, so there is
 * no need to export the sources individually.
 */
exports.sources = {
    // READ FIRST:
    // See https://github.com/fingerprintjs/fingerprintjs/blob/master/contributing.md#how-to-make-an-entropy-source
    // to learn how entropy source works and how to make your own.
    // The sources run in this exact order.
    // The asynchronous sources are at the start to run in parallel with other sources.
    fonts: fonts_1.default,
    domBlockers: dom_blockers_1.default,
    fontPreferences: font_preferences_1.default,
    audio: audio_1.default,
    screenFrame: screen_frame_1.getRoundedScreenFrame,
    canvas: canvas_1.default,
    osCpu: os_cpu_1.default,
    languages: languages_1.default,
    colorDepth: color_depth_1.default,
    deviceMemory: device_memory_1.default,
    screenResolution: screen_resolution_1.default,
    hardwareConcurrency: hardware_concurrency_1.default,
    timezone: timezone_1.default,
    sessionStorage: session_storage_1.default,
    localStorage: local_storage_1.default,
    indexedDB: indexed_db_1.default,
    openDatabase: open_database_1.default,
    cpuClass: cpu_class_1.default,
    platform: platform_1.default,
    plugins: plugins_1.default,
    touchSupport: touch_support_1.default,
    vendor: vendor_1.default,
    vendorFlavors: vendor_flavors_1.default,
    cookiesEnabled: cookies_enabled_1.default,
    colorGamut: color_gamut_1.default,
    invertedColors: inverted_colors_1.default,
    forcedColors: forced_colors_1.default,
    monochrome: monochrome_1.default,
    contrast: contrast_1.default,
    reducedMotion: reduced_motion_1.default,
    hdr: hdr_1.default,
    math: math_1.default,
    pdfViewerEnabled: pdf_viewer_enabled_1.default,
    architecture: architecture_1.default,
    applePay: apple_pay_1.default,
    privateClickMeasurement: private_click_measurement_1.default,
    // Some sources can affect other sources (e.g. WebGL can affect canvas), so it's important to run these sources
    // after other sources.
    webGlBasics: webgl_1.getWebGlBasics,
    webGlExtensions: webgl_1.getWebGlExtensions,
};
/**
 * Loads the built-in entropy sources.
 * Returns a function that collects the entropy components to make the visitor identifier.
 */
function loadBuiltinSources(options) {
    return (0, entropy_source_1.loadSources)(exports.sources, options, []);
}
exports["default"] = loadBuiltinSources;


/***/ }),

/***/ 903:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const browser_1 = __webpack_require__(479);
function getIndexedDB() {
    // IE and Edge don't allow accessing indexedDB in private mode, therefore IE and Edge will have different
    // visitor identifier in normal and private modes.
    if ((0, browser_1.isTrident)() || (0, browser_1.isEdgeHTML)()) {
        return undefined;
    }
    try {
        return !!window.indexedDB;
    }
    catch (e) {
        /* SecurityError when referencing it means it exists */
        return true;
    }
}
exports["default"] = getIndexedDB;


/***/ }),

/***/ 394:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/inverted-colors
 */
function areColorsInverted() {
    if (doesMatch('inverted')) {
        return true;
    }
    if (doesMatch('none')) {
        return false;
    }
    return undefined;
}
exports["default"] = areColorsInverted;
function doesMatch(value) {
    return matchMedia(`(inverted-colors: ${value})`).matches;
}


/***/ }),

/***/ 627:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const browser_1 = __webpack_require__(479);
function getLanguages() {
    const n = navigator;
    const result = [];
    const language = n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
    if (language !== undefined) {
        result.push([language]);
    }
    if (Array.isArray(n.languages)) {
        // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
        // the value of `navigator.language`. Therefore the value is ignored in this browser.
        if (!((0, browser_1.isChromium)() && (0, browser_1.isChromium86OrNewer)())) {
            result.push(n.languages);
        }
    }
    else if (typeof n.languages === 'string') {
        const languages = n.languages;
        if (languages) {
            result.push(languages.split(','));
        }
    }
    return result;
}
exports["default"] = getLanguages;


/***/ }),

/***/ 364:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
// https://bugzilla.mozilla.org/show_bug.cgi?id=781447
function getLocalStorage() {
    try {
        return !!window.localStorage;
    }
    catch (e) {
        /* SecurityError when referencing it means it exists */
        return true;
    }
}
exports["default"] = getLocalStorage;


/***/ }),

/***/ 373:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const M = Math; // To reduce the minified code size
const fallbackFn = () => 0;
/**
 * @see https://gitlab.torproject.org/legacy/trac/-/issues/13018
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=531915
 */
function getMathFingerprint() {
    // Native operations
    const acos = M.acos || fallbackFn;
    const acosh = M.acosh || fallbackFn;
    const asin = M.asin || fallbackFn;
    const asinh = M.asinh || fallbackFn;
    const atanh = M.atanh || fallbackFn;
    const atan = M.atan || fallbackFn;
    const sin = M.sin || fallbackFn;
    const sinh = M.sinh || fallbackFn;
    const cos = M.cos || fallbackFn;
    const cosh = M.cosh || fallbackFn;
    const tan = M.tan || fallbackFn;
    const tanh = M.tanh || fallbackFn;
    const exp = M.exp || fallbackFn;
    const expm1 = M.expm1 || fallbackFn;
    const log1p = M.log1p || fallbackFn;
    // Operation polyfills
    const powPI = (value) => M.pow(M.PI, value);
    const acoshPf = (value) => M.log(value + M.sqrt(value * value - 1));
    const asinhPf = (value) => M.log(value + M.sqrt(value * value + 1));
    const atanhPf = (value) => M.log((1 + value) / (1 - value)) / 2;
    const sinhPf = (value) => M.exp(value) - 1 / M.exp(value) / 2;
    const coshPf = (value) => (M.exp(value) + 1 / M.exp(value)) / 2;
    const expm1Pf = (value) => M.exp(value) - 1;
    const tanhPf = (value) => (M.exp(2 * value) - 1) / (M.exp(2 * value) + 1);
    const log1pPf = (value) => M.log(1 + value);
    // Note: constant values are empirical
    return {
        acos: acos(0.123124234234234242),
        acosh: acosh(1e308),
        acoshPf: acoshPf(1e154),
        asin: asin(0.123124234234234242),
        asinh: asinh(1),
        asinhPf: asinhPf(1),
        atanh: atanh(0.5),
        atanhPf: atanhPf(0.5),
        atan: atan(0.5),
        sin: sin(-1e300),
        sinh: sinh(1),
        sinhPf: sinhPf(1),
        cos: cos(10.000000000123),
        cosh: cosh(1),
        coshPf: coshPf(1),
        tan: tan(-1e300),
        tanh: tanh(1),
        tanhPf: tanhPf(1),
        exp: exp(1),
        expm1: expm1(1),
        expm1Pf: expm1Pf(1),
        log1p: log1p(10),
        log1pPf: log1pPf(10),
        powPI: powPI(-100),
    };
}
exports["default"] = getMathFingerprint;


/***/ }),

/***/ 366:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const maxValueToCheck = 100;
/**
 * If the display is monochrome (e.g. black&white), the value will be ≥0 and will mean the number of bits per pixel.
 * If the display is not monochrome, the returned value will be 0.
 * If the browser doesn't support this feature, the returned value will be undefined.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/monochrome
 */
function getMonochromeDepth() {
    if (!matchMedia('(min-monochrome: 0)').matches) {
        // The media feature isn't supported by the browser
        return undefined;
    }
    // A variation of binary search algorithm can be used here.
    // But since expected values are very small (≤10), there is no sense in adding the complexity.
    for (let i = 0; i <= maxValueToCheck; ++i) {
        if (matchMedia(`(max-monochrome: ${i})`).matches) {
            return i;
        }
    }
    throw new Error('Too high value');
}
exports["default"] = getMonochromeDepth;


/***/ }),

/***/ 727:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getOpenDatabase() {
    return !!window.openDatabase;
}
exports["default"] = getOpenDatabase;


/***/ }),

/***/ 733:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getOsCpu() {
    return navigator.oscpu;
}
exports["default"] = getOsCpu;


/***/ }),

/***/ 577:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function isPdfViewerEnabled() {
    return navigator.pdfViewerEnabled;
}
exports["default"] = isPdfViewerEnabled;


/***/ }),

/***/ 760:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const browser_1 = __webpack_require__(479);
function getPlatform() {
    // Android Chrome 86 and 87 and Android Firefox 80 and 84 don't mock the platform value when desktop mode is requested
    const { platform } = navigator;
    // iOS mocks the platform value when desktop version is requested: https://github.com/fingerprintjs/fingerprintjs/issues/514
    // iPad uses desktop mode by default since iOS 13
    // The value is 'MacIntel' on M1 Macs
    // The value is 'iPhone' on iPod Touch
    if (platform === 'MacIntel') {
        if ((0, browser_1.isWebKit)() && !(0, browser_1.isDesktopSafari)()) {
            return (0, browser_1.isIPad)() ? 'iPad' : 'iPhone';
        }
    }
    return platform;
}
exports["default"] = getPlatform;


/***/ }),

/***/ 679:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getPlugins() {
    const rawPlugins = navigator.plugins;
    if (!rawPlugins) {
        return undefined;
    }
    const plugins = [];
    // Safari 10 doesn't support iterating navigator.plugins with for...of
    for (let i = 0; i < rawPlugins.length; ++i) {
        const plugin = rawPlugins[i];
        if (!plugin) {
            continue;
        }
        const mimeTypes = [];
        for (let j = 0; j < plugin.length; ++j) {
            const mimeType = plugin[j];
            mimeTypes.push({
                type: mimeType.type,
                suffixes: mimeType.suffixes,
            });
        }
        plugins.push({
            name: plugin.name,
            description: plugin.description,
            mimeTypes,
        });
    }
    return plugins;
}
exports["default"] = getPlugins;


/***/ }),

/***/ 955:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Checks whether the Safari's Privacy Preserving Ad Measurement setting is on.
 * The setting is on when the value is not undefined.
 * A.k.a. private click measurement, privacy-preserving ad attribution.
 *
 * Unfortunately, it doesn't work in mobile Safari.
 * Probably, it will start working in mobile Safari or stop working in desktop Safari later.
 * We've found no way to detect the setting state in mobile Safari. Help wanted.
 *
 * @see https://webkit.org/blog/11529/introducing-private-click-measurement-pcm/
 * @see https://developer.apple.com/videos/play/wwdc2021/10033
 */
function getPrivateClickMeasurement() {
    var _a;
    const link = document.createElement('a');
    const sourceId = (_a = link.attributionSourceId) !== null && _a !== void 0 ? _a : link.attributionsourceid;
    return sourceId === undefined ? undefined : String(sourceId);
}
exports["default"] = getPrivateClickMeasurement;


/***/ }),

/***/ 454:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 */
function isMotionReduced() {
    if (doesMatch('reduce')) {
        return true;
    }
    if (doesMatch('no-preference')) {
        return false;
    }
    return undefined;
}
exports["default"] = isMotionReduced;
function doesMatch(value) {
    return matchMedia(`(prefers-reduced-motion: ${value})`).matches;
}


/***/ }),

/***/ 520:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRoundedScreenFrame = exports.getScreenFrame = exports.hasScreenFrameBackup = exports.resetScreenFrameWatch = exports.screenFrameCheckInterval = void 0;
const data_1 = __webpack_require__(634);
const browser_1 = __webpack_require__(479);
exports.screenFrameCheckInterval = 2500;
const roundingPrecision = 10;
// The type is readonly to protect from unwanted mutations
let screenFrameBackup;
let screenFrameSizeTimeoutId;
/**
 * Starts watching the screen frame size. When a non-zero size appears, the size is saved and the watch is stopped.
 * Later, when `getScreenFrame` runs, it will return the saved non-zero size if the current size is null.
 *
 * This trick is required to mitigate the fact that the screen frame turns null in some cases.
 * See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
 */
function watchScreenFrame() {
    if (screenFrameSizeTimeoutId !== undefined) {
        return;
    }
    const checkScreenFrame = () => {
        const frameSize = getCurrentScreenFrame();
        if (isFrameSizeNull(frameSize)) {
            screenFrameSizeTimeoutId = setTimeout(checkScreenFrame, exports.screenFrameCheckInterval);
        }
        else {
            screenFrameBackup = frameSize;
            screenFrameSizeTimeoutId = undefined;
        }
    };
    checkScreenFrame();
}
/**
 * For tests only
 */
function resetScreenFrameWatch() {
    if (screenFrameSizeTimeoutId !== undefined) {
        clearTimeout(screenFrameSizeTimeoutId);
        screenFrameSizeTimeoutId = undefined;
    }
    screenFrameBackup = undefined;
}
exports.resetScreenFrameWatch = resetScreenFrameWatch;
/**
 * For tests only
 */
function hasScreenFrameBackup() {
    return !!screenFrameBackup;
}
exports.hasScreenFrameBackup = hasScreenFrameBackup;
/**
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function getScreenFrame() {
    watchScreenFrame();
    return () => __awaiter(this, void 0, void 0, function* () {
        let frameSize = getCurrentScreenFrame();
        if (isFrameSizeNull(frameSize)) {
            if (screenFrameBackup) {
                return [...screenFrameBackup];
            }
            if ((0, browser_1.getFullscreenElement)()) {
                // Some browsers set the screen frame to zero when programmatic fullscreen is on.
                // There is a chance of getting a non-zero frame after exiting the fullscreen.
                // See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
                yield (0, browser_1.exitFullscreen)();
                frameSize = getCurrentScreenFrame();
            }
        }
        if (!isFrameSizeNull(frameSize)) {
            screenFrameBackup = frameSize;
        }
        return frameSize;
    });
}
exports.getScreenFrame = getScreenFrame;
/**
 * Sometimes the available screen resolution changes a bit, e.g. 1900x1440 → 1900x1439. A possible reason: macOS Dock
 * shrinks to fit more icons when there is too little space. The rounding is used to mitigate the difference.
 */
function getRoundedScreenFrame() {
    const screenFrameGetter = getScreenFrame();
    return () => __awaiter(this, void 0, void 0, function* () {
        const frameSize = yield screenFrameGetter();
        const processSize = (sideSize) => (sideSize === null ? null : (0, data_1.round)(sideSize, roundingPrecision));
        // It might look like I don't know about `for` and `map`.
        // In fact, such code is used to avoid TypeScript issues without using `as`.
        return [processSize(frameSize[0]), processSize(frameSize[1]), processSize(frameSize[2]), processSize(frameSize[3])];
    });
}
exports.getRoundedScreenFrame = getRoundedScreenFrame;
function getCurrentScreenFrame() {
    const s = screen;
    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    //
    // Some browsers (IE, Edge ≤18) don't provide `screen.availLeft` and `screen.availTop`. The property values are
    // replaced with 0 in such cases to not lose the entropy from `screen.availWidth` and `screen.availHeight`.
    return [
        (0, data_1.replaceNaN)((0, data_1.toFloat)(s.availTop), null),
        (0, data_1.replaceNaN)((0, data_1.toFloat)(s.width) - (0, data_1.toFloat)(s.availWidth) - (0, data_1.replaceNaN)((0, data_1.toFloat)(s.availLeft), 0), null),
        (0, data_1.replaceNaN)((0, data_1.toFloat)(s.height) - (0, data_1.toFloat)(s.availHeight) - (0, data_1.replaceNaN)((0, data_1.toFloat)(s.availTop), 0), null),
        (0, data_1.replaceNaN)((0, data_1.toFloat)(s.availLeft), null),
    ];
}
function isFrameSizeNull(frameSize) {
    for (let i = 0; i < 4; ++i) {
        if (frameSize[i]) {
            return false;
        }
    }
    return true;
}


/***/ }),

/***/ 228:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const data_1 = __webpack_require__(634);
function getScreenResolution() {
    const s = screen;
    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    // Some browsers even return  screen resolution as not numbers.
    const parseDimension = (value) => (0, data_1.replaceNaN)((0, data_1.toInt)(value), null);
    const dimensions = [parseDimension(s.width), parseDimension(s.height)];
    dimensions.sort().reverse();
    return dimensions;
}
exports["default"] = getScreenResolution;


/***/ }),

/***/ 63:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getSessionStorage() {
    try {
        return !!window.sessionStorage;
    }
    catch (error) {
        /* SecurityError when referencing it means it exists */
        return true;
    }
}
exports["default"] = getSessionStorage;


/***/ }),

/***/ 866:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const data_1 = __webpack_require__(634);
function getTimezone() {
    var _a;
    const DateTimeFormat = (_a = window.Intl) === null || _a === void 0 ? void 0 : _a.DateTimeFormat;
    if (DateTimeFormat) {
        const timezone = new DateTimeFormat().resolvedOptions().timeZone;
        if (timezone) {
            return timezone;
        }
    }
    // For browsers that don't support timezone names
    // The minus is intentional because the JS offset is opposite to the real offset
    const offset = -getTimezoneOffset();
    return `UTC${offset >= 0 ? '+' : ''}${Math.abs(offset)}`;
}
exports["default"] = getTimezone;
function getTimezoneOffset() {
    const currentYear = new Date().getFullYear();
    // The timezone offset may change over time due to daylight saving time (DST) shifts.
    // The non-DST timezone offset is used as the result timezone offset.
    // Since the DST season differs in the northern and the southern hemispheres,
    // both January and July timezones offsets are considered.
    return Math.max(
    // `getTimezoneOffset` returns a number as a string in some unidentified cases
    (0, data_1.toFloat)(new Date(currentYear, 0, 1).getTimezoneOffset()), (0, data_1.toFloat)(new Date(currentYear, 6, 1).getTimezoneOffset()));
}


/***/ }),

/***/ 778:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const data_1 = __webpack_require__(634);
/**
 * This is a crude and primitive touch screen detection. It's not possible to currently reliably detect the availability
 * of a touch screen with a JS, without actually subscribing to a touch event.
 *
 * @see http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
 * @see https://github.com/Modernizr/Modernizr/issues/548
 */
function getTouchSupport() {
    const n = navigator;
    let maxTouchPoints = 0;
    let touchEvent;
    if (n.maxTouchPoints !== undefined) {
        maxTouchPoints = (0, data_1.toInt)(n.maxTouchPoints);
    }
    else if (n.msMaxTouchPoints !== undefined) {
        maxTouchPoints = n.msMaxTouchPoints;
    }
    try {
        document.createEvent('TouchEvent');
        touchEvent = true;
    }
    catch (_a) {
        touchEvent = false;
    }
    const touchStart = 'ontouchstart' in window;
    return {
        maxTouchPoints,
        touchEvent,
        touchStart,
    };
}
exports["default"] = getTouchSupport;


/***/ }),

/***/ 458:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getVendor() {
    return navigator.vendor || '';
}
exports["default"] = getVendor;


/***/ }),

/***/ 835:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Checks for browser-specific (not engine specific) global variables to tell browsers with the same engine apart.
 * Only somewhat popular browsers are considered.
 */
function getVendorFlavors() {
    const flavors = [];
    for (const key of [
        // Blink and some browsers on iOS
        'chrome',
        // Safari on macOS
        'safari',
        // Chrome on iOS (checked in 85 on 13 and 87 on 14)
        '__crWeb',
        '__gCrWeb',
        // Yandex Browser on iOS, macOS and Android (checked in 21.2 on iOS 14, macOS and Android)
        'yandex',
        // Yandex Browser on iOS (checked in 21.2 on 14)
        '__yb',
        '__ybro',
        // Firefox on iOS (checked in 32 on 14)
        '__firefox__',
        // Edge on iOS (checked in 46 on 14)
        '__edgeTrackingPreventionStatistics',
        'webkit',
        // Opera Touch on iOS (checked in 2.6 on 14)
        'oprt',
        // Samsung Internet on Android (checked in 11.1)
        'samsungAr',
        // UC Browser on Android (checked in 12.10 and 13.0)
        'ucweb',
        'UCShellJava',
        // Puffin on Android (checked in 9.0)
        'puffinDevice',
        // UC on iOS and Opera on Android have no specific global variables
        // Edge for Android isn't checked
    ]) {
        const value = window[key];
        if (value && typeof value === 'object') {
            flavors.push(key);
        }
    }
    return flavors.sort();
}
exports["default"] = getVendorFlavors;


/***/ }),

/***/ 858:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.shouldAvoidDebugRendererInfo = exports.getWebGLContext = exports.getWebGlExtensions = exports.getWebGlBasics = exports.STATUS_GET_PARAMETER_NOT_A_FUNCTION = exports.STATUS_NO_GL_CONTEXT = void 0;
const browser_1 = __webpack_require__(479);
/** WebGl context is not available */
exports.STATUS_NO_GL_CONTEXT = -1;
/** WebGL context `getParameter` method is not a function */
exports.STATUS_GET_PARAMETER_NOT_A_FUNCTION = -2;
const validContextParameters = new Set([
    10752, 2849, 2884, 2885, 2886, 2928, 2929, 2930, 2931, 2932, 2960, 2961, 2962, 2963, 2964, 2965, 2966, 2967, 2968,
    2978, 3024, 3042, 3088, 3089, 3106, 3107, 32773, 32777, 32777, 32823, 32824, 32936, 32937, 32938, 32939, 32968, 32969,
    32970, 32971, 3317, 33170, 3333, 3379, 3386, 33901, 33902, 34016, 34024, 34076, 3408, 3410, 3411, 3412, 3413, 3414,
    3415, 34467, 34816, 34817, 34818, 34819, 34877, 34921, 34930, 35660, 35661, 35724, 35738, 35739, 36003, 36004, 36005,
    36347, 36348, 36349, 37440, 37441, 37443, 7936, 7937, 7938,
    // SAMPLE_ALPHA_TO_COVERAGE (32926) and SAMPLE_COVERAGE (32928) are excluded because they trigger a console warning
    // in IE, Chrome ≤ 59 and Safari ≤ 13 and give no entropy.
]);
const validExtensionParams = new Set([
    34047,
    35723,
    36063,
    34852,
    34853,
    34854,
    34229,
    36392,
    36795,
    38449, // MAX_VIEWS_OVR
]);
const shaderTypes = ['FRAGMENT_SHADER', 'VERTEX_SHADER'];
const precisionTypes = ['LOW_FLOAT', 'MEDIUM_FLOAT', 'HIGH_FLOAT', 'LOW_INT', 'MEDIUM_INT', 'HIGH_INT'];
const rendererInfoExtensionName = 'WEBGL_debug_renderer_info';
/**
 * Gets the basic and simple WebGL parameters
 */
function getWebGlBasics({ cache }) {
    var _a, _b, _c, _d, _e, _f;
    const gl = getWebGLContext(cache);
    if (!gl) {
        return exports.STATUS_NO_GL_CONTEXT;
    }
    if (!isValidParameterGetter(gl)) {
        return exports.STATUS_GET_PARAMETER_NOT_A_FUNCTION;
    }
    const debugExtension = shouldAvoidDebugRendererInfo() ? null : gl.getExtension(rendererInfoExtensionName);
    return {
        version: ((_a = gl.getParameter(gl.VERSION)) === null || _a === void 0 ? void 0 : _a.toString()) || '',
        vendor: ((_b = gl.getParameter(gl.VENDOR)) === null || _b === void 0 ? void 0 : _b.toString()) || '',
        vendorUnmasked: debugExtension ? (_c = gl.getParameter(debugExtension.UNMASKED_VENDOR_WEBGL)) === null || _c === void 0 ? void 0 : _c.toString() : '',
        renderer: ((_d = gl.getParameter(gl.RENDERER)) === null || _d === void 0 ? void 0 : _d.toString()) || '',
        rendererUnmasked: debugExtension ? (_e = gl.getParameter(debugExtension.UNMASKED_RENDERER_WEBGL)) === null || _e === void 0 ? void 0 : _e.toString() : '',
        shadingLanguageVersion: ((_f = gl.getParameter(gl.SHADING_LANGUAGE_VERSION)) === null || _f === void 0 ? void 0 : _f.toString()) || '',
    };
}
exports.getWebGlBasics = getWebGlBasics;
/**
 * Gets the advanced and massive WebGL parameters and extensions
 */
function getWebGlExtensions({ cache }) {
    const gl = getWebGLContext(cache);
    if (!gl) {
        return exports.STATUS_NO_GL_CONTEXT;
    }
    if (!isValidParameterGetter(gl)) {
        return exports.STATUS_GET_PARAMETER_NOT_A_FUNCTION;
    }
    const extensions = gl.getSupportedExtensions();
    const contextAttributes = gl.getContextAttributes();
    // Features
    const attributes = [];
    const parameters = [];
    const extensionParameters = [];
    const shaderPrecisions = [];
    // Context attributes
    if (contextAttributes) {
        for (const attributeName of Object.keys(contextAttributes)) {
            attributes.push(`${attributeName}=${contextAttributes[attributeName]}`);
        }
    }
    // Context parameters
    const constants = getConstantsFromPrototype(gl);
    for (const constant of constants) {
        const code = gl[constant];
        parameters.push(`${constant}=${code}${validContextParameters.has(code) ? `=${gl.getParameter(code)}` : ''}`);
    }
    // Extension parameters
    if (extensions) {
        for (const name of extensions) {
            if (name === rendererInfoExtensionName && shouldAvoidDebugRendererInfo()) {
                continue;
            }
            const extension = gl.getExtension(name);
            if (!extension) {
                continue;
            }
            for (const constant of getConstantsFromPrototype(extension)) {
                const code = extension[constant];
                extensionParameters.push(`${constant}=${code}${validExtensionParams.has(code) ? `=${gl.getParameter(code)}` : ''}`);
            }
        }
    }
    // Shader precision
    for (const shaderType of shaderTypes) {
        for (const precisionType of precisionTypes) {
            const shaderPrecision = getShaderPrecision(gl, shaderType, precisionType);
            shaderPrecisions.push(`${shaderType}.${precisionType}=${shaderPrecision.join(',')}`);
        }
    }
    // Postprocess
    extensionParameters.sort();
    parameters.sort();
    return {
        contextAttributes: attributes,
        parameters: parameters,
        shaderPrecisions: shaderPrecisions,
        extensions: extensions,
        extensionParameters: extensionParameters,
    };
}
exports.getWebGlExtensions = getWebGlExtensions;
/**
 * This function usually takes the most time to execute in all the sources, therefore we cache its result.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function getWebGLContext(cache) {
    if (cache.webgl) {
        return cache.webgl.context;
    }
    const canvas = document.createElement('canvas');
    let context;
    canvas.addEventListener('webglCreateContextError', () => (context = undefined));
    for (const type of ['webgl', 'experimental-webgl']) {
        try {
            context = canvas.getContext(type);
        }
        catch (_a) {
            // Ok, continue
        }
        if (context) {
            break;
        }
    }
    cache.webgl = { context };
    return context;
}
exports.getWebGLContext = getWebGLContext;
/**
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGLShaderPrecisionFormat
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getShaderPrecisionFormat
 * https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.12
 */
function getShaderPrecision(gl, shaderType, precisionType) {
    const shaderPrecision = gl.getShaderPrecisionFormat(gl[shaderType], gl[precisionType]);
    return shaderPrecision ? [shaderPrecision.rangeMin, shaderPrecision.rangeMax, shaderPrecision.precision] : [];
}
function getConstantsFromPrototype(obj) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keys = Object.keys(obj.__proto__);
    return keys.filter(isConstantLike);
}
function isConstantLike(key) {
    return typeof key === 'string' && !key.match(/[^A-Z0-9_x]/);
}
/**
 * Some browsers print a console warning when the WEBGL_debug_renderer_info extension is requested.
 * JS Agent aims to avoid printing messages to console, so we avoid this extension in that browsers.
 */
function shouldAvoidDebugRendererInfo() {
    return (0, browser_1.isGecko)();
}
exports.shouldAvoidDebugRendererInfo = shouldAvoidDebugRendererInfo;
/**
 * Some unknown browsers have no `getParameter` method
 */
function isValidParameterGetter(gl) {
    return typeof gl.getParameter === 'function';
}


/***/ }),

/***/ 497:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.suppressUnhandledRejectionWarning = exports.mapWithBreaks = exports.awaitIfAsync = exports.isPromise = exports.requestIdleCallbackIfAvailable = exports.releaseEventLoop = exports.wait = void 0;
function wait(durationMs, resolveWith) {
    return new Promise((resolve) => setTimeout(resolve, durationMs, resolveWith));
}
exports.wait = wait;
/**
 * Allows asynchronous actions and microtasks to happen.
 */
function releaseEventLoop() {
    return wait(0);
}
exports.releaseEventLoop = releaseEventLoop;
function requestIdleCallbackIfAvailable(fallbackTimeout, deadlineTimeout = Infinity) {
    const { requestIdleCallback } = window;
    if (requestIdleCallback) {
        // The function `requestIdleCallback` loses the binding to `window` here.
        // `globalThis` isn't always equal `window` (see https://github.com/fingerprintjs/fingerprintjs/issues/683).
        // Therefore, an error can occur. `call(window,` prevents the error.
        return new Promise((resolve) => requestIdleCallback.call(window, () => resolve(), { timeout: deadlineTimeout }));
    }
    else {
        return wait(Math.min(fallbackTimeout, deadlineTimeout));
    }
}
exports.requestIdleCallbackIfAvailable = requestIdleCallbackIfAvailable;
function isPromise(value) {
    return !!value && typeof value.then === 'function';
}
exports.isPromise = isPromise;
/**
 * Calls a maybe asynchronous function without creating microtasks when the function is synchronous.
 * Catches errors in both cases.
 *
 * If just you run a code like this:
 * ```
 * console.time('Action duration')
 * await action()
 * console.timeEnd('Action duration')
 * ```
 * The synchronous function time can be measured incorrectly because another microtask may run before the `await`
 * returns the control back to the code.
 */
function awaitIfAsync(action, callback) {
    try {
        const returnedValue = action();
        if (isPromise(returnedValue)) {
            returnedValue.then((result) => callback(true, result), (error) => callback(false, error));
        }
        else {
            callback(true, returnedValue);
        }
    }
    catch (error) {
        callback(false, error);
    }
}
exports.awaitIfAsync = awaitIfAsync;
/**
 * If you run many synchronous tasks without using this function, the JS main loop will be busy and asynchronous tasks
 * (e.g. completing a network request, rendering the page) won't be able to happen.
 * This function allows running many synchronous tasks such way that asynchronous tasks can run too in background.
 */
function mapWithBreaks(items, callback, loopReleaseInterval = 16) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = Array(items.length);
        let lastLoopReleaseTime = Date.now();
        for (let i = 0; i < items.length; ++i) {
            results[i] = callback(items[i], i);
            const now = Date.now();
            if (now >= lastLoopReleaseTime + loopReleaseInterval) {
                lastLoopReleaseTime = now;
                // Allows asynchronous actions and microtasks to happen
                yield wait(0);
            }
        }
        return results;
    });
}
exports.mapWithBreaks = mapWithBreaks;
/**
 * Makes the given promise never emit an unhandled promise rejection console warning.
 * The promise will still pass errors to the next promises.
 *
 * Otherwise, promise emits a console warning unless it has a `catch` listener.
 */
function suppressUnhandledRejectionWarning(promise) {
    promise.then(undefined, () => undefined);
}
exports.suppressUnhandledRejectionWarning = suppressUnhandledRejectionWarning;


/***/ }),

/***/ 479:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isAndroid = exports.exitFullscreen = exports.getFullscreenElement = exports.isIPad = exports.isWebKit616OrNewer = exports.isWebKit606OrNewer = exports.isChromium86OrNewer = exports.isGecko = exports.isDesktopSafari = exports.isWebKit = exports.isChromium = exports.isEdgeHTML = exports.isTrident = void 0;
const data_1 = __webpack_require__(634);
/*
 * Functions to help with features that vary through browsers
 */
/**
 * Checks whether the browser is based on Trident (the Internet Explorer engine) without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isTrident() {
    const w = window;
    const n = navigator;
    // The properties are checked to be in IE 10, IE 11 and not to be in other browsers in October 2020
    return ((0, data_1.countTruthy)([
        'MSCSSMatrix' in w,
        'msSetImmediate' in w,
        'msIndexedDB' in w,
        'msMaxTouchPoints' in n,
        'msPointerEnabled' in n,
    ]) >= 4);
}
exports.isTrident = isTrident;
/**
 * Checks whether the browser is based on EdgeHTML (the pre-Chromium Edge engine) without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isEdgeHTML() {
    // Based on research in October 2020
    const w = window;
    const n = navigator;
    return ((0, data_1.countTruthy)(['msWriteProfilerMark' in w, 'MSStream' in w, 'msLaunchUri' in n, 'msSaveBlob' in n]) >= 3 &&
        !isTrident());
}
exports.isEdgeHTML = isEdgeHTML;
/**
 * Checks whether the browser is based on Chromium without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isChromium() {
    // Based on research in October 2020. Tested to detect Chromium 42-86.
    const w = window;
    const n = navigator;
    return ((0, data_1.countTruthy)([
        'webkitPersistentStorage' in n,
        'webkitTemporaryStorage' in n,
        n.vendor.indexOf('Google') === 0,
        'webkitResolveLocalFileSystemURL' in w,
        'BatteryManager' in w,
        'webkitMediaStream' in w,
        'webkitSpeechGrammar' in w,
    ]) >= 5);
}
exports.isChromium = isChromium;
/**
 * Checks whether the browser is based on mobile or desktop Safari without using user-agent.
 * All iOS browsers use WebKit (the Safari engine).
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isWebKit() {
    // Based on research in September 2020
    const w = window;
    const n = navigator;
    return ((0, data_1.countTruthy)([
        'ApplePayError' in w,
        'CSSPrimitiveValue' in w,
        'Counter' in w,
        n.vendor.indexOf('Apple') === 0,
        'getStorageUpdates' in n,
        'WebKitMediaKeys' in w,
    ]) >= 4);
}
exports.isWebKit = isWebKit;
/**
 * Checks whether the WebKit browser is a desktop Safari.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isDesktopSafari() {
    const w = window;
    const { HTMLElement, Document } = w;
    return ((0, data_1.countTruthy)([
        'safari' in w,
        !('ongestureend' in w),
        !('TouchEvent' in w),
        !('orientation' in w),
        HTMLElement && !('autocapitalize' in HTMLElement.prototype),
        Document && 'pointerLockElement' in Document.prototype,
    ]) >= 4);
}
exports.isDesktopSafari = isDesktopSafari;
/**
 * Checks whether the browser is based on Gecko (Firefox engine) without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isGecko() {
    var _a, _b;
    const w = window;
    // Based on research in September 2020
    return ((0, data_1.countTruthy)([
        'buildID' in navigator,
        'MozAppearance' in ((_b = (_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.style) !== null && _b !== void 0 ? _b : {}),
        'onmozfullscreenchange' in w,
        'mozInnerScreenX' in w,
        'CSSMozDocumentRule' in w,
        'CanvasCaptureMediaStream' in w,
    ]) >= 4);
}
exports.isGecko = isGecko;
/**
 * Checks whether the browser is based on Chromium version ≥86 without using user-agent.
 * It doesn't check that the browser is based on Chromium, there is a separate function for this.
 */
function isChromium86OrNewer() {
    // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
    const w = window;
    return ((0, data_1.countTruthy)([
        !('MediaSettingsRange' in w),
        'RTCEncodedAudioFrame' in w,
        '' + w.Intl === '[object Intl]',
        '' + w.Reflect === '[object Reflect]',
    ]) >= 3);
}
exports.isChromium86OrNewer = isChromium86OrNewer;
/**
 * Checks whether the browser is based on WebKit version ≥606 (Safari ≥12) without using user-agent.
 * It doesn't check that the browser is based on WebKit, there is a separate function for this.
 *
 * @see https://en.wikipedia.org/wiki/Safari_version_history#Release_history Safari-WebKit versions map
 */
function isWebKit606OrNewer() {
    // Checked in Safari 9–14
    const w = window;
    return ((0, data_1.countTruthy)([
        'DOMRectList' in w,
        'RTCPeerConnectionIceEvent' in w,
        'SVGGeometryElement' in w,
        'ontransitioncancel' in w,
    ]) >= 3);
}
exports.isWebKit606OrNewer = isWebKit606OrNewer;
/**
 * Checks whether the browser is based on WebKit version ≥616 (Safari ≥17) without using user-agent.
 * It doesn't check that the browser is based on WebKit, there is a separate function for this.
 *
 * @see https://developer.apple.com/documentation/safari-release-notes/safari-17-release-notes Safari 17 release notes
 * @see https://tauri.app/v1/references/webview-versions/#webkit-versions-in-safari Safari-WebKit versions map
 */
function isWebKit616OrNewer() {
    const w = window;
    const n = navigator;
    const { CSS, HTMLButtonElement } = w;
    return ((0, data_1.countTruthy)([
        !('getStorageUpdates' in n),
        HTMLButtonElement && 'popover' in HTMLButtonElement.prototype,
        'CSSCounterStyleRule' in w,
        CSS.supports('font-size-adjust: ex-height 0.5'),
        CSS.supports('text-transform: full-width'),
    ]) >= 4);
}
exports.isWebKit616OrNewer = isWebKit616OrNewer;
/**
 * Checks whether the device is an iPad.
 * It doesn't check that the engine is WebKit and that the WebKit isn't desktop.
 */
function isIPad() {
    // Checked on:
    // Safari on iPadOS (both mobile and desktop modes): 8, 11, 12, 13, 14
    // Chrome on iPadOS (both mobile and desktop modes): 11, 12, 13, 14
    // Safari on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14
    // Chrome on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14
    // Before iOS 13. Safari tampers the value in "request desktop site" mode since iOS 13.
    if (navigator.platform === 'iPad') {
        return true;
    }
    const s = screen;
    const screenRatio = s.width / s.height;
    return ((0, data_1.countTruthy)([
        'MediaSource' in window,
        !!Element.prototype.webkitRequestFullscreen,
        // iPhone 4S that runs iOS 9 matches this. But it won't match the criteria above, so it won't be detected as iPad.
        screenRatio > 0.65 && screenRatio < 1.53,
    ]) >= 2);
}
exports.isIPad = isIPad;
/**
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function getFullscreenElement() {
    const d = document;
    return d.fullscreenElement || d.msFullscreenElement || d.mozFullScreenElement || d.webkitFullscreenElement || null;
}
exports.getFullscreenElement = getFullscreenElement;
function exitFullscreen() {
    const d = document;
    // `call` is required because the function throws an error without a proper "this" context
    return (d.exitFullscreen || d.msExitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen).call(d);
}
exports.exitFullscreen = exitFullscreen;
/**
 * Checks whether the device runs on Android without using user-agent.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function isAndroid() {
    const isItChromium = isChromium();
    const isItGecko = isGecko();
    // Only 2 browser engines are presented on Android.
    // Actually, there is also Android 4.1 browser, but it's not worth detecting it at the moment.
    if (!isItChromium && !isItGecko) {
        return false;
    }
    const w = window;
    // Chrome removes all words "Android" from `navigator` when desktop version is requested
    // Firefox keeps "Android" in `navigator.appVersion` when desktop version is requested
    return ((0, data_1.countTruthy)([
        'onorientationchange' in w,
        'orientation' in w,
        isItChromium && !('SharedWorker' in w),
        isItGecko && /android/i.test(navigator.appVersion),
    ]) >= 2);
}
exports.isAndroid = isAndroid;


/***/ }),

/***/ 634:
/***/ ((__unused_webpack_module, exports) => {


/*
 * This file contains functions to work with pure data only (no browser features, DOM, side effects, etc).
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUTF8Bytes = exports.maxInIterator = exports.areSetsEqual = exports.parseSimpleCssSelector = exports.round = exports.countTruthy = exports.replaceNaN = exports.toFloat = exports.toInt = exports.excludes = exports.includes = void 0;
/**
 * Does the same as Array.prototype.includes but has better typing
 */
function includes(haystack, needle) {
    for (let i = 0, l = haystack.length; i < l; ++i) {
        if (haystack[i] === needle) {
            return true;
        }
    }
    return false;
}
exports.includes = includes;
/**
 * Like `!includes()` but with proper typing
 */
function excludes(haystack, needle) {
    return !includes(haystack, needle);
}
exports.excludes = excludes;
/**
 * Be careful, NaN can return
 */
function toInt(value) {
    return parseInt(value);
}
exports.toInt = toInt;
/**
 * Be careful, NaN can return
 */
function toFloat(value) {
    return parseFloat(value);
}
exports.toFloat = toFloat;
function replaceNaN(value, replacement) {
    return typeof value === 'number' && isNaN(value) ? replacement : value;
}
exports.replaceNaN = replaceNaN;
function countTruthy(values) {
    return values.reduce((sum, value) => sum + (value ? 1 : 0), 0);
}
exports.countTruthy = countTruthy;
function round(value, base = 1) {
    if (Math.abs(base) >= 1) {
        return Math.round(value / base) * base;
    }
    else {
        // Sometimes when a number is multiplied by a small number, precision is lost,
        // for example 1234 * 0.0001 === 0.12340000000000001, and it's more precise divide: 1234 / (1 / 0.0001) === 0.1234.
        const counterBase = 1 / base;
        return Math.round(value * counterBase) / counterBase;
    }
}
exports.round = round;
/**
 * Parses a CSS selector into tag name with HTML attributes.
 * Only single element selector are supported (without operators like space, +, >, etc).
 *
 * Multiple values can be returned for each attribute. You decide how to handle them.
 */
function parseSimpleCssSelector(selector) {
    var _a, _b;
    const errorMessage = `Unexpected syntax '${selector}'`;
    const tagMatch = /^\s*([a-z-]*)(.*)$/i.exec(selector);
    const tag = tagMatch[1] || undefined;
    const attributes = {};
    const partsRegex = /([.:#][\w-]+|\[.+?\])/gi;
    const addAttribute = (name, value) => {
        attributes[name] = attributes[name] || [];
        attributes[name].push(value);
    };
    for (;;) {
        const match = partsRegex.exec(tagMatch[2]);
        if (!match) {
            break;
        }
        const part = match[0];
        switch (part[0]) {
            case '.':
                addAttribute('class', part.slice(1));
                break;
            case '#':
                addAttribute('id', part.slice(1));
                break;
            case '[': {
                const attributeMatch = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(part);
                if (attributeMatch) {
                    addAttribute(attributeMatch[1], (_b = (_a = attributeMatch[4]) !== null && _a !== void 0 ? _a : attributeMatch[5]) !== null && _b !== void 0 ? _b : '');
                }
                else {
                    throw new Error(errorMessage);
                }
                break;
            }
            default:
                throw new Error(errorMessage);
        }
    }
    return [tag, attributes];
}
exports.parseSimpleCssSelector = parseSimpleCssSelector;
function areSetsEqual(set1, set2) {
    if (set1 === set2) {
        return true;
    }
    if (set1.size !== set2.size) {
        return false;
    }
    if (set1.values) {
        for (let iter = set1.values(), step = iter.next(); !step.done; step = iter.next()) {
            if (!set2.has(step.value)) {
                return false;
            }
        }
        return true;
    }
    else {
        // An implementation for browsers that don't support Set iterators
        let areEqual = true;
        set1.forEach((value) => {
            if (areEqual && !set2.has(value)) {
                areEqual = false;
            }
        });
        return areEqual;
    }
}
exports.areSetsEqual = areSetsEqual;
function maxInIterator(iterator, getItemScore) {
    let maxItem;
    let maxItemScore;
    for (let step = iterator.next(); !step.done; step = iterator.next()) {
        const item = step.value;
        const score = getItemScore(item);
        if (maxItemScore === undefined || score > maxItemScore) {
            maxItem = item;
            maxItemScore = score;
        }
    }
    return maxItem;
}
exports.maxInIterator = maxInIterator;
/**
 * Converts a string to UTF8 bytes
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function getUTF8Bytes(input) {
    // If you want to just count bytes, see solutions at https://jsbench.me/ehklab415e/1
    const result = new Uint8Array(input.length);
    for (let i = 0; i < input.length; i++) {
        // `charCode` is faster than encoding so we prefer that when it's possible
        const charCode = input.charCodeAt(i);
        // In case of non-ASCII symbols we use proper encoding
        if (charCode < 0 || charCode > 127) {
            return new TextEncoder().encode(input);
        }
        result[i] = charCode;
    }
    return result;
}
exports.getUTF8Bytes = getUTF8Bytes;


/***/ }),

/***/ 593:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addStyleString = exports.selectorToElement = exports.withIframe = void 0;
const async_1 = __webpack_require__(497);
const data_1 = __webpack_require__(634);
/**
 * Creates and keeps an invisible iframe while the given function runs.
 * The given function is called when the iframe is loaded and has a body.
 * The iframe allows to measure DOM sizes inside itself.
 *
 * Notice: passing an initial HTML code doesn't work in IE.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function withIframe(action, initialHtml, domPollInterval = 50) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const d = document;
        // document.body can be null while the page is loading
        while (!d.body) {
            yield (0, async_1.wait)(domPollInterval);
        }
        const iframe = d.createElement('iframe');
        try {
            yield new Promise((_resolve, _reject) => {
                let isComplete = false;
                const resolve = () => {
                    isComplete = true;
                    _resolve();
                };
                const reject = (error) => {
                    isComplete = true;
                    _reject(error);
                };
                iframe.onload = resolve;
                iframe.onerror = reject;
                const { style } = iframe;
                style.setProperty('display', 'block', 'important'); // Required for browsers to calculate the layout
                style.position = 'absolute';
                style.top = '0';
                style.left = '0';
                style.visibility = 'hidden';
                if (initialHtml && 'srcdoc' in iframe) {
                    iframe.srcdoc = initialHtml;
                }
                else {
                    iframe.src = 'about:blank';
                }
                d.body.appendChild(iframe);
                // WebKit in WeChat doesn't fire the iframe's `onload` for some reason.
                // This code checks for the loading state manually.
                // See https://github.com/fingerprintjs/fingerprintjs/issues/645
                const checkReadyState = () => {
                    var _a, _b;
                    // The ready state may never become 'complete' in Firefox despite the 'load' event being fired.
                    // So an infinite setTimeout loop can happen without this check.
                    // See https://github.com/fingerprintjs/fingerprintjs/pull/716#issuecomment-986898796
                    if (isComplete) {
                        return;
                    }
                    // Make sure iframe.contentWindow and iframe.contentWindow.document are both loaded
                    // The contentWindow.document can miss in JSDOM (https://github.com/jsdom/jsdom).
                    if (((_b = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.readyState) === 'complete') {
                        resolve();
                    }
                    else {
                        setTimeout(checkReadyState, 10);
                    }
                };
                checkReadyState();
            });
            while (!((_b = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body)) {
                yield (0, async_1.wait)(domPollInterval);
            }
            return yield action(iframe, iframe.contentWindow);
        }
        finally {
            (_c = iframe.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(iframe);
        }
    });
}
exports.withIframe = withIframe;
/**
 * Creates a DOM element that matches the given selector.
 * Only single element selector are supported (without operators like space, +, >, etc).
 */
function selectorToElement(selector) {
    const [tag, attributes] = (0, data_1.parseSimpleCssSelector)(selector);
    const element = document.createElement(tag !== null && tag !== void 0 ? tag : 'div');
    for (const name of Object.keys(attributes)) {
        const value = attributes[name].join(' ');
        // Changing the `style` attribute can cause a CSP error, therefore we change the `style.cssText` property.
        // https://github.com/fingerprintjs/fingerprintjs/issues/733
        if (name === 'style') {
            addStyleString(element.style, value);
        }
        else {
            element.setAttribute(name, value);
        }
    }
    return element;
}
exports.selectorToElement = selectorToElement;
/**
 * Adds CSS styles from a string in such a way that doesn't trigger a CSP warning (unsafe-inline or unsafe-eval)
 */
function addStyleString(style, source) {
    // We don't use `style.cssText` because browsers must block it when no `unsafe-eval` CSP is presented: https://csplite.com/csp145/#w3c_note
    // Even though the browsers ignore this standard, we don't use `cssText` just in case.
    for (const property of source.split(';')) {
        const match = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(property);
        if (match) {
            const [, name, value, , priority] = match;
            style.setProperty(name, value, priority || ''); // The last argument can't be undefined in IE11
        }
    }
}
exports.addStyleString = addStyleString;


/***/ }),

/***/ 949:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transformSource = exports.loadSources = exports.loadSource = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const async_1 = __webpack_require__(497);
const data_1 = __webpack_require__(634);
function isFinalResultLoaded(loadResult) {
    return typeof loadResult !== 'function';
}
/**
 * Loads the given entropy source. Returns a function that gets an entropy component from the source.
 *
 * The result is returned synchronously to prevent `loadSources` from
 * waiting for one source to load before getting the components from the other sources.
 */
function loadSource(source, sourceOptions) {
    const sourceLoadPromise = new Promise((resolveLoad) => {
        const loadStartTime = Date.now();
        // `awaitIfAsync` is used instead of just `await` in order to measure the duration of synchronous sources
        // correctly (other microtasks won't affect the duration).
        (0, async_1.awaitIfAsync)(source.bind(null, sourceOptions), (...loadArgs) => {
            const loadDuration = Date.now() - loadStartTime;
            // Source loading failed
            if (!loadArgs[0]) {
                return resolveLoad(() => ({ error: loadArgs[1], duration: loadDuration }));
            }
            const loadResult = loadArgs[1];
            // Source loaded with the final result
            if (isFinalResultLoaded(loadResult)) {
                return resolveLoad(() => ({ value: loadResult, duration: loadDuration }));
            }
            // Source loaded with "get" stage
            resolveLoad(() => new Promise((resolveGet) => {
                const getStartTime = Date.now();
                (0, async_1.awaitIfAsync)(loadResult, (...getArgs) => {
                    const duration = loadDuration + Date.now() - getStartTime;
                    // Source getting failed
                    if (!getArgs[0]) {
                        return resolveGet({ error: getArgs[1], duration });
                    }
                    // Source getting succeeded
                    resolveGet({ value: getArgs[1], duration });
                });
            }));
        });
    });
    (0, async_1.suppressUnhandledRejectionWarning)(sourceLoadPromise);
    return function getComponent() {
        return sourceLoadPromise.then((finalizeSource) => finalizeSource());
    };
}
exports.loadSource = loadSource;
/**
 * Loads the given entropy sources. Returns a function that collects the entropy components.
 *
 * The result is returned synchronously in order to allow start getting the components
 * before the sources are loaded completely.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function loadSources(sources, sourceOptions, excludeSources) {
    const includedSources = Object.keys(sources).filter((sourceKey) => (0, data_1.excludes)(excludeSources, sourceKey));
    // Using `mapWithBreaks` allows asynchronous sources to complete between synchronous sources
    // and measure the duration correctly
    const sourceGettersPromise = (0, async_1.mapWithBreaks)(includedSources, (sourceKey) => loadSource(sources[sourceKey], sourceOptions));
    (0, async_1.suppressUnhandledRejectionWarning)(sourceGettersPromise);
    return function getComponents() {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceGetters = yield sourceGettersPromise;
            const componentPromises = yield (0, async_1.mapWithBreaks)(sourceGetters, (sourceGetter) => {
                const componentPromise = sourceGetter();
                (0, async_1.suppressUnhandledRejectionWarning)(componentPromise);
                return componentPromise;
            });
            const componentArray = yield Promise.all(componentPromises);
            // Keeping the component keys order the same as the source keys order
            const components = {};
            for (let index = 0; index < includedSources.length; ++index) {
                components[includedSources[index]] = componentArray[index];
            }
            return components;
        });
    };
}
exports.loadSources = loadSources;
/**
 * Modifies an entropy source by transforming its returned value with the given function.
 * Keeps the source properties: sync/async, 1/2 stages.
 *
 * Warning for package users:
 * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
 */
function transformSource(source, transformValue) {
    const transformLoadResult = (loadResult) => {
        if (isFinalResultLoaded(loadResult)) {
            return transformValue(loadResult);
        }
        return () => {
            const getResult = loadResult();
            if ((0, async_1.isPromise)(getResult)) {
                return getResult.then(transformValue);
            }
            return transformValue(getResult);
        };
    };
    return (options) => {
        const loadResult = source(options);
        if ((0, async_1.isPromise)(loadResult)) {
            return loadResult.then(transformLoadResult);
        }
        return transformLoadResult(loadResult);
    };
}
exports.transformSource = transformSource;


/***/ }),

/***/ 473:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 * Based on https://github.com/karanlyons/murmurHash3.js/blob/a33d0723127e2e5415056c455f8aed2451ace208/murmurHash3.js
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.x64hash128 = void 0;
const data_1 = __webpack_require__(634);
/**
 * Adds two 64-bit values (provided as tuples of 32-bit values)
 * and updates (mutates) first value to write the result
 */
function x64Add(m, n) {
    const m0 = m[0] >>> 16, m1 = m[0] & 0xffff, m2 = m[1] >>> 16, m3 = m[1] & 0xffff;
    const n0 = n[0] >>> 16, n1 = n[0] & 0xffff, n2 = n[1] >>> 16, n3 = n[1] & 0xffff;
    let o0 = 0, o1 = 0, o2 = 0, o3 = 0;
    o3 += m3 + n3;
    o2 += o3 >>> 16;
    o3 &= 0xffff;
    o2 += m2 + n2;
    o1 += o2 >>> 16;
    o2 &= 0xffff;
    o1 += m1 + n1;
    o0 += o1 >>> 16;
    o1 &= 0xffff;
    o0 += m0 + n0;
    o0 &= 0xffff;
    m[0] = (o0 << 16) | o1;
    m[1] = (o2 << 16) | o3;
}
/**
 * Multiplies two 64-bit values (provided as tuples of 32-bit values)
 * and updates (mutates) first value to write the result
 */
function x64Multiply(m, n) {
    const m0 = m[0] >>> 16, m1 = m[0] & 0xffff, m2 = m[1] >>> 16, m3 = m[1] & 0xffff;
    const n0 = n[0] >>> 16, n1 = n[0] & 0xffff, n2 = n[1] >>> 16, n3 = n[1] & 0xffff;
    let o0 = 0, o1 = 0, o2 = 0, o3 = 0;
    o3 += m3 * n3;
    o2 += o3 >>> 16;
    o3 &= 0xffff;
    o2 += m2 * n3;
    o1 += o2 >>> 16;
    o2 &= 0xffff;
    o2 += m3 * n2;
    o1 += o2 >>> 16;
    o2 &= 0xffff;
    o1 += m1 * n3;
    o0 += o1 >>> 16;
    o1 &= 0xffff;
    o1 += m2 * n2;
    o0 += o1 >>> 16;
    o1 &= 0xffff;
    o1 += m3 * n1;
    o0 += o1 >>> 16;
    o1 &= 0xffff;
    o0 += m0 * n3 + m1 * n2 + m2 * n1 + m3 * n0;
    o0 &= 0xffff;
    m[0] = (o0 << 16) | o1;
    m[1] = (o2 << 16) | o3;
}
/**
 * Provides left rotation of the given int64 value (provided as tuple of two int32)
 * by given number of bits. Result is written back to the value
 */
function x64Rotl(m, bits) {
    const m0 = m[0];
    bits %= 64;
    if (bits === 32) {
        m[0] = m[1];
        m[1] = m0;
    }
    else if (bits < 32) {
        m[0] = (m0 << bits) | (m[1] >>> (32 - bits));
        m[1] = (m[1] << bits) | (m0 >>> (32 - bits));
    }
    else {
        bits -= 32;
        m[0] = (m[1] << bits) | (m0 >>> (32 - bits));
        m[1] = (m0 << bits) | (m[1] >>> (32 - bits));
    }
}
/**
 * Provides a left shift of the given int32 value (provided as tuple of [0, int32])
 * by given number of bits. Result is written back to the value
 */
function x64LeftShift(m, bits) {
    bits %= 64;
    if (bits === 0) {
        return;
    }
    else if (bits < 32) {
        m[0] = m[1] >>> (32 - bits);
        m[1] = m[1] << bits;
    }
    else {
        m[0] = m[1] << (bits - 32);
        m[1] = 0;
    }
}
/**
 * Provides a XOR of the given int64 values(provided as tuple of two int32).
 * Result is written back to the first value
 */
function x64Xor(m, n) {
    m[0] ^= n[0];
    m[1] ^= n[1];
}
const F1 = [0xff51afd7, 0xed558ccd];
const F2 = [0xc4ceb9fe, 0x1a85ec53];
/**
 * Calculates murmurHash3's final x64 mix of that block and writes result back to the input value.
 * (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
 * only place where we need to right shift 64bit ints.)
 */
function x64Fmix(h) {
    const shifted = [0, h[0] >>> 1];
    x64Xor(h, shifted);
    x64Multiply(h, F1);
    shifted[1] = h[0] >>> 1;
    x64Xor(h, shifted);
    x64Multiply(h, F2);
    shifted[1] = h[0] >>> 1;
    x64Xor(h, shifted);
}
const C1 = [0x87c37b91, 0x114253d5];
const C2 = [0x4cf5ad43, 0x2745937f];
const M = [0, 5];
const N1 = [0, 0x52dce729];
const N2 = [0, 0x38495ab5];
/**
 * Given a string and an optional seed as an int, returns a 128 bit
 * hash using the x64 flavor of MurmurHash3, as an unsigned hex.
 * All internal functions mutates passed value to achieve minimal memory allocations and GC load
 *
 * Benchmark https://jsbench.me/p4lkpaoabi/1
 */
function x64hash128(input, seed) {
    const key = (0, data_1.getUTF8Bytes)(input);
    seed = seed || 0;
    const length = [0, key.length];
    const remainder = length[1] % 16;
    const bytes = length[1] - remainder;
    const h1 = [0, seed];
    const h2 = [0, seed];
    const k1 = [0, 0];
    const k2 = [0, 0];
    let i;
    for (i = 0; i < bytes; i = i + 16) {
        k1[0] = key[i + 4] | (key[i + 5] << 8) | (key[i + 6] << 16) | (key[i + 7] << 24);
        k1[1] = key[i] | (key[i + 1] << 8) | (key[i + 2] << 16) | (key[i + 3] << 24);
        k2[0] = key[i + 12] | (key[i + 13] << 8) | (key[i + 14] << 16) | (key[i + 15] << 24);
        k2[1] = key[i + 8] | (key[i + 9] << 8) | (key[i + 10] << 16) | (key[i + 11] << 24);
        x64Multiply(k1, C1);
        x64Rotl(k1, 31);
        x64Multiply(k1, C2);
        x64Xor(h1, k1);
        x64Rotl(h1, 27);
        x64Add(h1, h2);
        x64Multiply(h1, M);
        x64Add(h1, N1);
        x64Multiply(k2, C2);
        x64Rotl(k2, 33);
        x64Multiply(k2, C1);
        x64Xor(h2, k2);
        x64Rotl(h2, 31);
        x64Add(h2, h1);
        x64Multiply(h2, M);
        x64Add(h2, N2);
    }
    k1[0] = 0;
    k1[1] = 0;
    k2[0] = 0;
    k2[1] = 0;
    const val = [0, 0];
    switch (remainder) {
        case 15:
            val[1] = key[i + 14];
            x64LeftShift(val, 48);
            x64Xor(k2, val);
        // fallthrough
        case 14:
            val[1] = key[i + 13];
            x64LeftShift(val, 40);
            x64Xor(k2, val);
        // fallthrough
        case 13:
            val[1] = key[i + 12];
            x64LeftShift(val, 32);
            x64Xor(k2, val);
        // fallthrough
        case 12:
            val[1] = key[i + 11];
            x64LeftShift(val, 24);
            x64Xor(k2, val);
        // fallthrough
        case 11:
            val[1] = key[i + 10];
            x64LeftShift(val, 16);
            x64Xor(k2, val);
        // fallthrough
        case 10:
            val[1] = key[i + 9];
            x64LeftShift(val, 8);
            x64Xor(k2, val);
        // fallthrough
        case 9:
            val[1] = key[i + 8];
            x64Xor(k2, val);
            x64Multiply(k2, C2);
            x64Rotl(k2, 33);
            x64Multiply(k2, C1);
            x64Xor(h2, k2);
        // fallthrough
        case 8:
            val[1] = key[i + 7];
            x64LeftShift(val, 56);
            x64Xor(k1, val);
        // fallthrough
        case 7:
            val[1] = key[i + 6];
            x64LeftShift(val, 48);
            x64Xor(k1, val);
        // fallthrough
        case 6:
            val[1] = key[i + 5];
            x64LeftShift(val, 40);
            x64Xor(k1, val);
        // fallthrough
        case 5:
            val[1] = key[i + 4];
            x64LeftShift(val, 32);
            x64Xor(k1, val);
        // fallthrough
        case 4:
            val[1] = key[i + 3];
            x64LeftShift(val, 24);
            x64Xor(k1, val);
        // fallthrough
        case 3:
            val[1] = key[i + 2];
            x64LeftShift(val, 16);
            x64Xor(k1, val);
        // fallthrough
        case 2:
            val[1] = key[i + 1];
            x64LeftShift(val, 8);
            x64Xor(k1, val);
        // fallthrough
        case 1:
            val[1] = key[i];
            x64Xor(k1, val);
            x64Multiply(k1, C1);
            x64Rotl(k1, 31);
            x64Multiply(k1, C2);
            x64Xor(h1, k1);
        // fallthrough
    }
    x64Xor(h1, length);
    x64Xor(h2, length);
    x64Add(h1, h2);
    x64Add(h2, h1);
    x64Fmix(h1);
    x64Fmix(h2);
    x64Add(h1, h2);
    x64Add(h2, h1);
    return (('00000000' + (h1[0] >>> 0).toString(16)).slice(-8) +
        ('00000000' + (h1[1] >>> 0).toString(16)).slice(-8) +
        ('00000000' + (h2[0] >>> 0).toString(16)).slice(-8) +
        ('00000000' + (h2[1] >>> 0).toString(16)).slice(-8));
}
exports.x64hash128 = x64hash128;


/***/ }),

/***/ 235:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.errorToObject = void 0;
/**
 * Converts an error object to a plain object that can be used with `JSON.stringify`.
 * If you just run `JSON.stringify(error)`, you'll get `'{}'`.
 */
function errorToObject(error) {
    var _a;
    return Object.assign({ name: error.name, message: error.message, stack: (_a = error.stack) === null || _a === void 0 ? void 0 : _a.split('\n') }, error);
}
exports.errorToObject = errorToObject;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = void 0;
const agent_1 = __webpack_require__(326);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return agent_1.getVisitorData; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return agent_1.getVisitorId; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return agent_1.hashComponents; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return agent_1.componentsToDebugString; } });
const hashing_1 = __webpack_require__(473);
// The default export is a syntax sugar (`import * as FP from '...' → import FP from '...'`).
// It should contain all the public exported values.
exports["default"] = { getVisitorData: agent_1.getVisitorData, getVisitorId: agent_1.getVisitorId, hashComponents: agent_1.hashComponents, componentsToDebugString: agent_1.componentsToDebugString };
// The exports below are for private usage. They may change unexpectedly. Use them at your own risk.
/** Not documented, out of Semantic Versioning, usage is at your own risk */
__webpack_unused_export__ = hashing_1.x64hash128;
var agent_2 = __webpack_require__(326);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return agent_2.prepareForSources; } });
var sources_1 = __webpack_require__(555);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return sources_1.sources; } });
var screen_frame_1 = __webpack_require__(520);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return screen_frame_1.getScreenFrame; } });
var apple_pay_1 = __webpack_require__(313);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return apple_pay_1.getStateFromError; } });
var webgl_1 = __webpack_require__(858);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return webgl_1.getWebGLContext; } });
var browser_1 = __webpack_require__(479);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return browser_1.getFullscreenElement; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return browser_1.isAndroid; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return browser_1.isTrident; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return browser_1.isEdgeHTML; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return browser_1.isChromium; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return browser_1.isWebKit; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return browser_1.isGecko; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return browser_1.isDesktopSafari; } });
var entropy_source_1 = __webpack_require__(949);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return entropy_source_1.loadSources; } });
__webpack_unused_export__ = ({ enumerable: true, get: function () { return entropy_source_1.transformSource; } });
var dom_1 = __webpack_require__(593);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return dom_1.withIframe; } });
var data_1 = __webpack_require__(634);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return data_1.getUTF8Bytes; } });

})();

browser_identity = __webpack_exports__["default"];
/******/ })()
;