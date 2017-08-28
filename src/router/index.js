import Vue from 'vue'
import Router from 'vue-router'
import AppSwitcher from '@/components/AppSwitcher'

// Ironman
import IronmanLogin from '@/components/ironman/Login'
import IronmanHome from '@/components/ironman/Home'

// Survivor
import SurvivorHome from '@/components/survivor/Home'
import SurvivorLogin from '@/components/survivor/Login'
import SurvivorSorry from '@/components/survivor/Sorry'
import SurvivorCongratulations from '@/components/survivor/Congratulations'
import SurvivorWorkouts from '@/components/survivor/Workouts'

// Placeholder
import PlaceholderHome from '@/components/placeholder/Home'

import Auth from '../Auth'
import SurvivorAuth from '../SurvivorAuth'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AppSwitcher',
      component: AppSwitcher
    },
    {
      path: '/ironman/home',
      name: 'IronmanHome',
      component: IronmanHome,
      beforeEnter: (to, from, next) => {

        // Check if user loggedin
        if(!Auth.userLoggedIn()){
          next('/ironman/login');
        }else{
          next();
        }
      }
    },
    {
      path: '/ironman/login',
      name: 'IronmanLogin',
      component: IronmanLogin
    },
    {
      path: '/survivor/home',
      name: 'SurvivorHome',
      component: SurvivorHome,
      beforeEnter: (to, from, next) => {

        // Check if user loggedin
        if(!SurvivorAuth.userLoggedIn()){
          next('/survivor/login');
        }else{
          next();
        }
      }
    },
    {
      path: '/survivor/sorry',
      name: 'SurvivorSorry',
      component: SurvivorSorry,
      beforeEnter: (to, from, next) => {

        // Check if user loggedin
        if(!SurvivorAuth.userLoggedIn()){
          next('/survivor/login');
        }else{
          next();
        }
      }
    },
    {
      path: '/survivor/congratulations',
      name: 'SurvivorCongratulations',
      component: SurvivorCongratulations,
      beforeEnter: (to, from, next) => {

        // Check if user loggedin
        if(!SurvivorAuth.userLoggedIn()){
          next('/survivor/login');
        }else{
          next();
        }
      }
    },
    {
      path: '/survivor/workouts',
      name: 'SurvivorWorkouts',
      component: SurvivorWorkouts,
      beforeEnter: (to, from, next) => {

        // Check if user loggedin
        if(!SurvivorAuth.userLoggedIn()){
          next('/survivor/login');
        }else{
          next();
        }
      }
    },
    {
      path: '/survivor/login',
      name: 'SurvivorLogin',
      component: SurvivorLogin
    },
    {
      path: '/placeholder/home',
      name: 'PlaceholderHome',
      component: PlaceholderHome,
    }
  ]
})
