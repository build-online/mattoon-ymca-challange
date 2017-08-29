<template>
    <div class="survivor-home">
        <topbar></topbar>
        <motivation-section :user="user" v-if="user"></motivation-section>
        <week :base="base" :week="getCurrentWeekNumber()" :user="user"></week>
        <div v-if="buttonLoading == false">
            <div class="checkin-button-wrapper" v-if="!checkedIn">
                <button type="button" @click="checkIn" :disabled="loading"><i class="fa fa-clock-o" aria-hidden="true"></i> Check In</button>
            </div>        
            <div class="checkout-button-wrapper" v-if="checkedIn">
                <button type="button" @click="checkOut" :disabled="loading"><i class="fa fa-clock-o" aria-hidden="true"></i> Check Out</button>
            </div>
        </div>
        <checkout-modal :workout-item="getWorkoutItem()" :base="base" :show="showCheckoutModal" @close="showCheckoutModal = false"></checkout-modal>
    </div>
</template>

<script>
import moment from 'moment'
import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../../config'
import Bus from '../../Bus'
import Topbar from './common/Topbar'
import MotivationSection from './common/MotivationSection'
import { SurvivorMixin } from './mixins'
import CheckoutModal from './CheckoutModal'
import YMCALocations from './YMCALocations'
import Week from './Week'
import Router from 'vue-router'

export default {
    name: 'SurvivorHome',
    mixins: [SurvivorMixin],
    components:{
        'topbar': Topbar,
        'motivation-section': MotivationSection,
        'week': Week,
        CheckoutModal
    },
    data: function(){
        return {
            base: null,
            user: null,
            loading: false,
            buttonLoading: true, // Show button only after coupon data availabe
            checkedIn: false,
            showCheckoutModal: false
        }
    },
    mounted: function(){
        this.initialize();
    },
    created: function(){
        const self = this
        Bus.$on("workoutCheckedOut",this.checkedOut);

        // Show button only after coupon data availabe
        Bus.$on("couponsPopulating",function(){
            self.buttonLoading = true
        });

        Bus.$on("couponsPopulated",function(couponsRemaining){
            self.buttonLoading = false

            let currentWeek = self.getCurrentWeekNumber()

            // Show sorry screen
            if(couponsRemaining <= 0 && currentWeek <= 12){
                const router = new Router();
                router.push('/survivor/sorry');
            }

            // Show sorry screen
            if(couponsRemaining <= 0 && currentWeek > 12){
                const router = new Router();
                router.push('/survivor/sorry');
            }

            // Show congratulations screen
            if(currentWeek > 12 && couponsRemaining > 0){
                const router = new Router();
                router.push('/survivor/congratulations');
            }
        });

        // Check if user left YMCA after Check In
        setInterval(function(){
            self.checkUserLeftYMCALocation();
        }, 60 * 1000)
    },
    computed: {      

    },
    methods: {
        initialize: function(){
            // Configure Airtable
    		Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
            this.base = Airtable.base(AIRTABLE_APP_ID);
            
            let user = localStorage.getItem('survivorUser')
            if(user != ""){
                user = JSON.parse(user)
                this.user = user
            }

            // Set checkedIn
            this.checkedIn = localStorage.getItem('survivorWorkout') != null && localStorage.getItem('survivorWorkout') != "" ? true : false;
        },

        /* 
         * Check In
        */
        checkIn: function(){
            const self = this
            if(this.checkIfUserAtYMCALocation()){
                self.loading = true
                this.base("Survivor Workouts").create({
                    'Participants': [self.user['id']],
                    'Start Time': moment().format('YYYY-MM-DDTHH:mm:ss.000Z')
                },function(error,record){
                    self.loading = false
                    if(error){
                        alert("Unable to create workout.");
                        console.log(error)                    
                    }
                    localStorage.setItem('survivorWorkout',JSON.stringify(record['_rawJson']))
                    self.checkedIn =  true
                    alert("Workout Created.")
                })
            }else{
                alert("It looks like you aren’t at the YMCA. You have to be at a YMCA location to record a workout.")
            }
            
        },

        /* 
         * Check Out
        */
        checkOut: function(){
            this.showCheckoutModal = true;            
        },

        getWorkoutItem(){
            let workoutJSON = localStorage.getItem('survivorWorkout');
            if(workoutJSON){
                return JSON.parse(workoutJSON)
            }   
            return null;
        },

        checkedOut: function(){
            this.checkedIn = false
        },

        /* 
         * Function will check user is at YMCA or not
        */
        checkIfUserAtYMCALocation(){

            let rad = function(x) {
                return x * Math.PI / 180;
            };

            let calculateDistance = function(p1,p2){
                var R = 6378137; // Earth’s mean radius in meter
                var dLat = rad(p2.latitude - p1.latitude);
                var dLong = rad(p2.longitude - p1.longitude);
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.longitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                return d; // returns the distance in meter
            }

            // retrive user current location
            let userLocation = localStorage.getItem('survivorLocation')
            if(userLocation){
                userLocation = JSON.parse(userLocation)

                var flag = false
                YMCALocations.forEach(function(item){
                    let distance = calculateDistance(userLocation,item);
                    if(distance <= 200){
                        flag = true
                    }
                });

                return flag                
            }
            return false;
        },

        /* 
         * Function will check user left YMCA Location
        */
        checkUserLeftYMCALocation(){
            if(this.checkedIn && !this.checkIfUserAtYMCALocation()){

                const self = this

                // Checkout user
                let workoutRecord = this.getWorkoutItem()

                this.base("Survivor Workouts").update(workoutRecord['id'],{
                    'End Time': moment().format('YYYY-MM-DDTHH:mm:ss.000Z')
                },function(error,record){
                    if(error){
                        console.log(error)                    
                    }

                    localStorage.setItem('survivorWorkout',"")
                    self.checkedIn = false       
                })

                alert("It looks like you have left the YMCA.")
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .survivor-home{
        background: white;
        min-height: 100vh;

        .checkin-button-wrapper{
            text-align: center;
            margin: 15px 0;

            button{
                display: inline-block;
                font-size: 20px;
                padding: 15px 25px;

                &:disabled{
                    background: #bfd2da;
                }
            }
        }

        .checkout-button-wrapper{
            text-align: center;
            margin: 15px 0;

            button{
                display: inline-block;
                font-size: 20px;
                padding: 15px 25px;
                background: #A43078;

                &:disabled{
                    background: #bfd2da;
                }
            }
        }
    }
</style>

