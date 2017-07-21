import Vue from 'vue'
import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from './config'

// Configure Airtable
Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
const base = Airtable.base(AIRTABLE_APP_ID);

export default {
	login(participant,pin){
		return new Promise(function(resolve,reject){
			var args = {
				view: 'Grid view',        
				filterByFormula: "AND({Pin} = '"+pin+"',RECORD_ID() = '"+participant+"')",
				fields: ['Name','First Name','Last Name','Phone','email','Notes']
			};
			base("Participants").select(args).eachPage(function page(records, fetchNextPage){
				if(records.length > 0){
					/* Logged in */

					// Set user to localstorage
					const user = records[0];
					localStorage.setItem("user", JSON.stringify(user._rawJson));

					resolve(true);
				}else{
					resolve(false);
				}
			});
		});
	},
	userLoggedIn(){
		var user = localStorage.getItem("user")
		if(user != null){
			return user;
		}
		return false;
	},

	logout(){
		localStorage.removeItem("user");
	}

};