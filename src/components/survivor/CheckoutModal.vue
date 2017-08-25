<template>
  <modal :show="show" @close="close">
        <div class="modal-body">
           <p>Awesome, you've worked out for {{ timeString() }}</p>
           <p>(Optional) Describe what you did below:</p>
           <input type="text" v-model="text" />
        </div>
        <br/>
        <div class="modal-footer text-right">
            <button class="modal-default-button" @click="checkOut()" :disabled="loading">
                Check Out
            </button>
        </div>
    </modal>
</template>

<script>
import Modal from '../Modal'
import moment from 'moment'
import Bus from '../../Bus'

export default {
  name: 'CheckoutModal',
  props: ['show','base','workoutItem'],
  components:{
      Modal
  },
  data: function () {
    return {
      text: '',
      loading: false
    };
  },
  methods: {    
    close: function () {
      this.$emit('close');
      this.text = "",
      this.loading = false
    },
    timeString: function(){
        if(this.workoutItem != null && this.workoutItem['fields'] != null){
            var start = moment(this.workoutItem['fields']['Start Time']).format();
            var end = moment().format();

            var duration = moment.duration(moment(end).diff(start));
            var hours = duration.get('hours');
            var minutes = duration.get('minutes');
            var seconds = duration.get('seconds');
            if(hours != 0)
                return hours + ' hour and ' + minutes + ' minutes ';
            else
                return minutes + ' minutes';
        }
        return '';
    },
    checkOut: function () {
        if(confirm("Are you sure to Check Out?")){
            const self = this
            self.loading = true
            let workoutRecord = this.workoutItem
            this.base("Survivor Workouts").update(workoutRecord['id'],{
                'Workout Name': self.text,
                'End Time': moment().format('YYYY-MM-DDTHH:mm:ss.000Z')
            },function(error,record){
                self.loading = false
                if(error){
                    alert("Unable to clock out.");
                    console.log(error)                    
                }
                localStorage.setItem('survivorWorkout',"")
                alert("Checked Out Successfully.")
                Bus.$emit("workoutCheckedOut")
                self.close();                
            })
        }        
    }
  }
}
</script>