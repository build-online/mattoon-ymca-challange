<template>
    <div class="motivation-section">
        <p class="user-info">You are doing great {{ userName }}!</p>
        <blockquote v-if="randomQuote" class="quote">
            {{ randomQuote['Quote'] }}
            <br>
            <cite>{{ randomQuote['Source'] }}</cite>
        </blockquote>
    </div>
</template>
<script>
import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../../../config'

export default {
    name: 'MotivationSection',
    props: ['user'],
    data: function(){
        return {
            base: null,
            quotes: [],
        }
    },
    computed: {
        userName: function(){
            return this.user['fields']['First Name']
        },
        randomQuote: function(){				
            if(this.quotes.length > 0){
                const quotes = this.shuffle(this.quotes);	
                return quotes[0].fields;
            }

            return null;
        },    
    },
    mounted: function(){
        this.initialize();
    },
    created: function(){

    },
    methods: {
        initialize: function(){
            // Configure Airtable
    		Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
            this.base = Airtable.base(AIRTABLE_APP_ID);
            
            // Retrive quotes
            this.getQuotes();
        },

        /* Function will retrive random quote from airtable base */
        getQuotes: function(){
            var self = this;
    
            var args = {
                view: 'Grid view',
            };
            this.base('Quotes').select(args).eachPage(function page(records, fetchNextPage) {        
                records.forEach(function(item,key){
                    self.quotes.push(item);
                });
                fetchNextPage();
            });
        },

        /* 
            * Function to shuffle quotes items
        */
        shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }	

            return array;
        },
    }
}
</script>

<style lang="scss" scoped>
    .motivation-section{
        background-color: #00A1D5;
        color: white;
        padding: 15px;

        .user-info{
            text-align: center;
            margin-bottom: 15px;
        }

        .quote{
            text-align: center;
            margin: 0;

            cite{
                display: block;
                text-align: right;
                font-weight: bold;
                font-style: italic;
            }
        }
    }
</style>

