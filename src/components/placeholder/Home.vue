<template>
    <div class="placeholder-home">
        <main class="page-content" aria-label="Content">
            <section class="placeholder">
                <div class="branding">
                    <img src="/static/images/Logo.png" alt="Mattoon AreaFamily YMCA" width="127px">
                </div>
                <div class="image">
                    <img :src="imageURL" alt="Woman exercising">
                </div>
                <div class="placeholder-text">
                    <h2>The Next challenge is coming.</h2>
                    <p class="text">{{ content }}</p>                    
                </div>
            </section>
        </main>
    </div>
</template>

<script>
import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../../config'
import axios from 'axios'
import VueRouter from 'vue-router'
import { PlaceholderMixin } from './PlaceholderMixin'

export default {
    name: 'PlaceholderHome',
    mixins: [PlaceholderMixin],
    data: function(){
        return {
            info: null,
            base: null,
            loading: false,
        }
    },
    mounted: function(){

    },
    created: function(){
        const self = this
        this.configureAirtable();
        this.getInfo();
    },
    computed:{
        imageURL: function(){
            if(this.info != null && this.info['fields']['Image'][0]['url']){
                return this.info['fields']['Image'][0]['url'];
            }
            return "";
        },
        content: function(){
            if(this.info != null && this.info['fields']['Text']){
                return this.info['fields']['Text'];
            }
            return "";
        }
    },
    methods: {
        getInfo: function(){
            var currentApp = localStorage.getItem('currentApp')
            currentApp = JSON.parse(currentApp)
            this.info = currentApp;
        },
        configureAirtable: function(){
            // Configure Airtable
            Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
            this.base = Airtable.base(AIRTABLE_APP_ID);
        },
    }
}
</script>

