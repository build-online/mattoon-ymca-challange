<template>
	<div>
		<transition name="slideDown">
			<create id="create" v-if="createModal"></create>	
		</transition>
		
		<section class="home">
			<topbar></topbar>
			<!-- The name here needs to dynamically come from Airtable > Participants > First Name -->
			<h2 v-if="user">You are doing great {{ user.fields['First Name'] }}!</h2>
			<blockquote v-if="randomQuote">
				{{ randomQuote['Quote'] }}
				<br>
				<cite>{{ randomQuote['Source'] }}</cite>
			</blockquote>
			<div class="overallProgress">
				<h2>Overall Progress</h2>
				<div class="bars">
					<div class="swim bar-section">
						<img src="http://d33wubrfki0l68.cloudfront.net/3a825d79e59a3f2849198c2d843ac9110e93877f/6141c/assets/images/swim.png" alt="">
						<!--
							BAR EXPLANATION
							The numbers on the bottom (4224 yd, 112 mi, 26.2 mi) are set and should be the numbers you use to calculate percentages.

							The bar works by adjusting the width percentage on the .bar-inner

							The totals should be easily accessible from the particapants field.

							So...if a person has swum 300 yards, then 300/4224 = .071... so it should be 7%.

							The swim distance will always be an integer but the run and bike number can be a float with one decimal point.  (i.e. 13.2)

						-->
						<div class="bar">
							<div class="bar-inner" style="width: 7%;"></div>
						</div><!--/bar-->
						<div class="progressNumbers">
							<p>300 yd</p>
							<hr>
							<p>4224 yd</p>
						</div>
					</div><!--/swim-->
					<div class="bike bar-section">
						<img src="http://d33wubrfki0l68.cloudfront.net/b0eedc1c5349c820385839ced53bf87de9233b49/229ee/assets/images/bike.png" alt="" >
						<div class="bar">
							<div class="bar-inner" style="width: 14%;"></div>
						</div><!--/bar-->
						<div class="progressNumbers">
							<p>17 mi</p>
							<hr>
							<p>112 mi</p>
						</div>
					</div><!--/bike-->
					<div class="run bar-section">
						<img src="http://d33wubrfki0l68.cloudfront.net/20ecc20d03974d782d76e044a3881c26c57c9123/19adb/assets/images/run.png" alt="" >
						<div class="bar">
							<div class="bar-inner" style="width: 23%;"></div>
						</div><!--/bar-->
						<div class="progressNumbers">
							<p>6 mi</p>
							<hr>
							<p>26.2 mi</p>
						</div>
					</div><!--/run-->
				</div><!--/bars-->
			</div><!--/overallProgress-->
			<div class="weeklyProgress">
				<h2>This Week</h2>
			<!--
				Week Explanation

				The week starts on Sunday and goes through Saturday, so probably the easiest way to do this is to query the workouts table by the participant and add up all the numbers since Sunday at 00:00.

			-->

				<div class="weeklyNumbers">
					<div class="swim">
						<p>300 yd</p>
						<img src="http://d33wubrfki0l68.cloudfront.net/3a825d79e59a3f2849198c2d843ac9110e93877f/6141c/assets/images/swim.png" alt="">
					</div>
					<div class="bike">
						<p>17 mi</p>
						<img src="http://d33wubrfki0l68.cloudfront.net/b0eedc1c5349c820385839ced53bf87de9233b49/229ee/assets/images/bike.png" alt="">
					</div>
					<div class="run">
						<p>6 mi</p>
						<img src="http://d33wubrfki0l68.cloudfront.net/20ecc20d03974d782d76e044a3881c26c57c9123/19adb/assets/images/run.png" alt="">
					</div>
				</div><!--/weeklyNumbers-->
			</div><!--/weeklyProgress-->
			<div class="submitButton">
				<a @click="createModal = true" class="button">Record Workout</a>
			</div>
		</section>
	</div>
</template>
<script type="text/javascript">
	import Airtable from 'airtable'
	import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../config'
	import Auth from '../Auth'
	import VueRouter from 'vue-router'
	import Topbar from './common/Topbar'
	import Create from './Create'

	export default{
		name: 'home',
		components:{
			'topbar': Topbar,
			'create': Create
		},
		data: function(){
			return{
				user: null,
				base: null,
				quotes: [],
				loading: false,
				createModal: false
			}
		},
		created: function(){
			const self = this;
			Bus.$on('closeCreateWorkoutRecord',function(){
				self.createModal = false;
			})
		},
		mounted(){
			this.user = JSON.parse(Auth.userLoggedIn())

			// Configure Airtable
    		Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
    		this.base = Airtable.base(AIRTABLE_APP_ID);

    		this.getQuotes();
		},
		computed:{
			randomQuote: function(){
				
				if(this.quotes.length > 0){
					const quotes = this.shuffle(this.quotes);	
					return quotes[0].fields;
				}

				return null;
			}
		},
		methods: {

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
			}
		}
	}
</script>

<style type="text/css">
	#create{
		position: absolute;
	    z-index: 99;
	    left: 0;
	    right: 0;
	    margin: auto;
	}
</style>