import VueRouter from 'vue-router'

export const PlaceholderMixin = {
    created: function(){
        this.isCurrentApp();
    },
    methods: {
        isCurrentApp: function(){
            const self = this
            const router = new VueRouter();

            var currentApp = localStorage.getItem('currentApp');
            if(currentApp != null){
                currentApp = JSON.parse(currentApp)
                const code = currentApp['fields']['Code']
                if(code != 'P'){
                    router.push('/');
                }
            }else{
                router.push('/');
            }
        }
    }
}