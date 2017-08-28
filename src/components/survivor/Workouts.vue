<template>
    <div class="survivor-workouts">
        <topbar></topbar>        
        <div class="body">
            <div v-if="loading == false">
                <vue-event-calendar :events="workouts"></vue-event-calendar>
            </div>
            <div v-else>
                <div class="loader">
                    <p><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import Topbar from './common/Topbar'
import Router from 'vue-router'
import 'vue-event-calendar/dist/style.css'
import vueEventCalendar from 'vue-event-calendar'
import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../../config'
import moment from 'moment'
import { SurvivorMixin } from './mixins'

Vue.use(vueEventCalendar, {locale: 'en'})

export default {
    name: 'SurvivorWorkouts',
    mixins: [SurvivorMixin],
    components: {
        'topbar': Topbar
    },
    data: function(){
        return {
            loading: false,
            workouts: [],
            user: null,
            currentWeek: this.week,
            /*workouts: [{
                date: '2017/12/15',
                title: 'Foo',
                desc: 'longlonglong description'
            },{
                date: '2017/11/12',
                title: 'Bar'
            }]*/
        }
    },
    mounted: function(){
        // Configure Airtable
        Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
        this.base = Airtable.base(AIRTABLE_APP_ID);

        let user = localStorage.getItem('survivorUser')
        if(user != ""){
            user = JSON.parse(user)
            this.user = user
        }

        this.getWorkouts()
    },
    methods: {
        getWorkouts: function(){
            const self = this
            self.loading = true

            let year = moment().format('YYYY');

            let workoutRecords = []

            let promise = new Promise( (resolve,reject) => {

                // Retrive records of first 12 weeks of current year of logged in user
                self.base("Survivor Workouts").select({
                    filterByFormula: 'AND( {Week Number} <= 12 , {Year} = '+ year +', {Participant ID} = "'+ self.user['id']+'"  )'
                }).eachPage(function page(records, fetchNextPage) {
                    if(records.length > 0){
                        records.forEach(function(element) {
                            workoutRecords.push(element)    
                        }, this);
                        fetchNextPage();
                    }else{
                        resolve(true)
                    }
                }, function done(error) {
                    resolve(true)
                });
            }).then((response) => {
                if(workoutRecords.length > 0){
                    self.workouts = []
                    workoutRecords.forEach((item,index)=>{
                        let workoutName = item.get('Workout Name') ? item.get('Workout Name') : 'N/A';
                        let duration = item.get('Total Time');

                        self.workouts.push({
                            date: moment(item.get('Start Time')).format('YYYY/MM/DD'),
                            title: workoutName,
                            desc: 'Duration: '+duration+' mins'
                        });
                    })
                    self.loading = false
                }
            }).catch((error) => {
                console.log("Unable to fetch workouts",error)
                self.loading = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .survivor-workouts{
        min-height: 100vh;
        background: white;

        .loader{
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 300px;
            font-size: 34px;
        }

        .body{
            padding: 15px;
        }
    }
</style>

