import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../../config'

export const YMCAMixin = {
    created: function(){
        const self = this

        // Update current app every 5 mins
        window.setInterval(function(){
            self.updateCurrentApp();
        },300000)        
    },
    methods: {
        updateCurrentApp: function(){
            const self = this

            // Configure Airtable
            Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
            var base = Airtable.base(AIRTABLE_APP_ID);

            var args = {
                view: 'Grid view'
            };

            base("Active Challenge").select(args).eachPage(function page(records, fetchNextPage){
                var active = null
                records.forEach(function(item,index){
                    if(item.fields['Active'] != null){
                        active = item;
                        return;
                    }
                })                
                
                if(active != null){
                    localStorage.setItem("currentApp", JSON.stringify(active._rawJson));
                }
            });
        }
    }
}