import VueRouter from 'vue-router'

export const SurvivorMixin = {
    created: function(){
        this.isCurrentApp();        
    },
    mounted: function(){
        const self = this
        // Update location every 
        setInterval(function() {
            self.updateLocation()
        }, 10 * 1000);    
    },
    methods: {
        isCurrentApp: function(){
            const self = this
            const router = new VueRouter();

            var currentApp = localStorage.getItem('currentApp');
            if(currentApp != null){
                currentApp = JSON.parse(currentApp)
                const code = currentApp['fields']['Code']
                if(code != 'SC'){
                    router.push('/');
                }
            }else{
                router.push('/');
            }
        },
        getLocation() {
            const self = this
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(position => {
                    self.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                    localStorage.setItem('survivorLocation',JSON.stringify(self.location))
                },error => {
                    self.location = error
                });
            }
            /*const self = this
            localStorage.setItem('survivorLocation',"")
            var promise = new Promise(function(resolve,reject){
                if(confirm("Because that is how the challenge works, this app will only track workouts at a Mattoon Family YMCA location. (Although you can view progress anywhere.) To proceed, we need your permission to access location data.")){
                    if(navigator.geolocation){
                        navigator.geolocation.getCurrentPosition(position => {
                            alert("In")
                            self.location = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            }
                            alert(position.coords.latitude)
                            localStorage.setItem('survivorLocation',JSON.stringify(self.location))
                        },error => {
                            if(error.code == error.PERMISSION_DENIED){
                                localStorage.setItem('survivorLocation',"")
                                alert("Unable to retrive current location. User Denied to fetch location.")
                                reject();
                            }
                        })                                
                        resolve(true);
                    }else{
                        alert("Unable to retrive current location.")
                        reject();
                    }
                }else{
                    alert("Unable to retrive current location.")
                }
            })
            
            return promise;*/
        },
        updateLocation(){
            const self = this
            var locationString = localStorage.getItem('survivorLocation');            
            if(locationString != null && locationString != ""){
                console.log("Location updated")
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(position => {
                        var location = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }
                        localStorage.setItem('survivorLocation',JSON.stringify(location))
                    })
                }
            }
        }
    }
}