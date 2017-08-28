<template>
    <div class="survivor-congratulations">
        <topbar></topbar>
        <div class="survivor-congratulations-body">
            <h1 class="heading">Wow. You Survived!</h1>
            <p class="content">Congratulations, you are one of a very small portion of the people who started this to finish the Survivor Challenge. Don’t stop now! You’ve made amazing progress so far. Keep it up and keep investing in a healthy lifestyle.</p>
            <button class="btn-view-workout" type="button" @click="viewWorkout"><i class="fa fa-calendar" aria-hidden="true"></i> Your Workouts</button>
        </div>
    </div>
</template>
<script>
import Topbar from './common/Topbar'
import Router from 'vue-router'

export default {    
    name: 'SurvivorCongratulations',
    components: {
        'topbar': Topbar
    },
    data: function(){
        return {

        }
    },
    methods: {
        viewWorkout(){
            const router = new Router();
            router.push('/survivor/workouts');
        }
    }
}
</script>
<style lang="scss" scoped>
    .survivor-congratulations{
        background: white;
        min-height: 100vh;
    }
    .survivor-congratulations-body{
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

