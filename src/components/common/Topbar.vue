<template>
	<div class="topbar">
      <h1 class="logo"> <img src="/static/images/Logo.png" alt="" height="33px"></h1>
      <a href="javascript:void(0)" class="home" @click="logout"><img src="/static/images/home.png" alt="" height="30px"></a>
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
		}
	}
</script>