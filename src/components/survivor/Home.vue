<template>
    <div class="survivor-home">
        <topbar></topbar>
        <motivation-section :user="user" v-if="user"></motivation-section>
        <div class="checkin-button-wrapper" v-if="!checkedIn">
            <button type="button" @click="checkIn" :disabled="loading"><i class="fa fa-clock-o" aria-hidden="true"></i> Check In</button>
        </div>
        <div class="checkout-button-wrapper" v-if="checkedIn">
            <button type="button" @click="checkOut" :disabled="loading"><i class="fa fa-clock-o" aria-hidden="true"></i> Check Out</button>
        </div>
    </div>
</template>

<script>
import moment from 'moment'
import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../../config'
import Topbar from './common/Topbar'
import MotivationSection from './common/MotivationSection'
import { SurvivorMixin } from './mixins'

export default {
    name: 'SurvivorHome',
    mixins: [SurvivorMixin],
    components:{
        'topbar': Topbar,
        'motivation-section': MotivationSection
    },
    data: function(){
        return {
            base: null,
            user: null,
            loading: false,
            checkedIn: false,
        }
    },
    mounted: function(){
        this.initialize();
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
        },

        /* 
         * Check Out
        */
        checkOut: function(){
            const self = this
            self.loading = true
            let workoutRecord = JSON.parse(localStorage.getItem("survivorWorkout"))            
            this.base("Survivor Workouts").update(workoutRecord['id'],{
                'End Time': moment().format('YYYY-MM-DDTHH:mm:ss.000Z')
            },function(error,record){
                self.loading = false
                if(error){
                    alert("Unable to clock out.");
                    console.log(error)                    
                }
                localStorage.setItem('survivorWorkout',"")
                self.checkedIn =  false
                alert("Checked Out Successfully.")
            })
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

                &:disabled{
                    background: #bfd2da;
                }
            }
        }
    }
</style>

