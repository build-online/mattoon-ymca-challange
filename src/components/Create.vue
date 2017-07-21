<template>
	 <section class="workout">
	 	<a class="close" @click="close"><img src="http://d33wubrfki0l68.cloudfront.net/47237479c2581a93b4beb2f50b72ab635ea60b82/895d7/assets/images/close.png" alt="" height="30px" width="30px"></a>
		
		<h3>{{ todayDate }}</h3>
		<form method='post'><input type='hidden' name='form-name' value='form 1' />
			<div class="bar">
				<div class="img">
				<img src="http://d33wubrfki0l68.cloudfront.net/3a825d79e59a3f2849198c2d843ac9110e93877f/6141c/assets/images/swim.png" alt="">
				</div>
				<input type="number" placeholder="0">
				<p>laps*</p>
			</div>
			<div class="bar">
				<div class="img">
				<img src="http://d33wubrfki0l68.cloudfront.net/b0eedc1c5349c820385839ced53bf87de9233b49/229ee/assets/images/bike.png" alt="">
				</div>
				<input type="number" placeholder="0">
				<p>miles</p>
			</div>
			<div class="bar">
				<div class="img">
				<img src="http://d33wubrfki0l68.cloudfront.net/20ecc20d03974d782d76e044a3881c26c57c9123/19adb/assets/images/run.png" alt="">
				</div>
				<input type="number" placeholder="0">
				<p>miles</p>
			</div>
		</form>
		<div class="submitButton">
			<p>*1 lap equals 50 yards or one time down and back.</p>
			<button>Submit Workout</button>
		</div>
	</section>
</template>
<script type="text/javascript">
	import moment from 'moment'
	export default{
		name: 'create',
		data: function(){
			return {

			}
		},
		mounted: function(){

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
			}
		}
	}
</script>