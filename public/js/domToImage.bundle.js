/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/dom-to-image-more/src/dom-to-image-more.js":
/*!*****************************************************************!*\
  !*** ./node_modules/dom-to-image-more/src/dom-to-image-more.js ***!
  \*****************************************************************/
/***/ (function(module) {

eval("(function(global) {\n    'use strict';\n\n    var util = newUtil();\n    var inliner = newInliner();\n    var fontFaces = newFontFaces();\n    var images = newImages();\n\n    // Default impl options\n    var defaultOptions = {\n        // Default is to fail on error, no placeholder\n        imagePlaceholder: undefined,\n        // Default cache bust is false, it will use the cache\n        cacheBust: false,\n        // Use (existing) authentication credentials for external URIs (CORS requests)\n        useCredentials: false\n    };\n\n    var domtoimage = {\n        toSvg: toSvg,\n        toPng: toPng,\n        toJpeg: toJpeg,\n        toBlob: toBlob,\n        toPixelData: toPixelData,\n        toCanvas: toCanvas,\n        impl: {\n            fontFaces: fontFaces,\n            images: images,\n            util: util,\n            inliner: inliner,\n            options: {}\n        }\n    };\n\n    if (true)\n        module.exports = domtoimage;\n    else\n        {}\n\n    /**\n     * @param {Node} node - The DOM Node object to render\n     * @param {Object} options - Rendering options\n     * @param {Function} options.filter - Should return true if passed node should be included in the output\n     *          (excluding node means excluding it's children as well). Not called on the root node.\n     * @param {String} options.bgcolor - color for the background, any valid CSS color value.\n     * @param {Number} options.width - width to be applied to node before rendering.\n     * @param {Number} options.height - height to be applied to node before rendering.\n     * @param {Object} options.style - an object whose properties to be copied to node's style before rendering.\n     * @param {Number} options.quality - a Number between 0 and 1 indicating image quality (applicable to JPEG only),\n                defaults to 1.0.\n     * @param {Number} options.scale - a Number multiplier to scale up the canvas before rendering to reduce fuzzy images, defaults to 1.0.\n     * @param {String} options.imagePlaceholder - dataURL to use as a placeholder for failed images, default behaviour is to fail fast on images we can't fetch\n     * @param {Boolean} options.cacheBust - set to true to cache bust by appending the time to the request url\n     * @return {Promise} - A promise that is fulfilled with a SVG image data URL\n     * */\n    function toSvg(node, options) {\n        options = options || {};\n        copyOptions(options);\n        return Promise.resolve(node)\n            .then(function(node) {\n                return cloneNode(node, options.filter, true);\n            })\n            .then(embedFonts)\n            .then(inlineImages)\n            .then(applyOptions)\n            .then(function(clone) {\n                return makeSvgDataUri(clone,\n                    options.width || util.width(node),\n                    options.height || util.height(node)\n                );\n            });\n\n        function applyOptions(clone) {\n            if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;\n            if (options.width) clone.style.width = options.width + 'px';\n            if (options.height) clone.style.height = options.height + 'px';\n\n            if (options.style)\n                Object.keys(options.style).forEach(function(property) {\n                    clone.style[property] = options.style[property];\n                });\n\n            return clone;\n        }\n    }\n\n    /**\n     * @param {Node} node - The DOM Node object to render\n     * @param {Object} options - Rendering options, @see {@link toSvg}\n     * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.\n     * */\n    function toPixelData(node, options) {\n        return draw(node, options || {})\n            .then(function(canvas) {\n                return canvas.getContext('2d').getImageData(\n                    0,\n                    0,\n                    util.width(node),\n                    util.height(node)\n                ).data;\n            });\n    }\n\n    /**\n     * @param {Node} node - The DOM Node object to render\n     * @param {Object} options - Rendering options, @see {@link toSvg}\n     * @return {Promise} - A promise that is fulfilled with a PNG image data URL\n     * */\n    function toPng(node, options) {\n        return draw(node, options || {})\n            .then(function(canvas) {\n                return canvas.toDataURL();\n            });\n    }\n\n    /**\n     * @param {Node} node - The DOM Node object to render\n     * @param {Object} options - Rendering options, @see {@link toSvg}\n     * @return {Promise} - A promise that is fulfilled with a JPEG image data URL\n     * */\n    function toJpeg(node, options) {\n        options = options || {};\n        return draw(node, options)\n            .then(function(canvas) {\n                return canvas.toDataURL('image/jpeg', options.quality || 1.0);\n            });\n    }\n\n    /**\n     * @param {Node} node - The DOM Node object to render\n     * @param {Object} options - Rendering options, @see {@link toSvg}\n     * @return {Promise} - A promise that is fulfilled with a PNG image blob\n     * */\n    function toBlob(node, options) {\n        return draw(node, options || {})\n            .then(util.canvasToBlob);\n    }\n\n    /**\n     * @param {Node} node - The DOM Node object to render\n     * @param {Object} options - Rendering options, @see {@link toSvg}\n     * @return {Promise} - A promise that is fulfilled with a canvas object\n     * */\n    function toCanvas(node, options) {\n        return draw(node, options || {});\n    }\n\n    function copyOptions(options) {\n        // Copy options to impl options for use in impl\n        if (typeof(options.imagePlaceholder) === 'undefined') {\n            domtoimage.impl.options.imagePlaceholder = defaultOptions.imagePlaceholder;\n        } else {\n            domtoimage.impl.options.imagePlaceholder = options.imagePlaceholder;\n        }\n\n        if (typeof(options.cacheBust) === 'undefined') {\n            domtoimage.impl.options.cacheBust = defaultOptions.cacheBust;\n        } else {\n            domtoimage.impl.options.cacheBust = options.cacheBust;\n        }\n\n        if(typeof(options.useCredentials) === 'undefined') {\n            domtoimage.impl.options.useCredentials = defaultOptions.useCredentials;\n        } else {\n            domtoimage.impl.options.useCredentials = options.useCredentials;\n        }\n    }\n\n    function draw(domNode, options) {\n        return toSvg(domNode, options)\n            .then(util.makeImage)\n            .then(util.delay(100))\n            .then(function(image) {\n                var scale = typeof(options.scale) !== 'number' ? 1 : options.scale;\n                var canvas = newCanvas(domNode, scale);\n                var ctx = canvas.getContext('2d');\n                if (image) {\n                    ctx.scale(scale, scale);\n                    ctx.drawImage(image, 0, 0);\n                }\n                return canvas;\n            });\n\n        function newCanvas(domNode, scale) {\n            var canvas = document.createElement('canvas');\n            canvas.width = (options.width || util.width(domNode)) * scale;\n            canvas.height = (options.height || util.height(domNode)) * scale;\n\n            if (options.bgcolor) {\n                var ctx = canvas.getContext('2d');\n                ctx.fillStyle = options.bgcolor;\n                ctx.fillRect(0, 0, canvas.width, canvas.height);\n            }\n\n            return canvas;\n        }\n    }\n\n    function cloneNode(node, filter, root) {\n        if (!root && filter && !filter(node)) return Promise.resolve();\n\n        return Promise.resolve(node)\n            .then(makeNodeCopy)\n            .then(function(clone) {\n                return cloneChildren(node, clone, filter);\n            })\n            .then(function(clone) {\n                return processClone(node, clone);\n            });\n\n        function makeNodeCopy(node) {\n            if (node instanceof HTMLCanvasElement) return util.makeImage(node.toDataURL());\n            return node.cloneNode(false);\n        }\n\n        function cloneChildren(original, clone, filter) {\n            var children = original.childNodes;\n            if (children.length === 0) return Promise.resolve(clone);\n\n            return cloneChildrenInOrder(clone, util.asArray(children), filter)\n                .then(function() {\n                    return clone;\n                });\n\n            function cloneChildrenInOrder(parent, children, filter) {\n                var done = Promise.resolve();\n                children.forEach(function(child) {\n                    done = done\n                        .then(function() {\n                            return cloneNode(child, filter);\n                        })\n                        .then(function(childClone) {\n                            if (childClone) parent.appendChild(childClone);\n                        });\n                });\n                return done;\n            }\n        }\n\n        function processClone(original, clone) {\n            if (!(clone instanceof Element)) return clone;\n\n            return Promise.resolve()\n                .then(cloneStyle)\n                .then(clonePseudoElements)\n                .then(copyUserInput)\n                .then(fixSvg)\n                .then(function() {\n                    return clone;\n                });\n\n            function cloneStyle() {\n                copyStyle(window.getComputedStyle(original), clone.style);\n\n                function copyStyle(source, target) {\n                    if (source.cssText) {\n                        target.cssText = source.cssText;\n                        target.font = source.font; // here, we re-assign the font prop.\n                    } else copyProperties(source, target);\n\n                    function copyProperties(source, target) {\n                        util.asArray(source).forEach(function(name) {\n                            target.setProperty(\n                                name,\n                                source.getPropertyValue(name),\n                                source.getPropertyPriority(name)\n                            );\n                        });\n                    }\n                }\n            }\n\n            function clonePseudoElements() {\n                [':before', ':after'].forEach(function(element) {\n                    clonePseudoElement(element);\n                });\n\n                function clonePseudoElement(element) {\n                    var style = window.getComputedStyle(original, element);\n                    var content = style.getPropertyValue('content');\n\n                    if (content === '' || content === 'none') return;\n\n                    var className = util.uid();\n                    var currentClass = clone.getAttribute('class');\n                    if (currentClass) {\n                        clone.setAttribute('class', currentClass + ' ' + className);\n                    }\n\n                    var styleElement = document.createElement('style');\n                    styleElement.appendChild(formatPseudoElementStyle(className, element, style));\n                    clone.appendChild(styleElement);\n\n                    function formatPseudoElementStyle(className, element, style) {\n                        var selector = '.' + className + ':' + element;\n                        var cssText = style.cssText ? formatCssText(style) : formatCssProperties(style);\n                        return document.createTextNode(selector + '{' + cssText + '}');\n\n                        function formatCssText(style) {\n                            var content = style.getPropertyValue('content');\n                            return style.cssText + ' content: ' + content + ';';\n                        }\n\n                        function formatCssProperties(style) {\n\n                            return util.asArray(style)\n                                .map(formatProperty)\n                                .join('; ') + ';';\n\n                            function formatProperty(name) {\n                                return name + ': ' +\n                                    style.getPropertyValue(name) +\n                                    (style.getPropertyPriority(name) ? ' !important' : '');\n                            }\n                        }\n                    }\n                }\n            }\n\n            function copyUserInput() {\n                if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;\n                if (original instanceof HTMLInputElement) clone.setAttribute(\"value\", original.value);\n            }\n\n            function fixSvg() {\n                if (!(clone instanceof SVGElement)) return;\n                clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');\n\n                if (!(clone instanceof SVGRectElement)) return;\n                ['width', 'height'].forEach(function(attribute) {\n                    var value = clone.getAttribute(attribute);\n                    if (!value) return;\n\n                    clone.style.setProperty(attribute, value);\n                });\n            }\n        }\n    }\n\n    function embedFonts(node) {\n        return fontFaces.resolveAll()\n            .then(function(cssText) {\n                var styleNode = document.createElement('style');\n                node.appendChild(styleNode);\n                styleNode.appendChild(document.createTextNode(cssText));\n                return node;\n            });\n    }\n\n    function inlineImages(node) {\n        return images.inlineAll(node)\n            .then(function() {\n                return node;\n            });\n    }\n\n    function makeSvgDataUri(node, width, height) {\n        return Promise.resolve(node)\n            .then(function(node) {\n                node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');\n                return new XMLSerializer().serializeToString(node);\n            })\n            .then(util.escapeXhtml)\n            .then(function(xhtml) {\n                return '<foreignObject x=\"0\" y=\"0\" width=\"100%\" height=\"100%\">' + xhtml + '</foreignObject>';\n            })\n            .then(function(foreignObject) {\n                return '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"' + width + '\" height=\"' + height + '\">' +\n                    foreignObject + '</svg>';\n            })\n            .then(function(svg) {\n                return 'data:image/svg+xml;charset=utf-8,' + svg;\n            });\n    }\n\n    function newUtil() {\n        return {\n            escape: escape,\n            parseExtension: parseExtension,\n            mimeType: mimeType,\n            dataAsUrl: dataAsUrl,\n            isDataUrl: isDataUrl,\n            canvasToBlob: canvasToBlob,\n            resolveUrl: resolveUrl,\n            getAndEncode: getAndEncode,\n            uid: uid(),\n            delay: delay,\n            asArray: asArray,\n            escapeXhtml: escapeXhtml,\n            makeImage: makeImage,\n            width: width,\n            height: height\n        };\n\n        function mimes() {\n            /*\n             * Only WOFF and EOT mime types for fonts are 'real'\n             * see http://www.iana.org/assignments/media-types/media-types.xhtml\n             */\n            var WOFF = 'application/font-woff';\n            var JPEG = 'image/jpeg';\n\n            return {\n                'woff': WOFF,\n                'woff2': WOFF,\n                'ttf': 'application/font-truetype',\n                'eot': 'application/vnd.ms-fontobject',\n                'png': 'image/png',\n                'jpg': JPEG,\n                'jpeg': JPEG,\n                'gif': 'image/gif',\n                'tiff': 'image/tiff',\n                'svg': 'image/svg+xml'\n            };\n        }\n\n        function parseExtension(url) {\n            var match = /\\.([^\\.\\/]*?)(\\?|$)/g.exec(url);\n            if (match) return match[1];\n            else return '';\n        }\n\n        function mimeType(url) {\n            var extension = parseExtension(url).toLowerCase();\n            return mimes()[extension] || '';\n        }\n\n        function isDataUrl(url) {\n            return url.search(/^(data:)/) !== -1;\n        }\n\n        function toBlob(canvas) {\n            return new Promise(function(resolve) {\n                var binaryString = window.atob(canvas.toDataURL().split(',')[1]);\n                var length = binaryString.length;\n                var binaryArray = new Uint8Array(length);\n\n                for (var i = 0; i < length; i++)\n                    binaryArray[i] = binaryString.charCodeAt(i);\n\n                resolve(new Blob([binaryArray], {\n                    type: 'image/png'\n                }));\n            });\n        }\n\n        function canvasToBlob(canvas) {\n            if (canvas.toBlob)\n                return new Promise(function(resolve) {\n                    canvas.toBlob(resolve);\n                });\n\n            return toBlob(canvas);\n        }\n\n        function resolveUrl(url, baseUrl) {\n            var doc = document.implementation.createHTMLDocument();\n            var base = doc.createElement('base');\n            doc.head.appendChild(base);\n            var a = doc.createElement('a');\n            doc.body.appendChild(a);\n            base.href = baseUrl;\n            a.href = url;\n            return a.href;\n        }\n\n        function uid() {\n            var index = 0;\n\n            return function() {\n                return 'u' + fourRandomChars() + index++;\n\n                function fourRandomChars() {\n                    /* see http://stackoverflow.com/a/6248722/2519373 */\n                    return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);\n                }\n            };\n        }\n\n        function makeImage(uri) {\n            if (uri === 'data:,') return Promise.resolve();\n            return new Promise(function(resolve, reject) {\n                var image = new Image();\n                if(domtoimage.impl.options.useCredentials) {\n                    image.crossOrigin = 'use-credentials';\n                }\n                image.onload = function() {\n                    resolve(image);\n                };\n                image.onerror = reject;\n                image.src = uri;\n            });\n        }\n\n        function getAndEncode(url) {\n            var TIMEOUT = 30000;\n            if (domtoimage.impl.options.cacheBust) {\n                // Cache bypass so we dont have CORS issues with cached images\n                // Source: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache\n                url += ((/\\?/).test(url) ? \"&\" : \"?\") + (new Date()).getTime();\n            }\n\n            return new Promise(function(resolve) {\n                var request = new XMLHttpRequest();\n\n                request.onreadystatechange = done;\n                request.ontimeout = timeout;\n                request.responseType = 'blob';\n                request.timeout = TIMEOUT;\n                if(domtoimage.impl.options.useCredentials) {\n                    request.withCredentials = true;\n                }\n                request.open('GET', url, true);\n                request.send();\n\n                var placeholder;\n                if (domtoimage.impl.options.imagePlaceholder) {\n                    var split = domtoimage.impl.options.imagePlaceholder.split(/,/);\n                    if (split && split[1]) {\n                        placeholder = split[1];\n                    }\n                }\n\n                function done() {\n                    if (request.readyState !== 4) return;\n\n                    if (request.status !== 200) {\n                        if (placeholder) {\n                            resolve(placeholder);\n                        } else {\n                            fail('cannot fetch resource: ' + url + ', status: ' + request.status);\n                        }\n\n                        return;\n                    }\n\n                    var encoder = new FileReader();\n                    encoder.onloadend = function() {\n                        var content = encoder.result.split(/,/)[1];\n                        resolve(content);\n                    };\n                    encoder.readAsDataURL(request.response);\n                }\n\n                function timeout() {\n                    if (placeholder) {\n                        resolve(placeholder);\n                    } else {\n                        fail('timeout of ' + TIMEOUT + 'ms occured while fetching resource: ' + url);\n                    }\n                }\n\n                function fail(message) {\n                    console.error(message);\n                    resolve('');\n                }\n            });\n        }\n\n        function dataAsUrl(content, type) {\n            return 'data:' + type + ';base64,' + content;\n        }\n\n        function escape(string) {\n            return string.replace(/([.*+?^${}()|\\[\\]\\/\\\\])/g, '\\\\$1');\n        }\n\n        function delay(ms) {\n            return function(arg) {\n                return new Promise(function(resolve) {\n                    setTimeout(function() {\n                        resolve(arg);\n                    }, ms);\n                });\n            };\n        }\n\n        function asArray(arrayLike) {\n            var array = [];\n            var length = arrayLike.length;\n            for (var i = 0; i < length; i++) array.push(arrayLike[i]);\n            return array;\n        }\n\n        function escapeXhtml(string) {\n            return string.replace(/#/g, '%23').replace(/\\n/g, '%0A');\n        }\n\n        function width(node) {\n            var leftBorder = px(node, 'border-left-width');\n            var rightBorder = px(node, 'border-right-width');\n            return node.scrollWidth + leftBorder + rightBorder;\n        }\n\n        function height(node) {\n            var topBorder = px(node, 'border-top-width');\n            var bottomBorder = px(node, 'border-bottom-width');\n            return node.scrollHeight + topBorder + bottomBorder;\n        }\n\n        function px(node, styleProperty) {\n            var value = window.getComputedStyle(node).getPropertyValue(styleProperty);\n            return parseFloat(value.replace('px', ''));\n        }\n    }\n\n    function newInliner() {\n        var URL_REGEX = /url\\(['\"]?([^'\"]+?)['\"]?\\)/g;\n\n        return {\n            inlineAll: inlineAll,\n            shouldProcess: shouldProcess,\n            impl: {\n                readUrls: readUrls,\n                inline: inline\n            }\n        };\n\n        function shouldProcess(string) {\n            return string.search(URL_REGEX) !== -1;\n        }\n\n        function readUrls(string) {\n            var result = [];\n            var match;\n            while ((match = URL_REGEX.exec(string)) !== null) {\n                result.push(match[1]);\n            }\n            return result.filter(function(url) {\n                return !util.isDataUrl(url);\n            });\n        }\n\n        function inline(string, url, baseUrl, get) {\n            return Promise.resolve(url)\n                .then(function(url) {\n                    return baseUrl ? util.resolveUrl(url, baseUrl) : url;\n                })\n                .then(get || util.getAndEncode)\n                .then(function(data) {\n                    return util.dataAsUrl(data, util.mimeType(url));\n                })\n                .then(function(dataUrl) {\n                    return string.replace(urlAsRegex(url), '$1' + dataUrl + '$3');\n                });\n\n            function urlAsRegex(url) {\n                return new RegExp('(url\\\\([\\'\"]?)(' + util.escape(url) + ')([\\'\"]?\\\\))', 'g');\n            }\n        }\n\n        function inlineAll(string, baseUrl, get) {\n            if (nothingToInline()) return Promise.resolve(string);\n\n            return Promise.resolve(string)\n                .then(readUrls)\n                .then(function(urls) {\n                    var done = Promise.resolve(string);\n                    urls.forEach(function(url) {\n                        done = done.then(function(string) {\n                            return inline(string, url, baseUrl, get);\n                        });\n                    });\n                    return done;\n                });\n\n            function nothingToInline() {\n                return !shouldProcess(string);\n            }\n        }\n    }\n\n    function newFontFaces() {\n        return {\n            resolveAll: resolveAll,\n            impl: {\n                readAll: readAll\n            }\n        };\n\n        function resolveAll() {\n            return readAll(document)\n                .then(function(webFonts) {\n                    return Promise.all(\n                        webFonts.map(function(webFont) {\n                            return webFont.resolve();\n                        })\n                    );\n                })\n                .then(function(cssStrings) {\n                    return cssStrings.join('\\n');\n                });\n        }\n\n        function readAll() {\n            return Promise.resolve(util.asArray(document.styleSheets))\n                .then(getCssRules)\n                .then(selectWebFontRules)\n                .then(function(rules) {\n                    return rules.map(newWebFont);\n                });\n\n            function selectWebFontRules(cssRules) {\n                return cssRules\n                    .filter(function(rule) {\n                        return rule.type === CSSRule.FONT_FACE_RULE;\n                    })\n                    .filter(function(rule) {\n                        return inliner.shouldProcess(rule.style.getPropertyValue('src'));\n                    });\n            }\n\n            function getCssRules(styleSheets) {\n                var cssRules = [];\n                styleSheets.forEach(function(sheet) {\n                    if (sheet.hasOwnProperty(\"cssRules\")) {\n                        try {\n                            util.asArray(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules));\n                        } catch (e) {\n                            console.log('Error while reading CSS rules from ' + sheet.href, e.toString());\n                        }\n                    }\n                });\n                return cssRules;\n            }\n\n            function newWebFont(webFontRule) {\n                return {\n                    resolve: function resolve() {\n                        var baseUrl = (webFontRule.parentStyleSheet || {}).href;\n                        return inliner.inlineAll(webFontRule.cssText, baseUrl);\n                    },\n                    src: function() {\n                        return webFontRule.style.getPropertyValue('src');\n                    }\n                };\n            }\n        }\n    }\n\n    function newImages() {\n        return {\n            inlineAll: inlineAll,\n            impl: {\n                newImage: newImage\n            }\n        };\n\n        function newImage(element) {\n            return {\n                inline: inline\n            };\n\n            function inline(get) {\n                if (util.isDataUrl(element.src)) return Promise.resolve();\n\n                return Promise.resolve(element.src)\n                    .then(get || util.getAndEncode)\n                    .then(function(data) {\n                        return util.dataAsUrl(data, util.mimeType(element.src));\n                    })\n                    .then(function(dataUrl) {\n                        return new Promise(function(resolve, reject) {\n                            element.onload = resolve;\n                            // for any image with invalid src(such as <img src />), just ignore it\n                            element.onerror = resolve;\n                            element.src = dataUrl;\n                        });\n                    });\n            }\n        }\n\n        function inlineAll(node) {\n            if (!(node instanceof Element)) return Promise.resolve(node);\n\n            return inlineBackground(node)\n                .then(function() {\n                    if (node instanceof HTMLImageElement)\n                        return newImage(node).inline();\n                    else\n                        return Promise.all(\n                            util.asArray(node.childNodes).map(function(child) {\n                                return inlineAll(child);\n                            })\n                        );\n                });\n\n            function inlineBackground(node) {\n                var background = node.style.getPropertyValue('background');\n\n                if (!background) return Promise.resolve(node);\n\n                return inliner.inlineAll(background)\n                    .then(function(inlined) {\n                        node.style.setProperty(\n                            'background',\n                            inlined,\n                            node.style.getPropertyPriority('background')\n                        );\n                    })\n                    .then(function() {\n                        return node;\n                    });\n            }\n        }\n    }\n})(this);\n\n\n//# sourceURL=webpack://MemeGenerator/./node_modules/dom-to-image-more/src/dom-to-image-more.js?");

/***/ }),

