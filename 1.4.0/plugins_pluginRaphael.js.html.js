tui.util.defineNamespace("fedoc.content", {});
fedoc.content["plugins_pluginRaphael.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Raphael render plugin.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar BarChart = require('./raphaelBarChart'),\n    LineChart = require('./raphaelLineChart'),\n    AreaChart = require('./raphaelAreaChart'),\n    PieChart = require('./raphaelPieChart');\n\nvar pluginName = 'raphael',\n    pluginRaphael;\n\npluginRaphael = {\n    bar: BarChart,\n    column: BarChart,\n    line: LineChart,\n    area: AreaChart,\n    pie: PieChart\n};\n\ntui.chart.registerPlugin(pluginName, pluginRaphael);\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"