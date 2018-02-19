<template>
    <div class="survivor-sorry">
        <topbar></topbar>
        <div class="survivor-sorry-body">
            <h1 class="heading">Don't Stop Now</h1>
            <p class="content">Don’t stop now! Unfortunately you have not successfully completed the requirements to continue in the Survivor program. We are proud of the progress you have made and encourage you to keep moving forward. Keep updated on our next program by checking our Facebook page.</p>
            <button class="btn-view-workout" type="button" @click="viewWorkout"><i class="fa fa-calendar" aria-hidden="true"></i> Your Workouts</button>
        </div>
    </div>
</template>
<script>
import Topbar from './common/Topbar'
import Router from 'vue-router'
import axios from 'axios'
import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../../config'

export default {
    name: 'SurvivorSorry',
    components: {
        'topbar': Topbar
    },
    data: function(){
        return {
            base: null,
            user: null,
        }
    },
    methods: {
        viewWorkout(){
            //const router = new Router();
            this.$router.push('/survivor/workouts');
        },

        participantOut() {
            const self = this

            Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
            this.base = Airtable.base(AIRTABLE_APP_ID);

            let user = localStorage.getItem('survivorUser')
            if(user != ""){
                user = JSON.parse(user)
                this.user = user
            }

            // Set out field to true
            self.base("Survivor Participants")
                .update(self.user['id'],{
                    'Out': true
                });
        }
    },

    mounted() {
        this.participantOut();
    }
}
</script>
<style lang="scss" scoped>
    .survivor-sorry{
        background: white;
        min-height: 100vh;
    }
    .survivor-sorry-body{
        padding: 15px;
        text-align: center;

        .heading{
            color: #0160AE;
            margin-bottom: 50px;
        }

        .content{
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 50px;
        }

        .btn-view-workout{
            background: #A43078;
            padding: 15px 25px;
            font-size: 24px;
        }
    }
</style>

