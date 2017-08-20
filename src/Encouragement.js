import Vue from 'vue'
import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from './config'

// Configure Airtable
Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
const base = Airtable.base(AIRTABLE_APP_ID);

export default{
	/* 
	 * Get user encouragement information from airtable
	*/
	loadEncouragement: function(participant){
		return new Promise(function(resolve,reject){
			var args = {
				view: 'Grid view',        
				filterByFormula: "RECORD_ID() = '"+participant+"'",
				fields: ['Encouraged','Total Percentage'],
				pageSize: 1,
			};
			base("Participants").select(args).eachPage(function page(records, fetchNextPage){
				var encouragement = {
					'encouraged': false,
					'percentage': 0
				};
				var user = localStorage.getItem("user");
				user = JSON.parse(user)

				if(records.length > 0){
					var record = records[0];					
					encouragement['encouraged'] = record._rawJson.fields['Encouraged'] ? (record._rawJson.fields['Encouraged'] >= 1? true: false) : false;
					encouragement['percentage'] = record._rawJson.fields['Total Percentage'] ? record._rawJson.fields['Total Percentage'] : 0;				
				}

				user['encouragement'] = encouragement;
				localStorage.setItem("user", JSON.stringify(user));
				resolve(user['encouragement']);
			});
		});
	},

	/* 
	 * Retrive user encouragement information form localstorage
	*/
	getEncouragement: function(){
		var encouragement = {
			'encouraged': false,
			'percentage': 0
		};
		var user = localStorage.getItem("user");
		user = JSON.parse(user);

		if(user['encouragement'] != null){
			return user['encouragement'];
		}else{
			return encouragement;
		}
	},

	/* 
	 * Set user encouraged to true
	*/
	updateUserEncouragement: function(participant){
		return new Promise(function(resolve,reject){
			var data = {
				'Encouraged': 1
			};
			base("Participants").update(participant,data,function(err,record){
				if (err) { 
					reject(err);
				}

				// Update localstorage encouragment information
				var user = localStorage.getItem("user");
				user = JSON.parse(user);
				user['encouragement']['encouraged'] = true;
				localStorage.setItem("user", JSON.stringify(user));

				resolve(record)
			});	
		});
	}
}