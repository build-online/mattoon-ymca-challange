<template>
    <div class="app-switcher">
        <i class="fa fa-spinner fa-spin"></i>
    </div>
</template>
<script>
    import Airtable from 'airtable'
    import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../config'
    import axios from 'axios'
    import VueRouter from 'vue-router'

    export default{
        name: 'AppSwitcher',
        data(){
            return {
                base: null,
                currentApp: null,
                apps: [],
            }
        },
        mounted: function(){

        },
        created: function(){
            const self = this
            this.configureAirtable();
            this.getChallanges().then(function(){
                self.setCurrentApp();
                self.redirectToApp();
            });
        },
        methods: {
            configureAirtable: function(){
                // Configure Airtable
                Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
                this.base = Airtable.base(AIRTABLE_APP_ID);
            },
            getChallanges: function(){
                const self = this

                // Retrive all Challanges
                var promise = new Promise(function(resolve,reject){
                    var args = {
                        view: 'Grid view'
                    };
                    self.base("Active Challenge").select(args).eachPage(function page(records, fetchNextPage){
                        self.apps = records;
                        resolve(true);
                    });
                });

                return promise;
            },
            setCurrentApp: function(){
                var active = null;
                this.apps.forEach(function(item,index){
                    if(item.fields['Active']){
                        active = item;
                        return;
                    }
                })

                if(active != null){
                    this.currentApp = active;
                    localStorage.setItem("currentApp", JSON.stringify(this.currentApp._rawJson));
                }
            },
            redirectToApp: function(){
                var active = this.currentApp;

                if(active != null){
                    const code = active['fields']['Code']
                    if(code == 'IC'){
                        this.$router.push('/ironman/home');
                    }else if(code == 'SC'){
                        this.$router.push('/survivor/home');
                    }else if(code == 'P'){
                        this.$router.push('/placeholder/home');
                    }
                }
            }
        }
    }
</script>
<style>
    .app-switcher{
        display: flex;
        align-items: center;
        height: 100vh;
        justify-content: center;
        font-size: 50px;
    }
</style>