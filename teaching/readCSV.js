/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.ajax("teaching_ugrad_grad.csv", {
    success: function (data) {
        var jsonobject = csvjson.csv2json(data);
        // Now use jsonobject to do some charting...
        //console.log(jsonobject);
        var data = jsonobject.rows;
        (data);

    },
    error: function () {
        console.log("error")
    }
});