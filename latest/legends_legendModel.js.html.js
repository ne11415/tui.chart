tui.util.defineNamespace("fedoc.content", {});
fedoc.content["legends_legendModel.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview LegendModel is legend model.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar defaultTheme = require('../themes/defaultTheme');\n\nvar concat = Array.prototype.concat;\n\nvar LegendModel = tui.util.defineClass(/** @lends LegendModel.prototype */ {\n    /**\n     * LegendModel is legend model.\n     * @constructs LegendModel\n     * @param {object} params parameters\n     *      @param {number} params.labels legend labels\n     *      @param {object} params.bound axis bound\n     *      @param {object} params.theme axis theme\n     */\n    init: function(params) {\n        /**\n         * legend theme\n         * @type {Object}\n         */\n        this.theme = params.theme;\n\n        /**\n         * legend labels\n         * @type {array.&lt;string> | {column: ?array.&lt;string>, line: ?array.&lt;string>}}\n         */\n        this.labels = params.labels;\n\n        /**\n         * label infos\n         * @type {array.&lt;{chartType: string, label: string, index: number}>}\n         */\n        this.legendData = params.legendData;\n\n        /**\n         * chart types\n         * @type {?array.&lt;string>}\n         */\n        this.chartTypes = params.chartTypes;\n\n        /**\n         * chart type\n         * @type {string}\n         */\n        this.chartType = params.chartType;\n\n        /**\n         * Legend data\n         * @type {?array}\n         */\n        this.data = null;\n\n        /**\n         * Selected legend index.\n         * @type {?number}\n         */\n        this.selectedIndex = null;\n\n        /**\n         * sending data to series\n         * @type {object}\n         */\n        this.checkedIndexesMap = {};\n\n        /**\n         * checked indexes\n         * @type {array}\n         */\n        this.checkedWholeIndexes = [];\n\n        this._initCheckedIndexes();\n        this._setData();\n    },\n\n    /**\n     * Initialize checked data.\n     * @private\n     */\n    _initCheckedIndexes: function() {\n        var checkedWholeIndexes = [];\n        tui.util.forEachArray(this.legendData, function(legendDatum, index) {\n            checkedWholeIndexes[index] = true;\n        }, this);\n        this.checkedWholeIndexes = checkedWholeIndexes;\n    },\n\n    /**\n     * Make label info that applied theme.\n     * @param {array.&lt;object>} labelInfo labels\n     * @param {{colors: array.&lt;number>, singleColor: ?string, bordercolor: ?string}} theme legend theme\n     * @param {array.&lt;boolean>} checkedIndexes checked indexes\n     * @returns {array.&lt;object>} labels\n     * @private\n     */\n    _makeLabelInfoAppliedTheme: function(labelInfo, theme, checkedIndexes) {\n        var seriesIndex = 0;\n\n        return tui.util.map(labelInfo, function(item, index) {\n            var itemTheme = {\n                color: theme.colors[index]\n            };\n\n            if (theme.singleColors) {\n                itemTheme.singleColor = theme.singleColors[index];\n            }\n\n            if (theme.borderColor) {\n                itemTheme.borderColor = theme.borderColor;\n            }\n\n            item.theme = itemTheme;\n            item.index = index;\n\n            if (!checkedIndexes || !tui.util.isUndefined(checkedIndexes[index])) {\n                item.seriesIndex = seriesIndex;\n                seriesIndex += 1;\n            } else {\n                item.seriesIndex = -1;\n            }\n\n            return item;\n        }, this);\n    },\n\n    /**\n     * Set legend data.\n     * @private\n     */\n    _setData: function() {\n        var legendData = this.legendData,\n            data, defaultLegendTheme, startIndex, startThemeIndex;\n\n        if (!this.chartTypes) {\n            data = this._makeLabelInfoAppliedTheme(legendData, this.theme, this.checkedIndexesMap[this.chartType]);\n        } else {\n            startIndex = 0;\n            startThemeIndex = 0;\n            defaultLegendTheme = {\n                colors: defaultTheme.series.colors\n            };\n            data = concat.apply([], tui.util.map(this.chartTypes, function(chartType) {\n                var chartTheme = this.theme[chartType],\n                    labelLen = this.labels[chartType].length,\n                    endIndex = startIndex + labelLen,\n                    themeEndIndex, datum;\n\n                if (!chartTheme) {\n                    themeEndIndex = startThemeIndex + labelLen;\n                    chartTheme = JSON.parse(JSON.stringify(defaultLegendTheme));\n                    chartTheme.colors = chartTheme.colors.slice(startThemeIndex, themeEndIndex);\n                    startThemeIndex = themeEndIndex;\n                }\n\n                datum = this._makeLabelInfoAppliedTheme(legendData.slice(startIndex, endIndex), chartTheme, this.checkedIndexesMap[chartType]);\n                startIndex = endIndex;\n                return datum;\n            }, this));\n        }\n\n        this.data = data;\n    },\n\n    /**\n     * Get legend data.\n     * @returns {array.&lt;{chartType: string, label: string, theme: object}>} legend data\n     */\n    getData: function() {\n        return this.data;\n    },\n\n    /**\n     * Get legend datum by index.\n     * @param {number} index legend index\n     * @returns {{chartType: string, label: string, theme: object}} legend datum\n     */\n    getDatum: function(index) {\n        return this.data[index];\n    },\n\n    /**\n     * Get selected datum.\n     * @returns {{chartType: string, label: string, theme: Object}} legend datum\n     */\n    getSelectedDatum: function() {\n        return this.getDatum(this.selectedIndex);\n    },\n\n    /**\n     * Update selected index.\n     * @param {?number} value value\n     */\n    updateSelectedIndex: function(value) {\n        this.selectedIndex = value;\n    },\n\n    /**\n     * Toggle selected index.\n     * @param {number} index legend index\n     */\n    toggleSelectedIndex: function(index) {\n        var selectedIndex;\n\n        if (this.selectedIndex === index) {\n            selectedIndex = null;\n        } else {\n            selectedIndex = index;\n        }\n\n        this.updateSelectedIndex(selectedIndex);\n    },\n\n    /**\n     * Get selected index.\n     * @returns {number} selected index\n     */\n    getSelectedIndex: function() {\n        return this.selectedIndex;\n    },\n\n    /**\n     * Whether unselected index or not.\n     * @param {number} index legend index\n     * @returns {boolean} true if selected\n     */\n    isUnselectedIndex: function(index) {\n        return !tui.util.isNull(this.selectedIndex) &amp;&amp; (this.selectedIndex !== index);\n    },\n\n    /**\n     * Whether checked selected index or not.\n     * @returns {boolean} true if checked\n     */\n    isCheckedSelectedIndex: function() {\n        return this.isCheckedIndex(this.selectedIndex);\n    },\n\n    /**\n     * Update checked index.\n     * @param {number} index legend index\n     * @private\n     */\n    _updateCheckedIndex: function(index) {\n        this.checkedWholeIndexes[index] = true;\n    },\n\n    /**\n     * Whether checked index.\n     * @param {number} index legend index\n     * @returns {boolean} true if checked\n     */\n    isCheckedIndex: function(index) {\n        return !!this.checkedWholeIndexes[index];\n    },\n\n\n    /**\n     * Add sending datum.\n     * @param {number} index legend index\n     */\n    _addSendingDatum: function(index) {\n        var legendDatum = this.getDatum(index);\n        if (!this.checkedIndexesMap[legendDatum.chartType]) {\n            this.checkedIndexesMap[legendDatum.chartType] = [];\n        }\n        this.checkedIndexesMap[legendDatum.chartType][legendDatum.index] = true;\n    },\n\n    /**\n     * Check selected index;\n     */\n    checkSelectedIndex: function() {\n        this._updateCheckedIndex(this.selectedIndex);\n        this._addSendingDatum(this.selectedIndex);\n        this._setData();\n    },\n\n    /**\n     * Get checked indexes.\n     * @returns {{column: ?array.&lt;boolean>, line: ?array.&lt;boolean>} | array.&lt;boolean>} sending data\n     */\n    getCheckedIndexes: function() {\n        return this.checkedIndexesMap[this.chartType] || this.checkedIndexesMap;\n    },\n\n    /**\n     * Reset checked data.\n     * @private\n     */\n    _resetCheckedData: function() {\n        this.checkedWholeIndexes = [];\n        this.checkedIndexesMap = {};\n    },\n\n    /**\n     * Update checked data.\n     * @param {array.&lt;number>} indexes indxes\n     */\n    updateCheckedData: function(indexes) {\n        this._resetCheckedData();\n        tui.util.forEachArray(indexes, function(index) {\n            this._updateCheckedIndex(index);\n            this._addSendingDatum(index);\n        }, this);\n        this._setData();\n    }\n});\n\nmodule.exports = LegendModel;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"