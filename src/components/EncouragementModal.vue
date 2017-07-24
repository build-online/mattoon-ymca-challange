<template>
	<div class="encouragement-modal">
		<a class="close" @click="close"><img src="http://d33wubrfki0l68.cloudfront.net/47237479c2581a93b4beb2f50b72ab635ea60b82/895d7/assets/images/close.png" alt="" height="30px" width="30px"></a>
		<div class="encouragement-modal-content">
			Congratulations !! <br/> You are half way there.			
		</div>		
		<button class="button btn-close" @click="close">Close</button>
	</div>
</template>
<script type="text/javascript">
	export default{
		data: function(){
			return {

			}
		},
		methods: {
			close: function(){
				Bus.$emit('closeEncouragementModal');
			}
		}
	}
</script>
<style type="text/css" lang="scss">
	.encouragement-modal{
		max-width: 800px;
	    background: #D85C36;
	    margin-left: auto;
	    margin-right: auto;
	    height: 100vh;
	    position: relative;
	    padding: 85px;
	    position: absolute;
	    z-index: 99;
	    left: 0;
	    right: 0;
	    margin: auto;
	    text-align: center;

	    .close{
    	    position: absolute;
    		top: 10px;
    		left: 10px;
	    }

	    .btn-close{
	    	background: white;
	    	color: #D85C36;
	    	margin-top: 50px;

	    	&:hover{
	    		background: #D85C36;
	    		color: white;
	    		border: 2px solid white;
	    	}
	    }

	    .encouragement-modal-content{
	    	font-size: 32px;
	    	color: white;
	    	text-align: center;
	    }
	}
</style>