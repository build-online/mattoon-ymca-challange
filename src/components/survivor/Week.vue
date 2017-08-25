<template>
    <div class="survivor-week">
        <div class="week-row">            
            <div class="current-week">
                <button type="button" class="btn-week previous"><i class="fa fa-caret-left" aria-hidden="true"></i></button>
                <span class="text">Week <span>{{ currentWeek }}</span></span>
                <button type="button" class="btn-week next"><i class="fa fa-caret-right" aria-hidden="true"></i></button>
            </div>
            <div class="calendar">
                <button type="button" class="btn-calendar"><i class="fa fa-calendar" aria-hidden="true"></i></button>                
            </div>
            <div class="clearfix"></div>
        </div>        
        <p class="today">{{ today }}</p>
        <div class="points">
            <ul>
                <li><strong>Points Goal: </strong> <span>{{ pointsGoal }}</span></li>
                <li><strong>Points Earned: </strong> <span>{{ pointsEarned }}</span></li>
            </ul>
        </div>
        <div class="coupons">
            <ul>
                <li>Coupons Remaining: </li>
                <li>2</li>
            </ul>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../../config'
import { ADULT_WEEKS_POINTS } from './WeekConfig'
import { SurvivorMixin } from './mixins'

export default {
    name: 'SurvivorWeek',
    mixins: [SurvivorMixin],
    data: function(){
        return {
            currentWeek: this.week,
            pointsEarned: 0,
            base: null
        }
    },
    mounted: function(){
        this.initialize()
    },    
    computed: {
        today: function(){
            return moment().format('dddd, MMMM DD');
        },

        pointsGoal: function(){
            if(this.currentWeek <= 12)
                return ADULT_WEEKS_POINTS[ this.currentWeek - 1 ]
            return '-'
        },

        user: function(){
            let user = localStorage.getItem('survivorUser')
            if(user != ""){
                user = JSON.parse(user)
            }else{
                user = null
            }
            return user
        },

        week: function(){
            return this.getCurrentWeekNumber();
        }
    },
    methods: {
        initialize: function(){
            // Configure Airtable
            Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
            this.base = Airtable.base(AIRTABLE_APP_ID);            

            this.currentWeek = this.week

            this.getUsersPoint()
        },

        /* 
         * Retrive user's current week points
        */
        getUsersPoint(){
            const self = this

            let year = moment().format('YYYY');
            // get week start date
            let start_date = moment().day("Monday").year(year).week(self.currentWeek).format('YYYY-MM-DD');
            let end_date = moment().day("Monday").year(year).week(self.currentWeek).add(7,'days').format('YYYY-MM-DD');

            let workoutRecords = [];

            var promise = new Promise(function(resolve,reject){
                self.base("Survivor Workouts").select({
                    filterByFormula: 'AND( {Start Time} >= DATETIME_PARSE("'+start_date+'"), {Start Time} <= DATETIME_PARSE("'+end_date+'"), {Participant ID} = "'+ self.user['id']+'" )'
                }).eachPage(function page(records, fetchNextPage) {
                    if(records){
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
            }).then(function(response){
                if(response == true){
                    //self.pointsEarned = workoutRecords.length
                }
            })
        }
    }
}
</script>
<style scoped lang="scss">
    .survivor-week{
        margin: 15px 0;

        .clearfix{
            clear: both;
        }

        .week-row{
            display: flex;
            align-items: center;

            .current-week{
                
                .btn-week{
                    background: transparent;
                    color: #C4C4C4;
                    outline-width: 0;
                    font-size: 28px;
                }

                .text{
                    color: #0160AE;
                    font-weight: bold;
                    font-size: 24px;
                    margin: 0 10px;
                    vertical-align: middle;                    
                }
                
            }

            .calendar{
                margin-left: auto;

                .btn-calendar{
                    background: transparent;
                    color: #0160AE;
                    font-size: 28px;
                    outline-width: 0;
                }
            }
        }

        .today{
            font-weight: bold;
            color: #A43078;
            text-align: center;
            font-size: 20px;
        }

        .points{

            ul{
                list-style: none;
                margin: 0;
                padding: 0;
                text-align: center;

                li{
                    margin-bottom: 15px;
                    font-size: 18px;
                    vertical-align: middle;                    

                    span{
                        font-size: 28px;
                        display: inline-block;
                        margin-left: 10px;
                        vertical-align: middle;
                        font-weight: bold;
                        color: #A43078;
                    }
                }
            }
        }

        .coupons{
            background: #007EB5;
            margin: 30px 0;

            ul{
                list-style: none;
                margin: 0;
                padding: 0;
                display: flex;

                li{
                    display: inline-block;                    
                    padding: 15px;
                    color: white;
                    font-weight: bold;
                    line-height: 28px;
                    text-align: center;
                    
                    &:last-child{
                        margin-left: auto;
                        width: 80px;
                        text-align: center;
                        background: #A43078;
                        font-size: 28px;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
</style>