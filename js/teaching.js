//Maintaining two JSON one for final result and one to sort ugrad and grad.
		var manipulateDetailsJSON ={grad:[], ugrad:[]}; 
		var gradUgradJSON ={grad:[], ugrad:[]};
		
			// Parse the CSV file using PapaParse library all the dynamic functions are written inside complete callback method
			Papa.parse("\teaching/teaching_ugrad_grad.csv", {
				download: true,
				header: true,
				skipEmptyLines: true,
				complete: function(results) {
					$.each(results.data, function(i, f) {
						//Separate Grad and Undergrad details in the new JSON
						if(results.data[i].Level =='grad') {
							manipulateDetailsJSON.grad.push(results.data[i]);	
						}
						if(results.data[i].Level =='ugrad') {
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
					
					// Using the Final JSON display the HTML dynamically.
					$.each(gradUgradJSON.grad[0], function( key, value) {
						yearArray =[];
						if(value.length> 1){
							$.each(value, function(i, year) {
								yearArray[i] = year.Year;
							})
							yearArray = [...new Set(yearArray)].sort();
							var gradDetail = '<div class="row">'+
												'<div class="col-md-2">'+yearArray+'</div>'+
												'<div class="col-md-2">'+value[0].CourseNo+'</div>'+
												'<div class="col-md-3">'+value[0].CourseName+'</div>'+
												'<div class="col-md-3">'+value[0].University+'</div>'+
												'<div class="col-md-2">'+value.length+'</div> </div>';
							$(gradDetail).appendTo("#add-grad-details");
						} 
						else {
							var gradDetail = '<div class="row">'+
												'<div class="col-md-2">'+value[0].Year+'</div>'+
												'<div class="col-md-2">'+value[0].CourseNo+'</div>'+
												'<div class="col-md-3">'+value[0].CourseName+'</div>'+
												'<div class="col-md-3">'+value[0].University+'</div>'+
												'<div class="col-md-2">'+value.length+'</div> </div>';
							$(gradDetail).appendTo("#add-grad-details");
						}						
					});
					$.each(gradUgradJSON.ugrad[0], function( key, value) {
						yearArray =[];
						if(value.length> 1){
							$.each(value, function(i, year) {
								yearArray[i] = year.Year;
							})
							yearArray = [...new Set(yearArray)].sort();
							var ugradDetail = '<div class="row">'+
												'<div class="col-md-2">'+yearArray+'</div>'+
												'<div class="col-md-2">'+value[0].CourseNo+'</div>'+
												'<div class="col-md-3">'+value[0].CourseName+'</div>'+
												'<div class="col-md-3">'+value[0].University+'</div>'+
												'<div class="col-md-2">'+value.length+'</div> </div>';
							$(ugradDetail).appendTo("#add-ugrad-details");
						} 
						else {
							var ugradDetail = '<div class="row">'+
												'<div class="col-md-2">'+value[0].Year+'</div>'+
												'<div class="col-md-2">'+value[0].CourseNo+'</div>'+
												'<div class="col-md-3">'+value[0].CourseName+'</div>'+
												'<div class="col-md-3">'+value[0].University+'</div>'+
												'<div class="col-md-2">'+value.length+'</div> </div>';
							$(ugradDetail).appendTo("#add-ugrad-details");
						}						
					});
				}
			});
			
			