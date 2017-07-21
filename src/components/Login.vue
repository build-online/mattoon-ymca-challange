<template>
  <section class="login">
    <topbar></topbar>
    <img src="/static/images/welcome.png" alt="" class="welcomeImage">
    <p class="welcomeMessage">
      To Sign Up and receive your pin visit the Front Desk or call 217-235-9622
    </p>
    <h2>Sign In</h2>
    <form @submit.prevent="signIn">
      <!--Replace this with a material component.  Pull names from Airtable Participants-->
      <label >Name
      <select name="choose_name" id="choose_name" v-model="participant">
        <option value="">Select Participant</option>
        <option :value="participant.getId()" v-for="participant in participants">{{ participant.get("Name") }}</option>
      </select>
      </label>
      <label>
        4 Digit Pin
        <!--Again replace this with a material style component.  The pin number needs to match the pin number of the selected name.  I'm using a number input here because it will always be a four digit number and the numerical keyboard on a phone is easier to use.-->
        <input type="number" v-model="pin">
      </label>
    </form>
    <div class="submitButton">
      <button type="button" @click="signIn" :disabled="loading">Sign In</button>
    </div>
  </section>
</template>

<script>
import Airtable from 'airtable'
import { AIRTABLE_APP_ID,AIRTABLE_APP_KEY } from '../config'
import Auth from '../Auth'
import VueRouter from 'vue-router'
import Topbar from './common/Topbar'

export default {
  name: 'login',
  components:{
    'topbar': Topbar
  },
  created: function(){
  },
  mounted: function(){
    // If user is loggedin then redirect it to home page
    if(Auth.userLoggedIn()){
      const router = new VueRouter();
      router.push('/home');
    }
    
    // Configure Airtable
    Airtable.configure({ apiKey: AIRTABLE_APP_KEY });
    this.base = Airtable.base(AIRTABLE_APP_ID);    

    this.getParticipants();
  },
  data () {
    return {
      participants: [],
      participant: "",
      pin: "",
      base: null,
      loading: false
    }
  },
  methods: {
    signIn: function(){
      var self = this;
      // Validate
      if(this.participant == "" || this.pin == ""){
        alert("Participant field and Pin Field can not be empty")
        return false;
      }

      this.loading = true;
      Auth.login(this.participant,this.pin).then(function(response){        
        if(response == true){
          const router = new VueRouter();
          router.push('/home');
        }else{
          alert("Unable to login");
        }
        self.loading = false;
      }).catch(function(error){
        console.log(error)
        alert("Unable to login");
        self.loading = false;
      })
      
    },
    getParticipants: function(){
      var self = this;
      
      var args = {
        view: 'Grid view',
        fields: ['Name','First Name','Last Name']
      };
      this.base('Participants').select(args).eachPage(function page(records, fetchNextPage) {        
        records.forEach(function(item,key){
          self.participants.push(item);
        });
        fetchNextPage();
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
