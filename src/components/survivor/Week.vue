<template>
    <div class="survivor-week">
        <div v-if="!loading">
            <div class="week-row">
                <div class="current-week">
                    <button @click="prevWeek" type="button" class="btn-week previous"><i class="fa fa-caret-left" aria-hidden="true"></i></button>
                    <span class="text">Week <span>{{ challangeWeek }} <span v-if="(challangeStartWeek + challangeWeek - 1) == currentWeek">*</span></span></span>
                    <button @click="nextWeek" type="button" class="btn-week next"><i class="fa fa-caret-right" aria-hidden="true"></i></button>
                </div>
                <div class="calendar">
                    <button @click="navigateToWorkout" type="button" class="btn-calendar"><i class="fa fa-calendar" aria-hidden="true"></i></button>
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
                    <li>{{ couponsRemaining }}</li>
                </ul>
            </div>
        </div>
        <div v-else>
            <div class="loader">
                <p><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></p>
            </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../../config'
import Bus from '../../Bus'
import { ADULT_WEEKS_POINTS, TOTAL_COUPONS } from './WeekConfig'
import { SurvivorMixin } from './mixins'

export default {
    name: 'SurvivorWeek',
    mixins: [SurvivorMixin],
    data: function(){
        return {
            currentWeek: this.week,
            challangeStartWeek: this.getStartWeekNumber(),
            currentchallangeWeek: this.getChallangeWeekNumber(),
            challangeWeek: this.getChallangeWeekNumber(),
            pointsEarned: 0,
            base: null,
            couponsRemaining: null,
            loading: false
        }
    },
    mounted: function(){
        this.initialize()
    },
    created: function(){
    },
    computed: {
        today: function(){
            return moment().format('dddd, MMMM DD');
        },

        pointsGoal: function(){
            if(this.challangeWeek <= 12)
                return ADULT_WEEKS_POINTS[ this.challangeWeek - 1 ]
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
        },
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
            let week = (self.challangeStartWeek+self.challangeWeek -1);
            let start_date = moment().day("Monday").year(year).week(week).format('YYYY-MM-DD');
            let end_date = moment().day("Monday").year(year).week(week).add(7,'days').format('YYYY-MM-DD');

            let workoutRecords = [];

            this.loading = true
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

                    // Calculate points
                    let totalMinutes = 0
                    let totalPointsEarned = 0

                    workoutRecords.forEach(function(item){
                        if(item['fields']['Total Time'] != null && !isNaN(item['fields']['Total Time'])){
                            totalMinutes += item['fields']['Total Time'];
                        }
                    })

                    if(totalMinutes > 0){
                        totalPointsEarned = Math.trunc(totalMinutes / 30)
                    }
                    self.pointsEarned = totalPointsEarned

                    self.getCouponsRemaining()

                }
                self.loading = false;
            }).catch(function(error){
                self.loading = false;
            })
        },

        nextWeek(){
            if(this.challangeWeek < 12){
                this.challangeWeek += 1;

                this.getUsersPoint();
            }
        },

        prevWeek(){
            if(this.challangeWeek > 1){
                this.challangeWeek -= 1;

                this.getUsersPoint();
            }
        },

        getCouponsRemaining(){
            const self = this;

            let year = moment().format('YYYY');
            let couponRecords = []

            self.loading = true
            Bus.$emit("couponsPopulating")
            let promise = new Promise( (resolve,reject) => {
                self.base("Survivor Workouts").select({
                    filterByFormula: 'AND( {Week Number} >= '+ self.challangeStartWeek +',{Week Number} < '+ self.currentWeek +', {Year} = '+ year +', {Participant ID} = "'+ self.user['id']+'"  )'
                }).eachPage(function page(records, fetchNextPage) {
                    if(records.length > 0){
                        records.forEach(function(element) {
                            couponRecords.push(element)
                        }, this);
                        fetchNextPage();
                    }else{
                        resolve(true)
                    }
                }, function done(error) {
                    resolve(true)
                });
            }).then((response)=>{
                let totalCoupons = TOTAL_COUPONS

                if(self.currentchallangeWeek != 1){

                    // Calculate points remaining
                    ADULT_WEEKS_POINTS.forEach(function(item,index){
                        let week = index + 1;
                        let goal = item;

                        if(week < self.currentchallangeWeek){
                            // User points of week: let = week
                            let weekRecords = couponRecords.filter(function(element){
                                if(element.get("Week Number") == week){
                                    return element
                                }
                            })


                            // Loop through current week records to Retrive workout in minutes from server
                            let totalMinutes = 0

                            weekRecords.forEach(function(element){

                                if(element.get("Week Number") == week){
                                    totalMinutes += element.get("Total Time")
                                }

                            })

                            // Calculate points from minutes
                            let totalWeekPoints = 0
                            if(totalMinutes > 0)
                                totalWeekPoints = Math.trunc(totalMinutes / 30)

                            // Deduct points to coupons if user did less workout then expected goal
                            let totalConsumed = 0
                            if(totalWeekPoints < goal){
                                totalConsumed = goal - totalWeekPoints
                                totalCoupons -= totalConsumed
                            }

                            /*
                            console.log("Week: "+week);
                            console.log("Records Found: "+weekRecords.length);
                            console.log("Total Minutes: "+totalMinutes);
                            console.log("Total Week Points: "+totalWeekPoints);
                            console.log("Copons: "+totalCoupons);
                            console.log("Copons Consumed: "+totalConsumed);
                            */

                        }

                    })
                }

                self.couponsRemaining = totalCoupons
                Bus.$emit("couponsPopulated",totalCoupons)
                self.loading = false
            }).catch((error)=>{
                console.log(error)
                self.loading = false
            });

        },

        navigateToWorkout(){
            this.$router.push('/survivor/workouts');
        }
    }
}
</script>
<style scoped lang="scss">
    .survivor-week{
        margin: 15px 0;

        .loader{
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 300px;
            font-size: 34px;
        }

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
                    color: #01a490;
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
            color: #f47920;
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
                        color: #f47920;
                    }
                }
            }
        }

        .coupons{
            background: #01a490;
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
                        background: #f47920;
                        font-size: 28px;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
</style>