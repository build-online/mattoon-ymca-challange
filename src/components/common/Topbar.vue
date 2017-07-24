<template>
	<div class="topbar">
      <h1 class="logo"> <img src="/static/images/Logo.png" alt="" height="33px"></h1>
      <a v-if="isUserLoggedIn" href="javascript:void(0)" class="logout" @click="logout">Logout</a>
    </div><!--/topbar-->        
</template>
<script type="text/javascript">
	import Auth from '../../Auth'
	import VueRouter from 'vue-router'
	export default{
		name: 'topbar',
		methods:{
			logout: function(){

				// Logout user
				Auth.logout();

				// Redirect to login page
				const router = new VueRouter();
				router.push('/');
			}
		},
		mounted: function(){
			
		},
		computed: {
			isUserLoggedIn: function(){
				const user = JSON.parse(Auth.userLoggedIn());
				return user;
			}
		}
	}
</script>
<style type="text/css" lang="scss">
	.logout{
	    color: #D85C36;
		font-weight: bold;
		text-decoration: none;

		&:hover{
			color: black;
		}
	}
</style>