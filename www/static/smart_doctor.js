// Patient
// 
//online
var apipath="http://e3.businesssolutionapps.com/smart_doctor/";
var imgPath="http://e3.businesssolutionapps.com/smart_doctor/static/doc_image/";

//local
//var apipath="http://127.0.0.1:8000/smart_doctor/";
//var imgPath="http://127.0.0.1:8000/smart_doctor/static/doc_image/";


var url =''
var latitude="";
var longitude="";

function getLocationInfoAch() {	
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);		
	$(".errorChk").html("Confirming location. Please wait.");
}
// onSuccess Geolocation
function onSuccess(position) {
	$("#q_lat").val(position.coords.latitude);
	$("#q_long").val(position.coords.longitude);
	$(".errorChk").html("Location Confirmed");
}
// onError Callback receives a PositionError object
function onError(error) {
   $("#q_lat").val(0);
   $("#q_long").val(0);
   $(".errorChk").html("Failed to Confirmed Location.");
}

function replace_special_char(string_value){
	var real_value=string_value.replace(/\)/g,'').replace(/\(/g,'').replace(/\$/g,'').replace(/\{/g,'').replace(/\}/g,'').replace(/\[/g,'').replace(/\]/g,'').replace(/\"/g,'').replace(/\'/g,"").replace(/\>/g,'').replace(/\</g,'').replace(/\%/g,'').replace(/\&/g,'').replace(/\#/g,'').replace(/\@/g,'').replace(/\|/g,'').replace(/\//g,"").replace(/\\/g,'').replace(/\~/g,'').replace(/\!/g,'').replace(/\;/g,'');
	return real_value;
}

// -------------

$(document).ready(function(){
		
		$("#btn_reg").show();
		$("#btn_reg_1").hide();
		
		$("#h_user_name").hide();
		
		$("#wait_image_login").hide();
		$("#loginButton").show();		
		
		$("#q_lat").val("");
		$("#q_long").val("");
		
		$("#wait_image_doctor_search").hide();
		$("#wait_image_doctor_list").hide();
		$("#wait_image_doctor_chamber").hide();
		$("#wait_image_profile").hide();	
		$("#btn_profile_update").show();
		$("#btn_sync_location").show();
		
		$(".specialty_show").text("");
		
		
		$(".district_show").text("");
		$("#doctor_area_district").val("");
		$("#doctor_location_cmb_id").val("");
		
		$(".doctor_name_show").text("");
		$(".doctor_id_show").text("");
		
		sync_location();
			
		if (localStorage.user_mobile==undefined){
			url = "#pageHome";
		
		}else{
			
			$("#h_user_name").show();
			$("#btn_reg").hide();
			$("#btn_reg_1").show();
			
			$("#mobile_no").val(localStorage.user_mobile);
			$("#user_id").val(localStorage.user_id);
			$("#user_pass").val(localStorage.user_pass);
			$("#user_name").val(localStorage.user_name);
			$("#h_user_name").html(localStorage.user_name);
			$("#user_address").val(localStorage.user_address);
			
			
							
			$.ajax({
				 type: 'POST',
				 url: apipath+'syncmobile_patient/check_doc_apoinment?patient_mobile='+localStorage.user_mobile,
				 success: function(result) {
					
					var doctorList = result.split('<rd>');
					var doctorListLength=doctorList.length
					
					var doctor_cmb_list=''			
					for (var i=0; i < doctorListLength; i++){
						var doctorListArray = doctorList[i].split('<fd>');
						var doctorID=doctorListArray[0];
						var doctorName=doctorListArray[1];
						var showSpecialty=doctorListArray[2];
						if (doctorID!=''){
							doctor_cmb_list+='<li style="border-bottom-style:solid;border-color:#CBE4E4;border-bottom-width:thin; padding:10px 5px;"><a style="height:auto;" onClick="doctor_chamber(\''+doctorName+'-'+doctorID+'\')">'+doctorName+'-'+doctorID+'</li>';
						}
					}
					
					$(".specialty_show").text(showSpecialty);
					$("#patient_doctor_cmb_id_lv").append(doctor_cmb_list).trigger('create');
				 }
			});			
			url = "#pageHome";	
		}
		$.mobile.navigate(url);		
});


function sync_location(){	
		$.ajax({
			 type: 'POST',
			 url: apipath+'syncmobile_patient/sync_location',
			 success: function(result) {
				 	
				 	var doctorDistrictCombo='';
					var doctorAreaCombo='';
					
					var districtAreaList = result.split('<rd>');
										
					var districtList = districtAreaList[0].split('<fd>');					
					var districtListLength=districtList.length;					
					
					for (var i=0; i < districtListLength; i++){
						var districtName = districtList[i]
						
						if (districtName!=''){
							doctorDistrictCombo+='<li class="ui-btn-icon-left ui-icon-location" onClick="area_list(\''+districtName+'\')" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+districtName+'</li>';
							}		
					}								
					localStorage.districtCombo_list=doctorDistrictCombo;					
					
									
					localStorage.spciltyComboList=districtAreaList[1];
					
			 }
		});		
}
	

function dist_page(specialty_name){	
	/*$("#error_search_list").html("");
	$("#wait_image_doctor_search").hide();
	$("#doctor_location_cmb_id_lv").show();
	$("#btn_sync_location").show();*/
	//alert(localStorage.districtCombo_list);
	//localStorage.district=districtName;	
	if (specialty_name==undefined){
		specialty_name="0";
	}else{
		specialty_name=specialty_name;
		}
	
				
	var docSpeciltyNameCmbo="";
	var docSpciltyList = localStorage.spciltyComboList.split('<fd>');					
	var docSpeciltyListLength=docSpciltyList.length;					
	
	var docSpeciltyNameCmbo='<option value="0" >Any</option>';
	for (var i=0; i < docSpeciltyListLength; i++){
		var docSpeciltyName = docSpciltyList[i];
		if (docSpeciltyName.toUpperCase()==specialty_name.toUpperCase()){
			docSpeciltyNameCmbo+='<option value="'+docSpeciltyName+'" selected="selected" >'+docSpeciltyName+'</option>';
		}else{
			docSpeciltyNameCmbo+='<option value="'+docSpeciltyName+'" >'+docSpeciltyName+'</option>';
			}		
	}								
	
								
	$("#doc_specilty_cmb").append(docSpeciltyNameCmbo).trigger('create');
	
	
	//-------------
	doctor_dist_cmb_list=localStorage.districtCombo_list;	
	doctor_dist_cmb_ob=$('#doctor_district_cmb_id_lv');
	doctor_dist_cmb_ob.empty();
	doctor_dist_cmb_ob.append(localStorage.districtCombo_list);
	

	//--------------------------	
	url = "#page_district";
	$.mobile.navigate(url);
	doctor_dist_cmb_ob.listview("refresh");
	
}


function area_list(districtName){	
	$("#error_search_list").html("");
	$("#wait_image_doctor_search").hide();
	$("#doctor_location_cmb_id_lv").show();
	$("#btn_sync_location").show();
	
	districtName=districtName;
	doc_specialty=$("#doc_specilty_cmb").val();	
	
	$.ajax({
			 type: 'POST',
			 url: apipath+'syncmobile_patient/sync_location_area?district='+districtName+'&specialty='+doc_specialty,
			 success: function(result) {				 	
					//--------------------------													
					var areaList = result.split('<fd>');					
					var districtAreaListLength=areaList.length;					
					var doctorAreaCombo="";					
					for (var i=0; i < districtAreaListLength; i++){
						var districtAreaNameDocCount = areaList[i].split("-");						
						var districtAreaName=districtAreaNameDocCount[0];
						var docCount=districtAreaNameDocCount[1];
						
						if (districtAreaName!=''){
							doctorAreaCombo+='<li class="ui-btn-icon-left ui-icon-location" onClick="doctor_list(\''+districtAreaName+'\')" >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+districtAreaName+'<span class="ui-li-count" >'+docCount+'</span></li>';
							}		
					}															
					localStorage.areaCombo_list=doctorAreaCombo;
					
					
					doctor_location_cmb_list=localStorage.areaCombo_list;	
					doctor_location_cmb_ob=$('#doctor_location_cmb_id_lv');
					doctor_location_cmb_ob.empty();
					doctor_location_cmb_ob.append(doctor_location_cmb_list);
					
										
					if (doc_specialty==0 || doc_specialty=='0'){
						doc_specialty='';
						localStorage.specialty='Any';		
					}else{
						localStorage.specialty=doc_specialty;
					}
					
					localStorage.district=districtName
					
					$(".dist_show").text(localStorage.district);	
					$(".specialty_show").text(localStorage.specialty);
					
					//--------------------------	
					url = "#page_area";
					$.mobile.navigate(url);
					doctor_location_cmb_ob.listview("refresh");					
																						
			 }
		});	
	
}





function doctor_list(districtArea){	
	doc_specialty=$("#doc_specilty_cmb").val();
		
	$("#doctor_location_cmb_id").val(districtArea);	
	var districtAreaName=$("#doctor_location_cmb_id").val();
	
	
	if (districtAreaName==''){		
		$("#error_search_list").text("Search Location");
	}else{
			$("#error_search_list").text("");
			
			$("#doctor_location_cmb_id_lv").hide();
			$("#wait_image_doctor_search").show();
			
			//alert(apipath+'syncmobile_patient/get_doctor_list?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&speciality='+encodeURIComponent(doc_specialty)+'&district='+encodeURIComponent(localStorage.district)+'&district_area='+ encodeURIComponent(districtAreaName) )
			
			// ajax-------
			$.ajax({
				 type: 'POST',
				 url: apipath+'syncmobile_patient/get_doctor_list?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&speciality='+encodeURIComponent(doc_specialty)+'&district='+encodeURIComponent(localStorage.district)+'&district_area='+encodeURIComponent(districtAreaName),
				 success: function(result) {						
						if (result==''){
							$("#error_search_list").html('Network timeout. Please ensure you have active internet connection.');							
							$("#wait_image_doctor_search").hide();
							$("#doctor_location_cmb_id_lv").show();
							
						}else{					
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#error_search_list").html(resultArray[1]);
								$("#wait_image_doctor_search").hide();
								$("#doctor_location_cmb_id_lv").show();
								
							}else if (resultArray[0]=='SUCCESS'){									
								var doctor_string=resultArray[1];																
								//----------------
								var doctorList = doctor_string.split('<rd>');
								var doctorListLength=doctorList.length
								
								var doctor_cmb_list='';								
								for (var i=0; i < doctorListLength; i++){
									var doctorListArray = doctorList[i].split('<fd>');
									var doctorID=doctorListArray[0];
									var doctorName=doctorListArray[1];
									var docImg=doctorListArray[2];
									var docStatus=doctorListArray[3];
									var docExp=doctorListArray[4];
									var description=doctorListArray[5];
									var chemberDist=doctorListArray[6];
									var chemberArea=doctorListArray[7];
									var specialty=doctorListArray[8];
									
									if (docExp=="0"){
										docExp="";
									}else{
										docExp=docExp+" Years Experience.";
									}									
												
									if (doctorID!=''){
										doctor_cmb_list+='<ul data-role="listview" data-inset="true" style="margin-bottom:2px;">';
										if (docImg=="" || docImg=="0"){
											doctor_cmb_list+='<li  data-icon="false" onClick="doctor_chamber(\''+doctorName+'-'+doctorID+'-'+docStatus+'\')"><img src="'+imgPath+'default.png" style="margin:10px;" ><h4  >'+doctorName+'</h4><p>'+chemberDist+','+chemberArea+'</p><p>'+docExp+'</p><p>'+description+'</p><p style="float:right; margin:0px 0px;">'+specialty+'</p></li>';										
										}else{
											doctor_cmb_list+='<li  data-icon="false" onClick="doctor_chamber(\''+doctorName+'-'+doctorID+'-'+docStatus+'\')"><img src="'+imgPath+docImg+'" style="margin:10px;" ><h4 >'+doctorName+'</h4><p>'+chemberDist+','+chemberArea+'</p><p>'+docExp+'</p><p>'+description+'</p><p style="float:right; margin:0px 0px;">'+specialty+'</p></li>';										
										}
										doctor_cmb_list+='</ul>';								
									}									
								}
								 
								//-----------------
								$("#error_search_list").text("");
								$("#wait_image_doctor_search").hide();
								$("#doctor_location_cmb_id_lv").show();
								
								
								$(".specialty_show").text(localStorage.specialty);
								$(".district_show").text(localStorage.district);
								$(".area_show").text(districtAreaName);
								$("#doctor_area_district").val(districtAreaName);
								
								
								//-------------
								$("#doctor_cmb_id").val('');	
								$("#doctor_cmb_id_lv").show();
								
								var doctor_cmb_ob=$('#doctor_cmb_id_lv');
								doctor_cmb_ob.empty()
								doctor_cmb_ob.append(doctor_cmb_list).trigger('create');
								
								//--------------------------	
								url = "#page_doctor";
								$.mobile.navigate(url);	
								doctor_cmb_ob.listview("refresh");
								
							}else{						
								$("#error_search_list").html('Authentication error. Please register and sync to retry.');
								$("#wait_image_doctor_search").hide();
								$("#doctor_location_cmb_id_lv").show();
								}
						}
					  },
				  error: function(result) {				  		
					  $("#error_search_list").html('Invalid Request');
					  $("#wait_image_doctor_search").hide();
					  $("#doctor_location_cmb_id_lv").show();	  
				  }
			 });//end ajax
	}
	
}