/***/ "./src/js/domToImage.js":
/*!******************************!*\
  !*** ./src/js/domToImage.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var dom_to_image_more__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dom-to-image-more */ \"./node_modules/dom-to-image-more/src/dom-to-image-more.js\");\n/* harmony import */ var dom_to_image_more__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dom_to_image_more__WEBPACK_IMPORTED_MODULE_0__);\n\n\nvar outerContainer = document.createElement('div')\nvar innerContainer = document.createElement('div')\nvar image = document.createElement('img')\nvar topCaptionP = document.createElement('p')\nvar bottomCaptionP = document.createElement('p')\n\nvar button = document.querySelector('.create-button')\n\nvar reader = new FileReader()\nreader.addEventListener('load', (event) => {\n  image.src = event.target.result\n})\nvar name\nvar file\nvar topCaption\nvar bottomCaption\n\nouterContainer.className = 'outer-container'\ninnerContainer.className = 'inner-container'\nimage.className = 'meme-image'\ntopCaptionP.className = 'top-caption'\nbottomCaptionP.className = 'bottom-caption'\n\n__webpack_require__.g.formSubmit = (event) => {\n  event.preventDefault()\n  button.style = { display: 'inline block' }\n  name = event.target[0].value\n  topCaption = event.target[1].value\n  bottomCaption = event.target[2].value\n  file = event.target[3].files[0]\n  reader.readAsDataURL(file)\n  topCaptionP.innerHTML = topCaption\n  bottomCaptionP.innerHTML = bottomCaption\n  innerContainer.appendChild(topCaptionP)\n  innerContainer.appendChild(image)\n  innerContainer.appendChild(bottomCaptionP)\n  outerContainer.appendChild(innerContainer)\n  document.querySelector('.layout').appendChild(outerContainer)\n  return false\n}\n\n__webpack_require__.g.buttonSubmit = () => {\n  dom_to_image_more__WEBPACK_IMPORTED_MODULE_0___default().toPng(innerContainer).then(function (dataUrl) {\n    console.log(dataUrl)\n    var image2 = new Image()\n    image2.src = dataUrl\n    fetch(dataUrl)\n      .then((response) => {\n        console.log(response)\n        return response.blob()\n      })\n      .then((file2) => {\n        const formData = new FormData()\n        formData.append('meme[name]', name)\n        formData.append('meme[top_caption]', topCaption)\n        formData.append('meme[bottom_caption]', bottomCaption)\n        formData.append(\n          'meme[image]',\n          file2,\n          name + `.${file2.type.split('/').pop()}`\n        )\n        formData.append(\n          'meme[original_image]',\n          file,\n          name + `_original.${file.type.split('/').pop()}`\n        )\n        fetch('/memes', {\n          method: 'POST',\n          body: formData\n        })\n          .then((response) => console.log(response))\n          .then(() => {\n            window.location.href = `/users/${user_id}/memes`\n          })\n          .catch(function (error) {\n            console.error('error', error)\n          })\n      })\n  })\n}\n\n\n//# sourceURL=webpack://MemeGenerator/./src/js/domToImage.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/js/domToImage.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;