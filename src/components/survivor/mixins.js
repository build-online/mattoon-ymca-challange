import VueRouter from 'vue-router'

export const SurvivorMixin = {
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
                if(code != 'SC'){
                    router.push('/');
                }
            }else{
                router.push('/');
            }
        }
    }
}