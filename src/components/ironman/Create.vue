<template>
	 <section class="workout">
	 	<a class="close" @click="close"><img src="http://d33wubrfki0l68.cloudfront.net/47237479c2581a93b4beb2f50b72ab635ea60b82/895d7/assets/images/close.png" alt="" height="30px" width="30px"></a>

		<h3>{{ todayDate }}</h3>
		<form method='post' @submit.prevent="create"><input type='hidden' name='form-name' value='form 1' />
			<div class="bar">
				<div class="img">
				<img src="http://d33wubrfki0l68.cloudfront.net/3a825d79e59a3f2849198c2d843ac9110e93877f/6141c/assets/images/swim.png" alt="">
				</div>
				<input type="number" placeholder="0" v-model.number="swim">
				<p>yards*</p>
			</div>
			<div class="bar">
				<div class="img">
				<img src="http://d33wubrfki0l68.cloudfront.net/b0eedc1c5349c820385839ced53bf87de9233b49/229ee/assets/images/bike.png" alt="">
				</div>
				<input type="number" placeholder="0" v-model.number="bike">
				<p>miles</p>
			</div>
			<div class="bar">
				<div class="img">
				<img src="http://d33wubrfki0l68.cloudfront.net/20ecc20d03974d782d76e044a3881c26c57c9123/19adb/assets/images/run.png" alt="">
				</div>
				<input type="number" placeholder="0" v-model.number="run">
				<p>miles</p>
			</div>
		</form>
		<div class="submitButton">
			<p>*1 pool lap (down and back) equals 50 yards.</p>
			<button type="submit" @click="create" :disabled="loading">Submit Workout</button>
		</div>
	</section>
</template>
<script type="text/javascript">
	import moment from 'moment'
	import Airtable from 'airtable'
	import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../../config'
	import { IronmanMixin } from './mixins'

	export default {
		name: 'create',
		props: ['user'],
		mixins: [IronmanMixin],
		data: function(){
			return {
				swim: 0,
				bike: 0,
				run: 0,
				base: null,
				loading: false,
			}
		},
		mounted: function(){
			// Configure Airtable
			Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
			this.base = Airtable.base(AIRTABLE_APP_ID);
		},
		created: function(){

		},
		computed: {
			todayDate: function(){
				return moment().format('dddd, MMMM Do');
			}
		},
		methods: {
			close: function(){
				Bus.$emit('closeCreateWorkoutRecord');
			},
			create: function(){
				var self = this;
				var participants = [];
				participants.push(self.user.id);

				self.loading = true;

				this.base('Workouts').create({
			        "Date": moment().format('YYYY-MM-DD'),
			        "Swim Yards": self.swim,
			        "Bike Miles": self.bike,
			        "Run Miles": self.run,
			        "Participants": participants,
			    }, function(err, record) {
			        if (err) {
			        	console.log(err);
			        	alert("Unable to create new workout;")
			        	self.loading = false;
			        	return;
		        	}
		        	self.loading = false;
		        	Bus.$emit('updateHomeData');
			        Bus.$emit('closeCreateWorkoutRecord');
			    });
			}
		}
	}
</script>