function doctor_chamber(doctor){
	$("#doctor_cmb_id").val(doctor);	
	var areaDistrictName=$("#doctor_area_district").val();	
	var doctorNameID=$("#doctor_cmb_id").val();
	
	if (doctorNameID==''){		
		$("#error_doctor_list").text("Select Doctor");
	}else{	
			$("#doctor_cmb_id_lv").hide();			
			$("#error_doctor_list").text("");
			$("#wait_image_doctor_list").show();
			
			var doctorArray=doctorNameID.split('-')
			var doctorName=doctorArray[0]
			var doctorId=doctorArray[1]
			var doctorStatus=doctorArray[2]
			
			$("#doctor_cmb_id").val(doctorName+'-'+doctorId);
		
			$.ajax({
				 type: 'POST',
				 url: apipath+'syncmobile_patient/get_doctor_chamber?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId,
				 success: function(result) {						
						if (result==''){
							$("#error_doctor_list").html('Network timeout. Please ensure you have active internet connection.');							
							$("#wait_image_doctor_list").hide();
							$("#doctor_cmb_id_lv").show();
						}else{					
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#error_doctor_list").html(resultArray[1]);
								$("#wait_image_doctor_list").hide();
								$("#doctor_cmb_id_lv").show();
							}else if (resultArray[0]=='SUCCESS'){
								var chamber_string=resultArray[1];
								//----------------		
								var chamberListArray = chamber_string.split('<rdrdrd>');
								
								var chamber_cmb_list="";								
								for (var i=0; i < chamberListArray.length; i++){
									
									var chamberIdListArray=chamberListArray[i];
									
									var chamberIdListArray = chamberIdListArray.split('<fd>');
									var chamberID=chamberIdListArray[0];
									var chamberName=chamberIdListArray[1];
									var chamberArea=chamberIdListArray[2];
									var chamberDistrict=chamberIdListArray[3];
									var chambersAddress=chamberIdListArray[4];
									var chambersDay=chamberIdListArray[5];									
									var chamberAreaDistrict=chamberDistrict+'-'+chamberArea;
									
									chamber_cmb_list+='<ul data-role="listview" data-inset="false" style="margin-bottom:2px;">';																		
									if (chamberID!=''){											
										var scheduleArray = chambersDay.split('<rd>');										
										scheduleStr='';
										chambersDaySchedule='';
										if (chambersDay!=undefined){
											chambersDaySchedule='<ul data-role="listview" data-inset="true">';
											chambersDaySchedule+='<li style="font-size:12px; background-color:#DDEEF9;">রোগী দেখার সময়</li>';
											for (var j=0; j < scheduleArray.length; j++){
												scheduleStr=scheduleArray[j]											
												dayTimeArray=scheduleStr.split('<rdrd>');
												if (dayTimeArray[1]!=undefined){											
													chambersDaySchedule+='<li style="font-size:12px;">'+dayTimeArray[0]+'-'+dayTimeArray[1]+'</li>';
												}else{
													chambersDaySchedule+='<li style="font-size:12px;"></li>';
													}												
											}
											chambersDaySchedule+='</ul>';
											
											if(chamberID==1){
												chamber_cmb_list+='<li style="background-color:#F2F8FD;"><label ><input type="radio" name="RadioChamber" value="'+chamberID+'" id="radio_'+chamberID+'" checked >'+chamberID+'-'+chamberName+'</label><p>'+chamberDistrict+','+chamberArea+','+chambersAddress+'</p><p>'+chambersDaySchedule+'</p>';
											}else{
												if(areaDistrictName.toUpperCase()==chamberAreaDistrict.toUpperCase()){											
													chamber_cmb_list+='<li style="background-color:#F2F8FD;"><label ><input type="radio" name="RadioChamber" value="'+chamberID+'" id="radio_'+chamberID+'" checked >'+chamberID+'-'+chamberName+'</label><p>'+chamberDistrict+','+chamberArea+','+chambersAddress+'</p><p>'+chambersDaySchedule+'</p>';									
												}else{
													chamber_cmb_list+='<li style="background-color:#F2F8FD;"><label ><input type="radio" name="RadioChamber" value="'+chamberID+'" id="radio_'+chamberID+'" >'+chamberID+'-'+chamberName+'</label><p>'+chamberDistrict+','+chamberArea+','+chambersAddress+'</p><p>'+chambersDaySchedule+'</p>';									
													}
											}
											
										}else{
											chamber_cmb_list+='<li style="background-color:#F2F8FD;"><label ><input type="radio" name="RadioChamber" value="'+chamberID+'" id="radio_'+chamberID+'" >'+chamberID+'-'+chamberName+'</label><p>'+chamberArea+'</p><p>'+chamberDistrict+'</p><p>'+chambersAddress+'</p>';								
											}
									}									
									chamber_cmb_list+='</li>'									
									chamber_cmb_list+='</ul>'	
								}
								//-----------------
								//$("#error_doctor_list").text("");
								$("#wait_image_doctor_list").hide();
								$("#doctor_cmb_id_lv").show();
								$(".doctor_name_show").text(doctorName+'-'+doctorId);
								//$(".doctor_id_show").text(doctorId);
								//-------------
								$("#chamber_cmb_id_div").empty();								
								$("#chamber_cmb_id_div").append(chamber_cmb_list).trigger('create');								
								//---
								
								if (doctorStatus=="ACTIVE" || doctorStatus==undefined ){								
                                                                        $("#appoinment_footer_1").hide();
                                                                        $("#appoinment_footer_2").show();																									
								}else{
									$("#appoinment_footer_1").show();
									$("#appoinment_footer_2").hide();								
								}						
										
								//--------------------------	
								url = "#page_doctor_chamber";
								$.mobile.navigate(url);	
								//chamber_cmb_ob.listview("refresh");																
							}else{						
								$("#error_doctor_list").html('Authentication error. Please register and sync to retry.');
								$("#wait_image_doctor_list").hide();
								$("#doctor_cmb_id_lv").show();
								}
						}
					  },
				  error: function(result) {	
				  	  //$("#error_doctor_list").html(apipath+'syncmobile_patient/get_doctor_chamber?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId)		  
					  $("#error_doctor_list").html('Invalid Request');
					  $("#wait_image_doctor_list").hide();
					  $("#doctor_cmb_id_lv").show();
				  }
			 });//end ajax
	}	
}


