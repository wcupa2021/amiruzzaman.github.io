//Maintaining two JSON one for final result and one to sort ugrad and grad.
var manipulateDetailsJSON = {grad: [], ugrad: []};
var gradUgradJSON = {grad: [], ugrad: []};

// https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values
var sortBy = (function () {
    var toString = Object.prototype.toString,
            // default parser function
            parse = function (x) {
                return x;
            },
            // gets the item to be sorted
            getItem = function (x) {
                var isObject = x != null && typeof x === "object";
                var isProp = isObject && this.prop in x;
                return this.parser(isProp ? x[this.prop] : x);
            };

    /**
     * Sorts an array of elements.
     *
     * @param  {Array} array: the collection to sort
     * @param  {Object} cfg: the configuration options
     * @property {String}   cfg.prop: property name (if it is an Array of objects)
     * @property {Boolean}  cfg.desc: determines whether the sort is descending
     * @property {Function} cfg.parser: function to parse the items to expected type
     * @return {Array}
     */
    return function sortby(array, cfg) {
        if (!(array instanceof Array && array.length))
            return [];
        if (toString.call(cfg) !== "[object Object]")
            cfg = {};
        if (typeof cfg.parser !== "function")
            cfg.parser = parse;
        cfg.desc = !!cfg.desc ? -1 : 1;
        return array.sort(function (a, b) {
            a = getItem.call(cfg, a);
            b = getItem.call(cfg, b);
            return cfg.desc * (a < b ? -1 : +(a > b));
        });
    };

}());



// Parse the CSV file using PapaParse library all the dynamic functions are written inside complete callback method
Papa.parse("teaching/teaching_ugrad_grad.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
        var ugradHeader = '<div class="theader">' +
                            '<div class="table_header">Year</div>'+
                            '<div class="table_header">Course #</div>'+
                            '<div class="table_header">Name</div>'+
                            '<div class="table_header">University</div>'+
                            '<div class="table_header">Times</div>'+
                            '</div>';
        $(ugradHeader).appendTo("#add-ugrad-table");
        var gradHeader = '<div class="theader">' +
                            '<div class="table_header">Year</div>'+
                            '<div class="table_header">Course #</div>'+
                            '<div class="table_header">Name</div>'+
                            '<div class="table_header">University</div>'+
                            '<div class="table_header">Times</div>'+
                            '</div>';
        $(gradHeader).appendTo("#add-grad-table");
        $.each(results.data, function (i, f) {
            //Separate Grad and Undergrad details in the new JSON
            if (results.data[i].Level == 'grad') {
                manipulateDetailsJSON.grad.push(results.data[i]);
            }
            if (results.data[i].Level == 'ugrad') {
                manipulateDetailsJSON.ugrad.push(results.data[i]);
            }
        });
        //Filter course repetition based on how many times the course is taught
        gradUgradJSON.grad.push(manipulateDetailsJSON.grad.reduce(function (r, a, i) {
            r[a.CourseNo] = r[a.CourseNo] || [];
            r[a.CourseNo].push(a);
            return r;
        }, Object.create(null)));
        gradUgradJSON.ugrad.push(manipulateDetailsJSON.ugrad.reduce(function (r, a, i) {
            r[a.CourseNo] = r[a.CourseNo] || [];
            r[a.CourseNo].push(a);
            return r;
        }, Object.create(null)));


        //console.log(gradUgradJSON);
        //console.log(sortBy(gradUgradJSON, { prop: "Year" }));

        // Using the Final JSON display the HTML dynamically.
        $.each(gradUgradJSON.grad[0], function (key, value) {
            yearArray = [];
            if (value.length > 1) {
                $.each(value, function (i, year) {
                    yearArray[i] = year.Year;
                })
                yearArray = [...new Set(yearArray)].sort();
                yearArray = yearArray.sort(function(a, b){return a-b}).reverse();
                var gradDetail = '<div class="table_row">' +
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Year </div>'+
                                        '<div class="table_cell">'+ yearArray.join(', ') +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Course # </div>'+
                                        '<div class="table_cell">'+ value[0].CourseNo +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Name </div>'+
                                        '<div class="table_cell">'+  value[0].CourseName +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> University </div>'+
                                        '<div class="table_cell">'+ value[0].University +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Times </div>'+
                                        '<div class="table_cell">'+ value.length +'</div>'+
                                    '</div>' +
                                  '</div>';
                $(gradDetail).appendTo("#add-grad-table");
            } else {
                var gradDetail = '<div class="table_row">' +
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Year </div>'+
                                        '<div class="table_cell">'+ value[0].Year +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Course # </div>'+
                                        '<div class="table_cell">'+ value[0].CourseNo +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Name </div>'+
                                        '<div class="table_cell">'+  value[0].CourseName +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> University </div>'+
                                        '<div class="table_cell">'+ value[0].University +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Times </div>'+
                                        '<div class="table_cell">'+ value.length +'</div>'+
                                    '</div>' +
                                '</div>';
                $(gradDetail).appendTo("#add-grad-table");
            }
        });
        $.each(gradUgradJSON.ugrad[0], function (key, value) {
            yearArray = [];
            if (value.length > 1) {
                $.each(value, function (i, year) {
                    yearArray[i] = year.Year;
                })
                yearArray = [...new Set(yearArray)].sort();
                yearArray = yearArray.sort(function(a, b){return a-b}).reverse(); 
                var ugradDetail = '<div class="table_row">' +
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Year </div>'+
                                        '<div class="table_cell">'+ yearArray.join(', ') +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Course # </div>'+
                                        '<div class="table_cell">'+ value[0].CourseNo +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Name </div>'+
                                        '<div class="table_cell">'+  value[0].CourseName +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> University </div>'+
                                        '<div class="table_cell">'+ value[0].University +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Times </div>'+
                                        '<div class="table_cell">'+ value.length +'</div>'+
                                    '</div>' +
                                   '</div>';

                $(ugradDetail).appendTo("#add-ugrad-table");
            } else {
                var ugradDetail = '<div class="table_row">' +
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Year </div>'+
                                        '<div class="table_cell">'+ value[0].Year +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Course # </div>'+
                                        '<div class="table_cell">'+ value[0].CourseNo +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Name </div>'+
                                        '<div class="table_cell">'+  value[0].CourseName +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> University </div>'+
                                        '<div class="table_cell">'+ value[0].University +'</div>'+
                                    '</div>'+
                                    '<div class="table_small">' +
                                        '<div class="table_cell"> Times </div>'+
                                        '<div class="table_cell">'+ value.length +'</div>'+
                                    '</div>'+
                                  '</div>';
                $(ugradDetail).appendTo("#add-ugrad-table");
            }
        });
    }
});

			