function get_login() {
	url = "#login";
	$.mobile.navigate(url);
}


function menuClick(){
	location.reload();		
	url = "#pageHome";	
	$.mobile.navigate(url);	
}

function goBackPage(){	
	$.mobile.back();	
}


//========================= Longin: Check user
function check_user() {
	var mobile_no=$("#mobile_no").val();
	var user_pass=$("#user_pass").val();
	
	var user_name=$("#user_name").val();
	user_name=replace_special_char(user_name)
	
	//var user_address=$("#user_address").val();
	//user_address=replace_special_char(user_address)
	
	var base_url='';
	var photo_url='';
	
	//-----
	if (mobile_no=="" || mobile_no==undefined || user_pass=="" || user_pass==undefined || user_name=="" || user_name==undefined){
		$("#error_login").html("Required Member ID, PIN and Name");	
	}else{
			localStorage.synced='NO'
			$("#wait_image_login").show();
			$("#loginButton").hide();
			$("#error_home_page").html("")
			
			//-----------------
			//alert(apipath+'syncmobile_patient/check_user?mobile_no='+mobile_no+'&password='+encodeURIComponent(user_pass)+'&patient_name='+encodeURIComponent(user_name)+'&sync_code='+localStorage.sync_code);
			
			$.ajax({
					 type: 'POST',
					 url: apipath+'syncmobile_patient/check_user?mobile_no='+mobile_no+'&password='+encodeURIComponent(user_pass)+'&patient_name='+encodeURIComponent(user_name)+'&sync_code='+localStorage.sync_code,
					 success: function(result) {											
							if (result==''){
								$("#wait_image_login").hide();
								$("#loginButton").show();
								$("#error_login").html('Network timeout. Please ensure you have active internet connection.');
								
							}else{
								syncResult=result
																
								var syncResultArray = syncResult.split('<SYNCDATA>');
								//alert (syncResultArray[0]);
								if (syncResultArray[0]=='FAILED'){						
									$("#error_login").html(syncResultArray[1]);
									$("#wait_image_login").hide();
									$("#loginButton").show();
								}else if (syncResultArray[0]=='SUCCESS'){
									
									localStorage.synced='YES';	
									localStorage.user_pass=user_pass;
									localStorage.user_name=user_name;
									
									localStorage.sync_code=syncResultArray[1];
									localStorage.user_mobile=syncResultArray[2];
									
																	
									
									$("#wait_image_login").hide();
									$("#loginButton").show();
									
									
									$("#h_user_name").text(localStorage.user_name);
									$("#h_user_name").show();
									$("#btn_reg").hide();
									$("#btn_reg_1").show();
									//----------------									
									url = "#pageHome";
									$.mobile.navigate(url);								
									
								}else {									
									$("#wait_image_login").hide();
									$("#loginButton").show();									
									$("#error_login").html("Sync Failed. Authorization or Network Error.");									
								}								
							}
						  },
					  error: function(result) {					 
						  $("#wait_image_login").hide();
						  $("#loginButton").show();
						  $("#error_login").html("Sync Failed. Network Error.");		
						
					  }
				  });//end ajax
				}//base url check
	
	}//function



function appointment_submit(submitFrom){	

	var lastAreaDistName=$("#last_district_show").text();
	localStorage.lastAreaDistName=lastAreaDistName
	
	var submitFrom=submitFrom;
	
	$("#error_chamber_list").text("");
	$("#wait_image_doctor_chamber").hide();
	
	$("#error_chamber_details").text("");
	$("#wait_image_doctor_chamber_details").hide();
	
	
	var doctorNameID=$("#doctor_cmb_id").val();
		
	if (doctorNameID==''){		
		$("#error_chamber_list").text("Select Doctor");
	}else{
		var chamberId=''
		if (submitFrom=='MAIN'){		
			chamberId=($("input:radio[name='RadioChamber']:checked").val())
		}else{
			chamberId=$("#doctor_chamber_details_id").val();
		}
		
		if (chamberId=="" || chamberId==undefined){
			$("#error_chamber_list").html("Chamber Required");
			$("#error_chamber_details").html("Chamber Required");			
		}else{
			
			var appointmentDate=''
			if (submitFrom=='MAIN'){		
				appointmentDate=$("#appointment_date").val();
				//appointmentDate=appointmentDate.substring(6,10)+"-"+appointmentDate.substring(3,5)+"-"+appointmentDate.substring(0,2);////Faisal
			}else{
				appointmentDate=$("#appointment_date_chamber_details").val();
			}
			
			var now = new Date();
			var month=now.getUTCMonth()+1;
			if (month<10){
				month="0"+month
				}
			var day=now.getUTCDate();
			if (day<10){
				day="0"+day
				}
				
			var year=now.getUTCFullYear();
			
			var currentDay = new Date(year+ "-" + month + "-" + day);
			
			var appointment_date = new Date(appointmentDate);
			//alert(appointment_date);
			
			if (appointment_date=='Invalid Date'){		
				$("#error_chamber_list").text("Select a date 1");
				$("#error_chamber_details").html("Select a date");			
				
			}else{
				if (appointment_date<currentDay){
					$("#error_chamber_list").text("Previous date not allowed");
					$("#error_chamber_details").html("Previous date not allowed");
				}else{		
					
					if (localStorage.user_mobile==undefined || localStorage.sync_code==undefined ){
						$("#error_chamber_list").text("Required Registration");
					}else{
						
						$("#wait_image_doctor_chamber").show();
						$("#wait_image_doctor_chamber_details").show();
						
						$("#submitButton1").hide();
						$("#submitButton2").hide();
						
						var doctorArray=doctorNameID.split('-')
						var doctorName=doctorArray[0]
						var doctorId=doctorArray[1]
						
						var msg="DR"+doctorId+chamberId+" "+appointmentDate.substring(8,10)+" "+localStorage.user_name;
						
						//alert(appointmentDate.substring(8,10))
						//alert(apipath+"sms_api/sms_submit?password=Compaq510DuoDuo&mob="+localStorage.user_mobile+"&midia=app&msg="+msg)
						
						//url_sms= "http://eapps001.cloudapp.net/smart_doctor/sms_api/sms_submit?password=Compaq510DuoDuo&mob="+str(mob)+"&midia=app&msg="+str(msg)
						//url: apipath+'syncmobile_patient/submit_appointment?patient_id='+localStorage.user_id+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&doctorId='+doctorId+'&chamberId='+chamberId+'&appointmentDate='+appointmentDate,
						
						//alert(apipath+"sms_api/sms_submit?password=Compaq510DuoDuo&mob="+localStorage.user_mobile+"&midia=app&msg="+msg+'&sync_code='+localStorage.sync_code);
										
						// ajax------- 2015-10-20
						//alert(apipath+"sms_api/sms_submit?password=Compaq510DuoDuo&mob="+localStorage.user_mobile+"&media=app&msg="+msg+'&sync_code='+localStorage.sync_code);
						
						$.ajax({
							 type: 'POST',
							 url: apipath+"sms_api/sms_submit?password=Compaq510DuoDuo&mob="+localStorage.user_mobile+"&media=app&msg="+msg+'&sync_code='+localStorage.sync_code,
							 success: function(result) {								
									if (result==''){
										result_string='Network timeout. Please ensure you have active internet connection.'
										
										$("#error_chamber_list").html(result_string);							
										$("#wait_image_doctor_chamber").hide();
										
										$("#error_chamber_details").html(result_string);							
										$("#wait_image_doctor_chamber_details").hide();
										
										$("#submitButton1").show();
										$("#submitButton2").show();
										
									}else{
										var resultArray = result.split('.');	
										var result_string=""		
										if (resultArray[0]=='STARTFailed'){
											result_string='Authentication error. Please register and sync to retry.';
											
											$("#error_chamber_list").html(result_string);
											$("#wait_image_doctor_chamber").hide();
											
											$("#error_chamber_details").html(result_string);							
											$("#wait_image_doctor_chamber_details").hide();
											
											$("#submitButton1").show();
											$("#submitButton2").show();
								  
										}else if (resultArray[0]=='STARTSuccess'){										
											result_string=result.replace("STARTSuccess.","")										
											
											$("#wait_image_doctor_chamber").hide();															
											$("#wait_image_doctor_chamber_details").hide();									
											$("#success_message").html('</br></br>'+result_string);
											
											//--------------------------	
											
											$("#submitButton1").show();
											$("#submitButton2").show();
		
											url = "#page_success";
											
											$.mobile.navigate(url);	
											
										}else{
											result_string='Authentication error. Please register and sync to retry.'					
											$("#error_chamber_list").html(result_string);
											$("#wait_image_doctor_chamber").hide();
											
											$("#error_chamber_details").html(result_string);							
											$("#wait_image_doctor_chamber_details").hide();
											
											$("#submitButton1").show();
											$("#submitButton2").show();
											
											}
									}
								  },
							  error: function(result) {			  
								  $("#error_chamber_list").html('Invalid Request');
								  $("#wait_image_doctor_chamber").hide();
								  
								  $("#error_chamber_details").html('Invalid Request');							
								  $("#wait_image_doctor_chamber_details").hide();
								  
								  $("#submitButton1").show();
								  $("#submitButton2").show();
											  
							  }
						 });//end ajax
					}
				}
			}
		}
	}
}



function get_my_appoinment(){	
		var my_appoinment_list='';		
		if (localStorage.user_mobile==undefined){
			$("#error_appointment_list").html("Required Registration");		
		}else{
				
			$.ajax({
				 type: 'POST',
				 url: apipath+'syncmobile_patient/check_my_apoinment?patient_mobile='+localStorage.user_mobile,
				 success: function(result) {														
						var appoinmentList = result.split('<rd>');
						var appoinmentListLength=appoinmentList.length
							
						for (var i=0; i <=appoinmentListLength; i++){
							var appoinmentListArray = appoinmentList[i].split('<fd>');
							var appDoctorID=appoinmentListArray[0];
							var appDoctorName=appoinmentListArray[1];
							var appDoctorImage=appoinmentListArray[2];
							var appDocSpecialty=appoinmentListArray[3];
							var appDocNotes=appoinmentListArray[4];
							var appDocChemberName=appoinmentListArray[5];
							var appDocChemberAdd=appoinmentListArray[6];
							var appTime=appoinmentListArray[7];
							var appSlNo=appoinmentListArray[8];
							
							if (appDoctorID=="undefined" || appDoctorID==""){
								$("#error_appointment_list").html("");
							}else{												
								my_appoinment_list+='<ul data-role="listview" data-inset="true" style="margin-bottom:2px;">';
								if (appDoctorImage=="" || appDoctorImage=="0"){
									my_appoinment_list+='<li data-icon="false" ><img src="'+imgPath+'default.png" style="margin:10px;" ><h3>'+appDoctorName+'</h3><h4>'+appDocChemberName+'</h4><p>'+appDocChemberAdd+'</p><p>'+appDocNotes+'</p><li style="font-size:12px;">'+appTime+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Serial No	:'+appSlNo+'</li></li>';										
								}else{
									my_appoinment_list+='<li data-icon="false" ><img src="'+imgPath+appDoctorImage+'" style="margin:10px;" ><h3>'+appDoctorName+'</h3><h4>'+appDocChemberName+'</h4><p>'+appDocChemberAdd+'</p><p>'+appDocNotes+'</p><li style="font-size:12px;">'+appTime+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Serial No	:'+appSlNo+'</li></li>';										
								}
								my_appoinment_list+='</ul>';
																										
								
								$("#my_appoinment_div").empty();								
								$("#my_appoinment_div").html(my_appoinment_list).trigger('create');
							}
													
						}												
					}				
			});
		}
		url = "#page_my_appoinment";
		$.mobile.navigate(url);	
	}



function get_profile(){
	$("#error_home_page").html("")
	$("#error_profile_edit").html("")	
	$("#wait_image_profile").hide();	 
	$("#btn_profile_update").show();
	
	//var patientID=localStorage.user_id
	var patient_mobile=localStorage.user_mobile
	var patient_name=localStorage.user_name
	var patient_address=localStorage.user_address
	
	if ( patient_mobile=='' || patient_mobile=='undefined' || patient_mobile==undefined || patient_name=='' || patient_name==undefined){
		$("#error_home_page").html("Required Registration")
	}else{
		
		//$("#patient_id").val(patientID);
		$("#patient_mobile").val(patient_mobile);		
		$("#patient_name").val(patient_name);
		
		$("#patient_address").val(patient_address);
		
		
		//--------------------------	
		url = "#page_profile";
		$.mobile.navigate(url);	
				
			  
	
	}
}

function profile_edit(){	
	$("#error_profile_edit").html("")
		
	$("#wait_image_profile").hide();
	$("#btn_profile_update").show();
	
	var patient_mobile=localStorage.user_mobile
	
	if (patient_mobile==''|| patient_mobile==undefined){
		$("#error_profile_edit").html("Required Registration")
	}else{
		
		$("#wait_image_profile").show();
		$("#btn_profile_update").hide();
		
		var patient_name=$("#patient_name").val();
		patient_name=replace_special_char(patient_name)
		
		var patient_mobile=$("#patient_mobile").val();
		
		var patient_address=$("#patient_address").val();
		patient_address=replace_special_char(patient_address)
		
		if (patient_name==''){
			$("#error_profile_edit").html("Required Profile Name")
		}else{
			
			//alert(apipath+'syncmobile_patient/patient_profile_edit?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&patient_name='+encodeURIComponent(patient_name)+'&patient_address='+encodeURIComponent(patient_address))							
			
			$.ajax({
				 type: 'POST',
				 url: apipath+'syncmobile_patient/patient_profile_edit?patient_mobile='+localStorage.user_mobile+'&password='+encodeURIComponent(localStorage.user_pass)+'&sync_code='+localStorage.sync_code+'&patient_name='+encodeURIComponent(patient_name)+'&patient_address='+encodeURIComponent(patient_address),
				 success: function(result) {						
						if (result==''){
							$("#error_profile_edit").html('Network timeout. Please ensure you have active internet connection.');
							$("#wait_image_profile").hide();
							
						}else{
							var resultArray = result.split('<SYNCDATA>');			
							if (resultArray[0]=='FAILED'){						
								$("#error_profile_edit").html(resultArray[1]);
								$("#wait_image_profile").hide();
							}else if (resultArray[0]=='SUCCESS'){
								
								var result_string=resultArray[1];
								
								localStorage.user_name=patient_name;
								localStorage.user_address=patient_address;
								
								$("#patient_name").val(localStorage.user_name);
								$("#patient_address").val(localStorage.user_address);
								
								$("#user_name").val(localStorage.user_name);
								$("#user_address").val(localStorage.user_address);
								
								$("#error_profile_edit").html(result_string);
								$("#wait_image_profile").hide();
								//$("#btn_profile_update").hide();
								
								//--------------------------
								url = "#page_profile";
								$.mobile.navigate(url);	
								
							}else{						
								$("#error_profile_edit").html('Authentication error. Please register and sync to retry.');
								$("#wait_image_profile").hide();
								}
						}
					  },
				  error: function(result) {				  	 
					  $("#error_profile_edit").html('Invalid Request'); 
					  $("#wait_image_profile").hide();
				  }
				  });//end ajax
		}
	}
}

//---------------------- Exit Application
function exit() {	
	navigator.app.exitApp();
}
